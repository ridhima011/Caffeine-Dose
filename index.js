require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require('./Routes/AuthRouters');
const chatbotRoutes = require('./Routes/chatbootR');
const orderRouter=require('./Routes/orderRouter');
const { applyTimestamps } = require('./Modals/order');
const upload=require('../backend/Routes/fileUplodroute');

const PORT = process.env.PORT || 8080;
require("./Modals/db");

app.use(bodyParser.json());
app.use(cors());

app.get('/ping', (req, res) => {
    res.send("Server is on");
});

app.use('/api', AuthRouter);
app.use('/admin/orders',orderRouter);
app.use('/',upload);

app.use('/', chatbotRoutes);
app.use('/',orderRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
