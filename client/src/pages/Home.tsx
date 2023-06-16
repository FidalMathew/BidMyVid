// import React from "react";
// import { AccessPlayer } from "../components/AccessPlayer";
// export default function Home() {

//     return (<div style={{ height: "50vh", width: "auto", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10vh" }}>
//         <AccessPlayer />

//     </div>);

// }


import { Box, Text, VStack } from "@chakra-ui/react"
import Cards from "../components/Cards"
import ToggleTheme from "../components/Toggletheme"
import Navbar from "../components/Navbar"
import * as React from 'react'

const Homecomponent = () => {
    return (
        <>
            <Navbar />
            <Box>
                <Text fontSize="4xl" textAlign="center" fontWeight="bold" mt="10"></Text>
                <VStack>
                    <Cards />
                </VStack>
            </Box>
        </>
    )
}

export default Homecomponent
