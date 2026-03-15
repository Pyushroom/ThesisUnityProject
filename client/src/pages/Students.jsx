import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/authContext.js'

const Students = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/server/users/${currentUser.id}/students`);
        const studentsData = res.data.filter(student => student.id !== currentUser.id);
        setStudents(studentsData);
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
    <div style={{ marginTop: '2rem' }}>
      <Typography variant="h6">Student List</Typography>
      <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
        <Table>
            <TableHead style={{ backgroundColor: '#1769aa', color: '#fff' }}>
              <TableRow>
                <TableCell style={{ color: '#fff' }}>Index</TableCell>
                <TableCell style={{ color: '#fff' }}>Name</TableCell>
                <TableCell style={{ color: '#fff' }}>Email</TableCell>
                <TableCell style={{ color: '#fff' }}>Team</TableCell>
                <TableCell style={{ color: '#fff' }}></TableCell>
              </TableRow>
            </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : (
              students.map((student, index) => (
                <TableRow key={student.id} style={{ backgroundColor: index % 2 === 0 ? '#b0bec5' : '#fff' }}>
                  <TableCell component="th" scope="row" style={{ borderRadius: '5px', padding: '1rem' }}>{index + 1}</TableCell>
                  <TableCell style={{ borderRadius: '5px', padding: '1rem' }}>{student.name}</TableCell>
                  <TableCell style={{ borderRadius: '5px', padding: '1rem' }}>{student.email}</TableCell>
                  <TableCell style={{ borderRadius: '5px', padding: '1rem' }}>{student.teams}</TableCell>
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
    </div>
  );
};

export default Students;
