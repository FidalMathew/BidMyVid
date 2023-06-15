import {
    Container,
    Box,
    Avatar,
    Button,
    HStack,
    VStack,
    Image,
    Input,
    Spacer,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
    Link,
    MenuDivider,
    useColorModeValue
} from '@chakra-ui/react';
import ToggleTheme from './Toggletheme';


const Navbar = () => {

    return (
        <Box
            py="2"
            boxShadow="sm"
            border="0 solid #e5e7eb"
            position="fixed"
            top="0"
            // bg={useColorModeValue('gray.50', 'gray.700')}
            width="100%"
            zIndex="1"
        >
            <Container maxW="1280px" px={4} mx="auto">
                <HStack spacing={4}>
                    {/* <Image
                        alt="dev logo"
                        w={'auto'}
                        h={12}
                        src="https://dev-to-uploads.s3.amazonaws.com/uploads/logos/resized_logo_UQww2soKuUsjaOGNB38o.png"
                    /> */}
                    <Text w={'auto'} h={12} fontSize="2xl" fontWeight="bold" color="teal.500">Steal Videos</Text>
                    <Spacer />
                    <HStack spacing={3}>
                        <Button colorScheme="teal" variant="outline" size="sm">
                            Connect Wallet
                        </Button>
                        <Menu isLazy>
                            <MenuButton as={Button} size="sm" px={0} py={0} rounded="full">
                                <Avatar size="sm" src={'https://avatars2.githubusercontent.com/u/37842853?v=4'} />
                            </MenuButton>
                            <MenuList
                                zIndex={5}
                                // border="2px solid"
                                // borderColor={useColorModeValue('gray.700', 'gray.100')}
                                // boxShadow="4px 4px 0"
                            >
                                <MenuItem>
                                    <Text fontWeight="500">Profile</Text>
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