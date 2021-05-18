const mongoose = require("mongoose");
// const validator = require("validator");


// const database_name = "taskManager";

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
      useUnifiedTopology: true,
        useCreateIndex:true
    });



