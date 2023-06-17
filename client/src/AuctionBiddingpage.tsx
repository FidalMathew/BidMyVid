import { Box, Button, FormControl, FormErrorMessage, HStack, Icon, Input, Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Toast, Tr, VStack, useColorModeValue } from "@chakra-ui/react"
import * as React from 'react'
import { AccessPlayer } from "./components/AccessPlayer"
import { useNavigate, useParams } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import { Contract, fromWei, toWei } from "../src/initializers/ethers"
import { useState } from "react"
import { Field, Formik } from "formik"
import * as Yup from 'yup'
import authStore from "./stores/authStore"

const AuctionBiddingpage = () => {
    const navigate = useNavigate()

    const { id } = useParams()
    const s = authStore()
    // console.log(id)
    const [bidders, setBidders] = useState([])
    const [auctionItem, setAuctionItem] = useState({} as any)

    const [bidPrice, setBidPrice] = useState(0)

    const convertDateAndTime = (timestamp: any) => {
        const decimalTimestamp = parseInt(timestamp.substring(2), 16);
        const date = new Date(decimalTimestamp * 1000);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return formattedDateTime;
    };

    React.useEffect(() => {

        const getBidders = async () => {
            try {
                const res = await Contract.getBidders(id)
                console.log(res)
                const arr: any = []
                res.map((bidder: any) => {

                    let values = {
                        bidder: bidder.bidder,
                        amount: Number(bidder.price._hex),
                        timestamp: bidder.timestamp,
                        refunded: bidder.refunded,
                        won: bidder.won

                    }
                    arr.push(values)
                })

                setBidders(arr)

            } catch (error) {
                console.log(error)
            }
        }
        getBidders()
    }, [id])

    React.useEffect(() => {
        const func = async () => {
            try {
                const item = await Contract.getAuction(id)
                console.log(item)

                let values = {
                    biddable: item.biddable,
                    bids: Number(item.bids._hex),
                    description: item.description,
                    endTime: convertDateAndTime(item.endTime._hex),
                    image: item.image,
                    live: item.live,
                    name: item.name,
                    owner: item.owner,
                    price: Number(item.price),
                    sold: item.sold,
                    tokenId: Number(item.tokenId),
                    winner: item.winner,
                }
                setAuctionItem(values)

            } catch (error) {
                console.log(error)
            }
        }
        func()
    }, [id])

    if (!auctionItem.price) return (<div>Loading...</div>)


    const placeBid = async () => {

        if (auctionItem && auctionItem.price)
            return;

        if (bidPrice < auctionItem.price) {
            Toast({
                title: "Bid Price is less than the current bid",
                status: "error",
                duration: 5000,
            })
        }

        try {
            const res = await Contract.placeBid(id, {
                from: s.address,
                value: toWei(bidPrice)

            })
            await res.wait()
            Toast({
                title: "Bid Placed Successfully",
                status: "success",
                duration: 5000,
            })
            console.log(res)
        }
        catch (error) {
            Toast({
                title: "Unkwown Error",
                status: "error",
                duration: 5000,
            })
            console.log(error)
        }
    }


    return (
        <Box minH="100%">
            <HStack h="5vh" p="7">
                <Icon as={FiArrowLeft} onClick={() => {
                    navigate(-1)
                }} cursor={"pointer"} />
                <Text fontSize="sm">Go Back</Text>
            </HStack>

            <VStack p="10" pl="10" pr="10">
                <Stack direction={{ base: 'column', md: 'row' }} justifyContent="space-around" w="50%" h="auto" alignItems="flex-start" spacing={"10"}>
                    <Box w={{ base: "100%", lg: "50%" }} h="full" className="player">
                        <AccessPlayer playbackId={auctionItem.image} />
                    </Box>
                    <VStack align="left" w={{ base: "100%", lg: "50%" }} spacing={10}>
                        <VStack spacing={"3"} align="left">
                            <Text fontSize="3xl" fontWeight={"semibold"}>{auctionItem.name}</Text>
                            <Text>{auctionItem.description}</Text>
                            <Text fontSize={"sm"}>Owner: {auctionItem.owner}</Text>
                            <Text fontSize="sm">Auction Ends at: {auctionItem.endTime}</Text>
                            <Text fontSize="sm">Current Bid: {fromWei(auctionItem.price)} ETH</Text>
                            <Text fontSize="sm">Number of Bids: {auctionItem.bids}</Text>
                        </VStack>
                    </VStack>
                </Stack>
                <Box mt="10" w={{ base: "100%", lg: "50%" }}>
                    <Formik
                        initialValues={{ amount: "" }}
                        validationSchema={
                            Yup.object({
                                amount: Yup.number().required("Required")
                            })
                        }
                        onSubmit={(values, actions) => {
                            console.log(values)
                        }}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit}>
                                <FormControl id="amount"
                                    isInvalid={Boolean(formik.errors.amount && formik.touched.amount)}
                                >
                                    <HStack>
                                        <Field as={Input} name="amount" type="number" placeholder="Enter Amount" />
                                        <Button type="submit" colorScheme="blue" size="md" w="50%" >Place a Bid</Button>
                                    </HStack>
                                    <FormErrorMessage color="red">{formik.errors.amount}</FormErrorMessage>
                                </FormControl>
                            </form>
                        )}
                    </Formik>
                </Box>
                <TableContainer mt="7" w={{ base: "100%", lg: "50%" }} maxH={"40vh"} overflowY={"scroll"} border="1px solid" borderColor={useColorModeValue('gray.100', 'gray.500')} className="bid-table">
                    <Table variant='unstyled' size={"lg"} overflow={"scroll"} h="300px" overflowY={"hidden"}>
                        <Thead>
                            <Tr>
                                <Th>Bidders</Th>
                                <Th isNumeric textAlign={"right"}>Amount Bid</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                bidders.map((bidder: any, index: any) => {
                                    return (
                                        <Tr key={index}>
                                            <Td>{bidder.bidder}</Td>
                                            <Td isNumeric textAlign={"right"}>{bidder.amount}</Td>
                                        </Tr>
                                    )
                                })
                            }
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
                            <Tr>
                                <Td>0xA1008b78e3...Eb6F1592C101cD</Td>
                                <Td isNumeric textAlign={"right"}>0.91444</Td>
                            </Tr>
                            <Tr>
                                <Td>0xA1008b78e3...Eb6F1592C101cD</Td>
                                <Td isNumeric textAlign={"right"}>0.91444</Td>
                            </Tr>
                            <Tr>
                                <Td>0xA1008b78e3...Eb6F1592C101cD</Td>
                                <Td isNumeric textAlign={"right"}>0.91444</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
                {/* <Button colorScheme="blue" size="lg" w="50%" mt="10">Place a Bid</Button> */}
            </VStack>

        </Box>
    )
}

export default AuctionBiddingpage
