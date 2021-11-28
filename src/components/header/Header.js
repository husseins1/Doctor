import React from "react";
import {
  Flex,
  Heading,
  Avatar,
  Button,
  useColorMode,
  useDisclosure,
  Tooltip
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../features/user/userSlice";
import { signOut } from "@firebase/auth";
import { auth } from "../../firebase";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const signningout=()=>{
    signOut(auth)
    dispatch(logout())
  }
  return (
    <React.Fragment>
      <Flex marginX="4" alignItems="center" justifyContent="space-between">
        <Heading alignSelf="center" as="h2" fontWeight={8} p={15}>
          Doctor
        </Heading>
        <Button marginLeft="auto" marginRight="2" onClick={toggleColorMode}>
          {colorMode === "light" ? (
            <i className="fas fa-moon"></i>
          ) : (
            <i className="fas fa-sun"></i>
          )}
        </Button>
        <Button
          display={{ md: "none" }}
          ref={btnRef}
          colorScheme="whatsapp"
          onClick={onOpen}
        >
          <i className="fas fa-bars"></i>
        </Button>
        <Flex
          flex={0.5}
          display={{ sm: "none", base: "none", md: "flex" }}
          justifyContent="space-around"
          alignItems="center"
        >
          <Link to="/">Home</Link>

          <Link to="/book">Book</Link>
          <Link to="/appointments">Appointments</Link>
          {user?.displayName ? (
            <Tooltip label="Sign out">

              <Avatar
                onClick={signningout}
                cursor="pointer"
                name={user.displayName[0].toUpperCase()}
              />
            </Tooltip>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </Flex>
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody>
            <Flex
              height="100%"
              flexDirection="column"
              justifyContent="space-around"
              alignItems="center"
            >
              <Link to="/">Home </Link>

              <Link to="/book">Book </Link>
              <Link to="/appointments">Appointments</Link>
              {user?.displayName ? (
                <Avatar
                  onClick={signningout}
                  name={user.displayName[0].toUpperCase()}
                />
              ) : (
                <Link to="/login">Login</Link>
              )}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
}
