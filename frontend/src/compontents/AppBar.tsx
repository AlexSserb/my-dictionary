import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';

import AuthContext from '../context/AuthContext';


function ApplicationBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const { user } = useContext(AuthContext);
  const mainTitle = 'My dictionary';

  const navigate = useNavigate();

  const pages: Array<Array<string>> = [
    ['Todo', '/todo']
  ];

  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const titleElement = (xsValue: string, mdValue: string, flexGrowValue = 0) => {
    return (
      <Typography
        variant='h5' noWrap component='a'
        href='/'
        sx={{
          mr: 2,
          display: { xs: xsValue, md: mdValue },
          flexGrow: flexGrowValue,
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {mainTitle}
      </Typography>
    )
  }

  const avatarAndSettingsMenu = () => {
    if (user) return (
      <Tooltip title='Open settings'>
        <Button onClick={() => navigate('/settings')} sx={{ p: 0 }}>
          <SettingsIcon style={{ color: '#FFFFFF' }} />
        </Button>
      </Tooltip>
    )
    else return (
      <Box sx={{ flexGrow: 0 }}>
        <Link to='/login' style={{ textDecoration: 'none', color: 'white' }}>Log In</Link>
      </Box>
    )
  }

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          {titleElement('none', 'flex')}

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map(([page, linkTo]) => (
                <MenuItem href={linkTo} style={{ textDecoration: 'none', color: 'black' }} key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign='center'>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {titleElement('flex', 'none', 1)}

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map(([page, linkTo]: Array<string>) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                href={linkTo}
                sx={{ textDecoration: 'none', my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {avatarAndSettingsMenu()}

        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ApplicationBar;
