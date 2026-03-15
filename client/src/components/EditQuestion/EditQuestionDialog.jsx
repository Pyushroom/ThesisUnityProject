import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const EditQuestionDialog = ({ question, quizId, open, onClose, onSave }) => {
  const [updatedQuestion, setUpdatedQuestion] = useState(question.question);
  const [updatedAnswers, setUpdatedAnswers] = useState(question.answers);
  const [initialQuestion, setInitialQuestion] = useState(question.question);
  const [initialAnswers, setInitialAnswers] = useState(question.answers);
  const { currentUser } = useContext(AuthContext);
  
  const wasClosed = useRef(false);

  useEffect(() => {
    setInitialQuestion(question.question);
    setInitialAnswers(question.answers);
  }, [question]);

  const handleQuestionChange = (event) => {
    setUpdatedQuestion(event.target.value);
  };

  const handleAnswerChange = (event, index) => {
    const newAnswers = [...updatedAnswers];
    newAnswers[index].text = event.target.value;
    setUpdatedAnswers(newAnswers);
  };

  const handleCorrectAnswerChange = (event, index) => {
    const newAnswers = [...updatedAnswers];
    newAnswers[index].isCorrect = event.target.checked;
    setUpdatedAnswers(newAnswers);
  };
  
  const handleSave = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/server/users/${currentUser.id}/quizz/${quizId}/questions/${question.id}/edit`, {
        question: updatedQuestion,
        answers: updatedAnswers
      });
      console.log(response)
      onSave(updatedQuestion, updatedAnswers);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setUpdatedQuestion(initialQuestion);
    setUpdatedAnswers(initialAnswers);
    wasClosed.current = true;
    onClose();
  };

  useEffect(() => {
    if (wasClosed.current) {
      setUpdatedQuestion(initialQuestion);
      setUpdatedAnswers(initialAnswers);
    }
    wasClosed.current = false;
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Question</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Question"
          type="text"
          fullWidth
          value={updatedQuestion}
          onChange={handleQuestionChange}
        />
        {updatedAnswers.map((answer, index) => (
          <Box key={index} display="flex" alignItems="center" mt={1}>
            <Typography variant="subtitle1" component="span" mr={1}>
              {String.fromCharCode(65 + index)}:
            </Typography>
            <TextField
              margin="dense"
              label={`Answer ${String.fromCharCode(65 + index)}`}
              type="text"
              fullWidth
              value={answer.text}
              onChange={(event) => handleAnswerChange(event, index)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={answer.isCorrect}
                  onChange={(event) => handleCorrectAnswerChange(event, index)}
                  color="primary"
                />
              }
              label="Correct"
              labelPlacement="end"
            />
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditQuestionDialog;
