module.exports=function(req,res,next){
    if(!req.session.siwe)
    {
        res.status(401).json({message:"Sign in First"})
    }
    next();
}