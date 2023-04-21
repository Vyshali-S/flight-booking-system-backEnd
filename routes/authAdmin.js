const mongoose = require("mongoose");
const express = require("express")
const routes =  express.Router()
const {adminSchema}= require("../model/Admin")
const _ = require("lodash")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Admin = mongoose.model("admins",adminSchema)

const validateAdmin = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
})

routes.post("/",async(req,res)=>{

    const {error} = validateAdmin.validate(req.body)
    if(error) return res.status(400).send(_.pick(error,["message"]))

    let admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return res.status(400).send({"message":'Invalid email or password.'});

    const validPassword = await bcrypt.compare(req.body.password, admin.password);
    if (!validPassword) return res.status(400).send({"message":'Invalid email or password.'});
 
    const token = jwt.sign({_id:admin._id},"flightBooking")

    res.header("x-auth-admin-token",token).send({admin : _.pick(admin,["name","email","_id","phone"]),token:token})
})


module.exports = routes