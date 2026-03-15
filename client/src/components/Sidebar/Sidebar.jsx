import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import PolicyIcon from '@mui/icons-material/Policy';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import ScienceIcon from '@mui/icons-material/Science';
import './Sidebar.scss';
import { blue } from '@mui/material/colors';
import { AuthContext } from '../../context/authContext';

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#1769aa',
      color: "white",
    },
  },
  icon: {
    fontSize: '1.5rem',
    marginRight: '10px',
    color: '#666',
    '&:hover': {
      color: "white",
    },
  },
  name: {
    fontWeight: 'bold',
    marginRight: '5px',
  },
  email: {
    fontSize: '0.8rem',
    color: '#999',
  },
  topPart: {
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
  },
  topPartIcon: {
    fontSize: '3rem',
    marginBottom: '10px',
  },
}));

function Sidebar() {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div className={classes.topPart}>
      <Link to={`/profile/${currentUser?.id}`} className={classes.link}>
        <span style={{display: "flex",flexDirection: "column", alignItems: "center"}}>
          <span className={classes.topPartIcon}>
            <PersonIcon style={{fontSize: "3rem"}}/>
          </span>
          <span style={{display: "flex",flexDirection: "column", alignItems: "center"}} >
            <span className={classes.name}>{currentUser?.name}</span>
            <span className={classes.email}><EmailIcon/>{currentUser?.email}</span>
          </span>
        </span>
      </Link>
      </div>
      <div className="center-part">
        <ul>
          <li>
            <Link to="/dashboard" className={classes.link}>
              <DashboardIcon className={classes.icon} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/teams" className={classes.link}>
              <GroupIcon className={classes.icon} />
              <span>Teams</span>
            </Link>
          </li>
          <li>
            <Link to="/assignments" className={classes.link}>
              <AssignmentIcon className={classes.icon} />
              <span>Assignments</span>
            </Link>
          </li>
          {currentUser.status === 1 && (
            <>
              <li>
                <Link to="/quizz" className={classes.link}>
                  <QuizIcon className={classes.icon} />
                  <span>Quiz</span>
                </Link>
              </li>
              <li>
                <Link to="/exercises" className={classes.link}>
                  <ScienceIcon className={classes.icon} />
                  <span>Exercises</span>
                </Link>
              </li>
            </>
          )}
          <li>
            <Link to="/students" className={classes.link}>
              <PeopleIcon className={classes.icon} />
              <span>Students</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className={classes.link}>
              <SettingsIcon className={classes.icon} />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link to="/regulations" className={classes.link}>
              <PolicyIcon className={classes.icon} />
              <span>Regulations</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="bottom-part">Bottom</div>
    </div>
  );
}

export default Sidebar;
