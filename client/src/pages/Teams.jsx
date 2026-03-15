import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import { AuthContext } from '../context/authContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { makeStyles } from '@mui/styles';
import { lightBlue } from '@mui/material/colors';


const useStyles = makeStyles({
  card: {
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
  },
  teamCard: {
    marginTop: '2rem',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: "#1769aa",
    },
  },
});

const TeamCard = ({ id, name, teamCode, teamAdminId }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleTeamClick = () => {
    navigate(`/teams/${id}`, { state: { teamAdminId } });
  };

  return (
    <Card
      className={classes.teamCard}
      sx={{
        width: '450px',
        height: '250px',
        border: '1px solid #ccc',
        transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
        backgroundColor: 'white',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0px 2px 8px 2px rgba(0,0,0,0.4)',
          backgroundColor: '#1769aa',
          color: 'white',
        },
        '&:not(:hover)': {
          backgroundColor: 'white',
          boxShadow: '0px 2px 8px 2px rgba(0,0,0,0.4)',
        },
      }}
      onClick={handleTeamClick}
    >
      <CardContent style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <Typography variant="h6" component="div" style={{textAlign: 'center', fontSize: '2rem'}}>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/server/users/${currentUser.id}/teams`);
        setTeams(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch teams');
        console.log(error.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, [currentUser]);

  return (
    <div>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <div>
          <Typography variant="h5" style={{ marginTop: '2rem' }}>
            Teams
          </Typography>
          <Grid container spacing={1} sx={{ paddingX: '150px' }}>
            {teams.map((team) => (
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
        </div>
      )}
    </div>
  );
};

export default TeamsPanel;