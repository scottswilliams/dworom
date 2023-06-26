import express from 'express';
import router from "./routes";
import bodyParser from 'body-parser';

const path = require('path');
const app = express();
const cors = require("cors");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
})

app.listen(5000, () => {
    console.log(__dirname)
    console.log('Listening on port 5000...');
})

app.use('/api', router);