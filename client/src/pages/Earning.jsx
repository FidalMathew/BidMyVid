import { Flex, HStack, Icon, chakra, Text, VStack } from "@chakra-ui/react"
import { FiArrowLeft } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

const Earning = () => {
    const navigate = useNavigate()
    return (
        // Centered text in the middle of the page
        <Flex minH="100vh" alignItems="center" justifyContent="center" direction={"column"}>
            <HStack>
                <Icon as={FiArrowLeft} onClick={() => {
                    navigate(-1)
                }} cursor={"pointer"} />
                <Text fontSize="sm">Go Back</Text>
            </HStack>
            <VStack direction={"column"} spacing={3}>
                <Text fontSize="5xl">Your Earning</Text>
                <Text fontSize="xl">0.0001 ETH {" "}
                <chakra.span>
                        ($0.0001)
                </chakra.span>
                </Text>
            </VStack>
        </Flex>
    )
}

export default Earning
