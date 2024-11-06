const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./util/mongodb");
const getSetting = require("./Routes/Settings/getSetting");
const authChecker = require("./util/authChecker");
const updateSetting = require("./Routes/Settings/updateSetting");
const transporter = require("./Routes/mailer/transporter");
const User = require("./Routes/User/user.model");
const Withdraw = require("./Routes/WithDraw/withdraw.model");
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
        message: "Server Is Running 2"
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
app.get('/api/v1/statistic', async (req, res) => {
    try {
        const total = await User.countDocuments();
        const active = await User.countDocuments({ status: "active" });
        const pending = await User.countDocuments({ status: "pending" });
        const blocked = await User.countDocuments({ lock: true });
        const total_withdraw = await Withdraw.find({ status: "completed" });
        const totalAmmount = total_withdraw.map(withdraw => withdraw.amount).reduce((a, b) => a + b, 0);
        res.send({
            total: 32000 + total,
            active: 30001 + active,
            pending,
            blocked,
            total_withdraw: totalAmmount
        });
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});
// verify connection configuration

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