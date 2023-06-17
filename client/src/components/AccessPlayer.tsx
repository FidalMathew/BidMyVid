import { Player } from '@livepeer/react';
import React, { useState } from 'react';
import authStore from '../stores/authStore';
import { useEffect } from 'react';
import axios from 'axios'

export const AccessPlayer = ({ playbackId }) => {

    const [accessKey, setAccessKey] = useState("")
    const [sig, setSig] = useState("")
    const s = authStore()
    console.log(s)


    let access;
    const backend_url = "http://localhost:5000"
    useEffect(() => {
        if (s.address && s.signatureStore) {
            access = s.address + "$" + s.signatureStore

            if (!accessKey) {
                setAccessKey(access)
            }
        }
        const func = async () => {
            // console.log("6666666666666666")
            // console.log(access)
            try {
                const res = await axios.post(backend_url + "/api/check-access", { accessKey: access })
                console.log(res.status)
            } catch (error) {
                console.log(error)
            }
        }
        if (access !== undefined) {
            func()
        }
    }, [s])

    // const playbackId = "dd06al7r1jqniyhf"
    // console.log("accessKey: ", accessKey)
    return (<>{
        accessKey ? <Player playbackId={playbackId} accessKey={accessKey} /> : <div>Access Key is not available</div>
    }
    </>
    )

};