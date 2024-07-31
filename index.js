const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./util/mongodb");
const getSetting = require("./Routes/Settings/getSetting");
const authChecker = require("./util/authChecker");
const updateSetting = require("./Routes/Settings/updateSetting");
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

app.get('/api/v1/setting', async (req, res) => {
    try {
        const response = await getSetting();
        res.send(response);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
})
app.put('/api/v1/setting', authChecker, async (req, res) => {

    try {
        if (req.user.role !== 'admin') {
            return res.status(400).send({
                message: "Who are you pokinni"
            });
        }
        const response = await updateSetting(req.body);
        res.send(response);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
})

app.listen(port, () => console.log(`listening on http://localhost:${port}`));