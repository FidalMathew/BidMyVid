import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

function Profile() {
    const { address, isConnected } = useAccount()

    const { data, isError, isLoading } = useEnsAvatar({
        address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    })

    if (isLoading) return <div>Fetching avatar…</div>
    if (isError) return <div>Error fetching avatar</div>
    //   return <div>Avatar: {data}</div>

    const { data: ensName } = useEnsName({ address })
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    if (isConnected) return <div>Connected to {ensName ?? address}</div>
    return (
        <div>{
            isConnected ? (
                <>
                    <div>Connected to {ensName ?? address}</div>
                    <div>Avatar: {data}</div>
                    <button onClick={() => disconnect()}>Disconnect Wallet</button>
                </>
            )
                : < button onClick={() => connect()} > Connect Wallet</button >

        }
        </div >
    )

}

export default Profile
