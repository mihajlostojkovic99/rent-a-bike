import { TextField, Theme } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/system';
import {
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// export const theme = createTheme({
//   palette: {
//     background: {
//       paper: '#E3E3E3',
//     },
//     text: {
//       primary: '#242929',
//       secondary: '#46505A',
//     },
//     action: {
//       active: '#242929',
//     },
//   },
//   typography: {
//     fontFamily: ['Inter', 'Poppins', 'sans-serif'].join(','),
//     body1: {
//       'fontSize': '1.25rem',
//       '@media (min-width: 1024px)': {
//         fontSize: '1rem',
//       },
//     },
//   },
// });

type MyTimePickerProps = {
  value: any;
  onChange: (value: any, keyboardInputValue?: string | undefined) => void;
  theme: Theme;
};

const MyTimePicker = ({ value, onChange, theme }: MyTimePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <TimePicker
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              className="w-full tracking-tight lg:w-52"
            />
          )}
          value={value}
          onChange={onChange}
          // minTime={startTime}
          minutesStep={5}
          ampm={false}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default MyTimePicker;
