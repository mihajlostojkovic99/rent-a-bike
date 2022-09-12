import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { Bike, EmployeeData, Location } from '../../lib/dbTypes';
import cx from 'classnames';
import { useEffect, useRef, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../utils/useAuth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

export const selectStyles = {
  control: (styles: any, { isDisabled, isFocused, isSelected }: any) => ({
    ...styles,
    backgroundColor: 'transparent',
    height: '48px',
    width: '100%',
    border: '1px solid #008CEE',
    borderRadius: '0.5rem',
  }),
  menu: (styles: any) => ({ ...styles, backgroundColor: '#E3E3E3' }),
  option: (styles: any, { isDisabled, isFocused, isSelected }: any) => ({
    ...styles,
    backgroundColor: isSelected
      ? '#008CEE'
      : isFocused && 'rgb(0 140 238 / 0.1)',
  }),
};

type ManageEmployeesProps = {
  employees: EmployeeData[];
  uid: string;
  className?: string;
};

const ManageEmployees = ({
  employees,
  uid,
  className,
}: ManageEmployeesProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [realtimeEmployees] = useCollectionData(
    query(collection(db, 'users'), where('isAdmin', '==', true)),
  );

  const updatedEmployees = (realtimeEmployees as EmployeeData[]) || employees;

  return (
    <div
      className={cx(
        'w-full rounded-md bg-accentBlue/10 p-3 lg:rounded-3xl xl:p-6',
        className,
      )}
    >
      <div className="mb-4 text-center text-3xl font-extrabold tracking-tighter">
        Manage employees.
      </div>
      <div className="flex flex-col gap-4">
        {updatedEmployees.map((emp) => {
          return (
            <div
              key={emp.uid}
              className="flex w-full items-center justify-between rounded-md bg-accentBlue/10 p-3 shadow-lg lg:grow lg:rounded-3xl xl:p-6"
            >
              <div>
                <span className="font-bold">UID: </span>
                {emp.uid}
              </div>
              <div className="divider divider-horizontal h-12"></div>
              <div>
                <span className="font-bold">Display name: </span>
                {emp.displayName}
              </div>
              <div className="divider divider-horizontal h-12"></div>
              <button
                className={cx('btn btn-warning btn-wide', {
                  loading: loading,
                })}
                onClick={async () => {
                  if (emp.uid === uid) return;
                  setLoading(true);
                  await deleteDoc(doc(db, 'users', emp.uid));
                  setLoading(false);
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageEmployees;
