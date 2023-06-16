import { Avatar, Box, Button, Flex, HStack, Heading, Icon, Image, Text, VStack, chakra } from "@chakra-ui/react"
import { AiFillCreditCard, AiFillEye } from "react-icons/ai"
import { FiArrowLeft } from "react-icons/fi"
import { useLocation, useNavigate } from "react-router-dom"
import { AccessPlayer } from "./AccessPlayer"

import { Contract, toWei } from '../initializers/ethers'
import { useEffect, useState } from "react"
import authStore from "../stores/authStore"

const Videopage = () => {

    const s = authStore();
    const [bid, setBid] = useState(0)

    const placeBid = async (tokenId) => {
        const price = bid.toString() // in ether
        const res = await Contract.placeBid(tokenId, {
            from: s.address,
            value: toWei(price),
        })
        await res.wait()
        console.log(res)
    }

    const navigate = useNavigate()
    const { state } = useLocation()
    console.log(state, 'uselocation')

    return (
        <Flex align={"center"} justify={"center"} w="100vw" h="100%" p="7" direction={"column"}>
            <VStack spacing={"6"} align={"left"} w="50%">
                <HStack>
                    <Icon as={FiArrowLeft} onClick={() => {
                        navigate(-1)
                    }} cursor={"pointer"} />
                    <Text fontSize="sm">Go Back</Text>
                </HStack>
                <Box position="relative" h="full" w="auto" rounded="2xl">
                    <Heading mb="6" size="md" textAlign={"center"}>{state?.name}</Heading>
                    <AccessPlayer playbackId={state?.image} />
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
                {/* created by and avatar in sm size */}
                <HStack>
                    <Avatar size="sm" />
                    <Text fontSize="sm">Owner:{" "} <chakra.span as="u">{state?.owner?.slice(0, 7) + '...' + state?.owner?.slice(-4)}</chakra.span> </Text>
                </HStack>
                <Text fontSize="md" textAlign={"center"}>{state?.description}</Text>
            </VStack>

        </Flex>
    )
}

export default Videopage
