import {
    chakra,
    Box,
    Stack,
    Text,
    Image,
    Container,
    Button,
    useColorModeValue,
    VStack
} from '@chakra-ui/react';
import { AiFillEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { AccessPlayer } from './AccessPlayer';

// eslint-disable-next-line react/prop-types
const Cards = ({ auctionItem }) => {
    const navigate = useNavigate()
    return (
        <>
            <Container p={{ base: 5, md: 10 }} maxW="2xl">
                <Box
                    borderWidth="1px"
                    _hover={{ shadow: 'lg' }}
                    rounded="md"
                    overflow="hidden"
                    bg={useColorModeValue('white', 'gray.800')}
                >
                    <Box position="relative" w="100%" h="auto" zIndex={"0"}>
                        <AccessPlayer playbackId={auctionItem.playbackId} tokenId={auctionItem.tokenId} />
                    </Box>
                    <Box p={{ base: 3, sm: 5 }}>
                        <VStack align={"start"} mb={6}>
                            <chakra.h3
                                fontSize={{ base: 'lg', sm: '2xl' }}
                                fontWeight="bold"
                                lineHeight="1.2"
                                mb={2}
                                textAlign={"center"}
                            >
                                {auctionItem.name}
                            </chakra.h3>
                            <Text fontSize={{ base: 'md', sm: 'sm' }} noOfLines={2}>
                                {auctionItem.description}
                            </Text>
                            <Text fontSize={{ base: 'sm', sm: 'xs' }} noOfLines={2}>
                                by <chakra.span fontWeight="semibold" onClick={()=>navigate(`/profile/${auctionItem.owner}`)} cursor={"pointer"}>{auctionItem.owner.slice(0,6) + "..." + auctionItem.owner.slice(-7)}</chakra.span> |{' '}
                                <chakra.span fontWeight="semibold">{new Date(auctionItem.endTime).toLocaleDateString('en-us', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}</chakra.span>{" "}
                                <chakra.span>{new Date(auctionItem.endTime).toLocaleTimeString(
                                    'en-US',
                                    {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true,
                                    }
                                )}</chakra.span>
                            </Text>
                        </VStack>
                        <Stack
                            justify="end"
                            direction={{ base: 'column', sm: 'row' }}
                            spacing={{ base: 2, sm: 0 }}
                        >
                            <Button textTransform="uppercase" lineHeight="inherit" rounded="md" colorScheme="gray" variant="solid" onClick={() => navigate(`/bid/${auctionItem.tokenId}`)} size={"sm"}>
                                Place a Bid
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </>
    );
};


export default Cards;