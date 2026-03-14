const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose= require('passport-local-mongoose').default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
})
//salting and hashing apne aap ho jayega
userSchema.plugin(passportLocalMongoose);
//making model
module.exports=mongoose.model('User',userSchema);