import mysql from 'mysql';
import mysql2 from "mysql2"
import {db, pool} from "../db.js";
import generateRandomString from '../functions/emailVerCodeGenerator.js';
import sendVerificationEmail from '../functions/sendEmail.js';
import argon2 from "argon2";
import crypto from 'crypto';
import { debug } from 'console';




export const quizzData = async (req, res) => {
    const q = "SELECT q.id, q.name, qq.id, qq.quizz_id, qq.question, qq.answeara, qq.answearb, qq.answearc, qq.answeard, qq.correctAnswers FROM quizzes q JOIN questions qq ON q.id = qq.quizz_id";
    db.query(q, (err, result) => {
      if (err) return res.status(400).json('Problem with quizz data');
      if (result.length == 0) return res.status(400).json('No data found');
        console.log(result);
      res.json(result);
    });
  };


  export const notificationData = async (req, res) => {
    const q = "SELECT title, description, creation_date FROM notifications ORDER BY creation_date DESC LIMIT 1";
    db.query(q, (err, result) => {
      if (err) return res.send('Problem with notification data');
      if (result.length == 0) return res.send('No data found');
        console.log(result);
      res.json(result);
    });
  };


  export const UnityRegistration = async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const teamcode = req.body.team;
    const IP = req.body.IP;
    const hash = req.body.hash;

    // check if the hash in the HTTP POST request matches the computed hash
    if (2 > 1) {
      // query the userdatadb table to check if the user already exists
      db.query("SELECT * FROM users WHERE name = ? OR email = ?", [name, email], function(err, rows, fields) {
        if (err) throw err;
        if (rows.length === 0) {
          db.query("SELECT * FROM teams WHERE team_code = ?", [teamcode], async function(err, rows, fields) {
            if (err) throw err;
            if (rows.length === 1) {
              const teamid = rows[0].id;
              const verificationCode = generateRandomString();
              const isVerifi = 0;

              const hashPas = await argon2.hash(password);
  
              db.query("INSERT INTO users (name, email, password, IP, verification_code, isverify) VALUES (?, ?, ?, ?, ?, ?)", [name, email, hashPas, IP, verificationCode, isVerifi], function(err, result) {
                if (err) throw err;
                const fromEmail = 'przemek6550@gmail.com'
                sendVerificationEmail(req.body.name, verificationCode, req.body.email, fromEmail);
                db.query("SELECT * FROM users WHERE name = ? AND email = ?", [name, email], async function(errr, rows, fields) {
                  if (errr) throw errr;
                  if (rows.length === 1) {
                    const userid = rows[0].id;
                    db.query("INSERT INTO teammembers (user_id, team_id, isadmin) VALUES (?, ?, ?)", [userid, teamid, 0], async function(errro, result) {
                      if (errro) throw errro;
                      res.send("Doneeee");
                    });
                  }else{
                    res.send("Error in user data ")
                  }
                });
              });
            } else {
              res.send("Team do not exist or team code is invalid");
            }
          });
        } else {
          res.send("A user with this name already exists, \n please choose another one\n or register another account if you wish.");
        }
      });
    } 
  };


  export const UnityEmailVer = (req, res, next) => {
    const name = db.escape(req.body.name);
    const email = db.escape(req.body.email);
    const vercode = db.escape(req.body.verification_code);
    const hash = db.escape(req.body.hash);

    // Concatenate the input data with a secret key
    const secretKey = '123456789';
    const input = name + email + vercode + secretKey;

    // Check if the hash received from the form matches the calculated hash
    if (2 > 1) {
        // Query the database to check if there is a matching record with the user's name and verification code
        db.query(`SELECT * FROM users WHERE name = ${name} AND verification_code = ${vercode}`, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Internal Server Error');
            }

            // Count the number of rows returned by the query
            const numrows = results.length;

            // Fetch the first row returned by the query
            const row = results[0];
            
            // If there is one row with matching name and verification code in the database
            if (numrows === 1 ) {
                // Use a prepared statement to update the record in the database to indicate that the user has been verified
                db.query(`UPDATE users SET isverify = 1 WHERE name = ${name}`, (error, results) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).send('Internal Server Error');
                    }
                    // If the update is successful, output "Verify"
                    res.send('Verify');
                });
            }
        });
    }
    else {
        // If the received hash does not match the calculated hash, output both for debugging purposes
        
        res.send(`hashes do not match`);
    }
  };

  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_DURATION_MINUTES = 30;

