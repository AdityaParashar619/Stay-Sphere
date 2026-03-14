const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const reviewSchema = new Schema({
    comment:{
      type:String,
      minlength:5,
        maxlength:200,
    },
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
})

//making model
const Review=mongoose.model('Review',reviewSchema);

//now export
module.exports=Review;