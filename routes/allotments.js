const express = require("express");
const _ = require("lodash")
const mongoose = require("mongoose")
const routes = express.Router()
const {allotmentJoiSchema,allotmentSchema}= require("../model/Allotment")
const Allotment = mongoose.model("allotments",allotmentSchema);
const {flightSchema} = require("../model/Flight")
const Flight = mongoose.model("flights",flightSchema)

routes.get("/",async(req,res)=>{
    const listAllotments = await Allotment.find()
    .populate("flights");
    res.send(listAllotments)
})

routes.get("/:id",async(req,res)=>{
try{
    let allotment = await Allotment.findById(req.params.id);
    if(!allotment) return res.status(404).send({"message":"Invalid Allotment Id / Allotment Not found"});
    
    res.send(allotment)
}
catch (ex){
    res.status(404).send(_.pick(ex,["message"]))
}
})

routes.post("/",async(req,res)=>{
try{
    const {error} = allotmentJoiSchema.validate(req.body)
    if(error) return res.status(400).send(_.pick(error,["message"]))

    let alreadyPresentAllotment = await  isAllotmentAlreadyExits(req.body.from,req.body.to,req.body.departureDateAndTime);
    if(alreadyPresentAllotment){
        return res.send(alreadyPresentAllotment)
    }

    let allotment = createAllotment(req.body.from,req.body.to,req.body.departureDateAndTime)

    allotment = await allotment.save()
    res.send(allotment)
}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})

routes.put("/:id",async(req,res)=>{
try{
    let allotment = await Allotment.findById(req.params.id)
    if(!allotment) return res.status(404).send({message:"Enter a Valid Allotment Id"})
    let oldId = req.params.id;

    const {error} = allotmentJoiSchema.validate(req.body)
    if(error) return res.status(400).send(_.pick(error,["message"]))

    let flight = await Flight.findById(req.body.flightId)
    if(!flight) return res.status(400).send({message:"Invalid Flight Id / missing Argument 'flightId': 'Object Id' "})

    let findAllotment = await isAllotmentAlreadyExits(req.body.from,req.body.to,req.body.departureDateAndTime)

    if(!findAllotment){
        let newAllotment = createAllotment(req.body.from,req.body.to,req.body.departureDateAndTime);
        newAllotment.flights.push(req.body.flightId)        
        newAllotment = await newAllotment.save()

        allotment.flights.splice(req.body.flightId,1)
        await allotment.save()
        
        flight.allotmentId = newAllotment._id;
        await flight.save()

        return res.send(newAllotment)
    }
    if(findAllotment._id == req.params.id) {
        if(!allotment.flights.includes(req.body.flightId)){
            allotment.flights.push(req.body.flightId)
            await allotment.save() 
        }
        return res.send(allotment)
    }

    if(!findAllotment.flights.includes(req.body.flightId)){
    findAllotment.flights.push(req.body.flightId)
    await findAllotment.save()
}
    
    flight.allotmentId = findAllotment._id;
    await flight.save()

    allotment.flights.splice(req.body.flightId,1)
    await allotment.save()
    res.send(findAllotment)

}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})


routes.put("/setFlight/:id",async (req,res)=>{
try{
    const allotment = await Allotment.findById(req.params.id);
    if(!allotment) return res.status(404).send({"message":"Invalid Allotment Id / Allotment Not found"});
    
    const flight = await Flight.findById(req.body.flightId);
    if(!flight) return res.status(404).send({"message":"Invalid Flight Id / Flight Not found"});

    if(allotment.flights.includes(req.body.flightId)) return res.send(allotment);
    allotment.flights.push(req.body.flightId);
    const result = await allotment.save();
    res.send(result)
}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})

let createAllotment = (from,to,time)=>{
    let allotment = new Allotment({
        from:from,
        to:to,
        departureDateAndTime : time
    })
    return allotment
}

let isAllotmentAlreadyExits = async(from,to,time)=>{
    let allotment = await Allotment.findOne({from:from, to:to})
    if(allotment){
        if(Date(time) == Date(allotment.departureDateAndTime)){
            return allotment
        }
    }  
    return false
}

// async function print(){
//     let result = await isAllotmentAlreadyExits("Coimbatore","Chennai","2020-05-11T20:14:14.796Z");
//     console.log(result)
// }
// print()
// isAllotmentAlreadyExits("Coimbatore","Chennai","2020-05-11T20:14:14.796Z")

module.exports = routes