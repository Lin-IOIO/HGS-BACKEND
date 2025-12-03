const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {PORT} = process.env;

const app = express();

app.use(express.json())

const apiRouter = require('./api/main')
const allowlist = ['http://localhost:5173'];
app.use('/api', cors({origin: allowlist}));
app.use('/api', apiRouter);

app.listen(PORT, function(error) {
    if (error){
        console.error(error);
        process.exit(1);
    }
    console.log(`escuchando en el puerto ${PORT}`)
})