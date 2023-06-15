const { generateNonce, SiweMessage, ErrorTypes } = require('siwe')
const StealVideo = require("../models/steal")
const { error } = require('console')

async function Nonce(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send(generateNonce());
}

async function Verify(req, res) {
  const { message, signature, wallet } = req.body;
  const siweMessage = new SiweMessage(message);

  try {
    await siweMessage.verify({ signature });
    const existingObject = await StealVideo.findOne({ wallet: wallet });

    if (existingObject) {
      await StealVideo.findOneAndUpdate({ wallet: wallet }, { $set: { signature: signature } });
      return res.status(200).json({ message: "wallet exists, and updated" })
    }
    // create new wallet with signature
    const stealObject = new StealVideo({ wallet: wallet, signature: signature });
    const data = await stealObject.save();
    console.log('Object saved successfully');
    return res.send(data).status(200);

  }
  catch (error) {
    console.log(error)
    return res.send("Verification failed").status(422);
  }

}

async function Validate(req, res) {
  const { wallet, signature } = req.body;
  try {
    const existingObject = await StealVideo.findOne({ wallet: wallet, signature: signature })
    if (existingObject) {
      return res.status(200).json("Data Verified succesfully")
    } else {
      return res.status(422).json({ message: "Invalid Access" })
    }
  } catch (error) {
    console.log(error)
    return res.status(422).json({ message: "Invalid wallet or signature" })
  }
}

module.exports = {
  Nonce,
  Verify,
  Validate,
}