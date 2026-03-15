import { db, pool } from "../db.js";
import jwt from "jsonwebtoken";
import generateTeamCode from "../functions/GenerateTeamCode.js";

export const notificationData = async (req, res) => {
    const q = "SELECT title, description, creation_date FROM notifications ORDER BY creation_date DESC LIMIT 1";
    db.query(q, (err, result) => {
      if (err) return res.send('Problem with notification data');
      if (result.length == 0) return res.send('No data found');
        //console.log(result);
      res.json(result);
    });
  };



// POST /users/:userId/teams
export const createTeam = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userId: " + userId);
    const userIdNumber = parseInt(userId);
    const { name, admin_id, member_ids } = req.body;
    console.log(name, admin_id, member_ids)

    // Validate that the user_id in the URL parameter matches the admin_id in the request body
    if (userIdNumber !== admin_id) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    let existingTeamName = await db.promise().query('SELECT id FROM teams WHERE name = ?', [name]);
    console.log(existingTeamName[0].length);
    if (existingTeamName[0].length > 0) {
      return res.status(409).json({ error: 'Team with that name already exists' });
    }

    let newTeamCode = generateTeamCode()
    console.log(typeof newTeamCode)

    // Check if the generated team code already exists in the database
    let existingTeam = await db.promise().query("SELECT id FROM teams WHERE team_code = ?", [newTeamCode]).catch((error) => {
      console.error(error);
    });
    if (existingTeam && existingTeam.length > 0) {
      console.log(existingTeam[0].length);
    }
    
    while (existingTeam[0].length > 0) {
      newTeamCode = generateTeamCode();
      existingTeam = await db.promise().query('SELECT id FROM teams WHERE team_code = ?', [newTeamCode]);
    }

    // Insert new team into the database using the promise-based version of the query function
    const result = await db.promise().query('INSERT INTO teams (name, team_code) VALUES (?, ?)', [name, newTeamCode]);
    const teamId = result[0].insertId;

    // Add the user and any additional members to the team
    const insertData = member_ids.map((memberId) => [teamId, memberId, memberId === admin_id]);
     await db.promise().query('INSERT INTO teammembers (team_id, user_id, isadmin) VALUES ?', [insertData]);

    res.status(201).json({ id: teamId, team_code: newTeamCode });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Team with that name already exists' });
    } else {
      res.status(500).json({ error: 'An error occurred while creating the team' });
    }
  }
};




export const getTeamsData = async (req, res) => {
  const userId = req.params.userId;
  // Fetch teams and teammembers data from MySQL
  const query = `
    SELECT t.id, t.name, t.team_code, tm.isadmin as teamAdminId
    FROM teams t
    INNER JOIN teammembers tm ON t.id = tm.team_id
    WHERE tm.user_id = ?`;
  db.query(query, [userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch teams' });
    } else {
      res.json(results);
    }
  });
};


// Get all students for a given user ID
export const getStudentList = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get all teams that the current user is a member of
    const [userTeams] = await db.promise().query(
      `SELECT team_id FROM teammembers WHERE user_id = ${userId}`
    );

    // Get all students for those teams
    const teamIds = userTeams.length > 0 ? userTeams.map(team => team.team_id).join(',') : 'null';
    const students = await db.promise().query(`
      SELECT users.id, users.name, users.email, GROUP_CONCAT(teams.name SEPARATOR ', ') AS teams
      FROM users
      JOIN teammembers ON users.id = teammembers.user_id
      JOIN teams ON teammembers.team_id = teams.id
      WHERE teammembers.team_id IN (${teamIds.replace(/(^,)|(,$)/g, '') || 'null'})
      GROUP BY users.id
    `);

    res.json(students[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting students' });
  }
};


