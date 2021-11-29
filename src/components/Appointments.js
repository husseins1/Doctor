import { Box, Flex } from '@chakra-ui/layout'
import React, { useEffect, useRef, useState } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast
} from "@chakra-ui/react";
import { arrayRemove, collection,  doc, getDocs, updateDoc } from '@firebase/firestore';
import { db } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { addBooks, removeBook, selectUser, setBooksBack } from '../features/user/userSlice';

export default function Appointments() {
    const dispatch =useDispatch()
    const arr=[];
    const user = useSelector(selectUser);
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef();
    const [selectDate,setSelectDate] = useState()
    const toast = useToast()
    const deleteAppointmentHandler = async({id,userId, time, code,email,name})=>{
        const ref=doc(db,"dates",id)
        let preBooks;
        try {
            preBooks = [...user.bookings]
            console.log({ code, email, hour: time, id:userId, name });
            dispatch(removeBook({code}))
           await updateDoc(ref,{
               times:arrayRemove({code,email,hour:time,id:userId,name}) 
            })
            
            
        } catch (error) {
            dispatch(setBooksBack(preBooks))
            toast({
              position: "bottom-left",
              render: () => (
                <Box color="white" p={3} bg="red.500">
                  {error.message} 
                </Box>
              ),
            });
        }
    }
    
    useEffect(()=>{
        
        (async()=>{
            
                
            const datesData = await getDocs(collection(db,"dates"))
            datesData.forEach(ele=>{
                console.log(ele);
                ele.data().times.forEach(time=>{
                    
                    if(time.id === user?.uid){
                        arr.push({
                          userId: time.id,
                          id: ele.id,
                          time: time.hour,
                          code: time.code,
                          email: time.email,
                          name: time.name,
                        })
                    }else if(user?.admin){
                        arr.push({
                          userId: time.id,
                          id: ele.id,
                          time: time.hour,
                          code: time.code,
                          email: time.email,
                          name: time.name,
                        });
                    }
                })
            })
            if(!user) return;
            dispatch(addBooks(arr))
          
            
        })()
    },[user?.uid])
    const renderAdminItems=(ele)=>( 
        <React.Fragment>
            
        <Td>{ele?.name||"Name"}</Td>
         <Td>{ele?.email||"Email"}</Td>
         </React.Fragment>)

    return (
      <React.Fragment>
        <Flex
          alignItems="center"
          justifyContent="center"
          flex="1"
          flexDirection="column"
        >
          <Table variant="striped">
            <TableCaption>Imperial to metric conversion factors</TableCaption>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>code</Th>
                {user?.admin?(<React.Fragment>
                    <Th>Name</Th>
                    <Th>Email</Th>
                </React.Fragment>):false}
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {user?.bookings?.map((ele, index) => (
                <Tr key={index}>
                  <Td>{ele.id}</Td>
                  <Td>{ele.time}:00</Td>
                  <Td>{ele.code}</Td>
                  {user?.admin?renderAdminItems(ele):false}
                  <Td>
                    <Button
                      onClick={() => {
                        setIsOpen(true);
                        setSelectDate(ele);
                       
                      }}
                      colorScheme="red"
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
              </Tr>
            </Tfoot>
          </Table>
        </Flex>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete {`${selectDate?.id} at ${selectDate?.time}:00`} Appointment
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={()=>{
                    onClose()
                    deleteAppointmentHandler(selectDate)
                    }} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </React.Fragment>
    );
}
