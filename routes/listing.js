const express=require("express");
const router=express.Router();
const listingController=require("../controller/listings.js");
const wrapAsync=require("../util/wrapAsync.js");
const {isLoggedIn}=require("../middleware.js");
const {validateListing,isOwner}=require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload= multer({ storage });

// IndexRoute
router.get("/",wrapAsync(listingController.index)); 

// New Route
router
.route("/new")
.get(isLoggedIn,listingController.new)
.post(isLoggedIn,upload.single('listings[image]'),wrapAsync(listingController.addNewlisting)); 
//above validatelisting remove bcz showing was error of listingsrequired


// show-Route
router
.route("/:id")
.get(isLoggedIn, wrapAsync(listingController.showIndividualListing))  
.patch(isLoggedIn, isOwner,upload.single('listings[image]'),validateListing,wrapAsync(listingController.updateListingdetailse)); 
//above validatelisting remove bcz showing was error of listingsrequired


// edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListingdetails));   
 // delete
 router.delete("/:id/delete",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing)); 

module.exports=router;

