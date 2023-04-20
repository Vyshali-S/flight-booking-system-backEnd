const mongoose = require("mongoose")
const Joi = require("joi")


const adminJoiSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    phone : Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    
})

const adminSchema = mongoose.Schema({
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
        minlength: 5,
        maxlength: 1024,
        required:true
    },
    password : {
        type: String,
        required:true
    }
})
 
module.exports.adminSchema = adminSchema;
module.exports.adminJoiSchema = adminJoiSchema