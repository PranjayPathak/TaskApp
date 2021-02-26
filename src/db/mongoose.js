const mongoose = require("mongoose");
const validator = require("validator");


const database_name = "taskManager";

mongoose.connect("mongodb://127.0.0.1:27017/tast-manger-api",{
    useNewUrlParser:true,
      useUnifiedTopology: true,
        useCreateIndex:true
    });

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

const user1 = new User_model({
    name:"  pranjay33  ",
    age:28,
    email:"  pranjaypathakxxx411@gmasil.com ",
    password:"edssssssss"
})
user1.save()
.then(()=>console.log("saved user"))
.catch((err)=>{
    console.log(err);
})

const Task_model = mongoose.model("task",{
    description :{
        type: String,
        required:true
    },
    completed:{
       type: Boolean,
       default:false
        }
})    


const test_task = new Task_model({
    description:"do something",
    completed:true
});

test_task.save().then((res)=>{
console.log("saved task");
}).catch((err)=>{
    console.log(err);
});
