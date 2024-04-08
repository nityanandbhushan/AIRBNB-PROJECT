const ExpressError=require("./util/ExpressError.js");
const {reviewSchema,listingSchema}=require("./schema.js");
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");


module.exports.isLoggedIn=(req,res,next)=>{ 
    
    if(!req.isAuthenticated()){ 
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/user/login");
    }
    next();
}; 

module.exports.saveRedirectUrl=(req,res,next)=>{ 
    console.log("save");
    if(req.session.redirectUrl){ 
        res.locals.redirectUrl=req.session.redirectUrl; 
    }
    next();
}; 
module.exports.isOwner= async(req,res,next)=>{ 
    let{id}=req.params; 
    let listing=await Listing.findById(id); 
    if(!listing.owner._id.equals(res.locals.currUser.id)){ 
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}; 

module.exports.validateListing=(req,res,next)=>{ 
    console.log(req.body);
    let {error}=listingSchema.validate(req.body);
    if(error){ 
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{ 
        next();
    }
}; 

module.exports.reviewValidate=(req,res,next)=>{ 
    let {error}=reviewSchema.validate(req.body);
    if(error){ 
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{ 
        next();
    }
};  

module.exports.isReviewAuthor=async(req,res,next)=>{ 
    let{id,reviewId}=req.params; 
    let review=await Review.findById(reviewId);
    console.log(review);
    if(!review.author._id.equals(res.locals.currUser.id)){ 
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


