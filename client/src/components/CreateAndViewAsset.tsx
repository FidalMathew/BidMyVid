import { useCreateAsset } from '@livepeer/react';
import React, { ChangeEvent } from 'react';

import { useCallback, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

export const CreateAndViewAsset = () => {
    const [video, setVideo] = useState<File | undefined>();
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
                                assetId: "abcd1234",
                                userId: "user5678"
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
    console.log(asset)

    return (
        <>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag and drop or browse files</p>
            </div>

            {createError?.message && <p>{createError.message}</p>}

            {video ? <p>{video.name}</p> : <p>Select a video file to upload.</p>}
            {progressFormatted && <p>{progressFormatted}</p>}

            <button
                onClick={() => {
                    createAsset?.();
                }}
                disabled={!createAsset || createStatus === 'loading'}
            >
                Upload
            </button>
        </>
    );
};