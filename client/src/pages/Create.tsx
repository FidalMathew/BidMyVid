import React from 'react'
import { CreateAndViewAsset } from '../components/CreateAndViewAsset'
import Navbar from '../components/Navbar'

const Create = ({ apiKey, secretKey }) => {
    // console.log(apiKey, secretKey)
    return (
        <>
            <Navbar/>
            <CreateAndViewAsset apiKey={apiKey} secretKey={secretKey} />
        </>

    )
}

export default Create
