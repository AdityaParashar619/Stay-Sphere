const Listing=require('../models/listing.js');
const Review=require('../models/review.js');

//to add a review
module.exports.addReview=async (req,res)=>{
    let listings=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review);
    //author ki info ke liye
    newReview.author=req.user._id;
    listings.review.push(newReview)

    await newReview.save()
    await listings.save()
    req.flash('message','Review Successfully Created !!');
    res.redirect(`/listings/${listings._id}`);
}

//to delete review
module.exports.deleteReview=async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{ review:reviewId }})
    await Review.findByIdAndDelete(reviewId)
    req.flash('message','Review Deleted !!');
    res.redirect(`/listings/${id}`);
}