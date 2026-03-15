import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Grid, Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AuthContext } from '../context/authContext.js';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: '16px',
  },
  card: {
    marginBottom: '16px',
    borderRadius: '16px',
    border: '2px solid #4f4f4f',
    padding: '16px',
  },
  question: {
    marginBottom: '8px',
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
    padding: '8px',
    borderRadius: '8px',
  },
  answer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '4px',
    paddingLeft: '16px',
    backgroundColor: '#f2f2f2',
    padding: '8px',
    borderRadius: '8px',
  },
  correctAnswer: {
    backgroundColor: '#4caf50',
    color: '#ffffff',
  },
}));

const Quiz = (props) => {
  const classes = useStyles();
  const [quizData, setQuizData] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { quizId } = useParams();
  const navigate = useNavigate();

  console.log(quizId);

  useEffect(() => {
    const fetchQuizData = async () => {
      console.log('quizId = ' + quizId);
      const response = await axios.get(`http://localhost:5000/server/users/${currentUser.id}/quizz/${quizId}/questions`);
      console.log(response)
      setQuizData(response.data);
    };
    fetchQuizData();
  }, [quizId]);

  if (!quizData) {
    return <div>Loading...</div>;
  }

  const { name, creator, questions } = quizData;
  console.log(creator)

  const handleGoBack = () => {
    navigate(-1);
  }

  const handleModifyQuiz = () => {
    // navigate to modify quiz page
    navigate(`/quizz/${quizId}/edit`);
  }

  return (
    <div className={classes.root}>
      <Button variant="contained" color="primary" onClick={handleGoBack}>
        Go Back
      </Button>
      {currentUser.id === creator && 
        <Button variant="contained" color="primary" onClick={handleModifyQuiz} style={{marginLeft: '16px'}}>
          Modify Quiz
        </Button>
      }
      <Typography variant="h6">{name}</Typography>
      <Grid container justifyContent="center" alignItems="center">
        {questions.map((question) => (
          <Grid item xs={12} md={6} key={question.id}>
            <Card variant="outlined" className={classes.card}>
              <CardContent>
                <Typography variant="subtitle1" className={classes.question}>
                  {question.question}
                </Typography>
                {Object.entries(question.answers).map(([key, value]) => (
                  <div
                    key={key}
                    className={`${classes.answer} ${
                      value.isCorrect ? classes.correctAnswer : ''
                    }`}
                  >
                    <Typography variant="subtitle2" className={classes.answerLetter}>
                      {key.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" style={{marginLeft: '5px'}}>{value.text}</Typography>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Quiz;