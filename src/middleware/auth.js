const jwt = require("jsonwebtoken");
const User = require("../models/user.js");



const auth  = async (req,res,next) => {
  try{
     const token = req.header("Authorization").replace("Bearer ","");
     const decoded = jwt.verify(token,"sampletext")
     const user = await User.findOne({_id: decoded._id, "tokens.token": token})
     
     if(!user){
         throw new Error();
     }
     req.token = token; // attached token to request
     req.user = user; // attached user to request
     next();

    }catch(err){
      res.status(401).send("Error: Please authenticate");
  }

}

module.exports = auth;