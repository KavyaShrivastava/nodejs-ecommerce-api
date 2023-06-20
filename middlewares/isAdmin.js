import User from "../model/User.js"

const isAdmin = async (req,res,next) =>{
    //find thr login 
    const user = await User.findById(req.userAuthId);
    if(user.isAdmin){
        next()
    }
    else{
        next(new Error('Access Denied. Admin only'))
    }
};

export default isAdmin