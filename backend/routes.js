const express = require("express");
const router = express.Router();
// const fs = require("fs");
const authController = require('./controllers/authController')
const requireAuth = require('./middleware/requireAuth')
const mongoose = require('mongoose')
const StealVideo = require("./models/steal")

const { checkNFTs } = require('./middleware/checkNFTs')
// Auth
router.get('/api/nonce', authController.Nonce)
router.post('/api/verify', authController.Verify)
router.post('/api/validate', authController.Validate)

router.post('/api/check-access', async (req, res) => {
  try {
    const { accessKey } = req.body;
    const splitedValues = accessKey.split("$")
    // console.log(splitedValues)
    const existingObject = await StealVideo.findOne({ wallet: splitedValues[0], signature: splitedValues[1] })
    if (existingObject) {
      try {
        const tokenId = splitedValues[2]
        console.log(tokenId)
        const check = await checkNFTs(splitedValues[0], tokenId)
        if (check == false)
          return res.status(422).json({ message: "Invalid Access" })

        return res.status(200).json("Data Verified succesfully")

      } catch (error) {
        return res.status(422).json({ message: "Invalid Access" })
      }

    } else {
      return res.status(422).json({ message: "Invalid Access" })
    }

  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ message: error })
  }

})


module.exports = router;
