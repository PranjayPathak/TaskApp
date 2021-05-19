//For supertest
const express =  require("express");

//Connects the database
require("./db/mongoose.js");

//Routes
const userRouter = require('./routers/user.js');
const taskRouter = require('./routers/task.js');
const app =  express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;