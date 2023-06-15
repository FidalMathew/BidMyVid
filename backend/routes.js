const express = require("express");
const router = express.Router();
// const fs = require("fs");
const authController = require('./controllers/authController')
const requireAuth = require('./middleware/requireAuth')
const mongoose = require('mongoose')
const StealVideo = require("./models/steal")

// Auth
router.get('/api/nonce', authController.Nonce)
router.post('/api/verify', authController.Verify)
router.get('/api/validate', requireAuth, authController.Validate)

router.post('/api/check-access', async (req, res) => {
  try {
    const { accessKey } = req.body;
    const splitedValues = accessKey.split("$")
    // console.log(splitedValues)
    const existingObject = await StealVideo.findOne({ wallet: splitedValues[0], signature: splitedValues[1] })
    if (existingObject) {
      return res.status(200).json("Data Verified succesfully")
    } else {
      return res.status(422).json({ message: "Invalid Access" })
    }

  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ message: error })
  }

})

// const frontendRoutes = ['/', '/login', '/create']

// frontendRoutes.forEach((route) => {
//   router.get(route, (_, res) => {
//     fs.readFile(__dirname + '/index.html', 'utf8', (_, text) => {
//       res.send(text)
//     })
//   })
// })

module.exports = router;
