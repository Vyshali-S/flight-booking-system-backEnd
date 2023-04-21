const express = require("express");
const _ = require("lodash")
const bcrypt  = require("bcrypt")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const {createUserJoiSchema,userSchema,userTickectJoiSchema,bookingFlightSchema} = require("../model/User");
const {flightSchema} = require("../model/Flight")
const Joi = require("joi");
const authUserMid = require("../middleware/authUserMid");
const authAdminMid = require("../middleware/authAdminMid");
const routes = express.Router();
 
const Users = mongoose.model("users",userSchema)
const Flight = mongoose.model("flights",flightSchema)


routes.get("/",authAdminMid,async(req,res)=>{
    let listAllUser = await Users.find().populate("tickets.flightId");
    res.send(listAllUser)

})

routes.get("/:id",async(req,res)=>{
try{
    const user = await Users.find({_id:req.params.id}).populate("tickets.flightId").select("-password")
    if(user.length <1) return res.status(404).send({message:"User Not Found / invalid User id"})
   
    res.send(user)
}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
}) 

routes.post("/",async(req,res)=>{
try{
    const {error} = createUserJoiSchema.validate(req.body)
    if(error) return res.status(400).send(_.pick(error,["message"]));

    let isUserEmailExits = await Users.findOne({email:req.body.email});
    if(isUserEmailExits) return res.status(400).send({"message":"Mail id Already Exists"})

    let user = createUser(req.body.name,req.body.email,req.body.phone,req.body.password)
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt)
    user = await user.save()

    const token = jwt.sign({_id:user._id},"flightBooking")
    // res.send(_.pick(user,["_id","name","email","phone"]))

    res.header("x-auth-user-token",token).send({user : _.pick(user,["name","email","_id","tickets","phone"]),token:token})
}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})

routes.put("/bookTicket/:id",authUserMid,async(req,res)=>{
try{
    let user = await Users.findById(req.params.id);
    if(!user) return res.status(404).send({"message":"Invalid User ID"});

    const {error} = bookingFlightSchema.validate(req.body);
    if(error) return res.status(400).send(_.pick(error,["message"]))

    const flight = await Flight.findById(req.body.flightId)
    if(!flight) return res.status(404).send({"message":"Invalid flight Id / flight Not found"})
   
    let updateCount = req.body.seats.length;
    
  
    for(let outerLoop =0;outerLoop< flight.seats.length; outerLoop++){
        let isPresent = false;
        let eachFlightSeat = flight.seats[outerLoop];
        
        for(let innerLoop = 0; innerLoop < req.body.seats.length; innerLoop++){
            let eachReqSeat = req.body.seats[innerLoop];
            if(eachFlightSeat.seatId ==eachReqSeat.seatId){
                if(!eachFlightSeat.isAvailable) return res.status(400).send({"message":`seatId ${eachReqSeat.seatId} already reserved`})
                eachFlightSeat.isAvailable = false;
                // console.log(eachFlightSeat)
                updateCount--;
            }
          
        }
    }

    if(updateCount >0) return res.status(404).send({message:"Seat Not Found"})

    if(!flight.bookedUsers.includes(req.params.id)){
        flight.bookedUsers.push(req.params.id)   
    }
    await flight.save()

    user.tickets.push({flightId:req.body.flightId,seats:req.body.seats})
    user.save()

    user = await Users.find({_id:req.params.id}).populate("tickets.flightId").select("-password")
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