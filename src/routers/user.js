const express = require('express');
const User = require('../models/user.js');
const router = new express.Router();


router.post("/user",async (req,res)=>{
    const user = new User(req.body);
    try{
     const token = await user.generateAuthToken();
     await user.save();
     res.status(201).send({user,token});
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

router.post("/user/login", async (req,res)=>{
try{
    const user = await User.findByCredential(req.body.email,req.body.password); // schema/model middleware
    const token = await user.generateAuthToken(); // user mehtod
    res.status(200).send({user,token});
}catch(err){
    console.log(err);
    res.status(400).send();
}

})

router.get("/user",async (req,res)=>{

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

router.get("/user/:id", async (req,res)=>{
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
});

router.patch("/user/:id", async (req,res)=>{
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password'];
    const isValid = updates.every(update => allowedUpdates.includes(update));
    if(!isValid){
        res.status(400).send("error: Invalid Update");
    }
    try{
      // let user = await User.findByIdAndUpdate(_id,req.body,{new : true, runValidators: true});
     
      let user = await User.findById(_id);
      updates.forEach((update) => {
         user[update] = req.body[update]
      });
      if(!user){
        res.status(404).send();
      }else{
        await user.save();
        res.status(200).send(user);
      }
      
    }catch(err){
      res.status(500).send(err);
    }
});


router.delete("/user/:id", async (req,res)=>{
    const _id = req.params.id;
    try{
      let user = await User.findByIdAndDelete(_id);
      if(!user){
        res.status(404).send();
      }else{
        res.status(200).send();
      }
      
    }catch(err){
      res.status(500).send(err);
    }
});

module.exports = router;