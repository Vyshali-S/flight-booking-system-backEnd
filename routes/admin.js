const express = require("express");
const routes = express.Router()
const _ = require("lodash")
const bcrypt  = require("bcrypt")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const {adminSchema,adminJoiSchema} = require("../model/Admin")

const Admin = mongoose.model("admins",adminSchema)


routes.post("/",async(req,res)=>{
try{
    const {error} = adminJoiSchema.validate(req.body);
    if(error) return res.status(400).send(_.pick(error,["message"]));

    
    let isAdminExmailExits = await Admin.findOne({email:req.body.email});
    if(isAdminExmailExits) return res.status(400).send({"message":"Mail id Already Exists"})

    let admin = createAdminObj(req.body.name,req.body.email,req.body.phone,req.body.password)
    
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password,salt)
    admin = await admin.save()

    const token = jwt.sign({_id:admin._id},"flightBooking")

    res.header("x-auth-admin-token",token).send({admin : _.pick(admin,["name","email","_id","phone"]),token:token})

}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})

let createAdminObj = (name,email,phone,password)=>{
    const admin = new Admin({
        name:name,
        email:email,
        phone:phone,
        password:password
    })
    return admin
}


module.exports = routes
