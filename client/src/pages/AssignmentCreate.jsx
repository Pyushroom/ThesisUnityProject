import React, { useState, useEffect, useContext } from 'react';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Box, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import axios from 'axios';
import { AuthContext } from '../context/authContext.js';
import AssigmentMembersTable from '../components/AssigmentMembersTable/AssigmentMembersTable';


const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  },
  inputField: {
    marginBottom: '16px',
    width: '100%',
    maxWidth: '500px'
  },
  selectField: {
    marginBottom: '16px',
    width: '100%',
    maxWidth: '500px'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '24px'
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
  },
  dataContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }
}));

const AssignmentCreate = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [assignmentName, setAssignmentName] = useState('');
  const [assignmentDesc, setAssignmentDesc] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState({});
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState({});
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesResponse, exercisesResponse] = await Promise.all([
          axios.get(`http://localhost:5000/server/users/${currentUser.id}/assigments/assigment/getQuizzes`),
          axios.get(`http://localhost:5000/server/users/${currentUser.id}/assigments/assigment/getExercises`)
        ]);
        console.log(quizzesResponse.data)
        setQuizzes(quizzesResponse.data);
        setExercises(exercisesResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [currentUser.id, teamId]);
  

  const handleCreate = () => {
    const newAssignment = {
      teamId: teamId,
      name: assignmentName,
      description: assignmentDesc,
      quizId: selectedQuiz.id,
      exerciseId: selectedExercise.id,
      deadline: deadline,
      selectedUsers: selectedUsers
    };
    axios.post(`http://localhost:5000/server/users/${currentUser.id}/assigments/createAssigment`, newAssignment)
      .then(response => {
        console.log(response);
        navigate(-1);
      })
      .catch(error => console.log(error));
  };

  const handleSelectUsers = (users) => {
    setSelectedUsers(users);
  };

  return (
    <div className={classes.container}>
      <Typography variant="h6">Create New Assignment</Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <div className={classes.dataContainer}>
            <TextField
              className={classes.inputField}
              label="Assignment Name"
              variant="outlined"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              required
            />

            <TextField
              className={classes.inputField}
              label="Assignment Description"
              variant="outlined"
              multiline
              rows={4}
              value={assignmentDesc}
              onChange={(e) => setAssignmentDesc(e.target.value)}
              required
            />
            <FormControl className={classes.selectField}>
              <InputLabel id="quiz-select-label">Select Quiz</InputLabel>
              <Select
                labelId="quiz-select-label"
                id="quiz-select"
                value={selectedQuiz}
                onChange={(e) => setSelectedQuiz(e.target.value)}
                required
              >
                
                {quizzes.map((quiz) => (
                  <MenuItem key={quiz.id} value={quiz}>
                    {quiz.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.selectField}>
          <InputLabel id="exercise-select-label">Select Exercise</InputLabel>
          <Select
            labelId="exercise-select-label"
            id="exercise-select"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            required
          >
            
            {exercises.map((exercise) => (
              <MenuItem key={exercise.id} value={exercise}>
                {exercise.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
            className={classes.inputField}
            label="Deadline"
            variant="outlined"
            type="datetime-local"
            InputLabelProps={{
            shrink: true,
            }}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            />

      </div>
    </Grid>
    <Grid item xs={12} sm={6}>
      {selectedQuiz.id &&
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Typography variant="subtitle1">Selected Quiz:</Typography>
          <Tooltip title={selectedQuiz.description}>
            <Typography variant="subtitle1" className={classes.redText}>{selectedQuiz.name}</Typography>
          </Tooltip>
        </Box>
      }
      {selectedExercise.id &&
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Typography variant="subtitle1">Selected Exercise:</Typography>
          <Tooltip title={selectedExercise.description}>
            <Typography variant="subtitle1" className={classes.redText}>{selectedExercise.name}</Typography>
          </Tooltip>
        </Box>
      }
      <AssigmentMembersTable teamId={teamId} onSelectUsers={handleSelectUsers} />
    </Grid>
  </Grid>

  <div className={classes.buttonGroup}>
    <Button variant="contained" onClick={() => navigate(-1)} className={classes.modifyButton}>Cancel</Button>
    <Button
      variant="contained"
      color="primary"
      onClick={handleCreate}
      disabled={
        !assignmentName ||
        !assignmentDesc ||
        !selectedQuiz.id ||
        !selectedExercise.id ||
        !deadline ||
        !selectedUsers.length
      }
    >
      Create
    </Button>

  </div>
</div>
);
};

export default AssignmentCreate;
