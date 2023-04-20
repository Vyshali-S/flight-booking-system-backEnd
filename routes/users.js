const express = require("express");
const _ = require("lodash")
const mongoose = require("mongoose");
const {createUserJoiSchema,userSchema,userTickectJoiSchema} = require("../model/User");
const {flightSchema} = require("../model/Flight")
const Joi = require("joi");
const routes = express.Router();
 
const Users = mongoose.model("users",userSchema)
const Flight = mongoose.model("flights",flightSchema)
const bookingFlightSchema = Joi.object({
    flightId : Joi.string().required(),
    seats : 
    Joi.array()
    .items({
        seatId : Joi.string().required()
    })
    .min(1)
    .required()
})

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
    res.send(_.pick(user,["_id","name","email","phone"]))
}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})

routes.put("/bookTicket/:id",async(req,res)=>{
try{
    const user = await Users.findById(req.params.id);
    if(!user) return res.status(404).send({"message":"Invalid User ID"});

    const {error} = bookingFlightSchema.validate(req.body);
    if(error) return res.status(400).send(_.pick(error,["message"]))

    const flight = await Flight.findById(req.body.flightId).select("seats _id")
    if(!flight) return res.status(404).send({"message":"Invalid flight Id / flight Not found"})
   
    let updateCount = req.body.seats.length;
    
  
    for(let outerLoop =0;outerLoop< flight.seats.length; outerLoop++){
        let isPresent = false;
        let eachFlightSeat = flight.seats[outerLoop];
        
        for(let innerLoop = 0; innerLoop < req.body.seats.length; innerLoop++){
            let eachReqSeat = req.body.seats[innerLoop];
            if(eachFlightSeat.seatId ==eachReqSeat.seatId){
                eachFlightSeat.isAvailable = false;
                // console.log(eachFlightSeat)
                updateCount--;
            }
          
        }
    }

    if(updateCount >0) return res.status(404).send({message:"Seat Not Found"})
    
    await flight.save()
    res.send("SUCESS")



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