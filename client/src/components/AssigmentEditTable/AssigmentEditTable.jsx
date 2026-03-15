import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Paper,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    marginTop: '16px',
  },
  buttonGroup: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  scrollableTable: {
    maxHeight: '300px',
    overflow: 'auto',
  },
}));

const AssigmentEditTable = ({ teamName, onSelectUsers, selectedUsers: propSelectedUsers }) => {
    const { currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    //console.log(propSelectedUsers)
    const [selectedUsers, setSelectedUsers] = useState([]);
    //console.log(selectedUsers)
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
  
    useEffect(() => {
      const fetchStudents = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/server/users/${currentUser.id}/teams/team/${teamName}/assigmentStudents`
          );
          //console.log(res.data);
          setUsers(res.data);
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };
      fetchStudents();
    }, [teamName]);

    useEffect(() => {
        if (propSelectedUsers.length > 0 && !selectedUsers.length) {
          const usersToSelect = propSelectedUsers.map(id => users.find(user => user.id === id));
          console.log(usersToSelect)
          const newSelectedUsers = [...selectedUsers, ...usersToSelect];
          setSelectedUsers(newSelectedUsers);
        }
      }, [propSelectedUsers]);
      
      
  
    const handleSelect = (event, user) => {
      if (event.target.checked) {
        setSelectedUsers([...selectedUsers, user]);
      } else {
        setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
      }
    };
  
    const handleSelectAll = (event) => {
      if (event.target.checked) {
        setSelectedUsers(users);
      } else {
        setSelectedUsers([]);
      }
    };
  
    useEffect(() => {
      onSelectUsers(selectedUsers);
    }, [selectedUsers, onSelectUsers]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <div className={classes.scrollableTable}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.length === users.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Index</TableCell>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.some((u) => u.id === user.id)}
                        onChange={(event) => handleSelect(event, user)}
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className={classes.buttonGroup}>
          <Button variant="outlined" onClick={() => setSelectedUsers([])}>
            Select None
          </Button>
          <Button variant="outlined" onClick={() => setSelectedUsers(users)}>
            Select All
          </Button>
        </div>
      </div>
    );
  };

export default AssigmentEditTable