const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./router');
const connectDB = require('./router/db');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

connectDB();

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});