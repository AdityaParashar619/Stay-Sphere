const Listing=require('../models/listing.js');
const Review=require('../models/review.js');
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema}=require("../schema.js");
const {reviewSchema}=require("../schema.js");
const expressError=require("../utils/expressError.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //it is for log in ke baad hm whi phuche jha hme jana tha
        req.session.redirectUrl=req.originalUrl
        console.log(req.user)
        req.flash('error','You must be logged in to create a listing.');
        return res.redirect('/log_in');
    }
    next();
}

//but there is a problem with it passport req.session ko delete kr deta if kuch ho usme to, to hm use res.locals me save krayenge
//or fir use use krenge
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}

//making a middleware for jo owner nhi h wo edit/update na kr ske
module.exports.isOwner= async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curUser._id)){
        req.flash('error','You are not the owner of this listing.');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// make a middleware to validate listing schema
module.exports.validateListing=(req,res,next)=>{
    console.log(req.body);
    let {error}=listingSchema.validate(req.body.listing);
    console.log(error)
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new expressError(500,errMsg);
    }
    else {
        next();
    }
}

// make a middleware to validate review schema
module.exports.validateReview=(req,res,next)=>{
    console.log(req.body);
    let {error}=reviewSchema.validate(req.body);
    console.log(error)
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new expressError(400,errMsg);
    }
    else {
        next();
    }
}

//make a middleware for jo author nhi h wo delete bhi na kr ske
module.exports.isReviewAuthor= async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curUser._id)){
        req.flash('error','You are not the author of this review.');
        return res.redirect(`/listings/${id}`);
    }
    next();
}