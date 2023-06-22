import express from 'express';
import { query } from './db';
import router from "./routes";
import bodyParser from 'body-parser';

const path = require('path');
const app = express();
const dir = path.join(__dirname, 'public');
const cors = require("cors");

app.use(cors());

app.use(express.static(dir));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Success');
})

app.listen(5000, () => {
    console.log('Listening on port 5000...');
})

app.use('/api', router);