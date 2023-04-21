const mongoose = require("mongoose");
const express = require("express")
const routes =  express.Router()
const {userSchema}= require("../model/User")
const _ = require("lodash")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Users = mongoose.model("users",userSchema)

const validateUser = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
})

routes.post("/",async(req,res)=>{
     
    const {error} = validateUser.validate(req.body)
    if(error) return res.status(400).send(_.pick(error,["message"]))

    let user = await Users.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({"message":'Invalid email or password.'});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({"message":'Invalid email or password.'});
 
    const token = jwt.sign({_id:user._id},"flightBooking")

    res.header("x-auth-user-token",token).send({user : _.pick(user,["name","email","phone","_id","tickets"]),token:token})
})


module.exports = routes