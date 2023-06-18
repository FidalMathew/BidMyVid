import { Flex, HStack, Icon, chakra, Text, VStack, Heading } from "@chakra-ui/react"
import { FiArrowLeft } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import authStore from "../stores/authStore"
import { Polybase } from "@polybase/client"
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { fromWei } from "../initializers/ethers"

const Earning = ({ polyKey }) => {
  const navigate = useNavigate()

  const s = authStore();
  const db = new Polybase({
    defaultNamespace: polyKey
  });
  const [transactions, setTransactions] = useState([])
  useEffect(() => {
    const func = async () => {
      try {
        const res = await db.collection("BidMyVid").where("owner", "==", s.address).get();
        // console.log(res.data[0]?.data)
        setTransactions(res.data)
      }
      catch (err) {
        console.log(err)
      }

    }
    // const func2 = async () => {
    //   try {
    //     const res = await db.collection("BidMyVid").where("owner", "==", s.address).get();
    //     // console.log(res.data[0]?.data)
    //     setBoughtTrans(res.data)
    //   }
    //   catch (err) {
    //     console.log(err)
    //   }
    // }
    func()
    // func2()
  }, [s])

  return (
    // Centered text in the middle of the page
    <>
      <Navbar />
      <VStack minH="100vh" direction={"column"}>
        <Heading mt={10} mb={10} textAlign={"center"}>Transactions</Heading>
        {
          transactions.length === 0 ? <Text textAlign={"center"}>No transactions yet</Text> :
            <TableContainer w={{ base: "100%", md: "70%" }}>
              <Table variant='unstyled' size={"lg"}>
                <Thead>
                  <Tr>
                    <Th>NFT ID</Th>
                    <Th>Amount</Th>
                    <Th>Time of Sale</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions && transactions.map((transaction, index) => (
                    <Tr key={index}>
                      <Td>{transaction.data.tokenId}</Td>
                      {
                        (transaction.data.owner === s.address) ?
                          <Td>{fromWei(transaction.data.amount) + " ETH"}</Td> :
                          <Td>{- fromWei(transaction.data.amount) + " ETH"}</Td>
                      }
                      <Td>{new Date(transaction.data.timestamp).toLocaleDateString()}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>}
      </VStack>
    </>
  )
}

export default Earning
