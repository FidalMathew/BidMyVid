const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/api/check-access', (req, res) => {

    const { accessKey, context, timeStamp } = req.body;
    const assetId = context.assetId;
    const userId = context.userId;

    res.status(200).send('Data received successfully.');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
