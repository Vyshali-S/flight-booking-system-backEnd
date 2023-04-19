const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)
 

const allotmentSchema = mongoose.Schema({
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
    flights :{
        type:[
            {flightId : {type:mongoose.Schema.Types.ObjectId,ref:"flights"}
        }
        ]
    }
})

const allotmentJoiSchema = Joi.object({
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
    flights : Joi.object()

})

module.exports.allotmentSchema =allotmentSchema;
module.exports.allotmentJoiSchema = allotmentJoiSchema;