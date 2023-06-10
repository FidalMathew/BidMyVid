import './App.css'

import {
  LivepeerConfig,
  // ThemeConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
import { Livepeer } from './pages/Livepeer';

const VITE_LIVEPEER_STUDIO_API_KEY = import.meta.env.VITE_LIVEPEER_STUDIO_API_KEY;

console.log('VITE_LIVEPEER_STUDIO_API_KEY', VITE_LIVEPEER_STUDIO_API_KEY);

const client = createReactClient({
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

function App() {
  return (
    <LivepeerConfig client={client} theme={livepeerTheme}>
      <Livepeer />
    </LivepeerConfig>
  );
}
export default App
