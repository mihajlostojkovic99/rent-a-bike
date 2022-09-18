import { TextField, Theme } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/system';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

type MyDatePickerProps = {
  value: any;
  onChange: (value: any, keyboardInputValue?: string | undefined) => void;
  theme: Theme;
};

const MyDatePicker = ({ value, onChange, theme }: MyDatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <DatePicker
          renderInput={(props) => (
            <TextField
              {...props}
              size="small"
              className="w-48 tracking-tight lg:w-52"
            />
          )}
          value={value}
          onChange={onChange}
          inputFormat={'dd/MM/yyyy'}
          disableFuture
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default MyDatePicker;
