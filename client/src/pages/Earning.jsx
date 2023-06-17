import { Flex, HStack, Icon, chakra, Text, VStack } from "@chakra-ui/react"
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
        const res = await db.collection("BidKaro").where("buyer", "==", s.address).get();
        // console.log(res.data[0]?.data)
        setTransactions(res.data)
      }
      catch (err) {
        console.log(err)
      }

    }
    func()
  }, [s])
  return (
    // Centered text in the middle of the page
    <>
      <Navbar />
      <Flex minH="100vh" alignItems="center" justifyContent="center" direction={"column"}>
        {/* <HStack>
          <Icon as={FiArrowLeft} onClick={() => {
            navigate(-1)
          }} cursor={"pointer"} />
          <Text fontSize="sm">Go Back</Text>
        </HStack> */}
        <VStack direction={"column"} spacing={3}>
          <Text fontSize="5xl">Your Transactions</Text>
        </VStack>
        <TableContainer w={{
          base: "90%",
          md: "70%",
        }} m="auto">
          <Table variant='simple' marginTop={"40px"}>
            <Thead>
              <Tr>
                <Th>NFT ID</Th>
                <Th>Amount</Th>
                <Th>Time of Sale</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions && transactions.map((transaction) => (
                <Tr>
                  <Td>{transaction.data.tokenId}</Td>
                  <Td>{fromWei(transaction.data.amount) + " ETH"}</Td>
                  <Td>{new Date(transaction.data.timestamp).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </>
  )
}

export default Earning
