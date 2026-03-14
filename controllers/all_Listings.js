const Listing=require('../models/listing.js');

//here we simplify our code by exports all routes function

//index route function
module.exports.index=async (req,res)=>{
    let listing=await Listing.find();
    res.render("listings/home.ejs",{listing})
}

//show route function
module.exports.show=async (req,res)=>{
    let {id} = req.params;
    //to display author name with review
    let lists=await Listing.findById(id).populate({path:"review", populate:{path:"author"}}).populate("owner")
    if(!lists){
        // req.flash('error','Listing you looking for does not exist!');
        // res.redirect('/listings');
        return next(new ExpressError("Listing not found!", 404));
    }
    res.render("listings/show.ejs",{lists})
}

//to add a new route
module.exports.add=async (req,res,next)=>{ //wrapAsync for error handling
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.lists);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash('message','Listing successfully Created !!');
    res.redirect('/listings');
}

//to edit the route
module.exports.edit=async (req,res)=>{
    let {id} = req.params;
    let list=await Listing.findById(id);
    res.render("listings/edit.ejs",{list});
}

//to update the listings
module.exports.update=async (req,res)=>{

    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.lists})
    req.flash('message','Listing successfully Updated !!');
    res.redirect(`/listings/${id}`);
}

//to delete the listings
module.exports.delete=async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('message','Listing Deleted !!');
    res.redirect('/listings');
}