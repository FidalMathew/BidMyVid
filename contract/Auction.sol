//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Auction is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private totalItems;

    address contractOwner;
    uint listingPrice = 0.0002 ether;
    uint256 auctionDuration = 360 seconds; // 5 mins - demo purposes
    uint creatorFee;

    mapping(uint => AuctionStruct) auctionedItem;
    mapping(uint => bool) checkAuctionItemExist;
    mapping(uint => BidderStruct[]) tokenBidders;

    mapping(address => uint256) earnings;

    constructor(uint _creatorFee) ERC721("BidMyVideo Tokens", "MBV") {
        contractOwner = msg.sender;
        creatorFee = _creatorFee;
    }

    struct BidderStruct {
        address bidder;
        uint price;
        uint timestamp;
        bool refunded;
        bool won;
    }

    struct AuctionStruct {
        string name;
        string description;
        string playbackId;
        uint tokenId;
        address creator;
        address owner;
        address winner;
        uint price;
        bool live;
        uint bids;
        uint endTime;
    }

    event AuctionItemCreated(
        uint indexed tokenId,
        address creator,
        address owner,
        uint price
    );

    function getListingPrice() public view returns (uint) {
        return listingPrice;
    }

    function setListingPrice(uint _price) public {
        require(msg.sender == contractOwner, "Unauthorized entity");
        listingPrice = _price;
    }

    function getEarnings(address user) public view returns (uint256) {
        return earnings[user];
    }

    function mintToken(string memory tokenURI) internal returns (bool) {
        totalItems.increment();
        uint tokenId = totalItems.current();

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return true;
    }

    function payTo(address to, uint amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }

    function createAuction(
        string memory name,
        string memory description,
        string memory playbackId,
        string memory tokenURI,
        uint price
    ) public payable nonReentrant {
        require(price > 0 ether, "Sales price must be greater than 0 ethers.");
        require(
            msg.value >= listingPrice,
            "Price must be up to the listing price."
        );
        require(mintToken(tokenURI), "Could not mint token");

        uint tokenId = totalItems.current();

        AuctionStruct memory item;
        item.tokenId = tokenId;
        item.name = name;
        item.description = description;
        item.playbackId = playbackId;
        item.price = price;
        item.endTime = 0;
        item.creator = msg.sender;
        item.owner = msg.sender;

        auctionedItem[tokenId] = item;
        checkAuctionItemExist[tokenId] = true;

        payTo(contractOwner, listingPrice);

        emit AuctionItemCreated(tokenId, msg.sender, address(0), price);
    }

    function offerAuction(uint tokenId) public {
        require(
            auctionedItem[tokenId].owner == msg.sender,
            "Unauthorized entity"
        );
        require(
            auctionedItem[tokenId].bids == 0,
            "Winner should claim prize first"
        );

        if (!auctionedItem[tokenId].live) {
            setApprovalForAll(address(this), true);
            IERC721(address(this)).transferFrom(
                msg.sender,
                address(this),
                tokenId
            );
        }

        auctionedItem[tokenId].bids = 0;
        auctionedItem[tokenId].live = true;
        auctionedItem[tokenId].endTime = block.timestamp + auctionDuration;
    }

    function placeBid(uint tokenId) public payable {
        require(
            msg.value >= auctionedItem[tokenId].price,
            "Insufficient Amount"
        );
        require(
            auctionedItem[tokenId].endTime > block.timestamp,
            "Auction not available"
        );
        require(auctionedItem[tokenId].live == true, "Auction not live");

        BidderStruct memory bidder;
        bidder.bidder = msg.sender;
        bidder.price = msg.value;
        bidder.timestamp = block.timestamp;

        tokenBidders[tokenId].push(bidder);
        auctionedItem[tokenId].bids++;
        auctionedItem[tokenId].price = msg.value;
        auctionedItem[tokenId].winner = msg.sender;
    }

    function claimPrize(uint tokenId, uint bid) public {
        require(
            block.timestamp > auctionedItem[tokenId].endTime,
            "Auction still Live"
        );
        require(
            auctionedItem[tokenId].winner == msg.sender,
            "You are not the winner"
        );

        tokenBidders[tokenId][bid].won = true;
        uint price = auctionedItem[tokenId].price;
        address creator = auctionedItem[tokenId].creator;

        auctionedItem[tokenId].winner = address(0);
        auctionedItem[tokenId].live = false;
        auctionedItem[tokenId].bids = 0;
        auctionedItem[tokenId].endTime = 0;

        uint fee = (price * creatorFee) / 100;

        earnings[auctionedItem[tokenId].owner] =
            earnings[auctionedItem[tokenId].owner] +
            (price - fee); // earnings
        payTo(auctionedItem[tokenId].owner, (price - fee));
        payTo(creator, fee);

        IERC721(address(this)).transferFrom(address(this), msg.sender, tokenId);
        auctionedItem[tokenId].owner = msg.sender;

        performRefund(tokenId);
    }

    function performRefund(uint tokenId) internal {
        for (uint i = 0; i < tokenBidders[tokenId].length; i++) {
            if (tokenBidders[tokenId][i].bidder != msg.sender) {
                tokenBidders[tokenId][i].refunded = true;

                payTo(
                    tokenBidders[tokenId][i].bidder,
                    tokenBidders[tokenId][i].price
                );
            } else {
                tokenBidders[tokenId][i].won = true;
            }
            tokenBidders[tokenId][i].timestamp = 0;
        }

        delete tokenBidders[tokenId];
    }

    function backToItem(uint tokenId) public {
        require(
            auctionedItem[tokenId].owner == msg.sender,
            "You're not the owner"
        );

        require(
            block.timestamp > auctionedItem[tokenId].endTime,
            "Auction still Live"
        );

        require(auctionedItem[tokenId].winner == address(0), "Someone bidded");

        require(auctionedItem[tokenId].bids == 0, "Bids present");

        IERC721(address(this)).transferFrom(address(this), msg.sender, tokenId);
        auctionedItem[tokenId].live = false;
        auctionedItem[tokenId].endTime = 0;
    }

    function getAuction(uint id) public view returns (AuctionStruct memory) {
        require(checkAuctionItemExist[id], "Auctioned Item not found");
        return auctionedItem[id];
    }

    function getAuctionOwner(uint id) public view returns (address) {
        require(checkAuctionItemExist[id], "Auctioned Item not found");
        return auctionedItem[id].owner;
    }

    function getBidders(
        uint tokenId
    ) public view returns (BidderStruct[] memory) {
        return tokenBidders[tokenId];
    }

    function getAllAuctions()
        public
        view
        returns (AuctionStruct[] memory Auctions)
    {
        uint totalItemsCount = totalItems.current();
        Auctions = new AuctionStruct[](totalItemsCount);

        for (uint i = 0; i < totalItemsCount; i++) {
            Auctions[i] = auctionedItem[i + 1];
        }
    }
}
