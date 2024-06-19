import { FormEvent, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, TextField, Typography, FormControl,
  Grid, Paper, Alert, Box
} from '@mui/material';

import AuthContext from '../context/AuthContext';
import RegistrationForm from '../types/RegistrationFormType';
import { fieldBoxStyle } from './styles/Styles';
import { paperContainerStyle } from './styles/StylesRegistrationPage';


const RegistrationPage = () => {
  const { registerUser, message, changeMessage } = useContext(AuthContext);

  useEffect(() => {
    changeMessage('');
  }, []);

  const handleRegister = (e: FormEvent<RegistrationForm>) => {
    e.preventDefault();

    changeMessage('');
    const target = e.currentTarget.elements;

    if (target.password.value !== target.passwordRepeat.value) {
      changeMessage('Passwords don\'t match.');
    }
    else if (target.password.value.length < 8) {
      changeMessage('Password must be at least 8 characters.');
    }
    else {
      registerUser(e);
    }
  };

  return (
    <Grid container justifyContent='center'>
      <Paper elevation={5} sx={paperContainerStyle}>
        <Typography textAlign={'center'} variant='h5' component='h5' sx={{ paddingBlockEnd: 3 }}>
          Registration
        </Typography>
        <div>
          <form onSubmit={handleRegister}>
            <FormControl>
              <Typography>
                Username
              </Typography>
              <Box sx={fieldBoxStyle} marginBottom={2}>
                <TextField
                  type='text'
                  name='username'
                  required
                  inputProps={{ maxLength: 64 }}
                  color='info'
                />
              </Box>
            </FormControl><br />
            <FormControl>
              <Typography>
                Password
              </Typography>
              <Box sx={fieldBoxStyle} marginBottom={2}>
                <TextField
                  type='password'
                  name='password'
                  required
                  inputProps={{ maxLength: 20 }}
                  color='info'
                />
              </Box>
            </FormControl><br />
            <FormControl>
              <Typography>
                Repeat password
              </Typography>
              <Box sx={fieldBoxStyle} marginBottom={2}>
                <TextField
                  type='password'
                  name='passwordRepeat'
                  required
                  inputProps={{ maxLength: 20 }}
                  color='info'
                />
              </Box>
            </FormControl><br />
            {message && (
              <Alert severity='error'>
                {message}
              </Alert>
            )}
            <p><Link to='/login'>
              <Typography color='white'>
                Already have an account
              </Typography>
            </Link></p>
            <Button variant='contained' type='submit' sx={{ padding: 2 }}>
              Register
            </Button>
          </form>
        </div>
      </Paper>
    </Grid>
  );
};

export default RegistrationPage;

