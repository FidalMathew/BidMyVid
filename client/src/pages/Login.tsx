import React from 'react'
import { Navigate } from 'react-router-dom'
import authStore from '../stores/authStore'
import { Box, Button, Center } from '@chakra-ui/react'

export default function Login() {
    const s = authStore()

    if (s.loggedIn) return <Navigate to="/" />

    return (
        <Center minH="100vh">
            {s.address === '' ? (
                <>
                    <Button onClick={s.connectWallet}>Connect wallet</Button>
                </>
            ) : (
                <>
                    <Button onClick={s.signin}>Sign in</Button>
                </>
            )}
        </Center>
    )
}
