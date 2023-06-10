import { Player } from '@livepeer/react';

export const CreateAndViewAsset = () => {
    const accessKey = getAccessKeyForYourApplication();

    return <Player playbackId={playbackId} accessKey={accessKey} />;
};