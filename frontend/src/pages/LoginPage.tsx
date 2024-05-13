import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import {
  Button, TextField, Typography, FormControl,
  Grid, Stack, Paper, Alert
} from '@mui/material';

import AuthContext from '../context/AuthContext';


const LoginPage = () => {
  const { loginUser, message, changeMessage } = useContext(AuthContext);

  useEffect(() => {
    changeMessage('');
  }, [])

  return (
    <Grid container sx={{
      spacing: 0,
      direction: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Stack sx={{
        display: 'block',
        width: '35%',
        minWidth: '500px',
        spacing: 3
      }}>
        <Paper elevation={5} sx={{ padding: 3, marginTop: 3, justifyContent: 'left', backgroundColor: 'secondary.main' }}>
          <Typography textAlign={'center'} variant='h5' component='h5' sx={{ paddingBlockEnd: 3 }}>
            Log In
          </Typography>
          <form onSubmit={loginUser}>
            <FormControl sx={{ paddingBlockEnd: 3 }}>
              <TextField
                label='Username'
                type='text'
                name='username'
                required
                color='info'
              />
            </FormControl><br />
            <FormControl sx={{ paddingBlockEnd: 3 }}>
              <TextField
                label='Password'
                type='password'
                name='password'
                required
                color='info'
              />
            </FormControl><br />
            {message && (
              <Alert severity='error'>
                {message}
              </Alert>
            )}
            <p><Link to='/registration'>Register</Link></p>
            <Button variant='contained' type='submit' sx={{ padding: 2 }}>
              Log In
            </Button>
          </form>
        </Paper>
      </Stack>
    </Grid>
  )
}

export default LoginPage;

