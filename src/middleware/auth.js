




const auth  = async (req,res,next){
    console.log(req.path,req.method);
        next();
}