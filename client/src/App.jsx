import './App.css'

import {
  LivepeerConfig,
  // ThemeConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
// import { CreateAndViewAsset } from './components/CreateAndViewAsset';
// import { AccessPlayer } from './pages/AccessPlayer';
// import Profile from './pages/Profile';
import Home from './pages/Home';
import Login from './pages/Login';
import Create from './pages/Create';
import RequireAuth from './components/RequireAuth'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import authStore from './stores/authStore';
import { useEffect } from 'react';
import Videopage from './components/Videopage';
import Profilepage from './pages/Profilepage';
import Earning from './pages/Earning';
import AuctionBiddingpage from './AuctionBiddingpage';
import Notifications from './pages/Notifications';

const VITE_LIVEPEER_STUDIO_API_KEY = import.meta.env.VITE_LIVEPEER_STUDIO_API_KEY;
console.log(VITE_LIVEPEER_STUDIO_API_KEY, 'api key')
const VITE_PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY || '';
const VITE_PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY || '';
const polybaseKey = import.meta.env.VITE_POLYBASE_KEY || '';
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




function App() {

  const s = authStore()

  useEffect(() => {
    if (s) {
      s.init()
    }
  }, [])

  return (
    <LivepeerConfig client={clientLivepeer} theme={livepeerTheme}>
      <BrowserRouter>
        <Routes>
          <Route index element={<RequireAuth element={<Home />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create apiKey={VITE_PINATA_API_KEY} secretKey={VITE_PINATA_SECRET_API_KEY} />} />
          <Route path="/videos/:id" element={<Videopage />} />
          <Route path="/profile/:id" element={<Profilepage />} />
          <Route path="/earning" element={<Earning polyKey={polybaseKey} />} />
          <Route path="/bid/:id" element={<AuctionBiddingpage polyKey={polybaseKey} />} />
          <Route path="/notification" element={<Notifications />} />
        </Routes>
      </BrowserRouter>
    </LivepeerConfig>
  );
}
export default App
