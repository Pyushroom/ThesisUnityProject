import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Grid, Typography, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AuthContext } from '../../context/authContext.js'
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditQuestionDialog from '../EditQuestion/EditQuestionDialog.jsx';
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
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
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


const DisplayQuestions = ({ quizId }) => {
    const { currentUser } = useContext(AuthContext);
    const classes = useStyles();
    const [quizData, setQuizData] = useState(null);
    const [editQuestionDialogOpen, setEditQuestionDialogOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
 
    useEffect(() => {
      const fetchQuizData = async () => {
        console.log('quizId = ' + quizId);
        const response = await axios.get(`http://localhost:5000/server/users/${currentUser.id}/quizz/${quizId}/questions`);
        console.log(response)
        setQuizData(response.data);
      };
      fetchQuizData();
    }, [quizId]);
 
    const handleEditQuestion = (questionId) => {
      setSelectedQuestion(questionId);
      setEditQuestionDialogOpen(true);
    };
    const handleSave = (questionId, updatedQuestion) => {
      // update the question in the state or send the updated question to the server
    };
 
    const handleDeleteQuestion = async (questionId) => {
      try {
        const response = await axios.delete(`http://localhost:5000/server/users/${currentUser.id}/quizz/${quizId}/questions/${questionId}/deleteQuestion`);
        setQuizData(prevState => ({
          ...prevState,
          questions: prevState.questions.filter(question => question.id !== questionId)
        }));
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

      const handleClose = () => {
        setSelectedQuestion(null);
        setEditQuestionDialogOpen(false);
        
      };
 
    if (!quizData) {
      return <div>Loading...</div>;
    }
 
    const { name, questions } = quizData;
 
    return (
      <div className={classes.root}>
        <Typography variant="h6">{name}</Typography>
        <Grid container justifyContent="center" alignItems="center">
          {questions.map((question) => (
            <Grid item xs={12} md={6} key={question.id}>
              <Card variant="outlined" className={classes.card}>
                <CardContent>
                  <div className={classes.question}>
                    <Typography variant="subtitle1">
                      {question.question}
                    </Typography>
                    <div>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEditQuestion(question)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                  {Object.entries(question.answers).map(([key, value]) => (
                    <div
                      key={key}
                      className={`${classes.answer} ${
                        value.isCorrect ? classes.correctAnswer : ''
                      }`}
                    >
                      <Typography variant="subtitle2" className={classes.answerLetter}>
                        {(() => {
                          switch (key) {
                            case '0':
                              return 'A';
                            case '1':
                              return 'B';
                            case '2':
                              return 'C';
                            case '3':
                              return 'D';
                            default:
                              return '';
                          }
                        })()}
                      </Typography>
                      <Typography variant="body2" style={{marginLeft: '5px'}}>{value.text}</Typography>
                    </div>
  ))}
  </CardContent>
  </Card>
  </Grid>
  ))}
  </Grid>
  {selectedQuestion ? (
  <EditQuestionDialog
    question={selectedQuestion}
    quizId={quizId}
    open={editQuestionDialogOpen}
    onClose={handleClose}
    onSave={handleSave}
  />
) : null}

  </div>
  );
  };
 
  export default DisplayQuestions;

