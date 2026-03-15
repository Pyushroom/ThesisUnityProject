import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/authContext.js';
import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, Visibility } from "@mui/icons-material";

import "../styles/Quizzes.scss";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [newQuizName, setNewQuizName] = useState("");
  const [newQuizDescription, setNewQuizDescription] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleCreateQuizClick = () => {
    setShowCreateQuizModal(true);
  };

  const handleCreateQuizCancel = () => {
    setShowCreateQuizModal(false);
  };

  const handleCreateQuizSubmit = (event) => {
    event.preventDefault();
    axios.post(`http://localhost:5000/server/users/${currentUser.id}/quizzes`, {
      name: newQuizName,
      description: newQuizDescription,
      user_id: currentUser.id,
    })
      .then(response => {
        const newQuiz = response.data.id;
        console.log(newQuiz)
        setShowCreateQuizModal(false);
        ///create/:quizzId
        navigate(`/quizz/create/${newQuiz}`);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/server/users/${currentUser.id}/quizzes`)
      .then(response => {
        console.log(response.data);
        setQuizzes(response.data.map((quiz) => ({
          id: quiz.id,
          name: quiz.name,
          description: quiz.description,
          questions: quiz.num_questions,
          creatorId: quiz.creator_id,
          isdone: quiz.aname
        })));
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div className="quizzes-container">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6} sm={6} md={8}>
          <Typography variant="h6">Quizzes</Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={4} className="create-button-container">
          <Button variant="contained" color="primary" onClick={handleCreateQuizClick}>
            Create Quiz
          </Button>
        </Grid>
      </Grid>
      <div className="quizzes-list">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} variant="outlined" className="quiz-card" >
           <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm>
                <Typography variant="h6">{quiz.name}</Typography>
                <Typography color="textSecondary">
                  {quiz.description}
                </Typography>
                <Typography color="textSecondary">
                  {quiz.questions} questions
                </Typography>
                {quiz.isdone === 1 ? (
                  <Typography style={{color: 'green'}}>Completed</Typography>
                ) : (
                  <Typography style={{color: 'red'}}>Not Completed</Typography>
                )}
              </Grid>
              <Grid item>
                {quiz.isdone === 1 &&
                  <IconButton
                    color="primary"
                    aria-label="View"
                    component={Link}
                    to={`/quizz/${quiz.id}`}
                  >
                    <Visibility />
                  </IconButton>
                }
                {currentUser.id === quiz.creatorId && // Only show edit button if current user is the creator
                    <IconButton
                      color="primary"
                      aria-label="Edit"
                      component={Link}
                      to={`/quizz/${quiz.id}/edit`}
                    >
                      <Edit />
                    </IconButton>
                  }
              </Grid>
            </Grid>
          </CardContent>
          </Card>
        ))}
      </div>
      <Modal open={showCreateQuizModal} onClose={handleCreateQuizCancel}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '2rem' }}>
          <Typography variant="h6">Create New Quiz</Typography>
          <form onSubmit={handleCreateQuizSubmit} style={{ marginTop: '1rem' }}>
            <TextField 
            label="Name" 
            variant="outlined" 
            size="small" 
            fullWidth value={newQuizName} 
            onChange={(event) => setNewQuizName(event.target.value)} 
            />
            <TextField
              label="Description"
              variant="outlined"
              size="small"
              fullWidth
              multiline
              rows={6}
              value={newQuizDescription}
              onChange={(event) => setNewQuizDescription(event.target.value)}
              style={{ marginTop: '1rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button variant="contained" color="secondary" onClick={handleCreateQuizCancel} style={{ marginRight: '1rem' }}>
                Close
              </Button>
              <Button type="submit" variant="contained" color="primary" >
                Create
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>

  )
};

export default Quizzes