export const UnityLogin = async (req, res, next) => {
    const { name, password, IP } = req.body;

    if (!name || !password || !IP) {
        return res.status(400).json({error: "Error: missing required field(s)"});
    }

    // Escape special characters in the input data
    const sqlName = db.escape(name);
    const sqlPass = db.escape(password);

    // Check if the user is locked out
    const user = await getUserByName(name);
    const currentTime = new Date();
    if (user && user.failed_login_attempts >= MAX_LOGIN_ATTEMPTS && user.lockout_until > currentTime) {
        const lockoutDuration = Math.ceil((user.lockout_until - currentTime) / 1000 / 60);
        return res.status(401).json({error: `Account locked. Please try again in ${lockoutDuration} minutes.`});
    }

    // Create a prepared statement to prevent SQL injection attacks
    const sql = `
        SELECT id, name, email, password, status, IP, isverify
        FROM users
        WHERE name = ?
    `;

    db.query(sql, [name], async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({error: "Internal Server Error"});
        }

        if (results.length === 0) {
            // Increment failed login attempts
            if (user) {
                await updateUserFailedLoginAttempts(user.id, user.failed_login_attempts + 1);
            } else {
                await createUserFailedLoginAttempts(name, 1);
            }
            return res.status(401).json({error: "User name is wrong or does not exist"});
        }
        console.log(password)
        const row = results[0];
        const isMatch = await argon2.verify(row.password, password);
        console.log(password, row.password);
        // Check if the password matches the hashed password in the database
        if (isMatch) {
            if (!row.isverify) {
                return res.send({error: "Account not verified. Please check your email for a verification link."});
            }
            const response = {
                message: "Login done.",
                id: row.id,
                name: row.name,
                email: row.email,
                status: row.status,
            };
            if (IP === "1") {
                response.ip = row.IP;
            }
            // Reset failed login attempts
            if (user) {
                await updateUserFailedLoginAttempts(user.id, 0);
            }
            return res.json(response);
        } else {
            // Increment failed login attempts
            if (user) {
                await updateUserFailedLoginAttempts(user.id, user.failed_login_attempts + 1);
                if (user.failed_login_attempts + 1 >= MAX_LOGIN_ATTEMPTS) {
                    const lockoutUntil = new Date(currentTime.getTime() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
                    await updateUserLockoutUntil(user.id, lockoutUntil);
                    const lockoutDuration = Math.ceil(LOCKOUT_DURATION_MINUTES);
                    return res.status(401).json({error: `Account locked. Please try again in ${lockoutDuration} minutes.`});
                }
            } else {
                await createUserFailedLoginAttempts(name, 1);
            }
            return res.send({error: "Password is incorrect"});
        }
    });
};

  async function getUserByName(name) {
      const sql = `SELECT id, failed_login_attempts, lockout_until FROM users WHERE name = ?`;
      const [rows] = await db.promise().query(sql, [name]);
      return rows[0];
      }
      
      async function updateUserFailedLoginAttempts(userId, failedLoginAttempts) {
      const sql = `UPDATE users SET failed_login_attempts = ? WHERE id = ?`;
      await db.promise().query(sql, [failedLoginAttempts, userId]);
      }
      
      async function createUserFailedLoginAttempts(name, failedLoginAttempts) {
      const sql = `INSERT INTO users (name, failed_login_attempts) VALUES (?, ?)`;
      await db.promise().query(sql, [name, failedLoginAttempts]);
      }
      
      async function updateUserLockoutUntil(userId, lockoutUntil) {
      const sql = `UPDATE users SET lockout_until = ? WHERE id = ?`;
      await db.promise().query(sql, [lockoutUntil, userId]);
      }
      
      // Export helper functions for testing purposes
      // module.exports = {
      // getUserByName,
      // updateUserFailedLoginAttempts,
      // createUserFailedLoginAttempts,
      // updateUserLockoutUntil
      // };

      export const getAssigmentsUnity = async (req, res) => {
        const userId = req.params.userId;
        console.log(userId);
        try {
          const [rows] = await pool.execute(`
            SELECT a.id, a.name, a.description, a.quiz_id, a.exercise_id, a.deadline_date, a.image, am.isquizdone
            FROM assigments AS a
            JOIN assigments_members AS am ON a.id = am.assigment_id
            WHERE am.user_id = ? AND am.isdone = 0
          `, [userId]);
          res.json(rows);
        } catch (error) {
          console.error(error);
          res.status(500).send('Failed to retrieve assignments');
        }
      }


  export const quizResultSubmitted = async (req, res) =>{
    const userId = req.params.userId;
    const assigmentId = req.params.assigmentId;
    const jsonData = req.body;
  
    try {
      db.beginTransaction();
      await Promise.all(jsonData.map(record => {
        return new Promise((resolve, reject) => {
          db.query('INSERT INTO quizz_results (user_id, quizz_id, question_id, user_answear) VALUES (?, ?, ?, ?)',
            [userId, record.quizId, record.questionId, JSON.stringify(record.userAnswers)],
            function (error, results, fields) {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        });
      }));
      
      // Update assignment_members table
      db.query('UPDATE assigments_members SET isquizdone = ? WHERE user_id = ? AND assigment_id = ?',
        [true, userId, assigmentId],
        function (error, results, fields) {
          if (error) {
            console.log(error);
            db.rollback();
            res.status(500).send('Internal server error');
          } else {
            db.commit();
            res.send('OK');
          }
        }
      );
      
    } catch (error) {
      console.log(error);
      db.rollback();
      res.status(500).send('Internal server error');
    }
}

export const exerciseResultSubmitted = async (req, res) =>{
  const userId = req.params.userId;
  const assigmentId = req.params.assigmentId;
  const jsonData = req.body;

  const q = 'INSERT INTO exercise1 ( user_id, assigment_id, exercise_id, resultsRefract, isSorted, isTargetHit) VALUES (?, ?, ?, ?, ?, ?)'

  db.query(q, [userId, assigmentId, jsonData.exerciseId, jsonData.savedText, jsonData.isSortingDone, jsonData.targetHit], (error, results) => {
    if(error) {
      res.status(500).send('Querry error');
      console.log(error);
    }
    db.query('UPDATE assigments_members SET isexercisedone = ?, isdone = ? WHERE user_id = ? AND assigment_id = ?',
        [true, true, userId, assigmentId],
        function (err, resul) {
          if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
          } else {
            res.status(200).send('OK');
          }
        }
      );
  });
}
