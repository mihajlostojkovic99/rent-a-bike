import { TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/system';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export const theme = createTheme({
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

type MyDateTimePickerProps = {
  value: any;
  onChange: (value: any, keyboardInputValue?: string | undefined) => void;
};

const MyDateTimePicker = ({ value, onChange }: MyDateTimePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <DateTimePicker
          renderInput={(props) => (
            <TextField
              {...props}
              size="small"
              className="w-full tracking-tight lg:w-52"
            />
          )}
          value={value}
          onChange={onChange}
          inputFormat={'dd/MM/yyyy HH:mm'}
          disablePast
          minutesStep={5}
          ampm={false}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default MyDateTimePicker;
