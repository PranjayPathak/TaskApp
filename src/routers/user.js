const express = require('express');
const User = require('../models/user.js');
const auth = require("../middleware/auth.js")
const multer = require("multer");
const sharp = require("sharp");
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

});

router.post("/user/logout",auth, async (req,res)=>{
try{
  req.user.tokens = req.user.tokens.filter((token)=>{
    return token.token !== req.token;
  });
  await req.user.save();
  res.status(200).send();
}catch(err){
  res.status(500).send(); 
}
});

router.post("/user/logout/all",auth, async (req,res)=>{
  try{
    req.user.tokens = []
    await req.user.save();
    res.status(200).send();
  }catch(err){
    res.status(500).send(); 
  }
  });

  
router.get("/user/me", auth,async (req,res)=>{

try{
  const user = req.user;
  res.status(200).send(user);
}catch(err){
    res.status(500).send();
    console.log(err);
}
});


// no need: depricated
// router.get("/user/:id", async (req,res)=>{
//     const _id = req.params.id;

//     try{
//      let user = await User.findById(_id);
//         if(!user){
//             res.status(404).send("no user found");
//         }else{
//             res.status(200).send(user);
//         }
//     }catch(err){
//         res.status(500).send(err);
//     }
    // User.findById(_id).then((user=>{
    //     if(!user){
    //         res.status(404).send("no uer found");
    //     }else{
        
    //         res.status(200).send(user);
           
    //     }
    // })).catch((err)=>{
    //     res.status(500).send(err);
    // });
// });

router.patch("/user/me", auth, async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password'];
    const isValid = updates.every(update => allowedUpdates.includes(update));
    if(!isValid){
        res.status(400).send("error: Invalid Update");
    }
    try{
      // let user = await User.findByIdAndUpdate(_id,req.body,{new : true, runValidators: true});
     
      let user = req.user;
      updates.forEach((update) => {
         user[update] = req.body[update]
      });
      // if(!user){
        // res.status(404).send();
      // }else{
        await user.save();
        res.status(200).send(user);
      // }
      
    }catch(err){
      res.status(500).send(err);
    }
});


router.delete("/user/me", auth, async (req,res)=>{
    const _id = req.user._id;
    try{
      // let user = await User.findByIdAndDelete(_id);
      // if(!user){
        // res.status(404).send();
      // }else{
        await req.user.remove(); //mongoose remove function
        res.status(200).send(req. user);
      // }
      
    }catch(err){
      res.status(404).send(err);
    }
});

const upload = multer({
  // dest: 'avatar', ///depricated: now it will pass the file in the callback instead of the avatar folder
  limits:{
    fileSize: 1000000 //1mb
  },
  fileFilter(req, file, callBack){
     //regular expression to check file format
    if(!file.originalname.match(/\.(png|jpeg|jpg)$/)){ 
        return callBack(new Error("Please upload an image"))
    }
    callBack(undefined, true)
  }
});


router.post("/user/me/avatar", auth , upload.single("avatar") , async (req,res)=>{
  
  const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer();
  // req.user.avatar = req.file.buffer; //depricated
  await req.user.save();
  res.status(200).send();

},(err,req,res,next)=>{ //callback forr error handling
   res.status(400).send({ error : err.message});
});

router.delete("/user/me/avatar", auth , async (req,res)=>{
  try{
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
  }catch(err){
    res.status(404).send();
  }
});

router.get("/user/:id/avatar",async (req,res)=>{
  try{
    const user = await User.findById(req.params.id);
   
    if(!user || !user.avatar){
      throw new Error();
    }
    res.set("Content-Type","image/png");
    res.send(user.avatar);
    
  }catch(err){
    console.log(err);
    res.status(404).send();
  }

})

module.exports = router;