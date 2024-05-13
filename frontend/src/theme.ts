import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#610094',
    },
    secondary: {
      main: '#3f0071',
    },
    background: {
      default: '#0b0b0b',
    },
    text: {
    	primary: '#ffffff',
    },
    info: {
      main: '#ffffff',
      dark: '#150050',
    }
  },
});

export default theme;
