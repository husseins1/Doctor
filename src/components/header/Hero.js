import { Button } from '@chakra-ui/button'
import { Flex, Heading } from '@chakra-ui/layout'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
    return (
        <Flex flex="1" textAlign="center" justifyContent="center" flexDirection={{base:"column"}}>
            <Heading  as="h1">
                Welcome
                to Doctor

            </Heading>  
            <Link to="/book">
            <Button marginTop="5" colorScheme="whatsapp" alignSelf="center"> Book an appointment </Button>
            </Link>
        </Flex>
    )
}
