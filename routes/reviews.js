const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn, isReviewAuthor}=require("../middleware/middleware.js");


//to require the controllers
const reviewController=require("../controllers/all_reviews.js");

//to add the review (post route)
router.post('/listings/:id/reviews',isLoggedIn,validateReview,wrapAsync(reviewController.addReview))

//to delete the review route
router.delete('/listings/:id/reviews/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;