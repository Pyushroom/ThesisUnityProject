import React, { useState, useEffect, useContext } from 'react';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext.js'
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '16px'
  },
  memberLink: {
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  tableHead: {
    backgroundColor: '#1769aa',
    color: '#fff'
  },
  overdue: {
    color: 'red'
  }
}));


const StudentList = ({ teamId, isTeamAdmin }) => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isRowClicked, setIsRowClicked] = useState(false);
  const [studentToDeleteId, setStudentToDeleteId] = useState(null);
  const [openConfirmDialogStudent, setOpenConfirmDialogStudent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/server/users/${currentUser.id}/teams/team/${teamId}/students`);
        console.log(res.data)
        setStudents(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchStudents();
  }, [currentUser, teamId]);

  const handleViewProfile = (id) => {
    // Navigate to the profile page of the selected student
    navigate(`/profile/${id}`);
  };

  const handleDeleteTeamUser = (id, e) => {
    e.preventDefault();
    console.log(id)
    console.log('Deleting user from team');
    axios.delete(`http://localhost:5000/server/users/${currentUser.id}/leaveTeam`, {
      data: {
        teamId: teamId,
        userId: id
      }
    })
    .then((response) => {
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
  };

  const handleConfirmChoiceStudent = (id) => {
    setStudentToDeleteId(id);
    setOpenConfirmDialogStudent(true);
  };

  const handleCloseConfirmChoiceStudent = () => {
    setStudentToDeleteId(null);
    setOpenConfirmDialogStudent(false);
  };

  const handleRowClick = (id) => {
    if (!isRowClicked) {
      setIsRowClicked(true);
      handleViewProfile(id);
    }
  };

  const handleSeeMore = () => {
    setShowAll(true);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <Typography variant="h6">Student List</Typography>
      <TableContainer style={{ marginTop: '1rem' }}>
        <Table className='student-table'>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell></TableCell>
              {isTeamAdmin ? (
                <>
                  <TableCell>Action</TableCell>
                </>
              ):(
                <>&nbsp;</>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : (
              students.slice(0, showAll ? students.length : 5).map((student, index) => (
                <TableRow key={student.id} >
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.isadmin ? 'Teacher' : 'Student'}</TableCell>
                  {isTeamAdmin && student.id !== currentUser.id ? (
                    <TableCell>
                      <Button variant="contained" color="primary" style={{ marginTop: '1rem' }} disabled={isRowClicked} onClick={() => handleConfirmChoiceStudent(student.id)}>
                        Delete User
                      </Button>
                    </TableCell>
                  ) : (
                    <>&nbsp;</>
                  )}
                  <TableCell>
                      <Button variant="contained" color="primary" style={{ marginTop: '1rem' }} onClick={(e) => handleViewProfile(student.id)}>
                        View Profile
                      </Button>
                    </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {!loading && students.length > 5 && !showAll &&
          <Button variant="contained" color="primary" style={{ marginTop: '1rem' }} onClick={handleSeeMore}>
            See More
          </Button>
        }
      </TableContainer>
      {!loading && showAll &&
        <div style={{ marginTop: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
          {students.map((student, index) => (
            <div key={student.id} style={{ marginBottom: '0.5rem', cursor: 'pointer' }} onClick={() => handleRowClick(student.id)}>
              <Typography variant="subtitle1">{index+1}. {student.name}</Typography>
              <Typography variant="body2">{student.email}</Typography>
              <Typography variant="body2">{student.isadmin ? 'Is Admin' : 'Not Admin'}</Typography>
            </div>
          ))}
        </div>
      }
      <Dialog open={openConfirmDialogStudent} onClose={handleCloseConfirmChoiceStudent}>
        <DialogTitle>Are you sure you want to delete user from the team?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseConfirmChoiceStudent}>Cancel</Button>
          <Button onClick={(e) => handleDeleteTeamUser(studentToDeleteId, e)}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};



const AssignmentList = ({ teamId, teamName }) => {
  const [assignments, setAssignments] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/server/users/${currentUser.id}/teams/team/${teamId}/assigments`);
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

  const handleRowClick = (id) => {
    // Redirect to assignment page using the assignment id
    navigate(`/assignment/${id}/${teamName}`);
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
                <TableCell style={{ color: '#fff' }}>Deadline</TableCell>
                <TableCell style={{ color: '#fff' }}>Completion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id} onClick={() => handleRowClick(assignment.id)} style={{cursor: 'pointer'}}>
                  <TableCell style={{ color: isDeadlinePassed(assignment.deadline) ? 'red' : 'inherit' }}>
                    {assignment.name}
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
                        <Typography variant="caption" component="div" style={{ color: isDeadlinePassed(assignment.deadline) ? 'red' : 'text.secondary' }}>
                          {`${assignment.completion}%`}
                        </Typography>
                      </Box>
                    </Box>
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


const Team = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [newUser, setNewUser] = useState('');
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();

  useEffect(() => {
    axios.get(`http://localhost:5000/server/users/${currentUser.id}/teams/team/${teamId}`)
      .then((response) => {
        //console.log(response)
        setTeam(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [teamId]);

  const handleCreateAssignment = () => {
    navigate(`/${teamId}/assigment/create`);
  };

  const handleAddUser = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmChoice = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmChoice = () => {
    setOpenConfirmDialog(false);
  };

  const handleAddNewUser = () => {
    axios.post(`http://localhost:5000/server/users/${currentUser.id}/addToTeam`, { teamId: teamId, userName: newUser })
      .then((response) => {
        setOpenDialog(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLeaveTeam = () => {
    console.log(teamId)
    axios.delete(`http://localhost:5000/server/users/${currentUser.id}/leaveTeam`, {
      data: {
        teamId: teamId,
        userId: currentUser.id
      }
    })
    .then((response) => {
      setOpenConfirmDialog(false);
      navigate(`/`)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const isOverdue = (date) => {
    return new Date(date) < new Date();
  };

  const handleViewAssignments = (assignmentId) => {
    navigate(`/assignment/${assignmentId}`);
  };

  return (
    <div className={classes.container}>
      <h2>{team.name}</h2>
      {team.teamAdminId ? (
        <>
          <p>Team Code: {team.team_code}</p>
        </>
        ) : (
          <>&nbsp;</> // render a non-breaking space if team.teamAdminId is falsy
        )}
      <Button variant="contained" onClick={() => navigate(-1)}>Back</Button>
      {team.teamAdminId ? (
        <>
          <Button variant="contained" onClick={handleCreateAssignment} sx={{ marginLeft: '16px' }}>
            Create Assignment
          </Button>
          <Button variant="contained" onClick={handleAddUser} sx={{ marginLeft: '16px' }}>
            Add User
          </Button>
        </>
      ) : (
        <Button variant="contained" onClick={handleConfirmChoice} sx={{ marginLeft: '16px' }}>
            Leave Team
          </Button>
        //<>&nbsp;</> // render a non-breaking space if team.teamAdminId is falsy
      )}
      <div className={classes.flexContainer}>
        <StudentList teamId={teamId} isTeamAdmin = {team.teamAdminId}/>
        <AssignmentList teamId={teamId} teamName={team.name} />
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add User to Team</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="User Name"
            fullWidth
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddNewUser}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmChoice}>
        <DialogTitle>Are you sure you want to leave the team?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseConfirmChoice}>Cancel</Button>
          <Button onClick={handleLeaveTeam}>Leave</Button>
        </DialogActions>
      </Dialog>

    </div>

  );
};

export default Team;

