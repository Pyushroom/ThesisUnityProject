import React from 'react';
import '../styles/Home.scss';
import { Typography, Button, TextField, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Box, Modal } from '@mui/material';
import { makeStyles } from '@mui/styles';
//import { Add } from '@mui/icons-material';
import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/authContext.js'
import { toast } from "react-toastify";
import { lightBlue, red } from '@mui/material/colors';
import Cookies from 'js-cookie';

const token = Cookies.get('accessToken');
console.log(token)


const useStyles = makeStyles({
  card: {
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
    borderRadius: '10px',
    margin: '10px',
  },
  teamCard: {
    marginTop: '2rem',
    cursor: 'pointer',
    boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.3)',
    borderRadius: '10px',
    transition: 'transform 0.2s ease-in-out',
    position: 'relative',
    '&:hover': {
      backgroundColor: '#1769aa',
      color: 'white',
      transform: 'scale(1.1)',
      overflow: 'visible',
      whiteSpace: 'normal',
      zIndex: 1,
    },
    '&:not(:hover)': {
      backgroundColor: 'white',
      boxShadow: '2px 8px 8px 2px rgba(0,0,0,0.4)',
    },
  },
  teamName: {
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
});


const NotificationPanel = () => {
  const classes = useStyles();
  // const { currentUser } = useContext(AuthContext);
  const [notificationData, setNotificationData] = useState(null);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    axios.get('http://localhost:5000/server/users/notification', {withCredentials: true}
  )
      .then(response => {
        setNotificationData(response.data[0]);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  


  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6">Notifications</Typography>
        {notificationData ? (
          <div>
            <Typography variant="subtitle1">{notificationData.title}</Typography>
            <Typography variant="subtitle1">{notificationData.description}</Typography>
            <Typography variant="subtitle2">{notificationData.creation_date}</Typography>
          </div>
        ) : (
          <Typography variant="subtitle1">No new notifications</Typography>
        )}
      </CardContent>
    </Card>
  );
}



const CreateTeamForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [teamName, setTeamName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("i am in handle submit")
      const res = await axios.post(`http://localhost:5000/server/users/${currentUser.id}/teams`, {
        name: teamName,
        admin_id: currentUser.id,
        member_ids: [currentUser.id]
      });
      const newTeamId = res.data.id;
      const teamAdminId = currentUser.id; // Get the user's ID as the team admin ID
      navigate(`/teams/${newTeamId}`, { state: { teamAdminId } }); // Pass teamAdminId as state
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage('Team name already exists');
        toast.error('Team name already exists');
        console.log(error.message);
      } else {
        setErrorMessage('An error occurred while creating the team');
        toast.error('An error occurred while creating the team');
      }
      console.log(error);
    }
  };

  const handleTeamNameChange = (e) => {
    setTeamName(e.target.value);
    setErrorMessage('');
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Team
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ backgroundColor: '#fff', padding: '2rem', maxWidth: '400px', width: '100%' }}
        >
          <Typography variant="h6" style={{ marginBottom: '1rem' }}>
            Create Team
          </Typography>
          <Grid container spacing={2} alignItems="center" style={{ marginBottom: '1rem' }}>
            <Grid item xs={12}>
              <TextField label="Team Name" variant="outlined" size="small" fullWidth value={teamName} onChange={handleTeamNameChange} />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Button variant="contained" fullWidth onClick={handleClose} color="secondary">
                Close
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="contained" color="primary" fullWidth type="submit" onClick={handleSubmit}>
                Create
              </Button>
            </Grid>
          </Grid>
          {errorMessage && <div style={{ marginTop: '1rem', color: 'red' }}>{errorMessage}</div>}
        </form>
      </Modal>
    </>
  );
};

const JoinTeamForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [teamCode, setTeamCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/server/users/${currentUser.id}/teams/join`, {
        user_id: currentUser.id,
        team_code: teamCode
      });
      const newTeamId = res.data.id;
      const teamAdminId = res.data.admin_id; // Get the team admin ID from the response
      navigate(`/teams/${newTeamId}`, { state: { teamAdminId } }); // Pass teamAdminId as state
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('Team not found');
        toast.error('Team not found');
        console.log(error.message);
      } else if (error.response && error.response.status === 409) {
        setErrorMessage('You are already a member of this team');
        toast.error('You are already a member of this team');
        console.log(error.message);
      } else {
        setErrorMessage('An error occurred while joining the team');
        toast.error('An error occurred while joining the team');
        console.log(error);
      }
    }
  };

  const handleTeamCodeChange = (e) => {
    setTeamCode(e.target.value);
    setErrorMessage('');
  };

  const handleJoinTeamClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setTeamCode('');
    setErrorMessage('');
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleJoinTeamClick}>
        Join Team
      </Button>
      <Modal open={showModal} onClose={handleModalClose}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '2rem' }}>
          <Typography variant="h6">Join Team</Typography>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <TextField label="Team Code" variant="outlined" size="small" fullWidth value={teamCode} onChange={handleTeamCodeChange} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button variant="contained" color="secondary" onClick={handleModalClose} style={{ marginRight: '1rem' }}>
                Close
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Join
              </Button>
            </div>
            {errorMessage && <div style={{ marginTop: '1rem', color: 'red' }}>{errorMessage}</div>}
          </form>
        </div>
      </Modal>
    </>
  );
};



const TeamCard = ({ id, name, teamCode, teamAdminId }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleTeamClick = () => {
    navigate(`/teams/${id}`, { state: { teamAdminId } });
  };

  return (
    <Card className={classes.teamCard} onClick={handleTeamClick}>
      <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6" className={classes.teamName} title={name}>
          {name}
        </Typography>
        <Typography variant="subtitle1">{teamCode}</Typography>
      </CardContent>
    </Card>
  );
};

const TeamsPanel = () => {
  const { currentUser } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [displayedTeams, setDisplayedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/server/users/${currentUser.id}/teams`);
        setTeams(response.data);
        setLoading(false);
      } catch (error) {
        //toast.error('Failed to fetch teams');
        console.log(error.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, [currentUser]);

  useEffect(() => {
    setDisplayedTeams(teams.slice(0, 6));
  }, [teams]);

  const handleSeeMoreClick = () => {
    setShowAll(true);
    setDisplayedTeams(teams);
  };

  return (
    <div>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <div>
          <Typography variant="h5" style={{ marginTop: '2rem' }}>Teams</Typography>
          <Grid container spacing={3}>
            {displayedTeams.map((team) => (
              <Grid item xs={4} key={team.id}>
                <TeamCard
                  id={team.id}
                  name={team.name}
                  teamCode={team.teamCode}
                  teamAdminId={team.teamAdminId}
                />
              </Grid>
            ))}
          </Grid>
          {teams.length > 6 && !showAll && (
            <Button variant="contained" color="primary" onClick={handleSeeMoreClick}>
              See More
            </Button>
          )}
        </div>
      )}
    </div>
  );
};


const StudentList = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/server/users/${currentUser.id}/students`);
        const filteredStudents = res.data.filter(student => student.id !== currentUser.id);
        setStudents(filteredStudents.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchStudents();
  }, [currentUser]);

  const handleViewProfile = (id) => {
    // Navigate to the profile page of the selected student
    navigate(`/profile/${id}`);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <Typography variant="h6" style={{margin:'15px 0 0 10px'}}>Student List</Typography>
      <TableContainer style={{ marginTop: '0.25rem' }}>
        <Table className='student-table'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Team</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.teams}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewProfile(student.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Link to="/students">
        <Button variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          See More
        </Button>
      </Link>
    </div>
  );
};


const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/server/users/${currentUser.id}/assigments/teacher`);
        console.log(response)
        setAssignments(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [currentUser]);

  const isDeadlinePassed = (deadline) => {
    const now = new Date();
    return now.getTime() > new Date(deadline).getTime();
  };

  return (
    <div style={{ marginTop: '1rem', padding:'5px' }}>
      <Typography variant="h6" style={{margin:'10px 0 0 10px'}}>Assignment List</Typography>
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
                {currentUser.status === 1 && (
                  <TableCell style={{ color: '#fff' }}>Completion</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
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
                  {currentUser.status === 1 && (
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
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <Link to="/assignments">
        <Button variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          See More
        </Button>
      </Link>
    </div>
  );
};


    
const HomePage = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="home-container">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <NotificationPanel />
          <div style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
            { currentUser?.status === 1 &&
            <div style={{ padding: '1rem', marginRight: '0.5rem' }}>
              <CreateTeamForm />
            </div>
            }
            <div style={{ padding: '1rem' }}>
              <JoinTeamForm />
            </div>
          </div>
          <TeamsPanel />
        </Grid>
        <Grid item xs={12} md={6}>
          <div style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'}}>
            <StudentList  style={{ padding: '2rem' }} />
          </div>
          <div style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'}}>
          <AssignmentList style={{ padding: '2rem' }} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;



