import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import {
  Button, TextField, Typography, FormControl,
  Grid, Stack, Paper, Alert, Box
} from '@mui/material';

import AuthContext from '../context/AuthContext';


const LoginPage = () => {
  const { loginUser, message, changeMessage } = useContext(AuthContext);

  useEffect(() => {
    changeMessage('');
  }, [])

  const fieldBoxStyle = {
    borderColor: 'info',
    borderWidth: '1px',
    border: 'solid',
    borderRadius: 2,
    marginBottom: 2
  };

  return (
    <Grid container sx={{
      spacing: 0,
      direction: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
        <Paper elevation={5} sx={{
          display: 'block',
          width: '35%',
          minWidth: '500px',
          paddingX: 5,
          paddingY: 3,
          marginTop: 3,
          textAlign: 'left',
          backgroundColor: 'secondary.main',
          borderRadius: 3,
        }}>
          <Typography textAlign={'center'} variant='h5' component='h5' sx={{ paddingBlockEnd: 3 }}>
            Log In
          </Typography>
          <form onSubmit={loginUser}>
            <FormControl>
              <Typography>
                Username
              </Typography>
              <Box sx={fieldBoxStyle}>
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
              <Box sx={fieldBoxStyle}>
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
  )
}

export default LoginPage;

