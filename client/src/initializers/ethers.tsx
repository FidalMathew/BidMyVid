import { ethers } from 'ethers'
import contractABI from './contractABI.json'
// @ts-ignore
export const provider = new ethers.providers.Web3Provider(window.ethereum)
export const signer = provider.getSigner()

const contractAddress = "0xA0b49A74F0140883d4bBfef3Ec8D0bdA682528A2"
export const Contract = new ethers.Contract(contractAddress, contractABI, signer)


export const toWei = (num: number) => ethers.utils.parseEther(num.toString())
export const fromWei = (num: number) => ethers.utils.formatEther(num)

import * as PushAPI from "@pushprotocol/restapi";

export const fetchNotifs = async (address: string) => {
    const notifications = await PushAPI.user.getFeeds({
        user: `eip155:42:${address}`, // user address in CAIP-10
        env: 'staging'
    });

    console.log('Notifications: \n', notifications);
    return notifications;
}

export const optIn = async (chAddress: string, usAddress: string) => {
    await PushAPI.channels.subscribe({
        signer: signer,
        channelAddress: `eip155:5:${chAddress}`, // channel address in CAIP
        userAddress: `eip155:5:${usAddress}`, // user address in CAIP
        onSuccess: () => {
            console.log('opt in success');
        },
        onError: () => {
            console.error('opt in error');
        },
        env: 'staging'
    })
}

export const optOut = async (chAddress: string, usAddress: string) => {
    await PushAPI.channels.unsubscribe({
        signer: signer,
        channelAddress: `eip155:5:${chAddress}`, // channel address in CAIP
        userAddress: `eip155:5:${usAddress}`, // user address in CAIP
        onSuccess: () => {
            console.log('opt out success');
        },
        onError: () => {
            console.error('opt out error');
        },
        env: 'staging'
    })
}

export const sendNotification = async (address: string) => {
    const apiResponse = await PushAPI.payloads.sendNotification({
        signer: signer,
        type: 1, // broadcast
        identityType: 2, // direct payload
        notification: {
            title: `[SDK-TEST] notification TITLE:`,
            body: `[sdk-test] notification BODY`
        },
        payload: {
            title: `[sdk-test] payload title`,
            body: `sample msg body`,
            cta: '',
            img: ''
        },
        channel: `eip155:5:${address}`, // your channel address
        env: 'staging'
    });

    console.log(apiResponse)

}

export const following = async (address: string) => {
    const subscriptions = await PushAPI.user.getSubscriptions({
        user: `eip155:5:${address}`, // user address in CAIP
        env: 'staging'
    });
    console.log(subscriptions)
    return subscriptions
}

export const followers = async (address: string) => {
    const subscribers = await PushAPI.channels.getSubscribers({
        channel: `eip155:5:${address}`, // channel address in CAIP
        page: 1, // Optional, defaults to 1
        limit: 10, // Optional, defaults to 10
        env: 'staging' // Optional, defaults to 'prod'
    });

    return subscribers
}

export const getChannel = async (address: string) => {
    try {

        const channelData = await PushAPI.channels.getChannel({
            channel: `eip155:5:${address}`, // channel address in CAIP
            env: 'staging'
        });
        console.log(channelData)
        return true;

    } catch (error) {
        return false
    }
}