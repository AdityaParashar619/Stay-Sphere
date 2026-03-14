if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}
const mongoose = require('mongoose');
const initData=require('./data.js');
const Listing=require('../models/listing.js');

//making function main for mongoose
async function main(){
    await mongoose.connect(process.env.DB_URL)
}
main().then(()=>{
    console.log("MongoDB Connected");
}).catch((err)=>{console.log(err)})

const initDB=async () => {
   await Listing.deleteMany({})
    //it is for making owner of each listing
    initData.data=initData.data.map((obj)=>({
       ...obj,
       owner:"69b53edca1b75572fbff1ed7"
    }))
    await Listing.insertMany(initData.data)
    console.log("database initialized");
}
initDB();