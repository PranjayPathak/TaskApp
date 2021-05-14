const mongoose = require("mongoose");
// const validator = require("validator");


// const database_name = "taskManager";

mongoose.connect("mongodb://127.0.0.1:27017/tast-manger-api",{
    useNewUrlParser:true,
      useUnifiedTopology: true,
        useCreateIndex:true
    });



