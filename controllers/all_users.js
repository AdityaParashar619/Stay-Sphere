const User=require('../models/user.js');

//for post request for sign up
module.exports.sign_up=async (req,res)=>{
    try{
        let {username, email, password} = req.body;
        let newUser=new User({username: username, email: email});
        let result=await User.register(newUser,password);

        //it is for sign up ke bad wps log in na karna pde apne aap log in ho jaye
        req.login(result, (err)=>{
            if(err){return next(err);}
            req.flash('message','User registered successfully.');
            return res.redirect('/listings')
        });
    }catch(err){
        req.flash('error',err.message);
        res.redirect('/sign_up');
    }
}

//posts request for login user
module.exports.login=async (req,res)=>{
    req.flash('message','User logged in successfully.');
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

//to logout
module.exports.logout=(req,res,next)=>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash('message','User logged out successfully.');
        res.redirect('/listings');
    });
}