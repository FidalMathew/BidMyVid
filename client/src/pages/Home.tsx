import { Box, Button, Container, Grid, HStack, Skeleton, Stack, Text, VStack } from "@chakra-ui/react"
import Cards from "../components/Cards"
import ToggleTheme from "../components/Toggletheme"
import Navbar from "../components/Navbar"
import * as React from 'react'

import { Contract } from "../initializers/ethers"

const Homecomponent = () => {
    const convertDateAndTime = (timestamp) => {
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
    const [auctionitems, setAuctionItems] = React.useState([])

    const [fetchAuctionLoading, setFetchAuctionLoading] = React.useState(false)

    React.useEffect(() => {
        const getAllAuctions = async () => {
            setFetchAuctionLoading(true)
            try {
                let arr: any = [];
                const res = await Contract.getAllAuctions()
                res.map((item: any) => {

                    if (item.live) {

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
                        }
                        arr.push(values);
                    }
                })
                console.log("-------------------------", arr)
                setAuctionItems(arr)
            } catch (err) {
                console.log(err)
            } finally {
                setFetchAuctionLoading(false)
            }

        }
        getAllAuctions()
    }, [Contract])

    console.log(auctionitems, "auctionitems")

    return (
        <>
            <Navbar />
            <Box>
                <Text fontSize="4xl" textAlign="center" fontWeight="bold" mt="10"></Text>
                <Grid templateColumns='repeat(1, 1fr)' gap={0} m="auto" w="100%">
                    {/* make a skeleton */}
                    {
                        fetchAuctionLoading && (
                            Array.from({ length: 3 }).map((_, index) => (
                                <Container key={index} p={{ base: 5, md: 10 }} maxW="2xl">
                                    <Box
                                        borderWidth="1px"
                                        _hover={{ shadow: 'lg' }}
                                        rounded="md"
                                        overflow="hidden"
                                    // bg="gray.200"
                                    >
                                        <Box position="relative" w="100%" h="300px" zIndex="0">
                                            <Skeleton h="100%" w="100%" />
                                        </Box>
                                        <Box p={{ base: 3, sm: 5 }}>
                                            <VStack align="start" mb={6}>
                                                <Skeleton h="20px" w="80%" />
                                                <Skeleton h="16px" w="100%" />
                                                <Skeleton h="12px" w="60%" />
                                            </VStack>
                                            <Stack justify="end" direction={{ base: 'column', sm: 'row' }} spacing={{ base: 2, sm: 0 }}>
                                                <Button
                                                    textTransform="uppercase"
                                                    lineHeight="inherit"
                                                    rounded="md"
                                                    colorScheme="gray"
                                                    variant="solid"
                                                    size="sm"
                                                    isDisabled
                                                >
                                                    Place a Bid
                                                </Button>
                                            </Stack>
                                        </Box>
                                    </Box>
                                </Container>
                            ))
                        )
                    }

                    {
                        fetchAuctionLoading == false && auctionitems.length === 0 && (
                            <Text fontSize="4xl" textAlign="center" fontWeight="bold" mt="10">No Auctions</Text>
                        )
                    }

                    {auctionitems.map((item: any, index: any) => {
                        return <Cards auctionItem={item} key={index} />
                    })}
                </Grid>
            </Box>
        </>
    )
}

export default Homecomponent
