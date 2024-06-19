import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, TextField, Typography, FormControl,
  Grid, Paper, Alert, Box
} from '@mui/material';

import AuthContext from '../context/AuthContext';
import { fieldBoxStyle } from './styles/Styles';
import { paperContainerStyle } from './styles/StylesLoginPage';


const LoginPage = () => {
  const { loginUser, message, changeMessage } = useContext(AuthContext);

  useEffect(() => {
    changeMessage('');
  }, []);

  return (
    <Grid container justifyContent='center'>
      <Paper elevation={5} sx={paperContainerStyle}>
        <Typography textAlign={'center'} variant='h5' component='h5' sx={{ paddingBlockEnd: 3 }}>
          Log In
        </Typography>
        <form onSubmit={loginUser}>
          <FormControl>
            <Typography>
              Username
            </Typography>
            <Box sx={fieldBoxStyle} marginBottom={2}>
              <TextField
                type='text'
                name='username'
                required
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
                color='info'
              />
            </Box>
          </FormControl><br />
          {message && (
            <Alert severity='error'>
              {message}
            </Alert>
          )}
          <p><Link to='/registration'>
            <Typography color='white'>
              Register
            </Typography>
          </Link></p>
          <Button variant='contained' type='submit' sx={{ padding: 2 }}>
            Log In
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};

export default LoginPage;

