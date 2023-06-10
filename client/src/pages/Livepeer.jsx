import { Player } from '@livepeer/react';
// import * as React from 'react';
import pic from '../assets/react.svg';

// import waterfallsPoster from '../../public/images/waterfalls-poster.png';

const PosterImage = () => {
    // return (
    //     <Image
    //         src={pic}
    //         layout="fill"
    //         objectFit="cover"
    //         priority
    //         placeholder="blur"
    //     />
    // );

    return (
        <img
            src={pic}
            alt="Picture of the author"

            placeholder="blur"
        />)
};

const playbackId =
    'bafybeigtqixg4ywcem3p6sitz55wy6xvnr565s6kuwhznpwjices3mmxoe';

export function Livepeer() {
    return (
        <Player
            title="Waterfalls"
            playbackId={playbackId}
            loop
            autoPlay
            showTitle={false}
            muted
            poster={<PosterImage />}
        />
    );
}

