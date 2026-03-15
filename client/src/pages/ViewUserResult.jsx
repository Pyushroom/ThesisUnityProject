import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate  } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const ViewExerciseResult = (assigmentId, userId) =>{
  const [exercise, setExercise] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/server/users/${userId}/assigments/assigment/${assigmentId}/getResultsExercise`)
      .then(response => {
        console.log(response.data);
        setExercise(response.data);
      })
      .catch(error => console.log(error));
  }, [userId, assigmentId]);

  if (!exercise) {
    return <div>Loading...</div>;
  }

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
  };

  return(
    <div>
      <div>
      <Typography variant="h4" gutterBottom>Exercises</Typography>
        <div key={exercise.name}>
          <Card
            onClick={() => handleExerciseClick(exercise)}
            style={{
              marginBottom: 8,
              transform: selectedExercise === exercise ? 'translateY(-8px)' : 'none',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              backgroundColor: selectedExercise === exercise ? '#f0f0f0' : '#ffffff',
            }}
          >
            <CardContent>
              <Typography variant="h6">{exercise.name}</Typography>
            </CardContent>
          </Card>
          {selectedExercise === exercise && (
            <Card style={{ marginTop: 16 }}>
              <CardContent>
                <Typography variant="h5">{selectedExercise.name}</Typography>
                <Typography color="secondary">Exercise sorting: {selectedExercise.isSortingDone}</Typography>
                <Typography color="secondary">Refraction exercise answear: {selectedExercise.answearRefract}</Typography>
                <Typography color="secondary">Is target exercise done: {selectedExercise.isTargetDone}</Typography>
              </CardContent>
            </Card>
          )}
        </div>
    </div>
    </div>
  )
}

const ViewUserResult = () => {
  const { id, userId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/server/users/${userId}/assigments/assigment/${id}/getResults`)
      .then(response => {
        console.log(response.data);
        setQuizData(response.data);
      })
      .catch(error => console.log(error));
  }, [userId, id]);

  if (!quizData) {
    return <div>Loading...</div>;
  }

  if (!quizData.map || !quizData[0]) {
    return <div>No data about quiz results</div>;
  }

  const { assigment_name, name, user_name } = quizData[0];

  let correctCount = 0;
  quizData.forEach(data => {
    if (data.isCorrect) {
      correctCount++;
    }
  });

  const handleGoBack = () => {
    navigate(-1);
  }

  const options = ['A', 'B', 'C', 'D'];

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleGoBack} style={{marginBottom: '8px'}}>
        Go Back
      </Button>
      <Typography variant="h4">{assigment_name}</Typography>
      <Typography variant="h5">Student name: {user_name}</Typography>
      <Typography variant="h5">{name}</Typography>
      <Typography variant="subtitle1">Correct: {correctCount}/{quizData.length}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Index</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Is Correct</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizData.map((data, index) => (
             <TableRow key={index} style={{color: data.isCorrect ? 'green' : 'red '}}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>{data.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div>
                        <Typography variant="subtitle1"> A) {data.answeara}</Typography>
                        <Typography variant="subtitle1"> B) {data.answearb}</Typography>
                        <Typography variant="subtitle1"> C) {data.answearc}</Typography>
                        <Typography variant="subtitle1"> D) {data.answeard}</Typography>
                        <Typography variant="subtitle1">
                          User's answer: {JSON.parse(data.user_answear).map(num => options[num]).sort((a, b) => options.indexOf(a) - options.indexOf(b)).join(', ')}
                        </Typography>
                        <Typography variant="subtitle1">
                          Correct answer: {data.correctAnswers.split('/').map(ans => ans[ans.length-1]).join(', ')}
                        </Typography>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
                <TableCell>{data.isCorrect ? 'Correct' : 'Incorrect'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ViewExerciseResult assigmentId = {id} userId = {userId} />
    </div>
  );
};

export default ViewUserResult;
