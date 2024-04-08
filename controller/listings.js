const Listing=require("../models/listing.js");
const ExpressError=require("../util/ExpressError.js");


module.exports.index=(async(req,res,next)=>{ 
    let allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}); 

module.exports.new=(req,res,next)=>{ 
    res.render("./listings/new.ejs");
}; 

module.exports.addNewlisting=async(req,res,next)=>{ 
    const API_KEY='AIzaSyDwK6xcqEMUEbYdiayBbQLEu7QhmV66z3g';
    const axios = require('axios');

    // Function to fetch geocoding data from Google Maps API
  async function getGeocodingData(address) {
      try {
        // const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        //   params: {
        //     address: address,
        //     key: 'AIzaSyDwK6xcqEMUEbYdiayBbQLEu7QhmV66z3g' // Replace with your Google API key
        //   }
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
    
        if (response.data.status === 'OK') {
          // Extracting latitude and longitude from the response
          const location = response.data.results[0].geometry.location;
          return {
            latitude: location.lat,
            longitude: location.lng
          };
        } else {
          throw new Error('Failed to geocode address');
        }
      } catch (error) {
        console.error('Error fetching geocoding data:', error.message);
        throw error;
      }
    }
    
    // // Example usage
    // const address = '1600 Amphitheatre Parkway, Mountain View, CA';
    // getGeocodingData(address)
    //   .then(coordinates => {
    //     console.log('Geocoding data:', coordinates);
    //   })
    //   .catch(error => {
    //     console.error('Error:', error.message);
    //   });
    

    let address=req.body.listings.location;
    let data=getGeocodingData(address);
    console.log("nitya");
    console.log(data);

    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename);
    // const newListing=await Listing.insertMany(req.body.listings);
    const newListing=new Listing(req.body.listings);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    // await Listing.insertMany(req.body.listing);
    res.redirect("/listings");    
}; 

module.exports.showIndividualListing=async(req,res,next)=>{ 
    let {id}=req.params;
    let data= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner"); 
    
    if(!data){ 
        req.flash("error","You request that does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{data});
}; 
module.exports.editListingdetails=(async(req,res,next)=>{
    let {id}=req.params; 
    const data=await Listing.findById(id); 
   
    let originalImageUrl=data.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200,w_256");
    if(!data){ 
        req.flash("error","You request that does not exist!");
        res.redirect("/listings");
    }
   
    res.render("./listings/edit.ejs",{data,originalImageUrl});
});

module.exports.updateListingdetailse=(async(req,res,next)=>{ 
    console.log("hi listing update");
    if(!req.body.listings){ 
        throw new ExpressError(400,"Send valid data for list");
    }
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listings}); //distruct here data
    if(typeof req.file !=="undefined"){ 
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect("/listings");
 }); 

 module.exports.deleteListing=(async(req,res,next)=>{ 
    let {id}=req.params;
    await Listing.findByIdAndDelete(id); 
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
});
