import axios from 'axios'
import create from 'zustand'
import { provider, signer } from '../initializers/ethers'
import { SiweMessage } from 'siwe'
import { useEffect } from 'react'




type TAuthStore = {
  address: string
  ready: boolean
  loggedIn: boolean
  connectWallet(): void
  signin(): void
  init(): void
  messageStore: string
  signatureStore: string
  nonceStore: string
}

const backend_url = "http://localhost:5000"

let sig = localStorage.getItem("sig")

export const authStore = create<TAuthStore>((set) => ({

  address: '',
  loggedIn: false,
  messageStore: '',
  signatureStore: '',
  nonceStore: '',
  ready: false,

  init: async () => {
    try {
      // const res = await axios.get(backend_url + '/api/validate')
      const accounts = await provider.listAccounts()

      if (accounts[0]) {
        set({ ready: true, address: accounts[0] })
      } else {
        set({ ready: true })
      }

      if (sig) {
        set({ ready: true, signatureStore: sig })
      }
      else
        set({ loggedIn: false, ready: true })
    } catch (err) {
      console.log(err)
    }
  },

  connectWallet: async () => {
    const accounts = await provider
      .send('eth_requestAccounts', [])
      .catch(() => console.log('user rejected request'))

    if (accounts[0]) {
      set({ address: accounts[0] })
    }
  },

  signin: async () => {
    try {
      // Get nonce
      const res = await axios.get(backend_url + '/api/nonce')

      // Create message
      const messageRaw = new SiweMessage({
        domain: window.location.host,
        address: await signer.getAddress(),
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: 1,
        nonce: res.data,
      })
      set({ nonceStore: res.data })

      const message = messageRaw.prepareMessage()
      set({ messageStore: message })
      // Get signature
      const signature = await signer.signMessage(message)
      set({ signatureStore: signature })
      localStorage.setItem("sig", signature)
      // Send to server
      console.log({ message, signature, wallet: await signer.getAddress() });
      const res2 = await axios.post(backend_url + '/api/verify', { message, signature, wallet: await signer.getAddress() })

      set({ loggedIn: true })
    } catch (err) {

      console.log(err)
    }
  },
}))

export default authStore