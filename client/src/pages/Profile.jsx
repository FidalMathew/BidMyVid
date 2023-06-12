import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

function Profile() {
    const { address, isConnected } = useAccount()

    const { data, isError, isLoading } = useEnsAvatar({
        address: address,
    })

    if (isLoading)
        console.log('isLoading', isLoading);
    if (isError)
        console.log('isError', isError);

    // const add = '0xecC6E5aA22E2Bb7aDD9296e5E7113E1A44C4D736'
    const { data: ensName } = useEnsName({ address })
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    // if (isConnected) return <div>Connected to {ensName ?? address}</div>
    return (
        <div>{
            isConnected ? (
                <>
                    <div>Connected to {ensName ?? address}</div>

                    {/* <div>Avatar: {data}</div> */}
                    <button onClick={() => disconnect()}>Disconnect Wallet</button>
                </>
            )
                : < button onClick={() => connect()} > Connect Wallet</button >

        }
        </div >
    )

}

export default Profile
