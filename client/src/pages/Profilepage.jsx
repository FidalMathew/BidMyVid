import { Avatar, Box, HStack, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { Contract } from "../initializers/ethers"
import { useEffect } from "react"

const Profilepage = () => {

    useEffect(() => {
        const getAllAuctions = async () => {
            const res = await Contract.getAllAuctions()
            console.log(res)
        }
        getAllAuctions()
    }, [Contract])


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
