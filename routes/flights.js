const mongoose = require("mongoose")
const express = require("express");
const routes = express.Router();
const _ = require("lodash")
const {flightJoiSchema,flightSchema}= require("../model/Flight")

const Flights = mongoose.model("flights",flightSchema)

routes.get("/",async(req,res)=>{
try{
    let listFlights = await Flights.find();
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


}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})



module.exports = routes;
