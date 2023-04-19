const express = require("express");
const _ = require("lodash")
const mongoose = require("mongoose");
const {createUserJoiSchema,userSchema,userTickectJoiSchema} = require("../model/User")
const routes = express.Router();
 
const Users = mongoose.model("users",userSchema)

routes.get("/",async(req,res)=>{
    let listAllUser = await Users.find();
    res.send(listAllUser)

})
routes.post("/",async(req,res)=>{
try{
    const {error} = createUserJoiSchema.validate(req.body)
    if(error) return res.status(400).send(_.pick(error,["message"]));

    let user = createUser(req.body.name,req.body.email,req.body.phone,req.body.password)

    user = await user.save()
    res.send(user)
}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})

const createUser = (name,email,phone,password)=>{
    const user = new Users({
        name:name,
        email:email,
        phone:phone,
        password:password
    })
    return user
}

module.exports = routes