
import { BrowserProvider } from 'ethers';
import { useState } from 'react';
// import { SiweMessage } from 'siwe';

function Profile() {

    const domain = window.location.host;
    const origin = window.location.origin;
    const provider = new BrowserProvider(window.ethereum);

    const BACKEND_ADDR = "http://localhost:5000";

    const [account, setAccount] = useState(null);

    async function connectWallet() {

        const account = await provider.send('eth_requestAccounts', [])
            .catch(() => console.log('user rejected request'));
        console.log(account);
        setAccount(account);

    }

    return (
        <div>
            {
                account ? account :
                    <button onClick={connectWallet}>Connect Wallet</button>
            }
            {/*    <button onClick={signInWithEthereum}>Sign in with Ethereum</button>
            <button onClick={sendForVerification}>Send for verification</button> */}
            Hello
        </div >
    )

}

export default Profile
