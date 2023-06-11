import { Player } from '@livepeer/react';
import React from 'react';

export const AccessPlayer = () => {
    // const accessKey = getAccessKeyForYourApplication();
    const accessKey = "access"
    const playbackId = "dd06al7r1jqniyhf"
    return <Player playbackId={playbackId} accessKey={accessKey} />;
};