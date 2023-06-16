import { Box, Text, VStack } from "@chakra-ui/react"
import Cards from "../components/Cards"
import ToggleTheme from "../components/Toggletheme"
import Navbar from "../components/Navbar"
import * as React from 'react'

import { Contract } from "../initializers/ethers"

const Homecomponent = () => {

    React.useEffect(() => {
        const getAllAuctions = async () => {
            const res = await Contract.getAllAuctions()
            console.log(res)
        }
        getAllAuctions()
    }, [Contract])

    return (
        <>
            <Navbar />
            <Box>
                <Text fontSize="4xl" textAlign="center" fontWeight="bold" mt="10"></Text>
                <VStack>
                    <Cards />
                    <Cards />
                    <Cards />
                    <Cards />
                    <Cards />
                    <Cards />
                    <Cards />
                </VStack>
            </Box>
        </>
    )
}

export default Homecomponent
