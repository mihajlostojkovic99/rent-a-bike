import { createTheme } from '@mui/material';

export const muiTheme = createTheme({
  palette: {
    background: {
      paper: '#E3E3E3',
    },
    text: {
      primary: '#242929',
      secondary: '#46505A',
    },
    action: {
      active: '#242929',
    },
  },
  typography: {
    fontFamily: ['Inter', 'Poppins', 'sans-serif'].join(','),
    body1: {
      'fontSize': '1.25rem',
      '@media (min-width: 1024px)': {
        fontSize: '1rem',
      },
    },
  },
});

export const muiTheme2 = createTheme({
  palette: {
    background: {
      paper: '#E3E3E3',
    },
    text: {
      primary: '#242929',
      secondary: '#46505A',
    },
    action: {
      active: '#242929',
    },
  },
  typography: {
    fontFamily: ['Inter', 'Poppins', 'sans-serif'].join(','),
    body1: {
      'fontSize': '0.8rem',
      '@media (min-width: 1024px)': {
        fontSize: '1rem',
      },
      'fontWeight': 'bold',
    },
  },
});
