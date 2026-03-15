import React from 'react';
import { Typography, Button, TextField, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Box, Modal } from '@mui/material';
import { makeStyles } from '@mui/styles';
//import { Add } from '@mui/icons-material';
import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/authContext.js'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';



const AssignmentUserList = () => {
  const [assignments, setAssignments] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/server/users/${currentUser.id}/assigments/student`);
        //console.log(response)
        setAssignments(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const isDeadlinePassed = (deadline, isDone) => {
    if (isDone) {
      return false; // assignment already completed
    }
    const now = new Date();
    return now.getTime() > new Date(deadline).getTime();
  };

  const handleViewAssignment = (id, team) => {
    console.log(`View Assignment ${id}`);
    navigate(`/assignment/${id}/${team}`)
  };


  return (
    <div style={{ marginTop: '2rem' }}>
    <Typography variant="h6">Assignment List</Typography>
      <TableContainer style={{ marginTop: '1rem', maxHeight: '50vh', overflowY: 'scroll' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
            <Typography variant="h6" component="div" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        ) : (
          <Table className='assignment-table'>
            <TableHead style={{ backgroundColor: '#1769aa', color: '#fff' }}>
              <TableRow>
                <TableCell style={{ color: '#fff' }}>Name</TableCell>
                <TableCell style={{ color: '#fff' }}>Team name</TableCell>
                <TableCell style={{ color: '#fff' }}>Created</TableCell>
                <TableCell style={{ color: '#fff' }}>Deadline</TableCell>
                <TableCell style={{ color: '#fff' }}>Completion</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id} >
                  <TableCell style={{ color: isDeadlinePassed(assignment.deadline, assignment.isdone) ? 'red' : 'inherit' }}>
                    {assignment.name}
                    </TableCell>
                  <TableCell style={{ color: isDeadlinePassed(assignment.deadline, assignment.isdone) ? 'red' : 'inherit' }}>
                    {assignment.teams}
                    </TableCell>
                  <TableCell style={{ color: isDeadlinePassed(assignment.deadline, assignment.isdone) ? 'red' : 'inherit' }}>
                    {assignment.created}
                    </TableCell>
                  <TableCell style={{ color: isDeadlinePassed(assignment.deadline, assignment.isdone) ? 'red' : 'inherit' }}>
                    {assignment.deadline}
                    </TableCell>
                  <TableCell>
                    <Box className='completion-progress' position="relative" display="inline-flex">
                      <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {assignment.isdone ? (
                          <CheckIcon style={{ color: 'green' }} />
                        ) : (
                          <CloseIcon style={{ color: 'red' }} />
                        )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleViewAssignment(assignment.id, assignment.teams)} variant="contained" color="primary" size="small" style={{ marginRight: '0.5rem' }}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </TableContainer>
    </div>
    );
};



const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/server/users/${currentUser.id}/assigments/teacher`);
        //console.log(response)
        setAssignments(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const isDeadlinePassed = (deadline) => {
    const now = new Date();
    return now.getTime() > new Date(deadline).getTime();
  };

  const handleViewAssignment = (id, team) => {
    console.log(`View Assignment ${id}`);
    navigate(`/assignment/${id}/${team}`)
  };

  const handleModifyAssignment = (id, team) => {
    console.log(`Modify Assignment ${id}`);
    navigate(`/assignment/${id}/edit/${team}`);
  };

  const handleCreateAssigment = (id) => {
    console.log(`Create Assignment with id ${id}`);
    navigate(`/${id}/assigments/assigment/create`)
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      {currentUser?.status === 1 ? (
        <>
    <Typography variant="h6">Assignment List</Typography>
                    <Button
                      variant="contained"
                      size="small"
                      className={'modifyButton'}
                      onClick={() => handleCreateAssigment(currentUser.id)}
                    >
                      Create Assigment
                    </Button>
              
      <TableContainer style={{ marginTop: '1rem', maxHeight: '50vh', overflowY: 'scroll' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
            <Typography variant="h6" component="div" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        ) : (
          <Table className='assignment-table'>
            <TableHead style={{ backgroundColor: '#1769aa', color: '#fff' }}>
              <TableRow>
                <TableCell style={{ color: '#fff' }}>Name</TableCell>
                <TableCell style={{ color: '#fff' }}>Team name</TableCell>
                <TableCell style={{ color: '#fff' }}>Created</TableCell>
                <TableCell style={{ color: '#fff' }}>Deadline</TableCell>
                <TableCell style={{ color: '#fff' }}>Completion</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id} >
                  <TableCell style={{ color: isDeadlinePassed(assignment.deadline) ? 'red' : 'inherit' }}>
                    {assignment.name}
                    </TableCell>
                  <TableCell style={{ color: isDeadlinePassed(assignment.deadline) ? 'red' : 'inherit' }}>
                    {assignment.teams}
                    </TableCell>
                  <TableCell style={{ color: isDeadlinePassed(assignment.deadline) ? 'red' : 'inherit' }}>
                    {assignment.created}
                    </TableCell>
                  <TableCell style={{ color: isDeadlinePassed(assignment.deadline) ? 'red' : 'inherit' }}>
                    {assignment.deadline}
                    </TableCell>
                  <TableCell>
                    <Box className='completion-progress' position="relative" display="inline-flex">
                      <CircularProgress variant="determinate" value={assignment.completion} />
                      <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Typography variant="caption" component="div" style={{ color: isDeadlinePassed(assignment.deadline) ? 'red' : 'inherit' }}>
                          {`${assignment.completion}%`}
                        </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleViewAssignment(assignment.id, assignment.teams)} variant="contained" color="primary" size="small" style={{ marginRight: '0.5rem' }}>
                    View
                  </Button>
                    <Button onClick={() => handleModifyAssignment(assignment.id, assignment.teams)} variant="outlined" color="primary" size="small">
                      Modify
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </TableContainer>
      </>
      ):(
        <AssignmentUserList />
      )}
    </div>
    );
};

export default AssignmentList;
