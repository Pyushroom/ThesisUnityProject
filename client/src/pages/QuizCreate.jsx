import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.js";
import { makeStyles } from '@mui/styles';
import DisplayQuestions from '../components/DisplayQuestions/DisplayQuestions';
import axios from "axios";
import {
  Box,
  Grid,
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const useStyles = makeStyles({
  saveButton: {
    backgroundColor: "#4caf50",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#388e3c",
    },
  },
  correctAnswer: {
    color: "#4caf50",
  },
  questionField: {
    marginBottom: "1rem",
    "& input": {
      fontSize: "1.2rem",
      padding: "1rem",
    }
  },
  answerField: {
    marginBottom: "0.5rem",
    "& input": {
      fontSize: "1rem",
      padding: "1rem",
    }
  },
  correctAnswerField: {
    backgroundColor: "#e8f5e9",
    "& input": {
      color: "#4caf50",
    }
  },
});

const CreateQuiz = () => {
  const { quizzId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const classes = useStyles();

  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/server/users/${currentUser.id}/quizz/create/${quizzId}`)
      .then((response) => {
        console.log(response.data);
        setQuizzes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [quizzId, currentUser.id]);

  useEffect(() => {
    console.log("isAddQuestionOpen:", isAddQuestionOpen);
  }, [isAddQuestionOpen]);

  

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:5000/server/users/${currentUser.id}/quizz/create/${quizzId}/save`, {
        isDone: true,
      })
      .then(() => {
        console.log("Quiz saved successfully!");
        navigate(-1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddQuestionOpen = () => {
    setIsAddQuestionOpen(true);
  };

  const handleAddQuestionClose = () => {
    setIsAddQuestionOpen(false);
  };

  const handleQuestionTextChange = (event) => {
    setQuestionText(event.target.value);
  };

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index].text = event.target.value;
    setAnswers(newAnswers);
  };

  const handleIsCorrectChange = (index) => {
    const newAnswers = [...answers];
    newAnswers[index].isCorrect = !newAnswers[index].isCorrect;
    setAnswers(newAnswers);
  };

  const handleQuestionSave = () => {
    try {
      // send question data to server with axios
  
      axios
        .post(`http://localhost:5000/server/users/${currentUser.id}/quizz/${quizzId}/addquestion`, {
          questionText,
          answers,
        })
        .then((res) => {
          
          console.log("response");
          console.log(res.data);
          const questionId = res.data.id;
          console.log(`New question ID: ${questionId}`);
          try {
            setQuizzes([...quizzes, res.data]);
            console.log(quizzes)
          } catch (error) {
            console.log(error);
          }
          setIsAddQuestionOpen(false);
          setQuestionText("");
          setAnswers([
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ]);
          window.location.reload();
          console.log(answers)
          console.log(quizzes)
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  
  
  
  

    return (
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Button variant="outlined" color="primary" onClick={handleGoBack}>
              Back
            </Button>{" "}
            <Button className={classes.saveButton} onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
        <Grid container spacing={2}>
          {quizzes?.map((question) => (
            <Grid item xs={12} md={6} key={question.id}>
              <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {question.questionText}
                </Typography>
                {question.answers && question.answers.map((answer) => (
                  <Box key={answer.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={answer.isCorrect}
                          color="primary"
                          disabled
                        />
                      }
                      label={answer.text}
                      className={
                        answer.isCorrect ? classes.correctAnswer : null
                      }
                    />
                  </Box>
                ))}
              </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddQuestionOpen}
                >
                  Add Question
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <DisplayQuestions quizId={quizzId} />
          </Grid>
        </Grid>
        <Dialog
            open={isAddQuestionOpen}
            onClose={handleAddQuestionClose}
            maxWidth="800px"
          >
          <DialogTitle>Add Question</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <TextField
                id="question"
                label="Question"
                variant="filled"
                multiline
                rows={2}
                value={questionText}
                onChange={handleQuestionTextChange}
                className={classes.questionField}
              />
              {answers.map((answer, index) => (
                <FormControl key={index} fullWidth>
                  <TextField
                    id={`answer-${index}`}
                    label={`Answer ${index + 1}`}
                    variant="outlined"
                    value={answer.text}
                    onChange={(event) => handleAnswerChange(index, event)}
                    className={
                      answer.isCorrect
                        ? `${classes.answerField} ${classes.correctAnswerField}`
                        : classes.answerField
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={answer.isCorrect}
                        onChange={() => handleIsCorrectChange(index)}
                        color="primary"
                      />
                    }
                    label="Correct Answer"
                  />
                </FormControl>
              ))}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddQuestionClose}>Cancel</Button>
            <Button onClick={handleQuestionSave} disabled={!questionText}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
    
    }
    export default CreateQuiz;