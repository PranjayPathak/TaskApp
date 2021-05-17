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
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }

})    


module.exports = Task_model;
