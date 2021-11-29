import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Flex } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { createUserWithEmailAndPassword, updateProfile } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/user/userSlice";
import { auth, db } from "../firebase";

export default function Register() {
    const [email,setEmail] =useState("")
    const [name,setName] =useState("")
    const [password,setPassword] =useState("")
    const dispatch =useDispatch()
    const toast = useToast()
    const signup = async (e)=>{
        e.preventDefault()
        try{
            if(!name){
                throw new Error("name is required")
            }
            const {user} = await createUserWithEmailAndPassword(auth,email,password)
            await updateProfile(user,{displayName:name})
            await setDoc(doc(db, "users", user.uid), {
              email: user.email,
              uid: user.uid,
              displayName: name,
              admin:false
            });
            dispatch(
              login({
                email: user.email,
                uid: user.uid,
                displayName: name,
                admin:false
              })
            );
            window.location="/"
        }catch(err){
            toast({
              position: "bottom-left",
              render: () => (
                <Box color="white" p={3} bg="red.500">
                  {err.message} 
                </Box>
              ),
            });
        }

    }
  return (
    <form
      onSubmit={signup}
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
        <FormLabel>First name</FormLabel>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="name"
        ></Input>
      </FormControl>
      <FormControl marginTop="5" isRequired>
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
          Register
        </Button>
      </Flex>
    </form>
  );
}
