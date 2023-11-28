import {getAuth} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCaUPYSJe9td_ZMhpbpj1LBun4-7hb4C7c',
  authDomain: 'ipet-tcc-5cd87.firebaseapp.com',
  projectId: 'ipet-tcc-5cd87',
  storageBucket: 'ipet-tcc-5cd87.appspot.com',
  messagingSenderId: '826943175837',
  appId: '1:826943175837:web:6bf0c7ab957d3c3f83e874',
  measurementId: 'G-220G5SF16W',
});

// Initialize Firebase
export const auth = getAuth(firebaseApp);

export const db = getDatabase(firebaseApp);

export default db;
