const Review = require("../models/review.js"); 
const Listing=require("../models/listing.js");


module.exports.addNewReview=(async(req,res,next)=>{ 
    let listing= await Listing.findById(req.params.id);
    
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    
    listing.reviews.push(newReview);
    
    await newReview.save(); 
    await listing.save();
  
    req.flash("success","New Reveiw Created!");
    res.redirect(`/listings/${req.params.id}`); 
}); 

module.exports.deleteReview=(async(req,res,next)=>{ 
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
});