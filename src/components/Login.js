import { Button } from '@chakra-ui/button'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Box, Flex, LinkBox } from '@chakra-ui/layout'
import { useToast } from '@chakra-ui/toast'
import { signInWithEmailAndPassword } from '@firebase/auth'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'

export default function Login() {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const toast = useToast()
    const signinHandler = async (e)=>{
      e.preventDefault();
      try{
        await signInWithEmailAndPassword(auth,email,password)
        window.location="/"
      }catch(error){
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
    return (
      <form
      onSubmit={signinHandler}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "70%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          ></Input>
        </FormControl>
        <FormControl marginTop="5" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          ></Input>
        </FormControl>
        <Flex marginTop="7" alignItems="center">
          <Button type="submit" marginRight="5" colorScheme="whatsapp">
            Login
          </Button>
          <LinkBox fontSize="sm">
            <Link to="/register">Register</Link>
          </LinkBox>
        </Flex>
      </form>
    );
}
