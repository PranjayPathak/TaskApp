const mongoose = require("mongoose");
const validator = require("validator");


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


module.exports = Task_model;
