import React, { useState, useEffect, useContext } from 'react';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Box, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import axios from 'axios';
import { AuthContext } from '../context/authContext.js';
import AssigmentEditTable from '../components/AssigmentEditTable/AssigmentEditTable.jsx';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


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

const AssignmentEdit = () => {
  const { id, teamName } = useParams();

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
        const [assignmentResponse, quizzesResponse, exercisesResponse] = await Promise.all([
          axios.get(`http://localhost:5000/server/users/${currentUser.id}/assigments/assigment/${id}/info`),
          axios.get(`http://localhost:5000/server/users/${currentUser.id}/assigments/assigment/getQuizzes`),
          axios.get(`http://localhost:5000/server/users/${currentUser.id}/assigments/assigment/getExercises`)
        ]);
        const { name, description, quizId, exerciseId, deadline, selectedUsers } = assignmentResponse.data;
        setAssignmentName(name);
        setAssignmentDesc(description);
        setDeadline(dayjs(deadline));
        setSelectedUsers(selectedUsers);
        setSelectedQuiz(quizzesResponse.data.find(q => q.id === quizId) || {});
        setSelectedExercise(exercisesResponse.data.find(e => e.id === exerciseId) || {});
        setQuizzes(quizzesResponse.data);
        setExercises(exercisesResponse.data);
        console.log(selectedUsers)
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [currentUser.id, teamName, id]);
  

  const handleCreate = () => {
    const updatedAssignment = {
      assignmentId: id,
      name: assignmentName,
      description: assignmentDesc,
      quizId: selectedQuiz.id,
      exerciseId: selectedExercise.id,
      deadline: deadline,
      selectedUsers: selectedUsers
    };
    console.log(updatedAssignment);
    axios.put(`http://localhost:5000/server/users/${currentUser.id}/assigments/assigment/${id}/update`, updatedAssignment)
      .then(response => {
        console.log(response);
        navigate(`/assignment/${id}/${teamName}`)
      })
      .catch(error => console.log(error));
  };

  const handleSelectUsers = (users) => {
    setSelectedUsers(users);
  };

  return (
    <div className={classes.container}>
      <Typography variant="h6">Modify Assignment</Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <div className={classes.dataContainer}>
            <TextField
              className={classes.inputField}
              label="Assignment Name"
              variant="outlined"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              />
              <TextField
              className={classes.inputField}
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              value={assignmentDesc}
              onChange={(e) => setAssignmentDesc(e.target.value)}
              />
                      <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="quiz-select-label">Quiz</InputLabel>
          <Select
            labelId="quiz-select-label"
            id="quiz-select"
            value={selectedQuiz.id || ''}
            onChange={(e) => {
              const quizId = e.target.value;
              setSelectedQuiz(quizzes.find(q => q.id === quizId) || {});
              }}
              label="Quiz"
              >
              {quizzes.map(quiz => (
              <MenuItem key={quiz.id} value={quiz.id}>{quiz.name}</MenuItem>
              ))}
              </Select>
              </FormControl>
              <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="exercise-select-label">Exercise</InputLabel>
              <Select
              labelId="exercise-select-label"
              id="exercise-select"
              value={selectedExercise.id || ''}
              onChange={(e) => {
              const exerciseId = e.target.value;
              setSelectedExercise(exercises.find(e => e.id === exerciseId) || {});
              }}
              label="Exercise"
              >
              {exercises.map(exercise => (
              <MenuItem key={exercise.id} value={exercise.id}>{exercise.name}</MenuItem>
              ))}
              </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container justifyContent="space-around">
                <DateTimePicker
                  label="Deadline"
                  value={deadline}
                  onChange={setDeadline}
                  format="DD/MM/YYYY HH:mm"
                />
              </Grid>
              </LocalizationProvider>
              </div>
              </Grid>
              <Grid item xs={12} sm={6}>
              <div className={classes.dataContainer}>
              {/* <UserSelector onSelectUsers={handleSelectUsers} selectedUsers={selectedUsers} /> */}
              <AssigmentEditTable teamName={teamName} onSelectUsers={handleSelectUsers} selectedUsers={selectedUsers} />
              </div>
              </Grid>
              </Grid>
              <div className={classes.buttonContainer}>
    <Button className={classes.createButton} variant="contained" color="primary" onClick={()=>navigate(-1)}>
      Cancel
    </Button>
    <Button className={classes.createButton} variant="contained" color="primary" onClick={handleCreate}>
      Save Changes
    </Button>
  </div>
</div>
);
};

export default AssignmentEdit;
