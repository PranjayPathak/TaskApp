const express =  require("express");
require("./db/mongoose.js");
// const User = require('./models/user.js');
// const Task = require('./models/task.js');
const userRouter = require('./routers/user.js');
const taskRouter = require('./routers/task');
// const bcrypt = require('bcryptjs');
// const { populate } = require("./models/user.js");
const app =  express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port,()=>{
    console.log("server is up on port "+ port);
});

app.use(userRouter);
app.use(taskRouter);


// (
// async () => {
//     const x = await bcrypt.hash("pranjay",5);
//     console.log(x)
//     console.log(await bcrypt.compare('pranjAy',x));
// }

// )();