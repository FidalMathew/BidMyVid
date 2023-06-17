import { Box, Text, VStack } from "@chakra-ui/react"
import Cards from "../components/Cards"
import ToggleTheme from "../components/Toggletheme"
import Navbar from "../components/Navbar"
import * as React from 'react'

import { Contract } from "../initializers/ethers"

const Homecomponent = () => {
    const convertDateAndTime = (timestamp) => {
        const decimalTimestamp = parseInt(timestamp.substring(2), 16);
        const date = new Date(decimalTimestamp * 1000);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return formattedDateTime;
    };
    const [auctionitems, setAuctionItems] = React.useState([])

    React.useEffect(() => {
        const getAllAuctions = async () => {
            let arr: any = [];
            const res = await Contract.getAllAuctions()
            res.map((item: any) => {

                if (item.live) {

                    let values = {
                        biddable: item.biddable,
                        bids: Number(item.bids._hex),
                        description: item.description,
                        endTime: convertDateAndTime(item.endTime._hex),
                        image: item.image,
                        live: item.live,
                        name: item.name,
                        owner: item.owner,
                        price: Number(item.price),
                        sold: item.sold,
                        tokenId: Number(item.tokenId),
                        winner: item.winner,
                    }
                    arr.push(values);
                }
            })
            console.log(arr)
            setAuctionItems(arr)
        }
        getAllAuctions()
    }, [Contract])


    return (
        <>
            <Navbar />
            <Box>
                <Text fontSize="4xl" textAlign="center" fontWeight="bold" mt="10"></Text>
                <VStack>
                    {auctionitems.map((item: any, index: any) => {
                        return <Cards auctionItem={item} key={index} />
                    })}
                </VStack>
            </Box>
        </>
    )
}

export default Homecomponent
