import { Avatar, Box, Grid, HStack, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs, Text, VStack, useColorModeValue, Link as ChakraLink, chakra, Flex, Icon, Stack, Divider, Button, useToast, Skeleton, Heading } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { Contract, followers, following, optIn, optOut, sendNotification } from "../initializers/ethers"
import * as React from "react"
import authStore from "../stores/authStore"
import { Link, useNavigate, useParams } from "react-router-dom"
import { IconType } from "react-icons"
import { FaRegComment, FaRegHeart, FaRegEye, FaEye } from 'react-icons/fa';
import { MdMoney } from "react-icons/md"

const Profilepage = () => {

    const s = authStore()
    const { id } = useParams();
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
    console.log(id)
    const [holdings, setHoldings] = React.useState([])
    const [auctions, setAuctions] = React.useState([])

    const [update, setUpdate] = React.useState(true)
    const [optedIn, setOptedIn] = React.useState(false)

    const toast = useToast()

    React.useEffect(() => {
        const getAllAuctions = async () => {
            let holdArr: any = [];
            let auctionArr: any = [];
            const res = await Contract.getAllAuctions()
            res.map((item: any) => {
                console.log(item.owner.toLowerCase(), "debugging  ")
                if (item.owner.toLowerCase() === id) {
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
                    if (item.live == false)
                        holdArr.push(values);
                    else
                        auctionArr.push(values);
                }

            })
            // console.log(arr)
            setHoldings(holdArr)
            setAuctions(auctionArr)
        }
        getAllAuctions()
    }, [Contract, id, update])

    const [userfollowers, setUserFollowers] = React.useState([] as string[])
    const [userfollowing, setUserFollowing] = React.useState([])

    React.useEffect(() => {
        const getFollowers = async () => {
            try {

                const res = await followers(id as string)
                res.subscribers.map((item: any) => {
                    if (item.toLowerCase() === s.address.toLowerCase()) {
                        setOptedIn(true)
                    }
                })
                console.log("notif sub ", res.subscribers)
                setUserFollowers(res.subscribers as string[] || [])
            } catch (error) {
                console.log(error)
            }
        }
        const getFollowing = async () => {
            try {
                const res = await following(id as string)
                setUserFollowing(res || [])
                console.log(res, 'following')
            } catch (error) {
                console.log(error)
            }
        }
        if (id) {
            console.log("address", id)
            getFollowers()
            getFollowing()

        }
    }, [id, s.address])

    const [auctionLoading, setAuctionLoading] = React.useState(false)

    const offerAuction = async (tokenId: number) => {
        setAuctionLoading(true)
        try {

            const res = await Contract.offerAuction(tokenId);
            await res.wait()
            setUpdate(!update)

            sendNotification(s.address, tokenId)
            // console.log(res)
            toast({
                title: "Success",
                description: "Auction offered successfully",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
        } catch (err) {
            console.log(err)
            toast({
                title: "Error",
                description: "Error in offering auction",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        } finally {
            setAuctionLoading(false)
        }
    }

    const navigate = useNavigate()
    console.log(holdings, auctions)
    return (
        <VStack>
            <Navbar />
            <VStack>
                {
                    id?.toLowerCase() === s.address.toLowerCase() ? (
                        <Text fontSize="md" fontWeight="bold" p="5">Your Profile</Text>
                    ) : (
                        <Text fontSize="md" fontWeight="bold" p="5">Profile of the user {id?.slice(0, 5) + '...' + id?.slice(-5)}</Text>
                    )
                }
                <HStack spacing={4} p="10">
                    <Avatar size="2xl" src={'/avatar.png'} />
                    <VStack align={"left"} spacing="2">
                        {/* <Box fontWeight="bold">Fidal Mathew</Box> */}
                        <Text fontSize="md">{id?.slice(0, 7) + '...' + id?.slice(-6)}</Text>
                        <Text fontSize="sm">Your Earning: <chakra.span>0.0001 ETH</chakra.span> </Text>


                        <Text fontSize="sm">Followers: <chakra.span>{userfollowers.length}</chakra.span>
                            {/* following */}
                            <chakra.span ml="2">Following: {userfollowing.length}</chakra.span>
                        </Text>
                        {
                            id?.toLowerCase() !== s.address.toLowerCase() ? (
                                <>
                                    {!optedIn ?
                                        <Button size="xs" onClick={() => optIn(id as string, s.address)}>Follow</Button>
                                        :
                                        <Button size="xs" onClick={() => optOut(id as string, s.address)} >Unfollow</Button>
                                    }
                                </>
                            ) : (
                                <></>
                            )
                        }


                    </VStack>
                </HStack>
                <Box m={"auto"} p="6" w={{ base: "100vw", xl: "50vw" }}>
                    <Tabs position="relative" variant="unstyled" isFitted isLazy>
                        <TabList>
                            <Tab>Holdings</Tab>
                            <Tab>In Auction</Tab>
                        </TabList>
                        <TabIndicator
                            mt="-1.5px"
                            height="2px"
                            bg="blue.500"
                            borderRadius="1px"
                        />
                        <TabPanels>
                            <TabPanel>
                                {/*  */}
                                {
                                    // for no holdings
                                    holdings.length == 0 ? (
                                        <Heading textAlign={"center"} size="md" mb="4" p="5">No holdings</Heading>
                                    ) : null
                                }
                                {
                                    holdings.map((item: any, index: number) => {
                                        return (
                                            <VStack key={index} border="1px solid" borderColor="gray.400" rounded="md" overflow="hidden" spacing={0} mb="7">
                                                <Grid
                                                    templateRows={{ base: 'auto auto', md: 'auto' }}
                                                    w="100%"
                                                    templateColumns={{ base: 'unset', md: '4fr 2fr 2fr' }}
                                                    p={{ base: 2, sm: 4 }}
                                                    gap={3}
                                                    alignItems="center"
                                                >
                                                    <Box gridColumnEnd={{ base: 'span 2', md: 'unset' }}>
                                                        <chakra.h3 as={ChakraLink} href={""} isExternal fontWeight="bold" fontSize="lg">
                                                            {item.name}
                                                        </chakra.h3>
                                                        <chakra.p
                                                            fontWeight="medium"
                                                            fontSize="sm"
                                                            color={useColorModeValue('gray.600', 'gray.300')}
                                                        >
                                                            {item.description}
                                                        </chakra.p>
                                                    </Box>
                                                    <HStack
                                                        spacing={{ base: 0, sm: 3 }}
                                                        alignItems="center"
                                                        fontWeight="medium"
                                                        fontSize={{ base: 'xs', sm: 'sm' }}
                                                        color={useColorModeValue('gray.600', 'gray.300')}
                                                    >
                                                    </HStack>
                                                    <Stack
                                                        spacing={2}
                                                        direction="row"
                                                        fontSize={{ base: 'sm', sm: 'md' }}
                                                        justifySelf="flex-end"
                                                        alignItems="center"
                                                    >
                                                        <Button size="sm" leftIcon={<MdMoney />} onClick={
                                                            () => offerAuction(item.tokenId)
                                                        }>
                                                            Bid in Auction
                                                        </Button>
                                                        <Button size="sm" leftIcon={<FaEye />} onClick={() => navigate(`/videos/${item.tokenId}`, { state: item })}>
                                                            View
                                                        </Button>
                                                    </Stack>
                                                </Grid>
                                                <Divider m={0} />

                                            </VStack>
                                        )
                                    })
                                }
                            </TabPanel>
                            <TabPanel>
                                {/*  */}
                                {
                                    // for no auctions
                                    auctions.length == 0 ? (
                                        <Heading textAlign={"center"} size="md" mb="4" p="5">No auctions</Heading>
                                    ) : null
                                }
                                {
                                    auctions.map((item: any, index: number) => {
                                        return (

                                            <VStack key={index} border="1px solid" borderColor="gray.400" rounded="md" overflow="hidden" spacing={0} mb="7">
                                                <Grid
                                                    templateRows={{ base: 'auto auto', md: 'auto' }}
                                                    w="100%"
                                                    templateColumns={{ base: 'unset', md: '4fr 2fr 2fr' }}
                                                    p={{ base: 2, sm: 4 }}
                                                    gap={3}
                                                    alignItems="center"
                                                >
                                                    <Box gridColumnEnd={{ base: 'span 2', md: 'unset' }}>
                                                        <chakra.h3 as={ChakraLink} href={""} isExternal fontWeight="bold" fontSize="lg">
                                                            {item.name}
                                                        </chakra.h3>
                                                        <chakra.p
                                                            fontWeight="medium"
                                                            fontSize="sm"
                                                            color={useColorModeValue('gray.600', 'gray.300')}
                                                        >
                                                            Published: {"article.created_at"}
                                                        </chakra.p>
                                                    </Box>
                                                    <HStack
                                                        spacing={{ base: 0, sm: 3 }}
                                                        alignItems="center"
                                                        fontWeight="medium"
                                                        fontSize={{ base: 'xs', sm: 'sm' }}
                                                        color={useColorModeValue('gray.600', 'gray.300')}
                                                    >
                                                    </HStack>
                                                    <Stack
                                                        spacing={2}
                                                        direction="row"
                                                        fontSize={{ base: 'sm', sm: 'md' }}
                                                        justifySelf="flex-end"
                                                        alignItems="center"
                                                    >
                                                        <Button size="sm" leftIcon={<FaEye />} onClick={() => navigate(`/bid/${item.tokenId}`)}>
                                                            View Auction
                                                        </Button>
                                                    </Stack>
                                                </Grid>
                                                <Divider m={0} />

                                            </VStack>

                                        )
                                    })
                                }
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </VStack>
        </VStack>
    )
}

const ArticleStat = ({ icon, value }: { icon: IconType; value: number }) => {
    return (
        <Flex p={1} alignItems="center">
            <Icon as={icon} w={5} h={5} mr={2} />
            <chakra.span> {value} </chakra.span>
        </Flex>
    );
};


export default Profilepage
