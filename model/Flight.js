const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)
 
const flightJoiSchema = Joi.object({
    from : Joi.string()
    .min(3)
    .max(20)
    .required(),
    to : Joi.string()
    .min(3)
    .max(20)
    .required(),
    departureDateAndTime : Joi.date()
    .required(), 
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
    }).min(60)
    .required(),
    pricePerSeat : Joi.number()
    .min(0)
    .required(),
    bookedUsers : Joi.object(),
}) 

const flightSchema = mongoose.Schema({

    from : {
        type:String,
        minLength:3,
        maxLength:10,
        required:true
    },
    to :{
        type:String,
        minLength:3,
        maxLength:20,
        required:true
    },
    departureDateAndTime:{
        type:Date,
        required:true
    },
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
    } 

})

module.exports.flightJoiSchema = flightJoiSchema;
module.exports.flightSchema = flightSchema;
