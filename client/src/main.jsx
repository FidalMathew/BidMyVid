import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Buffer } from 'buffer';
Buffer.from('anything', 'base64');
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  initialColorMode: "dark",
  useSystemColorMode: true,
  colors: {
    light: {},
    dark: {}
  },
  fonts:{
    // inter font
    body: 'Inter, sans-serif',
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ChakraProvider>
)
