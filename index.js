const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./util/mongodb");
const getSetting = require("./Routes/Settings/getSetting");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

// Connect MongoDB
connectDB();

app.use('/api/v1', require('./Routes/index'));
app.get('/', (req, res) => {
    res.send({
        message: "Server Is Running"
    })
})

// get site setting 

app.get('/setting', async (req, res) => {
    const response = await getSetting();
    res.send(response);
})

app.listen(port, () => console.log(`listening on http://localhost:${port}`));