const mongoose = require("mongoose")
const express = require("express");
const routes = express.Router();
const _ = require("lodash")
const {allotmentSchema}= require("../model/Allotment")
const {flightJoiSchema,flightSchema}= require("../model/Flight")
const {userSchema} = require("../model/User")

const Flights = mongoose.model("flights",flightSchema)
const Allotments = mongoose.model("allotments",allotmentSchema)
const Users = mongoose.model("users",userSchema)

routes.get("/",async(req,res)=>{
try{
    let listFlights = await Flights.find()
    .populate("allotmentId bookedUsers")
    ;
    res.send(listFlights)
}
catch (ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})

routes.post("/",async(req,res)=>{
try{
    // req.body.seats = JSON.parse(req.body.seats)
    const {error} = flightJoiSchema.validate(req.body) 
    if(error) return res.status(400).send(_.pick(error,["message"]))

    let fligt = createFlight(req.body.name,req.body.number,req.body.pricePerSeat,req.body.seats)
    fligt = await fligt.save();
    res.send(fligt)
}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})

routes.put("/setAllotment/:id",async(req,res)=>{
try{
    let flight = await Flights.findById(req.params.id);
    if(!flight) return res.status(404).send({"message":"Flight Not Found / invalid flight id"});

    let allotment = await Allotments.findById(req.body.allotmentId)
    if(!allotment) return res.status(404).send({"message":"Invalid Allotment Id / Allotment Not found"});

    flight.allotmentId = req.body.allotmentId;
    let result = await flight.save();
    res.send(result)
}
catch (ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})

routes.put("/setUser/:id",async(req,res)=>{
try{
    const user = await Users.findById(req.body.userId)
    if(!user) return res.status(404).send({"message":"User not found / Invalid user Id"});

    let flight = await Flights.findById(req.params.id);
    if(!flight) return res.status(404).send({"message":"Flight Not Found / invalid flight id"});

    if(flight.bookedUsers.includes(req.body.userId)) return res.send(flight);
    flight.bookedUsers.push(user)
    let result = await flight.save()
    
    res.send(result)
}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})


const createFlight = (name,number,pricePerSeat,seats)=>{
    let flight = new Flights({
        name:name,
        number:number,
        pricePerSeat:pricePerSeat,
        seats,seats
    })
    return flight
}


module.exports = routes;
