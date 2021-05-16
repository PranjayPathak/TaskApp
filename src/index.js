const express =  require("express");
require("./db/mongoose.js");
// const User = require('./models/user.js');
// const Task = require('./models/task.js');
const userRouter = require('./routers/user.js');
const taskRouter = require('./routers/task');

// const { populate } = require("./models/user.js");
const app =  express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port,()=>{
    console.log("server is up on port "+ port);
});



// app.use((req,res,next)=>{
//     console.log(req.path,req.method);
//     next();
// });
app.use(userRouter);
app.use(taskRouter);

// const jwt = require('jsonwebtoken');

// (
// async () => {
//     const tkn = jwt.sign({_id:"abcd"},"prnjya",{expiresIn:"0 seconds"});
//     console.log("token:"+ tkn) ;
//     console.log(jwt.verify(tkn,"prnjya"));
//     // console.log(await bcrypt.compare('pranjAy',x));
// }
// )();