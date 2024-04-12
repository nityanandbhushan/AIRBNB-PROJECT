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
let categoryAll = [
	"Beachfront",
	"Cabins",
	"Omg",
	"Lake",
	"Design",
	"Amazing Pools",
	"Farms",
	"Amazing Views",
	"Rooms",
	"Lakefront",
	"Tiny Homes",
	"Countryside",
	"Treehouse",
	"Trending",
	"Tropical",
	"National Parks",
	"Casties",
	"Camping",
	"Top Of The World",
	"Luxe",
	"Iconic Cities",
	"Earth Homes",
];


const initDb=async ()=>{ 
    await Listing.deleteMany({}); 
    dataIn.data=dataIn.data.map((obj)=>({
        ...obj,
        owner:"660a75f947727d3b2e65215c",
        price:obj.price* 25,
        category:[ 
            `${categoryAll[Math.floor(Math.random()*22)]}`,
            `${categoryAll[Math.floor(Math.random()*22)]}`,
        ],
    }));
    await Listing.insertMany(dataIn.data);
    console.log("data was initialize");
}; 
initDb();