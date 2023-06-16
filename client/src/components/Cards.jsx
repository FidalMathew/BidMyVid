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
import Navbar from './Navbar';

const Cards = ({auctionItem}) => {
    const navigate = useNavigate()
    return (
        <>
            <Container p={{ base: 5, md: 10 }} maxW="3xl">
                <Box
                    borderWidth="1px"
                    _hover={{ shadow: 'lg' }}
                    rounded="md"
                    overflow="hidden"
                    bg={useColorModeValue('white', 'gray.800')}
                >
                    <Box position="relative" w="100%">
                        {/* <Image
                        style={{ filter: "blur(8px)" }}
                        src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80"
                        objectFit="cover"
                        w="100%"
                    /> */}
                        <AccessPlayer />
                        <Button
                            position="absolute"
                            colorScheme='gray'
                            variant={"outline"}
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            leftIcon={<AiFillEye />}
                        >
                            Stake to reveal
                        </Button>
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
                            <Text fontSize={{ base: 'md', sm: 'lg' }} noOfLines={2}>
                                {auctionItem.description}
                            </Text>
                            <Text fontSize={{ base: 'sm', sm: 'md' }} noOfLines={2}>
                                by <chakra.span fontWeight="bold">{auctionItem.owner}</chakra.span> |{' '}
                                <chakra.span fontWeight="bold">{auctionItem.endTime}</chakra.span>
                            </Text>
                        </VStack>
                        <Stack
                            justify="end"
                            direction={{ base: 'column', sm: 'row' }}
                            spacing={{ base: 2, sm: 0 }}
                        >
                            {/* <CustomButton variant="outline">Not a member?</CustomButton> */}
                            <Button textTransform="uppercase" lineHeight="inherit" rounded="md" colorScheme="gray" variant="solid" onClick={() => navigate('/videos/23234')}>
                                Access Now
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </>
    );
};


export default Cards;