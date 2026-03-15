import React, { useState, useContext } from "react";
import "./Navbar.scss"
import { makeStyles } from '@mui/styles';
import { AppBar, Toolbar, IconButton, InputBase, Menu, MenuItem, Button } from '@mui/material';
import { AccountCircle, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { AuthContext } from '../../context/authContext';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: '4px',
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: '#fff',
    },
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    alignItems: 'center',
    margin: '0 auto',
    color: 'black',
  },
  searchIcon: {
    color: "black",
    padding: '8px',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: '8px 8px 8px calc(1em + 32px)',
    transition: 'width 0.2s ease-in-out',
    width: '100%',
    marginLeft: '8px',
  },
  menuButton: {
    marginRight: '8px',
  },
  websiteName: {
    textAlign: 'left',
    color: 'white',
  },
  userPanel: {
    display: 'flex',
    alignItems: 'center',
  },
  searchButton: {
    marginLeft: '8px',
  },
  accountCircle: {
    fontSize: '48px', // increase the font size to make it bigger
    border: '1px solid #ccc', // add a border around the icon
    borderRadius: '50%',
    padding: '8px', // increase the padding to make the icon centered in the box
    backgroundColor: '#eee', // add a background color to the box
    
  },
  userList: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: '4px',
    marginTop: '4px',
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
    maxHeight: '200px',
    overflowY: 'auto',
    top: '50px',
  },
  userListItem: {
    padding: '4px 8px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f1f1f1',
    }
  },
}));

function Navbar() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
  logout();
  // navigate('/login');
  setAnchorEl(null);
  };
  
  const handleSearchInputChange = (event) => {
  const searchValue = event.target.value;
  setSearchValue(searchValue);
  
  if (searchValue.trim() === '') {
  setSearchResult([]);
  return;
  }
  
  axios.get(`http://localhost:5000/server/users/search/${searchValue}`)
  .then(response => {
  setSearchResult(response.data);
  })
  .catch(error => {
  //toast.error('Failed to search users');
  console.log(error)
  });
  };
  
  const handleSearchResultClick = (userId) => {
  setSearchResult([]);
  setSearchValue('');
  navigate(`/profile/${userId}`);
  };
  
  return (
  
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Button onClick={() => navigate('/')} className={classes.websiteName}>Artur Piłka Thesis</Button>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              
            </div>
            <InputBase
              placeholder="Search users"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={searchValue}
              onChange={handleSearchInputChange}
            />
            {searchResult.length > 0 && (
              <div className={classes.userList} style={{color: 'black'}}>
                {searchResult.map(user => (
                  <div
                    key={user.id}
                    className={classes.userListItem}
                    onClick={() => handleSearchResultClick(user.id)}
                  >
                    {user.name}
                  </div>
                ))}
              </div>
            )}
            <IconButton
              className={classes.searchButton}
              aria-label="search"
              onClick={() => navigate(`/search?name=${searchValue}`)}
            >
              <Search />
            </IconButton>
          </div>
          {currentUser ? (
            <div className={classes.userPanel}>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle className={classes.accountCircle} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => navigate('/profile')}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Button onClick={() => navigate('/login')}>Login</Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
  }
  export default Navbar;