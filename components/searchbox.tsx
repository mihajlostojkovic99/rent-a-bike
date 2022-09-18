import cx from 'classnames';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { muiTheme as theme } from '../utils/datePicker';
import { useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import SearchResults from './searchResult';
import { bikeTypes } from '../lib/bikeTypes';
import MyDateTimePicker from './myDateTimePicker';
import MyTimePicker from './myTimePicker';
import { Controller, useForm } from 'react-hook-form';
import {
  addHours,
  compareAsc,
  getHours,
  getMinutes,
  Interval,
  setHours,
  setMinutes,
} from 'date-fns';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

type SearchboxProps = {
  className?: string;
  children?: React.ReactNode;
};

export type SearchSort = 'ascending' | 'descending' | 'popularity';

const sortOptions: {
  value: SearchSort;
  label: string;
}[] = [
  { value: 'ascending', label: 'Price ascending' },
  { value: 'descending', label: 'Price descending' },
  { value: 'popularity', label: 'Popularity' },
];

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

export const loadLocations = async () => {
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

type FormData = {
  type: {
    value: string;
    label: string;
  };
  location: {
    value: string;
    label: string;
  };
  interval: Interval;
  sort: {
    value: SearchSort;
    label: string;
  };
};

const Searchbox = ({ className }: SearchboxProps) => {
  const now = new Date();
  const {
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      interval: {
        start: setMinutes(
          addHours(now, 1),
          Math.round(getMinutes(now) / 5) * 5,
        ),
        end: setMinutes(addHours(now, 2), Math.round(getMinutes(now) / 5) * 5),
      },
      sort: sortOptions[0],
    },
  });

  const [sameDayReturn, setSameDayReturn] = useState(true);
  const startDate = watch('interval.start');

  const [interval, setInterval] = useState<Interval>({
    start: setMinutes(addHours(now, 1), Math.round(getMinutes(now) / 5) * 5),
    end: setMinutes(addHours(now, 2), Math.round(getMinutes(now) / 5) * 5),
  });
  const [searchVisible, setSearchVisible] = useState<boolean>(false);

  const [bikeType, setBikeType] = useState<string | undefined>();

  const [location, setLocation] = useState<string | undefined>();

  const [sort, setSort] = useState<SearchSort | undefined>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    if (data.type) setBikeType(data.type.value);
    else setBikeType(undefined);
    if (data.location) setLocation(data.location.value);
    else setLocation(undefined);
    if (data.interval) {
      const startDate = data.interval.start as Date;
      let endDate = data.interval.end as Date;

      startDate.setSeconds(0, 0);
      endDate.setSeconds(0, 0);
      setInterval({
        start: startDate,
        end: endDate,
      });
    }
    setSort(data.sort.value);
    if (!searchVisible) setSearchVisible(true);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
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
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  isSearchable={false}
                  placeholder="Bike type"
                  styles={selectStyles}
                  options={bikeTypes}
                />
              )}
            />
            {errors.type && (
              <span className="label-text-alt text-red-600">
                {errors.type.message}
              </span>
            )}
          </div>

          <div className="mx-1 2xl:mx-2">
            <div className="mb-2 mt-5 ml-1 text-center font-semibold text-accentBlue lg:mt-0 lg:text-left lg:font-normal lg:text-justBlack">
              Pick up {'&'} return
            </div>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  loadOptions={loadLocations}
                  defaultOptions
                  cacheOptions
                  placeholder="Location"
                  isSearchable={false}
                  isClearable
                  styles={selectStyles}
                />
              )}
            />
            {errors.location && (
              <span className="label-text-alt text-red-600">
                {errors.location.message}
              </span>
            )}
          </div>
          <div className="mx-1 2xl:mx-2">
            <div className="mb-2 mt-5 ml-1 text-center font-semibold text-accentBlue lg:mt-0 lg:text-left lg:font-normal lg:text-justBlack">
              Pick up time
            </div>
            <Controller
              name="interval.start"
              control={control}
              rules={{
                validate: (startDate: number | Date) => {
                  if (typeof startDate === 'number')
                    return 'Must be in date format.';
                  if (compareAsc(startDate, new Date()) < 0) {
                    setSearchVisible(false);
                    return 'Past time is not allowed';
                  }
                },
              }}
              render={({ field: { value, onChange } }) => (
                <MyDateTimePicker
                  value={value}
                  onChange={onChange}
                  theme={theme}
                />
              )}
            />
            {errors.interval?.start && (
              <div className="label-text-alt text-red-600">
                {errors.interval.start.message}
              </div>
            )}
          </div>
          <div className="mx-1 2xl:mx-2">
            <label className="label mt-5 mb-2 ml-1 cursor-pointer justify-start p-0 lg:mt-0">
              <input
                // {...register('sameDayReturn')}
                type="checkbox"
                className="checkbox checkbox-accent checkbox-sm mr-2"
                name="returnDay"
                id="returnDay"
                checked={sameDayReturn}
                onChange={() => {
                  const old = sameDayReturn;
                  setSameDayReturn(!sameDayReturn);
                  if (!old) {
                    setValue('interval.end', addHours(startDate, 1));
                  }
                }}
              />
              <span>Same day return</span>
            </label>
            {sameDayReturn ? (
              <Controller
                name="interval.end"
                control={control}
                rules={{
                  validate: (endDate: number | Date) => {
                    if (typeof endDate === 'number')
                      return 'Must be in date format.';
                    const startDate = watch('interval.start') as Date;

                    if (compareAsc(startDate, endDate) >= 0) {
                      setSearchVisible(false);
                      return 'Return must be after pick up';
                    }
                  },
                }}
                render={({ field: { value, onChange } }) => (
                  <MyTimePicker
                    value={value}
                    onChange={onChange}
                    theme={theme}
                  />
                )}
              />
            ) : (
              <Controller
                name="interval.end"
                control={control}
                rules={{
                  validate: (endDate: number | Date) => {
                    if (typeof endDate === 'number')
                      return 'Must be in date format.';
                    const startDate = watch('interval.start') as Date;

                    if (compareAsc(startDate, endDate) >= 0) {
                      setSearchVisible(false);
                      return 'Return must be after pick up';
                    }
                  },
                }}
                render={({ field: { value, onChange } }) => (
                  <MyDateTimePicker
                    value={value}
                    onChange={onChange}
                    theme={theme}
                  />
                )}
              />
            )}
            {errors.interval?.end && (
              <div className="label-text-alt text-red-600">
                {errors.interval.end.message}
              </div>
            )}
          </div>
          <div className="mx-1 2xl:mx-2">
            <div className="mb-2 mt-5 ml-1 text-center font-semibold text-accentBlue lg:mt-0 lg:text-left lg:font-normal lg:text-justBlack">
              Sorting
            </div>
            <Controller
              name="sort"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={sortOptions}
                  defaultValue={field.value}
                  isSearchable={false}
                  styles={selectStyles}
                />
              )}
            />
            {errors.sort && (
              <span className="label-text-alt text-red-600">
                {errors.sort.message}
              </span>
            )}
          </div>
          <div className=" mx-2 mt-8 mb-5 lg:my-auto lg:ml-12 lg:mr-0">
            <button className="btn btn-accent h-16 w-full gap-4 text-3xl lg:h-10 lg:gap-1 lg:text-base">
              Search
              <MagnifyingGlassIcon className="h-8 w-8 lg:h-5 lg:w-5" />
            </button>
          </div>
        </div>
      </form>
      {searchVisible && (
        <SearchResults
          bikeType={bikeType}
          location={location}
          sort={sort}
          interval={interval}
        />
      )}
    </>
  );
};

export default Searchbox;
