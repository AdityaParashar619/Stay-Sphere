// require all packages
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
var methodOverride = require('method-override');
const expressError=require("./utils/expressError.js");
//require the passport
const passport = require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');
//for our cloud server
if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}
console.log(process.env.CLOUD_NAME);

//require the router
const listingsRouter=require("./routes/listings.js");
const reviewsRouter=require("./routes/reviews.js");
const usersRouter=require("./routes/users.js");

const session=require("express-session");
const flash=require("connect-flash");

//require ejs_mate
const ejsMate = require('ejs-mate');
//set the engine
app.engine('ejs', ejsMate);
//making a port
const port=8080;

//require the data
const Data = require('./init/data.js');
const passportLocalMongoose = require("passport-local-mongoose");

//making function main for mongoose
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/StaySphere")
}
main().then(()=>{
    console.log("MongoDB Connected");
}).catch((err)=>{console.log(err)})

//setting and use the app
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//to set session options
const sessionOptions={secret:"secret String",resave:false,saveUninitialized:true,
    //cookie expires upto 7 days
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true}
};
app.use(session(sessionOptions));
app.use(flash());

//code for passport authentication

//method to initialize passport
app.use(passport.initialize());
//ye btayega ki user ek session ke andar passport ka use krega (sb kuch session ke antral me hoga)
app.use(passport.session());
//it indicates that use uses passport local and authenticate with the help of authenticate method
passport.use(new LocalStrategy(User.authenticate()));
//serialize stores the users into an session and deserialize remove the users(ek baar serialize krne pr deserialize bhi krna jruri h)
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

//making middleware for flash
app.use((req,res,next)=>{

    res.locals.success=req.flash('message');
    res.locals.errors=req.flash('error');
    res.locals.curUser=req.user;
    next();
})

//use all the listing routes
app.use('/listings',listingsRouter);

// use all review route
app.use('/',reviewsRouter);

//use all users route for sign up
app.use('/',usersRouter);

//when somehow different route pr jaye info
app.use((req,res,next)=>{
    next(new expressError(404,'Page Not Found'));
})

//error handler
app.use((err,req,res,next)=>{
    const {status=400,message="Something went wrong"}=err;
    res.status(status).render("error.ejs",{err});

})
//listening the port
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
})