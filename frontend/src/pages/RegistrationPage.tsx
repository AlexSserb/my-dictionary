import { FormEvent, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import {
  Button, TextField, Typography, FormControl,
  Grid, Stack, Paper, Alert
} from '@mui/material';

import AuthContext from '../context/AuthContext';
import RegistrationForm from '../types/RegistrationFormType';


const RegistrationPage = () => {
  const { registerUser, message, changeMessage } = useContext(AuthContext);

  useEffect(() => {
    changeMessage('');
  }, [])

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
  }

  return (
    <Grid container sx={{
      spacing: 0,
      direction: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Stack sx={{
        display: 'flex',
        width: '35%',
        minWidth: '500px',
        spacing: 3
      }}>
        <Paper elevation={5} sx={{ padding: 3, marginTop: 3, backgroundColor: 'secondary.main' }}>
          <Typography textAlign={'center'} variant='h5' component='h5' sx={{ paddingBlockEnd: 3 }}>
            Registration
          </Typography>
          <div className='m-4'>
            <form onSubmit={handleRegister}>
              <FormControl sx={{ paddingBlockEnd: 3 }}>
                <TextField
                  label='Username'
                  type='text'
                  name='username'
                  required
                  inputProps={{ maxLength: 64 }}
                  color='info'
                />
              </FormControl><br />
              <FormControl sx={{ paddingBlockEnd: 3 }}>
                <TextField
                  label='Password'
                  type='password'
                  name='password'
                  required
                  inputProps={{ maxLength: 20 }}
                  color='info'
                />
              </FormControl><br />
              <FormControl sx={{ paddingBlockEnd: 3 }}>
                <TextField
                  label='Repeat password'
                  type='password'
                  name='passwordRepeat'
                  required
                  inputProps={{ maxLength: 20 }}
                  color='info'
                />
              </FormControl><br />
              {message && (
                <Alert severity='error'>
                  {message}
                </Alert>
              )}
              <p><Link to='/login'>Already have an account</Link></p>
              <Button variant='contained' type='submit' sx={{ padding: 2 }}>
                Register
              </Button>
            </form>
          </div>
        </Paper>
      </Stack>
    </Grid>
  )
}

export default RegistrationPage;

