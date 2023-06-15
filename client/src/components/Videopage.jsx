import { Avatar, Box, Button, Flex, HStack, Icon, Image, Text, VStack, chakra } from "@chakra-ui/react"
import { AiFillCreditCard, AiFillEye } from "react-icons/ai"
import { FiArrowLeft } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { AccessPlayer } from "./AccessPlayer"

const Videopage = () => {
    const navigate = useNavigate()
    return (
        <Flex align={"center"} justify={"center"} w="100vw" h="100%" p="7" direction={"column"}>
            <VStack spacing={"6"} align={"left"}>
                <HStack>
                   <Icon as={FiArrowLeft} onClick={()=> {
                        navigate(-1)
                   }} cursor={"pointer"} />
                    <Text fontSize="sm">Go Back</Text>
                </HStack>
                <Box position="relative" h="full" w="auto" rounded="2xl">
                    <AccessPlayer />
                    <Button
                        position="absolute"
                        colorScheme='gray'
                        variant={"solid"}
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        leftIcon={<AiFillEye />}
                    >
                        Stake to reveal
                    </Button>
                </Box>
                <Button colorScheme="teal" variant={"outline"} leftIcon={<AiFillCreditCard />} w="full" border="2px solid">
                    Steal for 0.001 ETH
                </Button>
                {/* created by and avatar in sm size */}
                <HStack>
                    <Avatar size="sm" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
                    <Text fontSize="sm">Created by: <chakra.span as="u">0x.3434938y</chakra.span> </Text>
                </HStack>
                <Text fontSize="md" textAlign={"center"}>Description: Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</Text>
            </VStack>

        </Flex>
    )
}

export default Videopage
