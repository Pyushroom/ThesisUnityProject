import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { AuthContext } from '../context/authContext.js';
function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    axios.get('http://localhost:5000/server/users/${currentUser.id}/exercises')
      .then((response) => {
        setExercises(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Exercises</Typography>
      {exercises.map((exercise) => (
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
                <Typography color="secondary">{selectedExercise.description}</Typography>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
}

export default Exercises;
