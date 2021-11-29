import {Flex } from '@chakra-ui/react';
import { doc, getDoc } from '@firebase/firestore';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes,Route } from 'react-router';
import './App.css';
import Appointments from './components/Appointments';
import Book from './components/header/book';
import Header from './components/header/Header';
import Hero from './components/header/Hero';
import Login from './components/Login';
import Register from './components/Register';
import { login } from './features/user/userSlice';
import { auth, db } from './firebase';


function App() {

  const dispatch = useDispatch();
  useEffect(() => {
   const unSub = auth.onAuthStateChanged(async(user) => {
      if (user) {
        const userDb =await getDoc(doc(db,"users",user.uid))
        const {admin}= userDb.data()
        dispatch(
          login({
            email: user.email,
            uid: user.uid,
            displayName: user.displayName,
            admin
          })
        );
      }
    })
    return ()=>unSub()
  }, []);
  return (
    <Flex flexDirection="column"  height="100vh">

      <Header />
    <Routes>
       <Route path="/login" element={<Login/>}/>
       <Route path="/register" element={<Register/>}/>
      <Route path="/" element={<Hero/>} />
      <Route path="/book" element={<Book/>}/>
      <Route path="/appointments" element={<Appointments/>}/>
    </Routes>

    </Flex>

    
  )
  
}

export default App;
