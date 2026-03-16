const mongoose=require('mongoose');
const {Schema} = require("mongoose");
const Review=require('./review.js');

// make schema
const listingSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
    },
    description: {
        type: String,
        required: true,
        // minlength: 15,
    },
    image:{
        url:String,
        filename:String,
    },
    price: {
        type: Number,
        min: 0,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    review:[{
        type:Schema.Types.ObjectId,
        ref:'Review',
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },

    geometry:{
        type:{
            type:String,
            enum:["Point"],

        },
        coordinates:{
            type:[Number],

        }
    }

});

//now making a post middleware to delete the reviews
//that means jb post delete ho to db se reviews apne aap delete ho jaye
listingSchema.post('findOneAndDelete',async (listings)=>{
    if(listings) {
        await Review.deleteMany({_id: {$in: listings.review}});
    }
})

//make model
const Listing=mongoose.model('Listing',listingSchema);

//exporting the module
module.exports=Listing;