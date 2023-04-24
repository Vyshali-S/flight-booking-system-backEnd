const mongoose = require("mongoose")
const express = require("express");
const routes = express.Router();
const _ = require("lodash") 
const {flightJoiSchema,flightSchema}= require("../model/Flight")
const {userSchema} = require("../model/User")
const authAdminMin = require("../middleware/authAdminMid")

const Flights = mongoose.model("flights",flightSchema) 
const Users = mongoose.model("users",userSchema)

routes.get("/allFlights",async(req,res)=>{
try{
    let listFlights = await Flights.find()
    .populate("bookedUsers")
    .sort({departureDateAndTime: 1})
    ;
    res.send(listFlights)
}
catch (ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})

routes.get("/bookedFlights",async(req,res)=>{
try{
    const flights = await Flights.find({ "bookedUsers" :  { "$size": 1  } })
    res.send(flights)
}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}

})

routes.get("/:id", async(req,res)=>{
try{
    let flight = await Flights.find({_id:req.params.id})
    .populate("bookedUsers")
    if(flight.length<1) return res.status(400).send({message:"Invalid Flight ID"})
    res.send(flight)
}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
} )


routes.get("/?",async(req,res)=>{
    if(!req.query.from || !req.query.to || !req.query.departureDateAndTime){
        return res.status(400).send({message:"enter a valid query, formate /?`from=cityName&to=cityName&departureDateAndTime=year-month-day"})
    }
    
    const flights = await Flights.find({from:req.query.from ,to:req.query.to,departureDateAndTime: {"$gte": new Date(req.query.departureDateAndTime)}})
    .populate("bookedUsers")
    res.send(flights)
})


routes.post("/",authAdminMin,async(req,res)=>{
try{ 
    const {error} = flightJoiSchema.validate(req.body) 
    if(error) return res.status(400).send(_.pick(error,["message"]))

    let fligt = createFlight(req.body.from,req.body.to,req.body.departureDateAndTime,req.body.name,req.body.number,req.body.pricePerSeat,req.body.seats)
    fligt = await fligt.save();
    res.send(fligt)
}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})

routes.put("/:id",authAdminMin,async(req,res)=>{
try{
    let flight = await Flights.findById(req.params.id);
    if(!flight) return res.status(404).send({"message":"Flight Not Found / invalid flight id"});
    
    const {error} = flightJoiSchema.validate(req.body) 
    if(error) return res.status(400).send(_.pick(error,["message"]));
    flight.from = req.body.from;
    flight.to = req.body.to;
    flight.departureDateAndTime = req.body.departureDateAndTime;
    flight.name = req.body.name;
    flight.number = req.body.number;
    flight.pricePerSeat = req.body.pricePerSeat;
    flight.seats = req.body.seats;

    let result = await flight.save();
    res.send(result)
}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
}) 

routes.delete("/:id",authAdminMin,async(req,res)=>{
try{
    let flight = await Flights.findById(req.params.id);
    if(!flight) return res.status(404).send({"message":"Flight Not Found / invalid flight id"});

    await Flights.findOneAndDelete({_id:req.params.id})
    res.send({"message":"Deleted Sucessfully"})
    
}
catch (ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})



const createFlight = (from,to,departureDateAndTime,name,number,pricePerSeat,seats)=>{
    let flight = new Flights({
        from:from,
        to:to,
        departureDateAndTime:departureDateAndTime,
        name:name,
        number:number,
        pricePerSeat:pricePerSeat,
        seats,seats
    })
    return flight
}


module.exports = routes;
