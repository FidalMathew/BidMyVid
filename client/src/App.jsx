import './App.css'

import {
  LivepeerConfig,
  // ThemeConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
// import { Livepeer } from './pages/Livepeer';
// import { CreateAndViewAsset } from './components/CreateAndViewAsset';
import { AccessPlayer } from './pages/AccessPlayer';

import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import Profile from './pages/Profile';

const VITE_LIVEPEER_STUDIO_API_KEY = import.meta.env.VITE_LIVEPEER_STUDIO_API_KEY;
// console.log('VITE_LIVEPEER_STUDIO_API_KEY', VITE_LIVEPEER_STUDIO_API_KEY);

const clientLivepeer = createReactClient({
  provider: studioProvider({ apiKey: VITE_LIVEPEER_STUDIO_API_KEY }),
});

const livepeerTheme = {
  colors: {
    accent: 'rgb(0, 145, 255)',
    containerBorderColor: 'rgba(0, 145, 255, 0.9)',
  },
  fonts: {
    display: 'Inter',
  },
};

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()],
)


const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})


function App() {
  return (
    <WagmiConfig client={client}>
      <LivepeerConfig client={clientLivepeer} theme={livepeerTheme}>
        {/* <Livepeer /> */}
        {/* <CreateAndViewAsset /> */}
        <Profile />
        <AccessPlayer />
      </LivepeerConfig>
    </WagmiConfig>
  );
}
export default App
