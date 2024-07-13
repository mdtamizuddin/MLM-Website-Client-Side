const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./util/mongodb");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

// Connect MongoDB
connectDB();

app.use('/api/v1', require('./Routes/index'));

app.listen(port, () => console.log(`listening on http://localhost:${port}`));