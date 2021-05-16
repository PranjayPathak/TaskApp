const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
    
        requuired:true,
        trim:true,
    },
    email:{
        type:String,
    
        requuired:true,
        unique:true,
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
});

userSchema.statics.findByCredential =  async(email,password) => {
    const user = await User_model.findOne({email})

    if(!user){
        throw new Error("unable to login");
    }

    const isMatch = await  bcrypt.compare(password,user.password);

    if(!isMatch){
        throw new Error("unable to login");
    }

    return user;
} 

userSchema.pre('save',async function(next){
    let user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next();
})
const User_model = mongoose.model("user",userSchema)


module.exports = User_model; 