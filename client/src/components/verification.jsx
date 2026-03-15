import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import {
  Button,
  FormControl,
  InputLabel,
  Input,
  Paper,
  Typography,
} from '@mui/material';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '32px',
    marginBottom: '32px',
    padding: '16px',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: '16px',
  },
  submit: {
    margin: '24px 0px 16px',
  },
}));


const Verification = ({ email, username }) => {
  const classes = useStyles();
  const [verificationCode, setVerificationCode] = useState('');

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      username: username,
      verificationCode: verificationCode,
    };
    await axios.post('http://localhost:5000/server/auth/emailVerify', data);
    // console.log(`Verification code: ${verificationCode}`);
    toast.success('Verification code submitted!', {
      position: 'top-center',
      autoClose: 3000,
    });
    navigate('/login');
  };

  return (
    <Paper className={classes.paper}>
      <Typography component="h2" variant="h5">
        Verify your email address
      </Typography>
      <Typography component="p" variant="body1">
        We have sent a verification code to <strong>{email}</strong>. Please
        enter the code below to complete your registration.
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="verificationCode">Verification code</InputLabel>
          <Input
            id="verificationCode"
            name="verificationCode"
            type="text"
            value={verificationCode}
            onChange={handleChange}
            autoFocus
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Submit
        </Button>
      </form>
    </Paper>
  );
};

Verification.propTypes = {
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default Verification;
