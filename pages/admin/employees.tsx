import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout';
import Searchbox from '../../components/searchbox';
import bike from '../public/home_bike.jpg';
import { useAuth } from '../../utils/useAuth';
import { AuthCheck } from '../../utils/authCheck';
import { verifyIdToken } from '../../utils/firebaseAdmin';
import { db, userToJSON } from '../../utils/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import { EmployeeData, Location, UserData } from '../../lib/dbTypes';
import Select from 'react-select';
import { useState } from 'react';
import EditLocation from '../../components/admin/editLocation';
import AddLocation from '../../components/admin/addLocation';
import ManageEmployees from '../../components/admin/manageEmployees';
import AddEmployee from '../../components/admin/addEmployee';

type EmployeesProps = {
  employees: EmployeeData[];
  uid: string;
};

const Employees: NextPage<EmployeesProps> = ({
  employees,
  uid,
}: EmployeesProps) => {
  //   console.log('My employees', employees);
  return (
    <Layout>
      <div className="mx-auto tracking-tighter text-justBlack lg:max-w-7xl">
        <div className="mx-2 mb-4 flex flex-col gap-4 rounded-md bg-offWhite p-3 lg:mx-0 lg:rounded-3xl lg:p-6">
          <ManageEmployees employees={employees} uid={uid} />
          <AddEmployee />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    // console.log('Admin token is: ', cookies.token.substring(0, 10), '...');
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    const [userSnap, employeesSnap] = await Promise.all([
      getDoc(doc(db, 'users', uid)),
      getDocs(collection(db, 'users')),
    ]);

    const isAdmin: boolean | undefined = userSnap.data()?.isAdmin;

    if (!isAdmin) {
      // console.log('user is not admin');
      return {
        redirect: {
          destination: '/',
        },
        props: {},
      };
    }

    const employees: EmployeeData[] = [];
    employeesSnap.forEach((emp) => {
      if (emp.data().isAdmin) {
        employees.push({
          uid: emp.data().uid,
          displayName: emp.data().displayName,
          isAdmin: emp.data().isAdmin,
          email: emp.data().email,
        });
      }
    });

    return {
      props: {
        employees: employees,
        uid: uid,
      },
    };
  } catch (err) {
    // console.log('ADMIN INDEX PAGE', err);
    return {
      redirect: {
        destination: '/',
      },
      props: {},
    };
  }
};

export default Employees;
