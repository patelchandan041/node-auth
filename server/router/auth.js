const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('../db/conn')

const User = require('../model/useSchema');

router.get('/',(req,res) => {
    res.send("Hello world from server router")
});



router.post('/register', async(req,res) => {

    const { name,email,phone,work, password, cpassword} = req.body;

     if( !name || !email|| !phone || !work || !password || !cpassword){
         return res.status(420).json({error: "plzz fill the form properly"});
     }

       try{
    
      const userExist = await User.findOne({ email:email })
     
         if(userExist){
             return res.status(422).json({error:"this email is already register"});
         }
         else if(password != cpassword){
             return res.status(422).json({error: "password should be match" })
         }
         else{
            const user = new User({name, email, phone, work, password, cpassword});
            await user.save();
            res.status(201).json({message:"user registered succesfully"}); 
         }

        
          }catch(err){
         console.log(err)
     }
})

router.post('/signIn',  async(req,res)=>{
    try{
        let token;
        const { email, password } = req.body;
        if (!email || !password){
            return res.status(400).json({error:"please feel the detail properly"})
        }
        const userLogin = await User.findOne({email:email});
     
        if(userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password)

         token = await userLogin.generateAuthToken();

         res.cookie("jwtoken",token,{
            expires:new Date(Date.now() + 25892000000),
         });
        
        if(!isMatch){
                res.status(400).json({error:"Invalid password"})
        } else {
                res.json({message:"user signin succesfully"})
        }
        } else{
            res.status(400).json({error:"Invalid email "}) 
        }
 
   

    }catch(err){
        console.log(err)
    }
})

module.exports = router;