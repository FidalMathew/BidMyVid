import React from 'react'
import { CreateAndViewAsset } from '../components/CreateAndViewAsset'

const Create = ({ apiKey, secretKey }) => {
    // console.log(apiKey, secretKey)
    return (
        <>
            <CreateAndViewAsset apiKey={apiKey} secretKey={secretKey} />
        </>

    )
}

export default Create
