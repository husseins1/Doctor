import React, {  useRef, useState } from 'react'
import {  setDoc, doc, getDoc, updateDoc, arrayUnion } from '@firebase/firestore';

import { Select } from '@chakra-ui/select';
import { Input } from '@chakra-ui/input';
import { Box, Container } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { db } from '../../firebase';
import { useToast } from '@chakra-ui/toast';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/user/userSlice';
export default function Book() {
    const [date,setDate] = useState("");
    const [options,setOptions] = useState([]);
    const [option,setOption] = useState("")
    const workingHours = [8,9,10,11,12,13,14,15,16]
    const offDays = [5,6];
    const today = new Date();
    const year = today.getFullYear()
    const month = (today.getMonth()+1).toString().padStart(2,"0")
    const day = today.getDate().toString().padStart(2, "0");
    const myRef = useRef(null)
   const user = useSelector(selectUser)
   const toast = useToast()
   const  makeid=(length)=> {
     let result = "";
     const characters =
       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
     const charactersLength = characters.length;
     for (let i = 0; i < length; i++) {
       result += characters.charAt(
         Math.floor(Math.random() * charactersLength)
       );
     }
     return result;
   }
   
   const dateChangeHandler =async(e)=>{
     setOption("")
      setDate(e.target.value);
     const isWork = new Date(e.target.value)
     console.log(isWork.getDay());
     if(offDays.includes(isWork.getDay())){
      toast({
        position: "bottom-left",
        render: () => (
          <Box color="white" p={3} bg="red.500">
            {isWork.getUTCDate()} is off
          </Box>
        ),
      });
      setOptions([])
       return;
     }
     
      const docRef = doc(db,"dates",e.target.value)
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
         await setDoc(doc(db,"dates", e.target.value), {
          times: [],
        });
        setOptions(workingHours)
        setOption(workingHours[0])
        return;
      }
      const bookedTimes = await docSnap.data().times.map(e=>e.hour);
      setOptions(workingHours.filter(e=>!bookedTimes.includes(e)))
      
      setOption(workingHours.filter((e) => !bookedTimes.includes(e))[0]);
    }

    const submitHandler = async()=>{
      console.log(myRef.current.value);
      if(!(option && myRef))return;
      updateDoc(doc(db, "dates", myRef.current.value), {
        times: arrayUnion({ hour: Number(option), id: user.uid,code:makeid(6),email:user.email,name:user.displayName }),
      });
      setDate("")
      setOptions([])

    }
    
    

    return (
      <Container
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Input
        ref={myRef}
          backgroundColor="whatsapp.300"
          value={date}
          min={`${year}-${month}-${day}`}
          onChange={dateChangeHandler}
          type="date"
        ></Input>
        {date && options.length !== 0 && (
          <Select  value ={option}   onChange={(e)=>setOption(Number(e.target.value))}   backgroundColor="whatsapp.300" marginTop="5">
            {options.map((ele, i) => (
              <option key={i} value={ele}>
                {ele}:00
              </option>
            ))}
          </Select>
        )}
        <Button disabled={option!==""?false:true} onClick={submitHandler}  marginTop="5" alignSelf="center" colorScheme="whatsapp">
          Book Now
        </Button>
      </Container>
    );
}
