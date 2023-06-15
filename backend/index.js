const express = require('express');
const app = express();
// const port = process.env.PORT || 5000;
const cors = require('cors');
const morgan = require('morgan');
// const { SiweMessage } = require('siwe');
const router = require("./routes");
const mongoose = require('mongoose');
require("dotenv").config();
const Session = require('express-session')

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

//Auth
app.use(Session({
    name: 'siwe-quickstart',
    secret: "siwe-quickstart-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: true }
}));

app.use(router);
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// })

// app.post('/api/check-access', (req, res) => {

//     const { accessKey, context, timeStamp } = req.body;
//     const assetId = context.assetId;
//     const userId = context.userId;
//     console.log(`accessKey: ${accessKey}`);
//     console.log(`assetId: ${assetId}`);
//     console.log(`userId: ${userId}`);
//     console.log(`timeStamp: ${timeStamp}`);

//     res.status(200).send('Data received successfully.');
// })


// app.get('/nonce', function (_, res) {
//     res.setHeader('Content-Type', 'text/plain');
//     res.send(generateNonce());
// });

// app.post('/verify', async function (req, res) {
//     const { message, signature } = req.body;
//     const siweMessage = new SiweMessage(message);
//     try {
//         await siweMessage.verify({ signature });
//         res.send(true);
//     } catch {
//         res.send(false);
//     }
// });

// console.log(process.env.MONGO_URL)

mongoose.
    connect(process.env.MONGO_URL)
    .then(result => {
        console.log("mongodb connected")
        app.listen(process.env.PORT, () => {
            console.log(`Server connected AT ${process.env.PORT}`)
        })
    })
    .catch(err => {
        console.log(err)
    })
