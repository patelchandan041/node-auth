const dotenv = require("dotenv")
const mongoose = require('mongoose');
const express = require('express');
const app = express();

dotenv.config({ path: './config.env' });
require('./db/conn')

app.use(express.json());

//const User= require('./model/useSchema');
app.use(require('./router/auth'));

const PORT = process.env.PORT;

const middleware = (req,res,next) =>{
   console.log("hello i  am middleware");
  next()
}

app.get('/', (req,res) =>{
  res.send(`hello this is home page`);
});




app.listen(PORT, () => {
    console.log(`listen on port  ${PORT}`);
})