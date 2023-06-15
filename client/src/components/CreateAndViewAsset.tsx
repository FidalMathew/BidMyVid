import { Box, Button, Text } from '@chakra-ui/react';
import { useCreateAsset } from '@livepeer/react';
import React, { ChangeEvent, useEffect } from 'react';

import { useCallback, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import authStore from '../stores/authStore';


export const CreateAndViewAsset = ({ apiKey, secretKey }) => {
    const [video, setVideo] = useState<File | undefined>();
    const [nftName, setNftName] = useState<string | undefined>();
    const [nftDescription, setNftDescription] = useState<string | undefined>();

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
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
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
                    // mintNFT(tokenURI, s.address)   

                } catch (error) {
                    console.log("JSON to IPFS: ")
                    console.log(error);
                }
            }
            sendJSONtoIPFS()
        }
    }, [asset])


    return (
        <>
            <Box {...getRootProps()}>
                <input {...getInputProps()} />
                <Text>Drag and drop or browse files</Text>
            </Box>

            {createError?.message && <Text>{createError.message}</Text>}

            {video ? <Text>{video.name}</Text> : <Text>Select a video file to upload.</Text>}
            {progressFormatted && <Text>{progressFormatted}</Text>}

            <input type="text" placeholder='name of Video NFT' onChange={(event) => setNftName(event.target.value)} />
            <input type="text" placeholder='description of Video NFT' onChange={(event) => setNftDescription(event.target.value)} />
            <Button
                onClick={() => {
                    createAsset?.();
                }}
                disabled={!createAsset || createStatus === 'loading'}
            >
                Upload
            </Button>
        </>
    );
};