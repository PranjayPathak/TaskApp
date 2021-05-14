const express =  require("express");
require("./db/mongoose.js");
const User = require('./models/user.js');
const Task = require('./models/task.js');
const { populate } = require("./models/user.js");
const app =  express();

const port = process.env.PORT || 3000;
app.use(express.json());

app.listen(port,()=>{
    console.log("server is up on port "+ port);
});

app.post("/user",async (req,res)=>{
    const user = new User(req.body);

 
    try{
     await user.save();
     res.status(201).send(user);
    }catch(err){
        res.status(400).send(err);
    }
    // user.save().then(()=>{
    //     console.log("user saved");
    //     res.status(201);
    //     res.send(user);
    // }).catch((err)=>{
    //     console.log("error in user cretion");
    //     res.status(400)
    //     res.send(err);
    // });
});

app.get("/user",async (req,res)=>{

try{
  let users = await User.find({});
  res.status(201).send(users);
  
}catch(err){
    res.status(500).send();
    console.log(err);
}
    // User.find().then((users)=>{
//     res.status(201);
//     res.send((users))

// }).catch((err)=>{
//     res.status(500)
//     res.send();
// })
});

app.get("/user/:id", async (req,res)=>{
    const _id = req.params.id;

    try{
     let user = await User.findById(_id);
        if(!user){
            res.status(404).send("no user found");
        }else{
            res.status(200).send(user);
        }
    }catch(err){
        res.status(500).send(err);
    }
    // User.findById(_id).then((user=>{
    //     if(!user){
    //         res.status(404).send("no uer found");
    //     }else{
        
    //         res.status(200).send(user);
           
    //     }
    // })).catch((err)=>{
    //     res.status(500).send(err);
    // });
})

app.post("/task", async (req,res)=>{
    const task = new Task(req.body);
    try{
     await task.save(); 
     res.status(201).send(task);
    }catch(err){
     res.status(400).send(err);
    }
    // task.save().then(()=>{
    //     console.log("task saved");
    //     res.status(201);
    //     res.send(task);
    // }).catch((err)=>{
    //     console.log("error in user cretion");
    //     res.status(400);
    //     res.send(err);
    // });
});

app.get("/task", async (req,res)=>{
    try{
     let tasks = await Task.find();
     res.status(201).send(tasks);
    }catch(err){
     res.status(400).send(err);   
    }
    //   Task.find().then((tasks)=>{
//     res.status(201).send(tasks);
//   }).catch((err)=>{
//       res.status(400).send(err);
//   });  
});


app.get("/task/:id",async (req,res)=>{
    const _id = req.params.id;
    try{
     let task = await Task.findById(_id);
      if(!task){
        throw new Error("task not found");
      }else{
        res.status(201).send(task);
      }
    }catch(err){
      res.status(400).send(err);  
    }
// Task.findById(_id).then((task)=>{
//  if(!task){
//      throw new Error("task not found");
//  }else{
//     res.status(201).send(task);
//  }
// }).catch((err)=>{
//     res.status(400).send(err);
// });  
  });