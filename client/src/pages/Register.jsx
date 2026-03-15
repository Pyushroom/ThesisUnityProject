import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Verification from '../components/verification.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@mui/styles';
import {
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Box,
} from '@mui/material';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '2rem', // custom value
    marginBottom: '2rem', // custom value
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: '1rem', // custom value
  },
  submit: {
    margin: '3rem 0 2rem', // custom value
  },
}));

const Register = () => {
  const classes = useStyles();

  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  const [err, setError] = useState(null);
  const [showVerification, setShowVerification] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputs.password !== inputs.repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:5000/server/auth/register', inputs);
      toast.success('User created successfully!', {
        position: 'top-center',
        autoClose: 3000,
      });
      setShowVerification(true);
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="app-content">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          {!showVerification ? (
            <form className={classes.form}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="repeatPassword"
                label="Repeat Password"
                type="password"
                id="repeatPassword"
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSubmit}
              >
                Register
              </Button>
              {err && <p>{err}</p>}
              <Box mt={5}>
                <Typography variant="body2" color="textSecondary" align="center">
                  Already have an account? <Link to="/login">Sign In</Link>
                </Typography>
              </Box>
          </form>
        ) : (
          <Verification email={inputs.email} username={inputs.username} />
        )}
      </div>
    </Container>
  </div>
);
};

export default Register;
