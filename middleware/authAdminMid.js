const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const {adminSchema} = require("../model/Admin")
const Admins = mongoose.model("admins",adminSchema)

async function authAdminMid (req,res,next){
try{
    const token = req.header("x-auth-admin-token");
    if(!token) return res.status(401).send({message:"Access denied. no admin token provided"});
    
    const decoded = jwt.verify(token,"flightBooking");
     
    const admin = await Admins.findById(decoded._id)
    if(!admin) return res.status(400).send({message:"'admin' not found with the provided token, Sign in Again"})
    
    next()
}
catch(ex){
    res.status(400).send({message:"Invalid Admin token"})
}
}

module.exports = authAdminMid