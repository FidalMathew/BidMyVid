import { Box, Button, HStack, Icon, Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, VStack, useColorModeValue } from "@chakra-ui/react"
import * as React from 'react'
import { AccessPlayer } from "./components/AccessPlayer"
import { useNavigate } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"

const AuctionBiddingpage = () => {
    const navigate = useNavigate()
    return (
        <Box minH="100%">
            <HStack h="5vh" p="7">
                <Icon as={FiArrowLeft} onClick={() => {
                    navigate(-1)
                }} cursor={"pointer"} />
                <Text fontSize="sm">Go Back</Text>
            </HStack>
            <VStack p="10" pl="0" pr="0">
                <Stack direction={{base: 'column', md: 'row'}} justifyContent="space-around" w="50%" h="auto" alignItems="flex-start" spacing={"10"}>
                    <Box w={{base: "100%", lg: "50%"}} h="auto">
                        <AccessPlayer />
                    </Box>
                    <VStack align="left" w={{base:"100%" ,lg:"50%"}} spacing={10}>
                        <VStack spacing={"3"} align="left">
                            <Text fontSize="3xl" fontWeight={"semibold"}>Name of the Video</Text>
                            <Text>Description of the video</Text>
                            <Text fontSize={"sm"}>Owner: 0xA1008b78....b6F1592C101cD</Text>
                            <Text fontSize="sm">Auction Ends in: 2 days</Text>
                            <Text fontSize="sm">Current Bid: 25.4</Text>
                            <Text fontSize="sm">Number of Bids: 3</Text>
                        </VStack>
                    </VStack>
                </Stack>
                <TableContainer mt="7" w={{base: "100%", md: "50%"}}>
                    <Table variant='unstyled' border="1px solid" borderColor={useColorModeValue('gray.100', 'gray.500')} size={"lg"} >
                        <Thead>
                            <Tr>
                                <Th>Bidders</Th>
                                <Th isNumeric textAlign={"right"}>Amount Bid</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>0xA1008b78e3...Eb6F1592C101cD</Td>
                                <Td isNumeric textAlign={"right"}>25.4</Td>
                            </Tr>
                            <Tr>
                                <Td>0xA1008b78e3...Eb6F1592C101cD</Td>
                                <Td isNumeric textAlign={"right"}>30.48</Td>
                            </Tr>
                            <Tr>
                                <Td>0xA1008b78e3...Eb6F1592C101cD</Td>
                                <Td isNumeric textAlign={"right"}>0.91444</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </VStack>

        </Box>
    )
}

export default AuctionBiddingpage
