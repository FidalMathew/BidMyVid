import { Avatar, Box, Grid, HStack, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs, Text, VStack, useColorModeValue, Link as ChakraLink, chakra, Flex, Icon, Stack, Divider, Button, useToast } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { Contract, followers, following } from "../initializers/ethers"
import * as React from "react"
import authStore from "../stores/authStore"
import { useNavigate, useParams } from "react-router-dom"
import { IconType } from "react-icons"
import { FaRegComment, FaRegHeart, FaRegEye, FaEye } from 'react-icons/fa';
import { MdMoney } from "react-icons/md"

const Profilepage = () => {
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
                setUserFollowers(res.subscribers as string[])
            } catch (error) {
                console.log(error)
            }
        }
        const getFollowing = async () => {
            try {
                const res = await following(id as string)
                setUserFollowing(res.subscriptions)
            } catch (error) {
                console.log(error)
            }
        }
        getFollowers()
        getFollowing()
    }, [id])

    const [auctionLoading, setAuctionLoading] = React.useState(false)

    const offerAuction = async (tokenId: number) => {
        setAuctionLoading(true)
        try {

            const res = await Contract.offerAuction(tokenId, true);
            await res.wait()
            setUpdate(!update)
            console.log(res)
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
                <HStack spacing={4} p="10">
                    <Avatar size="xl" src={'/avatar.png'} />
                    <VStack align={"left"} spacing="2">
                        {/* <Box fontWeight="bold">Fidal Mathew</Box> */}
                        <Text color="gray.600" fontSize="md">{id?.slice(0,7) + '...' + id?.slice(-6)}</Text>
                        <Text color="gray.500" fontSize="sm">Your Earning: <chakra.span>0.0001 ETH</chakra.span> </Text>
                        <Button size="xs">Follow</Button>
                    </VStack>
                </HStack>
                <Box m={"auto"} p="6" w={{ base: "100vw", xl: "50vw" }}>
                    <Tabs position="relative" variant="unstyled" isFitted>
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
                                                    _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
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

                                            </VStack>)
                                    })
                                }
                            </TabPanel>
                            <TabPanel>
                                {/*  */}
                                {
                                    auctions.map((item: any, index: number) => {
                                        return (

                                            <VStack key={index} border="1px solid" borderColor="gray.400" rounded="md" overflow="hidden" spacing={0}>
                                                <Grid
                                                    templateRows={{ base: 'auto auto', md: 'auto' }}
                                                    w="100%"
                                                    templateColumns={{ base: 'unset', md: '4fr 2fr 2fr' }}
                                                    p={{ base: 2, sm: 4 }}
                                                    gap={3}
                                                    alignItems="center"
                                                    _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
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

const ArticleSettingLink = ({ label }: { label: string }) => {
    return (
        <chakra.p
            as={ChakraLink}
            _hover={{ bg: useColorModeValue('gray.400', 'gray.600') }}
            p={1}
            rounded="md"
        >
            {label}
        </chakra.p>
    );
};



export default Profilepage
