const express = require('express');
const Task = require('../models/task.js')
const auth = require("../middleware/auth.js");
const router = new express.Router();


router.post("/task",auth, async (req,res)=>{
    // const task = new Task(req.body);
    const task = new Task({
      ...req.body,  //copying the task object in request
      owner: req.user._id  //owner ID from user attached in auth
    })
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

router.get("/tasks",auth, async (req,res)=>{
   const match = {};
   const sortBy = {};
   if(req.query.completed){
     match.completed = req.query.completed == "true"
   }

   if(req.query.sortBy){
    const parts = req.query.sortBy.split(":");
    sortBy[parts[0]] = parts[1] === "desc" ? -1 : 1 ;
  }
    try{
    //  let tasks = await Task.find({owner: req.user._id});
    
    await req.user.populate({
      path: 'userTasks', //property name of virtual relatiation
      match: match,
      options:{
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort:sortBy
      }
    }).execPopulate(); //populting the user with its tasks(userTasks virtual relation)
    res.status(201).send(req.user.userTasks);
   
  }catch(err){
     res.status(400).send(err);   
    }  
});


router.get("/task/:id",auth,async (req,res)=>{
    const _id = req.params.id;
    try{
    //  let task = await Task.findById(_id);
    const task = await Task.findOne({_id, owner: req.user._id})
      if(!task){
       return res.status(404).send();
      }
      // else{
      res.status(201).send(task);
      // }
    }catch(err){
      res.status(500).send();  
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


router.patch("/task/:id",auth, async (req,res)=>{
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['completed','description'];
    const isValid = updates.every(update => allowedUpdates.includes(update));
    
    if(!isValid){
        res.status(400).send("error: Invalid Update");
    }
    try{
      // let task = await Task.findByIdAndUpdate(_id,req.body,{new : true, runValidators: true});
      // let task = await Task.findById(_id);
      const task = await Task.findOne({_id: _id, owner: req.user._id})

      if(!task){
        res.status(404).send();
      }else{
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.status(200).send(task);
      }

    }catch(err){
      res.status(500).send(err);
    }
});

router.delete("/task/:id",auth, async (req,res)=>{
    const _id = req.params.id;
    try{
      // let task = await Task.findByIdAndDelete(_id);
      const task = await Task.findOneAndDelete({_id:_id, owner: req.user._id})

      if(!task){
        res.status(404).send();
      }else{
        res.status(200).send();
      }
      
    }catch(err){
      res.status(500).send(err);
    }
});

module.exports = router;