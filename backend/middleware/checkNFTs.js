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


const contractAddress = "0x88AF2064b973cb6918363b9B00Ee61A5Cb6871a8"

const checkNFTs = async (userAddress, tokenId) => {

    const nfts = await alchemy.nft.getNftsForOwner(userAddress);
    // Print NFTs
    console.log(nfts);
    nfts.ownedNfts.map((nft) => {
        if (nft.tokenId === tokenId) return true;
    })

    return false;
}

// console.log(checkNFTs("0xecC6E5aA22E2Bb7aDD9296e5E7113E1A44C4D736", "1"))
module.exports = { checkNFTs };