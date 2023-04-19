const express = require("express");
const _ = require("lodash")
const mongoose = require("mongoose")
const routes = express.Router()
const {allotmentJoiSchema,allotmentSchema}= require("../model/Allotment")
const Allotment = mongoose.model("allotments",allotmentSchema);

routes.get("/",async(req,res)=>{
    const listAllotments = await Allotment.find();
    res.send(listAllotments)
})
routes.post("/",async(req,res)=>{
try{
    const {error} = allotmentJoiSchema.validate(req.body)
    if(error) return res.status(400).send(_.pick(error,["message"]))

    let allotment = createAllotment(req.body.from,req.body.to,req.body.departureDateAndTime)
    
    allotment = await allotment.save()
    res.send(allotment)
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

module.exports = routes