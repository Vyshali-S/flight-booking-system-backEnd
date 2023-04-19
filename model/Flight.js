const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)
 
const flightJoiSchema = Joi.object({
    name: Joi.string()
    .min(3)
    .max(20)
    .required(),
    number : Joi
    .number()
    .required(),
    seats : Joi.array()
    .items({
        seatId: Joi.string()
        .required(),
        isAvailable :  Joi.boolean()
        .required()
    })
    .required(),
    pricePerSeat : Joi.number()
    .min(0)
    .required(),
    bookedUsers : Joi.object(),
    allotmentId : Joi.object()
}) 

const flightSchema = mongoose.Schema({
    name:{
        type:String,
        minLength:3,
        maxLength:20,
        required:true
    },
    number:{
        type:Number,
        unique:true,
        required:true
    },
    seats:{
        type: [
        {
            seatId :{type:String,required:true},
            isAvailable : {type:Boolean,required:true}
        }
    ],
    required: true
},
  pricePerSeat : {
    type:Number,
    required:true
  },
    bookedUsers : {
        type: [
            {type:mongoose.Schema.Types.ObjectId,ref:"users"} 
        ]
    },
    allotmentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"allotments"
    },

})

module.exports.flightJoiSchema = flightJoiSchema;
module.exports.flightSchema = flightSchema;