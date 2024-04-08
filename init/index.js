const dataIn=require("./data.js");
const Listing=require("../models/listing.js"); 

const mongoose=require("mongoose"); 

const url="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{ 
    console.log("connection establish");
}).catch((err)=>{ 
    console.log(err);
}); 

async function main(){ 
    await mongoose.connect(url);
}; 


const initDb=async ()=>{ 
    await Listing.deleteMany({}); 
    dataIn.data=dataIn.data.map((obj)=>({...obj,owner:"660a75f947727d3b2e65215c"}));
    await Listing.insertMany(dataIn.data);
    console.log("data was initialize");
}; 
initDb();