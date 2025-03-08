require('dotenv').config();
const path = require("path");
const express = require("express");
const cors = require('cors');

const PORT = process.env.APP_PORT;

const app = express();
app.use(cors());
app.use(express.json())

app.get("/", (req, res)=>{
    res.status(200).json({"msg": "FilmFusion Server is Running"})
})

const userRouter = require('./routes/users')
app.use("/user/", userRouter);

const filmRouter = require('./routes/film')
app.use("/film/", filmRouter);

// Set app port
app.listen(PORT);

