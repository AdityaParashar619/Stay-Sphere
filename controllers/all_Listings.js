const Listing=require('../models/listing.js');
const geocodeLocation = require("../utils/geocode");
//here we simplify our code by exports all routes function

//index route function
module.exports.index=async (req,res)=>{
    try {
        let listing = await Listing.find();
        return res.render("listings/home.ejs", {listing})
    }catch(err){
        console.log(err);
    }
}

//show route function
module.exports.show=async (req,res,next)=>{
    let {id} = req.params;
    //to display author name with review
    let lists=await Listing.findById(id).populate({path:"review", populate:{path:"author"}}).populate("owner")
    if(!lists){
        // req.flash('error','Listing you looking for does not exist!');
        // res.redirect('/listings');
        return next(new ExpressError("Listing not found!", 404));
    }
    return res.render("listings/show.ejs",{lists})
}

//to add a new route
module.exports.add=async (req,res,next)=>{ //wrapAsync for error handling
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.lists);
    newListing.owner=req.user._id;
    newListing.image={url,filename};

    const geoData = await geocodeLocation(newListing.location);

    newListing.geometry = {
        type:"Point",
        coordinates:[geoData.lng, geoData.lat]
    };
    await newListing.save();
    req.flash('message','Listing successfully Created !!');
    return res.redirect('/listings');
}

//to edit the route
module.exports.edit=async (req,res)=>{
    let {id} = req.params;

    let list=await Listing.findById(id);
    if(!list){
        req.flash('error','Listing you looking for does not exist!');
        return res.redirect('/listings');
    }

    let originalImage=list.image.url;
    originalImage=originalImage.replace("/uploads/","uploads/h_200,w_250");
    return res.render("listings/edit.ejs",{list,originalImage});
}

//to update the listings
module.exports.update=async (req,res)=>{
    let {id} = req.params;
    const updateListing=await Listing.findByIdAndUpdate(id,{...req.body.lists})
   if(typeof req.file!=="undefined"){
       let url=req.file.path;
       let filename=req.file.filename;
       updateListing.image={url,filename};
       await updateListing.save();
   }
    req.flash('message','Listing successfully Updated !!');
    return res.redirect(`/listings/${id}`);
}

//to delete the listings
module.exports.delete=async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('message','Listing Deleted !!');
    return res.redirect('/listings');
}