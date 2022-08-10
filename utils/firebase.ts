// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCTp2QZ6CNDUe-ulCNHmxQMBD8OL_xdvg4',
  authDomain: 'diplomski-2022.firebaseapp.com',
  projectId: 'diplomski-2022',
  storageBucket: 'diplomski-2022.appspot.com',
  messagingSenderId: '237293275435',
  appId: '1:237293275435:web:bb5fe3d69c095ee6ab5d6e',
  measurementId: 'G-RTT84PTEHZ',
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebase);
// const perf = getPerformance(firebase);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