export const joinTeam = async (req, res) => {
  const { userId } = req.params;
  const { user_id, team_code } = req.body;

  try {
    // check if the team exists
    const [teams] = await pool.query('SELECT id, name FROM teams WHERE team_code = ?', [team_code]);
    if (teams.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const team = teams[0];
    const teamId = team.id;

    // check if the user is already a member of the team
    const [members] = await pool.query('SELECT user_id FROM teammembers WHERE user_id = ? AND team_id = ?', [user_id, teamId]);
    if (members.length > 0) {
      return res.status(409).json({ error: 'User is already a member of this team' });
    }

    // add the user to the team
    await pool.query('INSERT INTO teammembers (user_id, team_id) VALUES (?, ?)', [user_id, teamId]);
    
    // return the team ID and admin ID
    res.status(200).json({ id: teamId, admin_id: team.admin_id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while joining the team' });
  }
};

export const getAllQuizzes = async (req, res) => {
  const { userId } = req.params;
  const q = "SELECT quizzes.id, quizzes.name, quizzes.description, quizzes.creator_id, quizzes.isdone AS aname, COUNT(questions.id) AS num_questions FROM quizzes LEFT JOIN questions ON quizzes.id = questions.quizz_id WHERE quizzes.isdone = 1 OR quizzes.creator_id = ? GROUP BY quizzes.id";
  db.query(q, [userId] , (err,results) =>{
      if (err) return res.status(500).json(err.message);
      if (results.length === 0) return res.status(404).json("No results found")
      res.json(results);
  });
}

export const getAllQuestions = async(req, res) => {
  try {
    // Retrieve quiz data from MySQL database
    //console.log(req.params.quizzId);
    const [quizRows, _] = await pool.execute(
      'SELECT id, name, description, creator_id, isdone FROM quizzes WHERE id = ?',
      [req.params.quizzId]
    );

    if (quizRows.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const quiz = quizRows[0];

    // Retrieve question data from MySQL database
    const [questionRows, __] = await pool.execute(
      'SELECT id, question, answeara, answearb, answearc, answeard, correctAnswers FROM questions WHERE quizz_id = ?',
      [quiz.id]
    );
      //console.log(questionRows[3])
      const questions = questionRows.map(row => {
        const answers = [
          { text: row.answeara, isCorrect: row.correctAnswers.substr(-1) === 'A' || row.correctAnswers.includes('AnswearA/') },
          { text: row.answearb, isCorrect: row.correctAnswers.substr(-1) === 'B' || row.correctAnswers.includes('/AnswearB/') },
          { text: row.answearc, isCorrect: row.correctAnswers.substr(-1) === 'C' || row.correctAnswers.includes('/AnswearC/') },
          { text: row.answeard, isCorrect: row.correctAnswers.substr(-1) === 'D' || row.correctAnswers.includes('/AnswearD/') },
        ];
        return { id: row.id, question: row.question, answers };
      });
      
    
      //console.log(questions[0].answers);
    const quizData = { name: quiz.name,creator: quiz.creator_id, questions };
    //console.log(quizData);
    res.json(quizData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const createQuizz = async (req, res) => {
  const { name, description, user_id } = req.body;
  const creator_id = user_id; // Assuming the creator_id field is the same as user_id

  try {
    const [result] = await pool.query(
      'INSERT INTO quizzes (name, description, creator_id, isdone) VALUES (?, ?, ?, ?)',
      [name, description, creator_id, false]
    );
      
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create quiz' });
  }
}

export const getOneQuizzes = (req, res) => {
  const quizzId = req.params.quizzId;
  //console.log(quizzId);
  const q = "SELECT id, name, description, isdone FROM quizzes WHERE id = ?";
  db.query(q, [quizzId] , (err,results) =>{
      //console.log(results);
      if (err) return res.status(500).json(err.message);
      if (results.length === 0) return res.status(404).json("No results found")
      
      res.status(200).json(results);
  });
}


export const addQuestion = async (req, res) => {
  const { userId, quizzId } = req.params;
  const { questionText, answers } = req.body;
  //console.log(answers);
  //console.log(questionText);

  // construct the SQL query to insert the question into the database
  const sql = `
    INSERT INTO questions (quizz_id, question, answeara, answearb, answearc, answeard, correctAnswers)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // determine the correct answer(s)
  const correctAnswers = [];
  answers.forEach((answer, index) => {
    if (answer.isCorrect) {
      const letter = String.fromCharCode(65 + index);
      correctAnswers.push(`Answear${letter}`);
    }
  });
  const correctAnswerString = correctAnswers.join('/');
  

  // execute the SQL query with the provided data
  db.query(sql, [quizzId, questionText, answers[0].text, answers[1].text, answers[2].text, answers[3].text, correctAnswerString], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to insert question' });
    } else {
      //console.log("results.insertId" + results.insertId)
      res.status(200).json({ id: results.insertId });
    }
  });
}


export const getAllAssigments = async (req, res) => {
  const userId = req.params.userId;
  //console.log('userId: ' + userId)

  const query = `
    SELECT a.id, a.name, a.creation_date as created, a.deadline_date as deadline, 
      COUNT(DISTINCT am.user_id) as total_users, 
      SUM(am.isdone) as completed_users,
      COUNT(DISTINCT t.id) as total_teams,
      GROUP_CONCAT(DISTINCT t.name SEPARATOR ', ') as team_names
    FROM assigments a 
    INNER JOIN teams t ON a.team_id = t.id 
    INNER JOIN teammembers tm ON t.id = tm.team_id AND tm.user_id = ?
    LEFT JOIN assigments_members am ON a.id = am.assigment_id 
    GROUP BY a.id`;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    //console.log(results);

    const assignments = results.map((row) => ({
      id: row.id,
      name: row.name,
      created: row.created,
      deadline: row.deadline,
      completion: row.total_users > 0 ? Math.round(row.completed_users * 100 / row.total_users) : 0,
      teams: row.team_names,
      total_teams: row.total_teams
    }));

    return res.json(assignments);
  });
};


export const getUserData = async (req, res) => {
  const userId = req.params.userId;

  // Retrieve user data from database
  db.query(
    `
    SELECT u.id, u.name, u.email, u.status, t.name AS team_name, tm.isadmin
    FROM users u
    INNER JOIN teammembers tm ON tm.user_id = u.id
    INNER JOIN teams t ON t.id = tm.team_id
    WHERE u.id = ?
  `,
    [userId],
    (err, results) => {
      if (err) {
        console.error('Error retrieving user data:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Format data to match client-side expectations
      const user = {
        id: results[0].id,
        name: results[0].name,
        email: results[0].email,
        status: results[0].status,
        teams: results.map((row) => ({
          name: row.team_name,
          isadmin: row.isadmin,
        })),
      };
      
      res.json(user);
    }
  );
}


export const addTeamUser = async (req, res) =>{
  const teamId = req.body.teamId;
  const userName = req.body.userName;
  console.log(teamId, userName);

  // First, check if the user is already a member of the team
  const checkUserQuery = `SELECT COUNT(*) AS count FROM teammembers tm JOIN users u ON tm.user_id = u.id WHERE tm.team_id = ? AND u.name = ?`;
  db.query(checkUserQuery, [teamId, userName], (err, result) => {
    if (err) {
      console.error('Error checking if user is already a member:', err);
      res.status(500).send('Error checking if user is already a member');
    } else {
      const count = result[0].count;
      if (count > 0) {
        // If the user is already a member, send an error response
        res.status(400).send('User is already a member of the team');
      } else {
        // If the user is not already a member, retrieve the user ID from the 'users' table
        const getUserIdQuery = `SELECT id FROM users WHERE name = ?`;
        db.query(getUserIdQuery, [userName], (err, result) => {
          if (err) {
            console.error('Error getting user ID:', err);
            res.status(500).send('Error getting user ID');
          } else {
            const userId = result[0].id;

            // Then, insert the user ID and team ID into the 'teammembers' table
            const insertUserQuery = `INSERT INTO teammembers (user_id, team_id, isadmin) VALUES (?, ?, ?)`;
            db.query(insertUserQuery, [userId, teamId, false], (err, result) => {
              if (err) {
                console.error('Error inserting new user:', err);
                res.status(500).send('Error inserting new user');
              } else {
                // Finally, retrieve the list of team members and send it back to the client
                const getMembersQuery = `SELECT u.name FROM users u JOIN teammembers tm ON u.id = tm.user_id WHERE tm.team_id = ?`;
                db.query(getMembersQuery, [teamId], (err, result) => {
                  if (err) {
                    console.error('Error getting team members:', err);
                    res.status(500).send('Error getting team members');
                  } else {
                    const members = result.map(row => row.name);
                    console.log({members});
                    res.send({ members });
                  }
                });
              }
            });
          }
        });
      }
    }
  });
}


export const searchUsers = async (req, res) => {
  const name = req.params.userName;
  //console.log(name)
  const query = `SELECT id, name, email FROM users WHERE name LIKE '%${name}%'`;
  
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to search users' });
    } else {
      res.json(results);
    }
  });
}

export const questionEdit = async (req, res) => {
  const { userId, quizId, questionId } = req.params;
  const { question, answers } = req.body;
  //console.log(question, answers);

  // build query to update question data
  const correctAnswers = answers.filter(answer => answer.isCorrect).map(answer => `Answear${String.fromCharCode(65 + answers.indexOf(answer))}`).join('/');
  const query = `UPDATE questions SET question='${question}', answeara='${answers[0].text}', answearb='${answers[1].text}', answearc='${answers[2].text}', answeard='${answers[3].text}', correctAnswers='${correctAnswers}' WHERE id=${questionId}`;

  // execute query
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error updating question data: ' + error.stack);
      res.status(500).json({ error: 'Error updating question data' });
    } else {
      console.log(`Question with id ${questionId} updated`);
      res.json({ success: true });
    }
  });
}


export const updateCreatedQuiz = async (req, res) =>{
  const { userId, quizzId } = req.params;
  const { isDone } = req.body;

  try {
    
    db.query('UPDATE quizzes SET isdone = ?, creator_id = ? WHERE id = ?', [isDone, userId, quizzId]);
    res.status(200).json({ message: 'Quiz saved successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


export const getOneTeamData = async (req, res) =>{
  const {userId, teamId} = req.params;
  //console.log(userId, teamId);
  // Fetch teams and teammembers data from MySQL
  const query = `
    SELECT t.id, t.name, t.team_code, tm.isadmin as teamAdminId
    FROM teams t
    INNER JOIN teammembers tm ON t.id = tm.team_id
    WHERE tm.user_id = ? AND t.id = ?`;
  db.query(query, [userId, teamId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch teams' });
    } else {
      //console.log(results);
      res.json(results[0]);
    }
  });
}


export const getTeamStudents = async (req, res) => {
  const { teamId } = req.params;

  try {
    const sql = `SELECT u.id, u.name, u.email, t.isadmin
               FROM users u
               JOIN teammembers t ON t.user_id = u.id
               JOIN teams s ON t.team_id = s.id
               WHERE t.team_id = ? 
               ORDER BY u.name`;

    db.query(sql, [teamId], (err, results) => {
      if (err) throw err;
      //console.log(results);
      res.json(results);
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting students' });
  }
};



export const getTeamAssigments = async (req, res) => {
  const teamId = req.params.teamId;
  //console.log('userId: ' + userId)


  const query = `
      SELECT a.id, a.name, a.creation_date as created, a.deadline_date as deadline, 
      COUNT(DISTINCT am.user_id) as total_users, 
      SUM(am.isdone) as completed_users
    FROM assigments a 
    INNER JOIN teams t ON a.team_id = t.id 
    INNER JOIN teammembers tm ON t.id = tm.team_id
    LEFT JOIN assigments_members am ON a.id = am.assigment_id 
    WHERE a.team_id = ?
    GROUP BY a.id, a.name, a.creation_date, a.deadline_date
  `;

  db.query(query, [teamId], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    //console.log(results);

    const assignments = results.map((row) => ({
      id: row.id,
      name: row.name,
      created: row.created,
      deadline: row.deadline,
      completion: row.total_users > 0 ? Math.round(row.completed_users * 100 / row.total_users) : 0,
    }));
    console.log(assignments);
    return res.json(assignments);
  });
};


export const getAssigmentInfo = async (req, res) => {
  const assigmentId = req.params.assigmentId;
  //console.log('userId: ' + userId)

  const query = `
      SELECT a.id, a.name, a.description, a.creation_date as created, a.deadline_date as deadline, 
      COUNT(DISTINCT am.user_id) as total_users, 
      SUM(am.isdone) as completed_users
    FROM assigments a 
    LEFT JOIN assigments_members am ON a.id = am.assigment_id 
    WHERE a.id = ?
    GROUP BY a.id
  `;

  db.query(query, [assigmentId], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    //console.log(results);

    const assignments = results.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      created: row.created,
      deadline: row.deadline,
      completion: row.total_users > 0 ? Math.round(row.completed_users * 100 / row.total_users) : 0,
    }));

    return res.json(assignments[0]);
  });
};

export const getAssigmentQuiz = async (req, res) =>{
  const userId = req.params.userId;
  const assigmentId = req.params.assigmentId;

  // execute the SQL query to fetch quiz information
  const query = `
    SELECT q.id, q.name, q.description, COUNT(qq.id) AS numQuestions
    FROM quizzes q
    INNER JOIN questions qq ON q.id = qq.quizz_id
    WHERE q.id IN (
      SELECT a.quiz_id FROM assigments a WHERE a.id = ?
    )
    GROUP BY q.id, q.name, q.description;
  `;
  db.query(query, [assigmentId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching quiz information');
    } else {
      let quiz = {};
      if (results.length > 0) {
        quiz = results[0];
        quiz.numQuestions = quiz.numQuestions || 0;
      }
      res.json(quiz);
    }
  });
  
}


export const getAssigmentExercise = async  (req, res) =>{
  const userId = req.params.userId;
  const assignmentId = req.params.assigmentId;
  //console.log(assignmentId);

  // query to get exercise data by assignment ID
  const query = `
    SELECT e.id, e.name, e.description
    FROM exercises e
    INNER JOIN assigments a ON e.id = a.exercise_id
    WHERE a.id = ?`;

  // execute query with assignment ID parameter
  db.query(query, [assignmentId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error fetching exercise data');
    } else {
      //console.log(results)
      if (results.length > 0) {
        //console.log(results)
        res.json(results[0]); // return first exercise matching assignment ID
      } else {
        res.status(404).send('Exercise not found for assignment ID');
      }
    }
  });

}


export const getAssigmentMemebers = async (req, res) =>{
  const userId = req.params.userId;
  const assignmentId = req.params.assigmentId;
  //console.log(assignmentId);

  const query = `SELECT am.*, u.name, a.deadline_date
                FROM assigments_members AS am 
                INNER JOIN users AS u ON am.user_id = u.id 
                INNER JOIN assigments AS a ON am.assigment_id = a.id 
                WHERE am.assigment_id = ?
                `;

  db.query(query,[assignmentId] ,(error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching results');
    } else {
      const users = results.map((result) => ({
        id: result.user_id,
        name: result.name,
        quiz: result.isquizdone,
        exercise: result.isexercisedone,
        completion: result.isdone ? 100 : 0,
        completionDatetime: result.finisheddate || '',
        deadlineDate: result.deadline_date
      }));

      const data = {
        users,
        quiz: {}, // If you don't need any data from quizzes table, leave it empty
        exercise: {} // If you don't need any data from exercises table, leave it empty
      };
      
      console.log(data);
      res.send(users);
    }
  });

}


export const getAssigmentQuizzes = async (req, res) => {
  const { userId } = req.params;
  try {
    const q = "SELECT id, name, description FROM quizzes WHERE isdone = 1 GROUP BY id";
    const results = await db.promise().query(q);
    if (results.length === 0) return res.status(404).json("No results found");
    const quizzes = results[0].map((quiz) => ({
      id: quiz.id,
      name: quiz.name,
      description: quiz.description,
    }));
    
    res.json( quizzes );
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};


export const getAssigmentExercises = async (req, res) => {
  const { userId } = req.params;
  try {
    const q = "SELECT id, name, description FROM exercises  GROUP BY id";
    const results = await db.promise().query(q);
    if (results.length === 0) return res.status(404).json("No results found");
    const exercises = results[0].map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
    }));
    
    res.json( exercises);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};


export const createAssignment = async (req, res) => {
  const { teamId, name, description,  quizId, exerciseId, deadline, selectedUsers } = req.body;
  console.log(req.body);
  const creationDate = new Date();
  const insertAssignmentSql = `INSERT INTO assigments (name, description, team_id, quiz_id, exercise_id, creation_date, deadline_date)
                               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(insertAssignmentSql, [name, description, teamId, quizId, exerciseId, creationDate, deadline], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send('Failed to create assignment');
    } else {
      const assignmentId = result.insertId;
      const insertMembersSql = `INSERT INTO assigments_members (user_id, assigment_id, isquizdone, isexercisedone, finisheddate, isdone)
                                VALUES (?, ?, ?, ?, ?, ?)`;
      selectedUsers.forEach(userId => {
        db.query(insertMembersSql, [userId.id, assignmentId, false, false, null, false], (error) => {
          if (error) {
            console.log(error);
            res.status(400).send('Failed to create members');
          }
        });
      });
      res.status(200).send('Assignment created successfully');
    }
  });
}


export const modifyAssignmentInfo = (req, res) => {
  const { userId, assigmentId } = req.params;
  console.log(assigmentId, userId)

  const q = `SELECT name, description, quiz_id as quizId, exercise_id as exerciseId, deadline_date as deadline FROM assigments WHERE id = ?`;

  try {
    db.query(q, [assigmentId], (error, result) => {
      if (error) throw error;
      if (result.length === 0) return res.status(404).json({ message: "No results found" });

      const { name, description, quizId, exerciseId, deadline } = result[0];
      const selectedUsers = [];
      const userQuery = `SELECT user_id FROM assigments_members WHERE assigment_id = ?`;

      db.query(userQuery, [assigmentId], (error, userResult) => {
        if (error) throw error;

        if (userResult.length > 0) {
          userResult.forEach((user) => selectedUsers.push(user.user_id));
        }

        const response = {
          name: name,
          description: description,
          quizId: quizId,
          exerciseId: exerciseId,
          deadline: deadline,
          selectedUsers: selectedUsers,
        };
        //console.log(response);
        res.json(response);
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAssigmentStudents = async (req, res) => {
  const { teamName } = req.params;

  try {
    const sql = `SELECT u.id, u.name, u.email, t.isadmin
               FROM users u
               JOIN teammembers t ON t.user_id = u.id
               JOIN teams s ON t.team_id = s.id
               WHERE s.name = ? 
               ORDER BY u.name`;

    db.query(sql, [teamName], (err, results) => {
      if (err) throw err;
      //console.log(results);
      res.json(results);
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting students' });
  }
};


export const quizQuestionDelete = async (req, res) => {
  const userId = req.params.userId;
  const quizId = req.params.quizzId;
  const questionId = req.params.questionId;
  //console.log(quizId, questionId);

  try {
    // delete the question from the database using parameterized query
    const query = 'DELETE FROM questions WHERE id = ? AND quizz_id = ?';
    const results =  db.promise().query(query, [questionId, quizId]);

    // return success response if question was deleted successfully
    return res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete question' });
  }
}


export const updateAssigmentData = async (req, res) => {
  const { assignmentId, name, description, quizId, exerciseId, deadline, selectedUsers } = req.body;
  //console.log(req.body);

  
  const updateAssignmentSql = `UPDATE assigments SET name=?, description=?, quiz_id=?, exercise_id=?, deadline_date=? WHERE id=?`;
  db.query(updateAssignmentSql, [name, description, quizId, exerciseId, deadline, assignmentId], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send('Failed to update assignment');
    } else {
      const deleteMembersSql = `DELETE FROM assigments_members WHERE assigment_id = ?`;
      db.query(deleteMembersSql, [assignmentId], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).send('Failed to delete members');
        } else {
          const insertMembersSql = `INSERT INTO assigments_members (user_id, assigment_id, isquizdone, isexercisedone, finisheddate, isdone)
                                    VALUES (?, ?, ?, ?, ?, ?)`;
          selectedUsers.forEach(userId => {
            db.query(insertMembersSql, [userId.id, assignmentId, false, false, null, false], (error) => {
              if (error) {
                console.log(error);
                res.status(400).send('Failed to create members');
              }
            });
          });
          res.status(200).send('Assignment updated successfully');
        }
      });
    }
  });
};


export const getAllExercises = (req, res) => {
  const q = "SELECT id, name, description FROM exercises GROUP BY id";
  db.query(q, (err,results) =>{
      if (err) return res.status(500).json(err.message);
      if (results.length === 0) return res.status(404).json("No results found")
      res.json(results);
  });
}


export const getAllUserAssigments = async (req, res) => {
  const userId = req.params.userId;

  const query = `
      SELECT a.id, a.name, a.creation_date as created, a.deadline_date as deadline, 
      COUNT(DISTINCT t.id) as total_teams,
      GROUP_CONCAT(DISTINCT t.name SEPARATOR ', ') as team_names,
      MAX(CASE WHEN am.user_id = ? THEN am.isdone ELSE NULL END) as isdone
    FROM assigments a 
    INNER JOIN teams t ON a.team_id = t.id 
    INNER JOIN teammembers tm ON t.id = tm.team_id AND tm.user_id = ?
    LEFT JOIN assigments_members am ON a.id = am.assigment_id
    GROUP BY a.id
    ORDER BY isdone DESC
    `;

  db.query(query, [userId, userId], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const assignments = results.map((row) => ({
      id: row.id,
      name: row.name,
      created: row.created,
      deadline: row.deadline,
      teams: row.team_names,
      total_teams: row.total_teams,
      isdone: row.isdone
    }));

    return res.json(assignments);
  });
};

export const getUserQuizAssigmentResult = async (req, res) => {
  const {userId, assigmentId} = req.params;
  console.log(userId, assigmentId);
  const q = `SELECT
              assigments.name as assigment_name,
              quizzes.*,
              questions.*,
              quizz_results.id,
              quizz_results.user_answear,
              assigments_members.isquizdone,
              assigments_members.isexercisedone,
              users.name as user_name
            FROM
              assigments
              JOIN quizzes ON assigments.quiz_id = quizzes.id
              JOIN questions ON quizzes.id = questions.quizz_id
              JOIN quizz_results ON assigments.quiz_id = quizz_results.quizz_id
              JOIN assigments_members ON assigments.id = assigments_members.assigment_id AND assigments_members.user_id = ?
              JOIN users ON users.id = ?
              JOIN (
                SELECT
                  MAX(id) as id,
                  question_id
                FROM
                  quizz_results
                WHERE
                  user_id = ?
                GROUP BY
                  question_id
              ) as latest_results ON questions.id = latest_results.question_id
              AND quizz_results.id = latest_results.id
            WHERE
              assigments.id = ?
            ORDER BY
              quizz_results.id DESC;`
    db.query(q,[userId, userId, userId, assigmentId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
      }

       // Loop through the questions and compare the user's answer with the correct answer
       result.forEach(question => {
        const userAnswer = JSON.parse(question.user_answear);
        const correctAnswer = question.correctAnswers.split('/').map(answer => {
          if (answer.includes('AnswearA')) {
            return 0;
          } else if (answer.includes('AnswearB')) {
            return 1;
          } else if (answer.includes('AnswearC')) {
            return 2;
          } else if (answer.includes('AnswearD')) {
            return 3;
          }
        });
        console.log(correctAnswer)
        let isCorrect = true;
        userAnswer.forEach(answerIndex => {
          if (correctAnswer.indexOf(answerIndex) === -1) {
            isCorrect = false;
          }
        });
        question.isCorrect = isCorrect;
      });

      console.log(result);
      res.json(result);

    })
}

export const deleteTeamUser = async (req, res) =>{
  const teamId = req.body.teamId;
  const userId = req.body.userId;
  console.log(teamId, userId);

  // First, check if the user is a member of the team
  const checkUserQuery = `SELECT COUNT(*) AS count FROM teammembers tm JOIN users u ON tm.user_id = u.id WHERE tm.team_id = ? AND u.id = ?`;
  db.query(checkUserQuery, [teamId, userId], (err, result) => {
    if (err) {
      console.error('Error checking if user is a member:', err);
      res.status(500).send('Error checking if user is a member');
    } else {
      const count = result[0].count;
      if (count == 0) {
        // If the user is not a member, send an error response
        res.status(400).send('User is not a member of the team');
      } else {
            // Then, delete the user ID and team ID from the 'teammembers' table
            const deleteUserQuery = `DELETE FROM teammembers WHERE user_id = ? AND team_id = ?`;
            db.query(deleteUserQuery, [userId, teamId], (err, result) => {
              if (err) {
                console.error('Error deleting user:', err);
                res.status(500).send('Error deleting user');
              } else {
                // Finally, retrieve the list of team members and send it back to the client
                const getMembersQuery = `SELECT u.name FROM users u JOIN teammembers tm ON u.id = tm.user_id WHERE tm.team_id = ?`;
                db.query(getMembersQuery, [teamId], (err, result) => {
                  if (err) {
                    console.error('Error getting team members:', err);
                    res.status(500).send('Error getting team members');
                  } else {
                    const members = result.map(row => row.name);
                    console.log({members});
                    res.send({ members });
                  }
                });
              }
            }); 
      }
    }
  });
}


export const getAssigmentExerciseResult = async (req, res) =>{
  const {userId, assigmentId} = req.params;
  const query = `SELECT * FROM exercise1 WHERE user_id= ? AND assigment_id= ? ORDER BY id DESC LIMIT 1`;
  db.query(query,[userId, assigmentId] ,(err, rows, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log(rows);
      res.json(rows);
    }
  });
}