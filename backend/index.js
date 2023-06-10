const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const morgan = require('morgan');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/api/check-access', (req, res) => {

    const { accessKey, context, timeStamp } = req.body;
    const assetId = context.assetId;
    const userId = context.userId;
    console.log(`accessKey: ${accessKey}`);
    console.log(`assetId: ${assetId}`);
    console.log(`userId: ${userId}`);
    console.log(`timeStamp: ${timeStamp}`);

    res.status(200).send('Data received successfully.');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
