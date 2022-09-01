import cx from 'classnames';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { TextField } from '@mui/material';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme as theme } from '../utils/datePicker';
import { useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import SearchResults from './searchResult';

type SearchboxProps = {
  className?: string;
  children?: React.ReactNode;
};

const sortOptions = [
  { value: 'ascending', label: 'Price ascending' },
  { value: 'descending', label: 'Price descending' },
  { value: 'popularity', label: 'Popularity' },
];

export type SearchSort = 'ascending' | 'descending' | 'popularity';

const selectStyles = {
  control: (styles: any, { isDisabled, isFocused, isSelected }: any) => ({
    ...styles,
    'backgroundColor': '#E3E3E3',
    'height': '40px',
    'width': '100%',
    '@media (min-width: 1024px)': {
      width: '11rem',
    },
    'border': '1px solid rgb(0 0 0 / 0.23)',
  }),
  menu: (styles: any) => ({ ...styles, backgroundColor: '#E3E3E3' }),
  option: (styles: any, { isDisabled, isFocused, isSelected }: any) => ({
    ...styles,
    backgroundColor: isSelected
      ? '#008CEE'
      : isFocused && 'rgb(0 140 238 / 0.1)',
  }),
};

const Searchbox = ({ className, children }: SearchboxProps) => {
  const [sameDayReturn, setSameDayReturn] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [searchVisible, setSearchVisible] = useState<boolean>(false);

  const typeSelect = useRef<string | undefined>();
  const [bikeType, setBikeType] = useState<string | undefined>();

  const sortSelect = useRef<SearchSort | undefined>('ascending');
  const [sort, setSort] = useState<SearchSort | undefined>();

  const loadBikeTypes = async () => {
    const typesSnap = await getDocs(collection(db, 'bikes'));

    const types: { value: string; label: string }[] = [];

    typesSnap.forEach((typeSnap) => {
      types.push({ value: typeSnap.id, label: typeSnap.data().label });
    });

    return types;
  };

  const loadLocations = async () => {
    const locationsSnap = await getDocs(collection(db, 'locations'));

    const locations: { value: string; label: string }[] = [];

    locationsSnap.forEach((typeSnap) => {
      locations.push({
        value: typeSnap.id,
        label: `${typeSnap.data().place}, ${typeSnap.data().city}`,
      });
    });

    return locations;
  };

  const handleSearch = () => {
    setBikeType(typeSelect.current);
    setSort(sortSelect.current);
    if (!searchVisible) setSearchVisible(true);
  };

  return (
    <>
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
          <div className="mx-1 2xl:mx-2">
            <div className="mb-2 mt-5 ml-1 text-center font-semibold text-accentBlue lg:mt-0 lg:text-left lg:font-normal lg:text-justBlack">
              Type
            </div>
            <AsyncSelect
              loadOptions={loadBikeTypes}
              isClearable
              defaultOptions
              cacheOptions
              placeholder="Bike type"
              isSearchable={false}
              onChange={(val) => {
                if (val) typeSelect.current = val?.value;
                else typeSelect.current = undefined;
              }}
              styles={selectStyles}
            />
          </div>

          <div className="mx-1 2xl:mx-2">
            <div className="mb-2 mt-5 ml-1 text-center font-semibold text-accentBlue lg:mt-0 lg:text-left lg:font-normal lg:text-justBlack">
              Pick up {'&'} return
            </div>
            <AsyncSelect
              loadOptions={loadLocations}
              defaultOptions
              cacheOptions
              placeholder="Location"
              isSearchable={false}
              onChange={(val) => console.log(val)}
              styles={selectStyles}
            />
          </div>
          <div className="mx-1 2xl:mx-2">
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
          <div className="mx-1 2xl:mx-2">
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
          <div className="mx-1 2xl:mx-2">
            <div className="mb-2 mt-5 ml-1 text-center font-semibold text-accentBlue lg:mt-0 lg:text-left lg:font-normal lg:text-justBlack">
              Sort
            </div>
            <Select
              options={sortOptions}
              defaultValue={sortOptions[0]}
              isSearchable={false}
              onChange={(val) =>
                (sortSelect.current = val?.value as SearchSort)
              }
              styles={selectStyles}
            />
          </div>
          <div className=" mx-2 mt-8 mb-5 lg:my-auto lg:ml-12 lg:mr-0">
            <button
              className="btn btn-accent h-16 w-full text-3xl lg:h-10 lg:w-28 lg:text-base"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {searchVisible && <SearchResults bikeType={bikeType} sort={sort} />}
    </>
  );
};

export default Searchbox;
