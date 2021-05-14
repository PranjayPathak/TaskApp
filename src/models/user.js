const mongoose = require("mongoose");
const validator = require("validator");


const User_model = mongoose.model("user",{
    name:{
        type:String,
    
        requuired:true,
        trim:true,
    },
    email:{
        type:String,
    
        requuired:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validator(value){
            if(value.includes(" ")){
                throw new Error("passowrd cannot contain space between")
            }
        }
    },
    age:{
        type:Number,
        validate(value){
            if(value <= 0){
                throw new Error("age is invalid")
            }
        }
    }
})


module.exports = User_model; 