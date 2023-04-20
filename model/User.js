const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)
 

const createUserJoiSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email : Joi.string().email().required(),
    phone : Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password:  Joi.string().min(3).max(15).required()
})
const userTickectJoiSchema = Joi.object({
            flightId: Joi.objectId().required(),
            seats : Joi.array().items({
                seatId: Joi.string().min(1).required()
            })
})
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

const userSchema = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email :{
        type : String,
        unique: true,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    password : {
        type: String,
        
    },
    tickets:{
        type:[
            {flightId : {type:mongoose.Schema.Types.ObjectId,ref:"flights"},
             seats: [{seatId:String}]
        }
        ]
    }
})

module.exports.createUserJoiSchema = createUserJoiSchema;
module.exports.userTickectJoiSchema = userTickectJoiSchema;
module.exports.userSchema = userSchema;
module.exports.bookingFlightSchema = bookingFlightSchema