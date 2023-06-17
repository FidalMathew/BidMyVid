// import React from 'react'
import { useEffect, useState } from 'react'
import { fetchNotifs, signer } from '../initializers/ethers'
import authStore from '../stores/authStore'
import { Text } from '@chakra-ui/react';
import * as PushAPI from "@pushprotocol/restapi";

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const s = authStore()
    useEffect(() => {

        const fetchNotifications = async () => {

            const res = await fetchNotifs(s.address);
            let arr = [];
            res.map((notif) => {
                let obj = {
                    title: notif.notification.title,
                    message: notif.notification.body,
                }
                arr.push(obj)
            })
            setNotifications(arr)
        }
        if (s.address)
            fetchNotifications()
    }, [s])

    console.log(signer)


    return (
        <div>
            {
                notifications.map((notif) => {
                    return (
                        <>
                            <Text>{notif.title}</Text>
                            <Text>{notif.message}</Text>
                        </>
                    )
                })
            }

            {/* <button onClick={() => sendNotification()}>Send</button> */}
        </div>
    )
}

export default Notifications