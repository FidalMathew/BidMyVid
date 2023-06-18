// Setup
const { Network, Alchemy } = require('alchemy-sdk')

const settings = {
    apiKey: "zvHiRctLU05rjtA-c4rVIqygGk2NhAu4",
    network: Network.MATIC_MUMBAI,
};


const alchemy = new Alchemy(settings);

const opts = {
    pageKey: "4756",
    omitMetadata: true,
    pageSize: 3,
    tokenUriTimeoutInMs: 0,
};


const contractAddress = "0xB0959E1F19713D0F948e4949B1cBA871fFFB904f"

const checkNFTs = async (userAddress, tokenId) => {

    const nfts = await alchemy.nft.getNftsForOwner(userAddress);
    // Print NFTs
    console.log(nfts);

    let ans = false;

    for (let i = 0; i < nfts.ownedNfts.length; i++) {
        if (nfts.ownedNfts[i].contract.address === contractAddress.toLowerCase()) {
            if (String(nfts.ownedNfts[i].tokenId) === String(tokenId)) {
                ans = true;
                break;
            }
        }
    }

    return ans;
}

// console.log(checkNFTs("0xecC6E5aA22E2Bb7aDD9296e5E7113E1A44C4D736", "1"))
module.exports = { checkNFTs };