import {
    Container,
    Box,
    Avatar,
    Button,
    HStack,
    Spacer,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
    Link as ChakraLink,
    MenuDivider,
    VStack,
    useColorModeValue,
    Stack,
    Flex,
    Icon,
    Divider,
} from '@chakra-ui/react';
import ToggleTheme from './Toggletheme';
import { useNavigate, Link } from 'react-router-dom';
import authStore from '../stores/authStore';
import { FiBell } from 'react-icons/fi';
import { Fragment, useEffect, useState } from 'react';
import { GoPrimitiveDot } from 'react-icons/go';
import { fetchNotifs } from '../initializers/ethers';


const Navbar = () => {
    const navigate = useNavigate()
    const s = authStore();

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchUserNotifications = async () => {
            const res = await fetchNotifs(s.address);
            console.log(res)
            res?.map((notif) => {
                console.log(notif)
                setNotifications([...notifications, { message: notif.message, cta: notif.cta, icon: notif.icon }])
            })
        }
        fetchUserNotifications();
    }, []);

    return (
        <Box
            py="2"
            boxShadow="sm"
            border="0 solid #e5e7eb"
            // position="fixed"
            // top="0"
            // bg={useColorModeValue('gray.50', 'gray.700')}
            width="100%"
            zIndex="1"
        >
            <Container maxW="1280px" px={4} mx="auto">
                <HStack spacing={4}>
                    <Link to="/">
                        <Text w={'auto'} fontSize="2xl" fontWeight="bold" color="teal.500">BidMyVid</Text>
                    </Link>
                    <Spacer />
                    <HStack spacing={3}>
                        <Menu>
                            <Box as={MenuButton} cursor="pointer">
                                <FiBell style={{ height: '20px', width: '20px' }} />
                            </Box>
                            <VStack
                                boxShadow={useColorModeValue(
                                    '2px 6px 8px rgba(160, 174, 192, 0.6)',
                                    '2px 6px 8px rgba(9, 17, 28, 0.9)'
                                )}
                                rounded="md"
                                overflow="hidden"
                                spacing={0}
                                as={MenuList}
                            >
                                {notifications.map((notification, index) => (
                                    <Box key={index} as={MenuItem} style={{ zIndex: '10' }}>
                                        <Flex
                                            w="100%"
                                            justify="space-between"
                                            alignItems="center"
                                        // _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
                                        >
                                            <Stack spacing={0} direction="row" alignItems="center">
                                                <Flex p={4}>
                                                    <Avatar size="md" name={notification.userName} src={notification.userAvatar} />
                                                </Flex>
                                                <Flex direction="column" p={2}>
                                                    <Text
                                                        color={useColorModeValue('black', 'white')}
                                                        fontSize={{ base: 'sm', sm: 'md', md: 'lg' }}
                                                        dangerouslySetInnerHTML={{ __html: notification.notification }}
                                                    />
                                                    <Text
                                                        color={useColorModeValue('gray.400', 'gray.200')}
                                                        fontSize={{ base: 'sm', sm: 'md' }}
                                                    >
                                                        {notification.dateTime}
                                                    </Text>
                                                </Flex>
                                            </Stack>
                                            {notification.isOnline && (
                                                <Flex p={4}>
                                                    <Icon as={GoPrimitiveDot} w={5} h={5} color="blue.400" />
                                                </Flex>
                                            )}
                                        </Flex>
                                    </Box>
                                ))}
                            </VStack>
                        </Menu>
                        <Button colorScheme="teal" variant="outline" size="sm" onClick={() => navigate('/create')}>
                            Create
                        </Button>
                        <Button colorScheme="teal" variant="outline" size="sm" onClick={() => navigate('/earning')}>
                            Earning
                        </Button>
                        <Menu>
                            <MenuButton as={Button} size="sm" px={0} py={0} rounded="full">
                                <Avatar size="sm" src={'/avatar.png'} />
                            </MenuButton>
                            <MenuList
                                zIndex={5}
                            // border="2px solid"
                            // borderColor={useColorModeValue('gray.700', 'gray.100')}
                            // boxShadow="4px 4px 0"
                            >
                                <MenuItem onClick={() => navigate('/profile' + '/' + s.address.toLowerCase())}>
                                    <Text fontWeight="500" >Profile</Text>
                                </MenuItem>
                                <MenuDivider />
                                <MenuItem>
                                    <Text fontWeight="500">Disconnect</Text>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                        <ToggleTheme />
                    </HStack>
                </HStack>
            </Container>
        </Box>
    );
};

export default Navbar;