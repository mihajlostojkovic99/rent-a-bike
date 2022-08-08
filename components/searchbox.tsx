import cx from 'classnames';
import { Menu } from '@headlessui/react';
import Dropdown from './dropdown';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { TextField } from '@mui/material';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { useState } from 'react';
import Button from './button';
// import { ChevronDownIcon } from '@heroicons/react/solid';

type SearchboxProps = {
  className?: string;
  children?: React.ReactNode;
};

const Searchbox = ({ className, children }: SearchboxProps) => {
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [sameDayReturn, setSameDayReturn] = useState<boolean>(true);
  console.log(sameDayReturn);

  const theme = createTheme({
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
    },
  });

  return (
    <div
      className={cx(
        'mx-auto flex h-32 max-w-7xl rounded-3xl bg-offWhite text-base text-black',
        className,
      )}
    >
      <div className="my-auto mx-7 flex">
        <div className="mx-4">
          <div className="mb-2 ml-1">Type</div>
          <Dropdown
            items={['Cross country', 'Road', 'City']}
            item={'Cross country'}
            renderItem={(item) => {
              return <span>{item}</span>;
            }}
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

        <div className="mx-4">
          <div className="mb-2 ml-1">Pick up {'&'} return</div>
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
          />
        </div>
        {/* React DayPicker (light)
        React Datepicker(najpopularniji)
        material design date/time picker (ima ugradjen time)
        !!!react-dates (ima lep date range)
        carbon design date picker (IBM???)
        AntDesign date picker (imaju i odvojen time picker)
        react-calendar (light & fast) */}
        <div className="mx-4">
          <div className="mb-2 ml-1">Pick up time</div>
          <div className="flex items-center gap-1">
            <ThemeProvider theme={theme}>
              <DateTimePicker
                renderInput={(props) => (
                  <TextField
                    {...props}
                    size="small"
                    className="w-52 tracking-tight"
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
        <div className="mx-4">
          <label className="label mb-2 ml-1 cursor-pointer justify-start p-0">
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
            <TimePicker
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  className="w-52 tracking-tight"
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
          ) : (
            <ThemeProvider theme={theme}>
              <DateTimePicker
                renderInput={(props) => (
                  <TextField
                    {...props}
                    size="small"
                    className="w-52 tracking-tight"
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
        <div className="mx-4">
          <div className="mb-2 ml-1">Sort</div>
          <Dropdown
            items={['Price ascending', 'Price descending', 'Popularity']}
            item={'Price ascending'}
            renderItem={(item) => {
              return <span>{item}</span>;
            }}
          />
        </div>
        <div className=" my-auto ml-12">
          {/* <Button className="absolute bottom-0 my-auto h-[40px] w-28 p-0 text-xl font-semibold tracking-wider text-offWhite">
            Search
          </Button> */}
          <button className="btn btn-accent h-[40px] w-28">Search</button>
        </div>
      </div>
    </div>
  );
};

export default Searchbox;
