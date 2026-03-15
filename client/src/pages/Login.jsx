import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Container, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AuthContext } from '../context/authContext';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    margin: '3rem', // add margin
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
  },
  
  heading: {
    marginBottom: '2rem',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: '3rem',
    padding: '16px',
  },
  button: {
    marginTop: '2rem', // increase marginTop
    backgroundColor: '#4caf50',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  },
  
  error: {
    color: 'red',
    margin: '1rem',
  },
}));

const Login = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });
  const [err, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { currentUser } = useContext(AuthContext);

  const classes = useStyles();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      toast.success('User logged in successfully!', {
        position: 'top-center',
        autoClose: 3000,
      });
      navigate('/');
    } catch (err) {
      setError(err.response.data);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser]);

  return (
    <div className={classes.container}>
      <Container maxWidth='sm'>
        <div className={classes.form}>
          <Typography variant='h4' className={classes.heading}>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                required
                label='Username'
                variant='outlined'
                name='username'
                className={classes.input}
                onChange={handleChange}
              />
              <TextField
                required
                label='Password'
                variant='outlined'
                type='password'
                name='password'
                className={classes.input}
                onChange={handleChange}
              />
            </div>
            <Button variant='contained' className={classes.button} type='submit'>
              Login
            </Button>
            {err && <p className={classes.error}>{err.sqlMessage}</p>}
            <Typography variant='body1'>
              Don't you have an account? <Link to='/register'>Register</Link>
            </Typography>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Login;
