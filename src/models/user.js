const mongoose = require("mongoose");
const Task = require("../models/task.js");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
    
        required:true,
        trim:true,
    },
    email:{
        type:String,
    
        required:true,
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
    },
    tokens:[{
        token:{
            type:  String,
    
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
}
,{
  timestamps: true
});

//virtual relation
userSchema.virtual('userTasks',{
    ref:"task",
    localField:'_id', // name of field locally 
    foreignField:'owner' //name of field in task
})

//middleware function to encryption password
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

// method on instances to generate token
userSchema.methods.generateAuthToken= async function(){
 const user = this;
 const token = jwt.sign({_id : user.id.toString() },"sampletext")
  
 user.tokens = user.tokens.concat({token});
 await user.save();
 return token;
}

//removing private info from user object
//function gets called whenever user is stringified (when sent back in respose to client)
userSchema.methods.toJSON = function(){
    const user = this;
    const userObj = user.toObject();
    
    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;
    return(userObj);   
}
   
// before mongoose save() function
userSchema.pre('save',async function(next){
    let user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next();
})

//before mongoose remove() function
userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
});

const User_model = mongoose.model("user",userSchema)


module.exports = User_model; 