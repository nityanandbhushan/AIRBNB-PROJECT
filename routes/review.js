const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../util/wrapAsync.js");


const reviewController=require("../controller/review.js");
const {reviewValidate,isLoggedIn,isReviewAuthor}=require("../middleware.js");




//Add-New-Listing
router.post("/",isLoggedIn,reviewValidate,wrapAsync(reviewController.addNewReview)); 

// Review-Delete
router.delete("/:reviewId/delete",isReviewAuthor,reviewController.deleteReview);

module.exports=router;
