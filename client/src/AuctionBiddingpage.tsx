import { Box, Button, Center, Flex, FormControl, FormErrorMessage, HStack, Heading, Icon, Input, SimpleGrid, Spinner, Stack, Table, chakra, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Toast, Tr, VStack, useColorModeValue, Tooltip } from "@chakra-ui/react"
import * as React from 'react'
import { AccessPlayer } from "./components/AccessPlayer"
import { useNavigate, useParams } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import { Contract, fromWei, toWei } from "../src/initializers/ethers"
import { useState } from "react"
import { Field, Formik } from "formik"
import * as Yup from 'yup'
import authStore from "./stores/authStore"
import { Polybase } from "@polybase/client";

const AuctionBiddingpage = ({ polyKey }: { polyKey: any }) => {
    const db = new Polybase({
        defaultNamespace: polyKey,
    });
    const navigate = useNavigate()
    const { id } = useParams()
    const s = authStore()
    // console.log(id)
    const [bidders, setBidders] = useState([])
    const [auctionItem, setAuctionItem] = useState({} as any)

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

                    bids: Number(item.bids._hex),
                    description: item.description,
                    endTime: convertDateAndTime(item.endTime._hex),
                    playbackId: item.playbackId,
                    live: item.live,
                    name: item.name,
                    owner: item.owner,
                    price: Number(item.price),
                    tokenId: Number(item.tokenId),
                    winner: item.winner,
                    ended: ((new Date(convertDateAndTime(item.endTime._hex)) < new Date()) ? true : false)
                }
                setAuctionItem(values)

            } catch (error) {
                console.log(error)
            }
        }
        func()
    }, [id])

    if (!auctionItem.price) return (
        <Center h="100vh">
            <Spinner size="xl" />
        </Center>
    )


    const placeBid = async (bidPrice: number) => {

        // console.log(auctionItem, auctionItem.price)


        if (Number(toWei(bidPrice)._hex) < auctionItem.price) {
            Toast({
                title: "Bid Price is less than the current bid",
                status: "error",
                duration: 5000,
            })

        }

        console.log(Contract, auctionItem.price, Number(toWei(bidPrice)._hex))
        console.log(bidPrice)
        try {
            console.log(toWei(bidPrice))
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

    const claimPrize = async () => {
        const bid = auctionItem.bids;
        try {
            const { data } = await db.collection('BidKaro').get();
            const saveDb = await db.collection('BidKaro').create([String(data.length + 1), String(id), String(auctionItem.price), String(new Date()), String(auctionItem.winner), String(auctionItem.owner)])
            const res = await Contract.claimPrize(id, bid - 1);
            await res.wait();
            // sucessfllly claimed
            console.log(res);
        } catch (error) {
            // you are not the winner
            console.log(error)
        }
    }

    const addToHoldings = async () => {
        try {
            const res = await Contract.backToItem(id);
            await res.wait();
            console.log(res);
            Toast(
                {
                    title: "Successfully added to holdings",
                    status: "success",
                    duration: 5000,
                }
            )
        }
        catch (error) {
            console.log(error)
        }
    }

    if (auctionItem.live === false) {
        return (
            <Center h="100vh">
                <Text fontSize="3xl">NFT not for sale, explore other NFTs</Text>
            </Center>
        )
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
                <Stack direction={{ base: 'column', md: 'row' }} justifyContent="space-around" w="60%" h={{ base: "100vh", md: "30vh" }} alignItems="flex-start" spacing={"10"}>
                    <Flex w={{ base: "full", lg: "45%" }} shadow={"xl"}>
                        <AccessPlayer playbackId={auctionItem.playbackId} />
                    </Flex>
                    {/* <Center borderRadius="md" overflow="hidden" w="100%" h="full" bg="gray.400">
                            <Text fontSize="3xl" fontWeight={"semibold"}>{auctionItem.name}</Text>
                        </Center> */}
                    <Box w={{ base: "100%", lg: "50%" }} h="full" p="5" shadow="lg" rounded="xl">
                        <VStack spacing={"1"} align="left">
                            <Flex justifyContent={"space-between"}>
                                <HStack>

                                    <Text fontSize="3xl" fontWeight={"semibold"} >{auctionItem.name}</Text>
                                    {
                                        auctionItem.ended ?
                                            <Tooltip label="Auction Ended" aria-label="A tooltip">
                                                <Box h="10px" w="10px" bg="red.500" borderRadius="full">
                                                </Box>
                                            </Tooltip>
                                            :
                                            <Tooltip label="Auction Live" aria-label="A tooltip">
                                                <Box h="10px" w="10px" bg="green.500" borderRadius="full" display="inline-block" />
                                            </Tooltip>
                                    }
                                </HStack>
                                <Text fontSize="xs" mt="2">{new Date(auctionItem.endTime)
                                    .toLocaleString('en-US', { timeZone: 'UTC' })
                                }</Text>
                            </Flex>
                            <Text>{auctionItem.description}</Text>
                            <Text fontSize={"xs"}>Owner: {auctionItem.owner}</Text>
                            {/* <Text fontSize="sm">Auction Ends at: {auctionItem.endTime}</Text> */}
                            <Text fontSize="md">Current Bid: <chakra.span fontWeight={"semibold"}>{fromWei(auctionItem.price)}</chakra.span>  ETH</Text>
                            {auctionItem.ended ? (

                                auctionItem.bids === 0 ? (

                                    s.address === auctionItem.owner ? (
                                        <Box mt="5" w={{ base: "100%", lg: "100%" }}>
                                            <Button w="full" onClick={() => claimPrize()}> Add to Holdings</Button>
                                        </Box>
                                    ) : (
                                        <></>
                                    )
                                ) : (
                                    s.address === auctionItem.winner ? (
                                        <Box mt="5" w={{ base: "100%", lg: "100%" }}>
                                            <Button w="full" onClick={() => addToHoldings()}> Claim prize</Button>
                                        </Box>
                                    ) : (
                                        <>
                                            Wait for the winner to claim the prize
                                        </>
                                    )
                                )
                            ) : (
                                <Box mt="10" w={{ base: "100%", lg: "100%" }}>
                                    <Formik
                                        initialValues={{ amount: "" }}
                                        validationSchema={
                                            Yup.object({
                                                amount: Yup.number().required("Required")
                                            })
                                        }
                                        onSubmit={(values, actions) => {
                                            console.log(values)
                                            placeBid(Number(values.amount))
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
                            )

                            }
                        </VStack>
                    </Box>
                </Stack>
                {/* {
                    auctionItem.ended ? (
                        <>
                            <Button onClick={claimPrize}> Claim prize</Button>
                        </>
                    ) : (
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
                                    placeBid(Number(values.amount))
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
                    )
                } */}
                <VStack w="full" p="10" spacing="0">
                    <Heading size="md" textAlign="center" color={
                        useColorModeValue('gray.700', 'gray.200')
                    }>Bids for this video
                        <chakra.span> ({auctionItem.bids}) </chakra.span>
                    </Heading>
                    <TableContainer mt="7" w={{ base: "100%", lg: "70%" }} maxH={"40vh"} overflowY={"scroll"} border="1px solid" borderColor={useColorModeValue('gray.100', 'gray.500')} className="bid-table">
                        <Table variant='unstyled' size={"lg"} overflow={"scroll"} overflowY={"hidden"}>
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
                                                <Td isNumeric textAlign={"right"}>{fromWei(bidder.amount)}</Td>
                                            </Tr>
                                        )
                                    })
                                }
                                {/* <Tr>
                                    <Td>0xA1008b78e3...Eb6F1592C101cD</Td>
                                    <Td isNumeric textAlign={"right"}>25.4</Td>
                                </Tr> */}

                            </Tbody>
                        </Table>
                    </TableContainer>
                </VStack>

                {/* <Button colorScheme="blue" size="lg" w="50%" mt="10">Place a Bid</Button> */}
            </VStack>

        </Box>
    )
}


export default AuctionBiddingpage
