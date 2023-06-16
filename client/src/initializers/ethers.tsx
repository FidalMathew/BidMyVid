import { ethers } from 'ethers'
import contractABI from './contractABI.json'
// @ts-ignore
export const provider = new ethers.providers.Web3Provider(window.ethereum)
export const signer = provider.getSigner()

const contractAddress = "0xA0b49A74F0140883d4bBfef3Ec8D0bdA682528A2"
export const Contract = new ethers.Contract(contractAddress, contractABI, signer)


export const toWei = (num: number) => ethers.utils.parseEther(num.toString())
export const fromWei = (num: number) => ethers.utils.formatEther(num)