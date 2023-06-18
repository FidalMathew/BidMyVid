import { Player } from '@livepeer/react';
import React, { useState } from 'react';
import authStore from '../stores/authStore';
import { useEffect } from 'react';
import axios from 'axios'

export const AccessPlayer = ({ playbackId, tokenId }) => {

    const [accessKey, setAccessKey] = useState("")
    const [sig, setSig] = useState("")
    const s = authStore()
    console.log(s)


    let access;
    const backend_url = "https://hack-fs-ethglobal-production.up.railway.app"
    useEffect(() => {
        if (s.address && s.signatureStore) {
            access = s.address + "$" + s.signatureStore + "$" + tokenId

            if (!accessKey) {
                setAccessKey(access)
            }
        }
        const func = async () => {
            // console.log("6666666666666666")
            // console.log(access)
            try {
                console.log("accessKey: ", access + "$" + tokenId)
                const res = await axios.post(backend_url + "/api/check-access", { accessKey: access + "$" + tokenId })
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
    console.log("SAAAAAAAAAAAAAA ", playbackId, accessKey)
    return (<>{
        accessKey ? <Player playbackId={playbackId} accessKey={accessKey} /> : <div>Access Key is not available</div>
    }
    </>
    )

};