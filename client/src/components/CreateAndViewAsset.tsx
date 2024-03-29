import { Box, Button, Center, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Heading, Icon, Input, Progress, Stack, Text, VStack, useToast } from '@chakra-ui/react';
import { useCreateAsset } from '@livepeer/react';
import React, { ChangeEvent, useEffect } from 'react';
import { MdAdd } from "react-icons/md";
import { useCallback, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import authStore from '../stores/authStore';
import axios from 'axios';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Contract } from "../initializers/ethers"
import { ethers } from 'ethers';
import { toWei, fromWei } from '../initializers/ethers';

export const CreateAndViewAsset = ({ apiKey, secretKey }) => {
    const [video, setVideo] = useState<File | undefined>();
    const [nftName, setNftName] = useState<string | undefined>();
    const [nftDescription, setNftDescription] = useState<string | undefined>();
    const [videoUrl, setVideoUrl] = useState("");
    const toast = useToast()
    const navigate = useNavigate()

    console.log(apiKey, secretKey)
    const s = authStore()


    const {
        mutate: createAsset,
        data: asset,
        status: createStatus,
        progress,
        error: createError,
    } = useCreateAsset(
        video
            ? {
                sources: [
                    {
                        name: video.name,
                        file: video,
                        playbackPolicy: {
                            type: 'webhook',
                            // This is the id of the webhook you created in step 2
                            webhookId: 'f1ed1ce1-087a-49d1-830b-e3c734b3fc30',
                            webhookContext: {
                                // This is the context you want to pass to your webhook
                                // It can be anything you want, and it will be passed back to your webhook
                            },
                        },
                    },
                ] as const,
            }
            : null,
    );

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0 && acceptedFiles?.[0]) {
            setVideo(acceptedFiles[0]);
            console.log(acceptedFiles[0], 'file');
            const file = acceptedFiles[0];
            if (file) {
                const videoUrl = URL.createObjectURL(file);
                setVideoUrl(videoUrl);
            }
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'video/*': ['.mp4'],
        },
        maxFiles: 1,
        onDrop,
    });

    const progressFormatted = useMemo(
        () =>
            progress?.[0].phase === 'failed'
                ? 'Failed to process video.'
                : progress?.[0].phase === 'waiting'
                    ? 'Waiting'
                    : progress?.[0].phase === 'uploading'
                        ? `Uploading: ${Math.round(progress?.[0]?.progress * 100)}%`
                        : progress?.[0].phase === 'processing'
                            ? `Processing: ${Math.round(progress?.[0].progress * 100)}%`
                            : null,
        [progress],
    );

    const [mintLoading, setMintLoading] = useState(false)
    const mintNFT = async (tokenURI: string) => {
        try {

            console.log(asset)
            if (!asset || !asset[0] || !asset[0].playbackUrl) return;

            const playbackId = asset[0].playbackId
            let price: number = 0.002;
            const listingPrice = await Contract.getListingPrice()
            console.log(listingPrice.toString())
            console.log(nftName, nftDescription, playbackId, tokenURI, toWei(price))

            const tx = await Contract.createAuction(
                nftName, nftDescription,
                playbackId,
                tokenURI,
                toWei(price),
                {
                    from: s.address,
                    value: toWei(0.02),
                },
            )
            await tx.wait()
            console.log(tx)
            toast({
                title: "Success",
                description: "NFT created successfully",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
            navigate("/")
        } catch (err) {
            console.log(err)
            toast({
                title: "Error",
                description: "Error minting NFT",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        }
    }

    useEffect(() => {
        console.log(asset)
        if (asset && asset[0] && asset[0].playbackId && nftName && nftDescription && apiKey && secretKey) {
            // setPlaybackId(asset[0].playbackId)
            const sendJSONtoIPFS = async () => {
                try {

                    const resJSON = await axios({
                        method: "post",
                        url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
                        data: {
                            "name": nftName,
                            "description": nftDescription,
                            "animation_url": asset[0].playbackUrl,
                            "external_url": asset[0].playbackUrl,
                            "image": "ipfs://bafkreidmlgpjoxgvefhid2xjyqjnpmjjmq47yyrcm6ifvoovclty7sm4wm",
                            "properties": {
                                "com.livepeer.playbackId": asset[0].playbackId,
                                "video": asset[0].playbackUrl,
                            }
                        },
                        headers: {
                            'pinata_api_key': `${apiKey}`,
                            'pinata_secret_api_key': `${secretKey}`,
                        },
                    });

                    const tokenURI = `ipfs://${resJSON.data.IpfsHash}`;
                    console.log("Token URI", tokenURI);
                    toast({
                        title: "Success",
                        description: `Uploaded to IPFS: ${tokenURI}`,
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    })

                    mintNFT(tokenURI);

                } catch (error) {
                    console.log("JSON to IPFS: ")
                    console.log(error);
                    toast({
                        title: "Error",
                        description: "Error uploading to IPFS",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                }
            }
            sendJSONtoIPFS()
        }
    }, [asset])


    useEffect(() => {
        console.log(createError, 'error')
        if (createError) {
            toast({
                title: "Error",
                description: "Error uploading to Livepeer",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        }
    }, [createError])


    return (
        <>
            <Box minH="100vh">

                <VStack justifyContent="center" alignItems="center" align={"left"} minH="90vh" maxW="5xl" m="auto" p="10">
                    <Heading size="xl" mb="4">
                        Create an NFT
                    </Heading>
                    <Formik
                        initialValues={{ name: '', description: '' }}
                        validationSchema={Yup.object({
                            name: Yup.string()
                                .max(20, 'Must be 20 characters or less')
                                .required('Required'),
                            description: Yup.string()
                                .max(50, 'Must be 50 characters or less')
                                .required('Required'),
                        })}
                        onSubmit={(values, actions) => {
                            setNftName(values.name)
                            setNftDescription(values.description)
                            createAsset?.()
                        }}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit} style={{ width: '60%' }}>
                                <VStack spacing={10} m="auto">
                                    <FormControl
                                        isInvalid={!!formik.errors.name && formik.touched.name}
                                    >
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
                                    <FormControl
                                        isInvalid={
                                            !!formik.errors.description && formik.touched.description
                                        }
                                    >
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
                                        {!video ? <VStack mb="4"
                                            {...getRootProps()}
                                        >
                                            <input {...getInputProps()} />
                                            <Icon color="gray.500" border="1px solid" borderColor={"gray.500"} rounded="full" h="8" w="8" as={MdAdd} />
                                            <Text color="gray.500" fontSize="lg" fontWeight="bold">
                                                Upload your file
                                            </Text>
                                        </VStack> :
                                            <VStack {...getRootProps()}>
                                                {videoUrl && <video style={{ height: "30vh", margin: "auto", width: "auto" }} src={videoUrl} width="100%" controls />}
                                                <Text color="gray.500" fontSize="lg" fontWeight="bold"
                                                >
                                                    {video.name}
                                                </Text>
                                            </VStack>}
                                    </Box>
                                    {progressFormatted && progress !== undefined && (
                                        <Center w="full">
                                            <Box w="50%">
                                                <Progress
                                                    value={progress?.[0]?.progress * 100}
                                                    size="sm"
                                                    colorScheme="teal"
                                                    mb="4"
                                                />
                                                <Text textAlign="center">{progressFormatted}</Text>
                                            </Box>
                                        </Center>
                                    )}
                                    <Button
                                        isLoading={createStatus === 'loading'}
                                        loadingText="Uploading..."
                                        type="submit" w="100%">
                                        Submit & Mint
                                    </Button>
                                </VStack>
                            </form>
                        )}
                    </Formik>
                </VStack>
            </Box>
        </>
    );
};

