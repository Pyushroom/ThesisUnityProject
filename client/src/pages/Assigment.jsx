import React, { useState, useEffect, useContext } from 'react';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import { AuthContext } from '../context/authContext.js'
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '16px'
  },
  completionProgress: {
    position: 'relative',
    display: 'inline-flex',
  },
  progressCircle: {
    color: 'blue',
    marginRight: '8px'
  },
  viewButton: {
    marginRight: '8px'
  },
  modifyButton: {
    backgroundColor: 'transparent'
  },
  tableHead: {
    backgroundColor: '#1769aa',
    color: '#fff'
  },
  redText: {
    color: 'red'
  }
}));


const AssigmentInfo = ({ assigmentId }) => {
  const { currentUser } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      const response = await axios.get(`http://localhost:5000/server/users/${currentUser.id}/assigments/assigment/${assigmentId}/getInfo`);
      setAssignment(response.data);
    };
  
    fetchAssignment();
  }, [assigmentId, currentUser.id]);
  
  if (!assignment) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className="assimentinfo">
      <Typography variant="h6">{assignment.name}</Typography>
      <Typography variant="subtitle1">Description: {assignment.description}</Typography>
      <Typography variant="subtitle1">Created: {assignment.created}</Typography>
      <Typography variant="subtitle1">Deadline: {assignment.deadline}</Typography>
      <Typography variant="subtitle1">Completion: {assignment.completion}%</Typography>
    </div>
  );
};

const QuizInfo = ({ id }) => {
  const classes = useStyles();
  const [quiz, setQuiz] = useState({});
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);


  useEffect(() => {
    axios.get(`http://localhost:5000/server/users/${currentUser.id}/assigments/assigment/${id}/getQuiz`)
      .then(response => {
        console.log(response.data);
        setQuiz(response.data)
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  }, [id]);

  return (
    <div className="quiz">
      {loading ? (
        <CircularProgress className={classes.progressCircle} />
      ) : (
        <>
          {quiz.id && (
            <>
              <Typography variant="h6" mt={3}>
                Quiz
              </Typography>
              <Typography variant="subtitle1">Name: {quiz.name}</Typography>
              <Typography variant="subtitle1">
                Description: {quiz.description}
              </Typography>
              <Typography variant="subtitle1">
                Number of questions: {quiz.numQuestions}
              </Typography>
            </>
          )}
        </>
      )}
    </div>
  );
};


const ExerciseInfo = ({ id }) => {
  const [exercise, setExercise] = useState({});
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
  const fetchExercise = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/server/users/${currentUser.id}/assigments/assigment/${id}/getExercise`);
      setExercise(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  
  fetchExercise();
}, [id, currentUser.id]);


  return (
    <div>
      {loading ? (
        <CircularProgress className={'progressCircle'} />
      ) : (
        <>
          {exercise.id && (
            <>
              <Typography variant="h6" mt={3}>
                Exercise
              </Typography>
              <Typography variant="subtitle1">Name: {exercise.name}</Typography>
              <Typography variant="subtitle1">Description: {exercise.description}</Typography>
            </>
          )}
        </>
      )}
    </div>
  );
};

const ResultTable = ({id}) =>{
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState({});
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/server/users/${currentUser.id}/assigments/assigment/${id}/getMembers`);
        const data = response.data;
        console.log(data.quiz);
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id, currentUser.id]);

  const isDeadlinePassed = (deadline) => {
    const now = new Date();
    return now.getTime() > new Date(deadline).getTime();
  };

  const handleViewResult = (userId) => {
    console.log(`View result for user ${userId} and assigment id ${id}`);
    navigate(`/assignment/${id}/view/${userId}`);
  };

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">Completion</TableCell>
              <TableCell align="center">Completion Time</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell align="center">
                  <div className={classes.completionProgress}>
                    <CircularProgress
                      size={24}
                      className={classes.progressCircle}
                      variant="determinate"
                      value={user.completion}
                      style={{ color: blue[500] }}
                    />
                    <Typography variant="subtitle1" component="div">
                      {user.completion}%
                    </Typography>
                  </div>
                </TableCell>
                <TableCell align="center">
                  {user.completionDatetime ? (
                    <Typography variant="subtitle1">{user.completionDatetime}</Typography>
                  ) : (
                    <Typography className={classes.redText} variant="subtitle1">
                      Not Completed
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  {isDeadlinePassed(user.deadlineDate) || user.completion === 100 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      className={classes.viewButton}
                      onClick={() => handleViewResult(user.id)}
                    >
                      View Result
                    </Button>
                  ) : null}
                  {!isDeadlinePassed(user.deadlineDate) && (
                    <Button
                      variant="contained"
                      size="small"
                      className={classes.modifyButton}
                      onClick={() => console.log('Modify clicked')}
                    >
                      Modify
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

};

const Assignment = () => {
  const { id, teamName } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const classes = useStyles();

  const handleGoBack = () => {
    navigate(-1);
  }

  const handleEdit = () => {
    navigate(`/assignment/${id}/edit/${teamName}`);
  }


  return (
    <div className={classes.container}>
      <Button variant="contained" color="primary" onClick={handleGoBack}>
        Go Back
      </Button>
      {currentUser.status === 1 && (
        <Button variant="contained" color="primary" onClick={handleEdit}>
          Edit
        </Button>
      )}
      <AssigmentInfo assigmentId={id} />
      <QuizInfo id={id} />
      <ExerciseInfo id={id} />
      {currentUser.status === 1 && (
      <ResultTable id={id} />
      )}
    </div>
  );
};

export default Assignment;
