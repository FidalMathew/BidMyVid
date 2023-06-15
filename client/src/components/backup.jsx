const backup = () => {
    return (
        <div>
            return (
        <>
            <Flex h="100vh" justifyContent="center" alignItems="center">
                <Formik
                    initialValues={{ name: '', description: '' }}
                    validationSchema={Yup.object({
                        name: Yup.string()
                            .max(15, 'Must be 15 characters or less')
                            .required('Required'),
                        description: Yup.string()
                            .max(20, 'Must be 20 characters or less')
                            .required('Required'),
                    })}
                    onSubmit={(values, actions) => {
                        console.log(values);
                        console.log(actions);
                    }}
                >
                    {(formik) => (
                        <form onSubmit={formik.handleSubmit} style={{ width: '60%' }}>
                            <VStack spacing={4} m="auto">
                                <FormControl>
                                    <FormLabel htmlFor="name">Name</FormLabel>
                                    <Field
                                        name="name"
                                        type="text"
                                        as={Input}
                                        placeholder="Enter a name for your video"
                                        w="100%"
                                    />
                                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="description">Description</FormLabel>
                                    <Field
                                        name="description"
                                        type="text"
                                        as={Input}
                                        placeholder="Enter a description for your video"
                                        w="100%"
                                    />
                                    <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
                                </FormControl>
                                <Box
                                    border="2px dashed"
                                    borderColor="gray.200"
                                    p="6"
                                    rounded="md"
                                    w="full"
                                    mx="auto"
                                    textAlign="center"
                                >
                                    <Center mb="4" 
                                        {...getRootProps()}
                                    >
                                        <Icon color="gray.500" border="1px solid" borderColor={"gray.500"} rounded="full" h="8" w="8" as={MdAdd} />
                                    </Center>
                                    <Text color="gray.500" fontSize="lg" fontWeight="bold">
                                        Upload your file
                                    </Text>
                                </Box>
                                <Button type="submit" w="100%">Submit</Button>
                            </VStack>
                        </form>
                    )}
                </Formik>
            </Flex>

        </>
    );
        </div>
    )
}

export default backup
