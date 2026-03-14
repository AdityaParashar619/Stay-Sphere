const express = require('express');
const wrapAsync=require("../utils/wrapAsync.js");
const router = express.Router({mergeParams:true});
//require multer for parsing of files
const multer  = require('multer')
//require storage from cloud
const {storage}=require('../config/cloudConfig.js')
//automatically file(which was uploaded by user while creating new listing) store in uploads file
const upload = multer({ storage })

const {isLoggedIn,isOwner,validateListing}=require("../middleware/middleware.js");

//require controllers
const listingController=require("../controllers/all_Listings.js");

//index and post route to home page or add a new listing
router.get('/',(req,res)=>{
    res.redirect(`/listings`);
})
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('lists[image]'),validateListing,wrapAsync(listingController.add))
// .post(upload.single('lists[image]'),  (req, res, next)=> {
//     res.send(req.file)
// })

//create new route
router.get('/new',isLoggedIn,wrapAsync(async (req,res)=>{
    res.render("listings/new.ejs")
}));

//to show, update and delete route
router.route('/:id')
    .get(wrapAsync(listingController.show))
    .put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.update))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.delete))


//to edit the listings
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.edit));

//now export the router
module.exports = router;