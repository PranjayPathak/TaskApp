const express = require('express');
const Task = require('../models/task.js')
const router = new express.Router();


router.post("/task", async (req,res)=>{
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

router.get("/task", async (req,res)=>{
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


router.get("/task/:id",async (req,res)=>{
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


router.patch("/task/:id", async (req,res)=>{
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['completed','description'];
    const isValid = updates.every(update => allowedUpdates.includes(update));
    
    if(!isValid){
        res.status(400).send("error: Invalid Update");
    }
    try{
      // let task = await Task.findByIdAndUpdate(_id,req.body,{new : true, runValidators: true});
      let task = await Task.findById(_id);
      updates.forEach((update) => {
         task[update] = req.body[update]
      });
      if(!task){
          console.log(task);
        res.status(404).send();
      }else{
        await task.save();
        res.status(200).send(task);
      }

    }catch(err){
      res.status(500).send(err);
    }
});

router.delete("/task/:id", async (req,res)=>{
    const _id = req.params.id;
    try{
      let task = await Task.findByIdAndDelete(_id);
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