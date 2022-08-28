import cx from 'classnames';
import { Menu } from '@headlessui/react';
import Dropdown from './dropdown';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { TextField } from '@mui/material';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { muiTheme as theme } from '../utils/datePicker';
import { useState } from 'react';

// import { ChevronDownIcon } from '@heroicons/react/solid';

type SearchboxProps = {
  className?: string;
  children?: React.ReactNode;
};

const Searchbox = ({ className, children }: SearchboxProps) => {
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [sameDayReturn, setSameDayReturn] = useState<boolean>(true);

  // const theme = createTheme({
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

  return (
    <div
      className={cx(
        'mx-auto flex max-w-7xl rounded-lg bg-offWhite text-base text-black lg:h-32 lg:rounded-3xl',
        className,
      )}
    >
      <div className="my-auto mx-auto flex w-full flex-col justify-between text-xl lg:mx-7 lg:flex-row lg:text-base">
        <div className="mt-3 text-center text-2xl font-bold text-justBlack lg:hidden">
          Find a bike
        </div>
        <div className="mx-1 2xl:mx-4">
          <div className="mb-2 mt-5 ml-1 text-center font-semibold text-accentBlue lg:mt-0 lg:text-left lg:font-normal lg:text-justBlack">
            Type
          </div>
          <Dropdown
            items={['Cross country', 'Road', 'City']}
            item={'Cross country'}
            renderItem={(item) => {
              return <span>{item}</span>;
            }}
            className="w-full lg:w-fit"
          />
          {/* <select className="select m-0 w-full max-w-xs py-0">
            <option disabled selected>
              Pick your favorite Simpson
            </option>
            <option>Homer</option>
            <option>Marge</option>
            <option>Bart</option>
            <option>Lisa</option>
            <option>Maggie</option>
          </select> */}
        </div>

        <div className="mx-1 2xl:mx-4">
          <div className="mb-2 mt-5 ml-1 text-center font-semibold text-accentBlue lg:mt-0 lg:text-left lg:font-normal lg:text-justBlack">
            Pick up {'&'} return
          </div>
          <Dropdown
            items={[
              'Ada Ciganlija, Beograd',
              'Belgrade Waterfront, Beograd',
              '25. maj, Beograd',
            ]}
            item={'Ada Ciganlija, Beograd'}
            renderItem={(item) => {
              return <span>{item}</span>;
            }}
            className="w-full lg:w-fit"
          />
        </div>
        {/* React DayPicker (light)
        React Datepicker(najpopularniji)
        material design date/time picker (ima ugradjen time)
        !!!react-dates (ima lep date range)
        carbon design date picker (IBM???)
        AntDesign date picker (imaju i odvojen time picker)
        react-calendar (light & fast) */}
        <div className="mx-1 2xl:mx-4">
          <div className="mb-2 mt-5 ml-1 text-center font-semibold text-accentBlue lg:mt-0 lg:text-left lg:font-normal lg:text-justBlack">
            Pick up time
          </div>
          <div className="flex items-center gap-1">
            <ThemeProvider theme={theme}>
              <DateTimePicker
                renderInput={(props) => (
                  <TextField
                    {...props}
                    size="small"
                    className="w-full tracking-tight lg:w-52"
                  />
                )}
                value={startTime}
                onChange={(newValue) => {
                  setStartTime(newValue);
                }}
                inputFormat={'dd/MM/yyyy HH:mm'}
                disablePast
                minutesStep={5}
                ampm={false}
              />
            </ThemeProvider>
          </div>
        </div>
        <div className="mx-1 2xl:mx-4">
          <label className="label mt-5 mb-2 ml-1 cursor-pointer justify-start p-0 lg:mt-0">
            <input
              type="checkbox"
              className="checkbox checkbox-accent checkbox-sm mr-2"
              name="returnDay"
              id="returnDay"
              checked={sameDayReturn}
              onChange={() => setSameDayReturn(!sameDayReturn)}
            />
            <span>Same day return</span>
          </label>
          {sameDayReturn ? (
            <ThemeProvider theme={theme}>
              <TimePicker
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    className="w-full tracking-tight lg:w-52"
                  />
                )}
                value={endTime}
                onChange={(newValue) => {
                  setEndTime(newValue);
                }}
                minTime={startTime}
                minutesStep={5}
                ampm={false}
              />
            </ThemeProvider>
          ) : (
            <ThemeProvider theme={theme}>
              <DateTimePicker
                renderInput={(props) => (
                  <TextField
                    {...props}
                    size="small"
                    className="w-full tracking-tight lg:w-52"
                  />
                )}
                value={endTime}
                onChange={(newValue) => {
                  setEndTime(newValue);
                }}
                inputFormat={'dd/MM/yyyy HH:mm'}
                disablePast
                minutesStep={5}
                ampm={false}
              />
            </ThemeProvider>
          )}
        </div>
        <div className="mx-1 2xl:mx-4">
          <div className="mb-2 mt-5 ml-1 text-center font-semibold text-accentBlue lg:mt-0 lg:text-left lg:font-normal lg:text-justBlack">
            Sort
          </div>
          <Dropdown
            items={['Price ascending', 'Price descending', 'Popularity']}
            item={'Price ascending'}
            renderItem={(item) => {
              return <span>{item}</span>;
            }}
            className="w-full lg:w-fit"
          />
        </div>
        <div className=" mx-2 mt-8 mb-5 lg:my-auto lg:ml-12 lg:mr-0">
          {/* <Button className="absolute bottom-0 my-auto h-[40px] w-28 p-0 text-xl font-semibold tracking-wider text-offWhite">
            Search
          </Button> */}
          <button className="btn btn-accent h-16 w-full text-3xl lg:h-10 lg:w-28 lg:text-base">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Searchbox;
