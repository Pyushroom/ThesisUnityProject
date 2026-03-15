import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Paper, Box, Divider } from '@mui/material';

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/server/users/user/profile/${id}`);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [id]);

  return (
    <Box sx={{
      maxWidth: 600,
      margin: 'auto',
      padding: '20px',
      border: '1px solid #ccc',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)'
    }}>
      <Typography variant="h6">Profile</Typography>
      {user ? (
        <Paper sx={{
          padding: '20px',
          marginTop: '1rem',
          backgroundColor: '#f8f8f8',
          border: '1px solid #ccc'
        }}>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Box sx={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
              <Typography variant="subtitle1">Name:</Typography>
              <Typography variant="body1">{user.name}</Typography>
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="subtitle1">Email:</Typography>
              <Typography variant="body1">{user.email}</Typography>
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="subtitle1">Status:</Typography>
              <Typography variant="body1">{user.status === 0 ? 'Student' : 'Teacher'}</Typography>
            </Box>
            <Divider style={{ margin: '10px 0' }} />
            <Typography variant="subtitle1">Teams:</Typography>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              {user.teams.map((team) => (
                <div key={team.name}>
                  <Typography variant="body1" style={{ margin: '5px 0' }}>
                    {team.name}
                    {team.isadmin === 1 ? (
                      <Typography variant="caption" style={{ color: 'green', marginLeft: '10px' }}>
                        (Admin)
                      </Typography>
                    ) : (
                      <span style={{ marginLeft: '10px' }}></span>
                    )}
                  </Typography>
                  <Divider style={{ margin: '5px 0' }} />
                </div>
              ))}
            </Box>
          </Box>
        </Paper>
      ) : (
        <div>Loading...</div>
      )}
    </Box>
  )
}

export default Profile;
