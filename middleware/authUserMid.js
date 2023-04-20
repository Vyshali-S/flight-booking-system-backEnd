const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const {userSchema} = require("../model/User")
const User = mongoose.model("users",userSchema)

async function authUserMid (req,res,next){
try{
    const token = req.header("x-auth-user-token");
    if(!token) return res.status(401).send({message:"Access denied. no user token provided"});
    
    const decoded = jwt.verify(token,"flightBooking");
    
    console.log(decoded)
    const user = await User.findById(decoded._id)
    if(!user) return res.status(400).send({message:"'User' not found with the provided token, Sign in Again"})
    
    next()
}
catch(ex){
    res.status(400).send({message:"Invalid User token"})
}
}

module.exports = authUserMid