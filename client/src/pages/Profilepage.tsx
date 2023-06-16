import { Avatar, Box, HStack, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { Contract } from "../initializers/ethers"
import * as React from "react"
import authStore from "../stores/authStore"
import { useParams } from "react-router-dom"

const Profilepage = () => {
    const {id}=useParams();
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
    console.log(id)
    const[auctionitems,setAuctionItems]=React.useState([])
    React.useEffect(() => {
        const getAllAuctions = async () => {
            let arr:any=[];
            const res = await Contract.getAllAuctions()
            res.map((item:any)=>{
                console.log(item.owner.toLowerCase(),"debugging  ")
                if(item.owner.toLowerCase()===id)
                {
                    let values={
                        biddable:item.biddable,
                        bids:Number(item.bids._hex),
                        description:item.description,
                        endTime:convertDateAndTime(item.endTime._hex),
                        image:item.image,
                        live:item.live,
                        name:item.name,
                        owner:item.owner,
                        price:Number(item.price),
                        sold:item.sold,
                        tokenId:Number(item.tokenId),
                        winner:item.winner,
                    }
                    arr.push(values);
                }
                
            })
            console.log(arr)
            setAuctionItems(arr)
        }
        getAllAuctions()
    }, [Contract,id])
    const offerAuction = async (tokenId) => {
        const res = await Contract.offerAuction(tokenId, true);
        await res.wait()
        console.log(res)
    }

    return (
        <VStack>
            <Navbar />
            <VStack>
                <HStack spacing={4}>
                    <Avatar size="2xl" src={'https://avatars2.githubusercontent.com/u/37842853?v=4'} />
                    <VStack align={"left"} spacing="0">
                        <Box fontWeight="bold">Fidal Mathew</Box>
                        <Box color="gray.500">0x45mfefewfe....cBa</Box>
                    </VStack>
                </HStack>
                <Box m={"auto"} p="6" w={{ base: "100vw", xl: "70vw" }}>
                    <Tabs position="relative" variant="unstyled" isFitted>
                        <TabList>
                            <Tab>Holdings</Tab>
                            <Tab>Created</Tab>
                        </TabList>
                        <TabIndicator
                            mt="-1.5px"
                            height="2px"
                            bg="blue.500"
                            borderRadius="1px"
                        />
                        <TabPanels>
                            <TabPanel>
                                <Text fontSize="xl" fontWeight="bold" color="gray.500" textAlign="center" mt="10">
                                    No Holdings yet
                                </Text>
                            </TabPanel>
                            <TabPanel>
                                <Text fontSize="xl" fontWeight="bold" color="gray.500" textAlign="center" mt="10">
                                    No Videos yet
                                </Text>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </VStack>
        </VStack>
    )
}

export default Profilepage
