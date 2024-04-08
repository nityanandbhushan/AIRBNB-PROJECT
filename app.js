if(process.env.NODE_ENV!="production"){ 
    require('dotenv').config();
}

const express=require("express"); 
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const ExpressError=require("./util/ExpressError.js");
const path=require("path");
const app=express(); 
const ejsMate=require("ejs-mate");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const users=require("./routes/user.js");
const url="mongodb://127.0.0.1:27017/wanderlust"; 
const session=require("express-session");
const flash=require("connect-flash");
const port=8080; 
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");




app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
app.set("view engine","ejs"); 
app.set("views",path.join(__dirname,"views")); 

main().then(()=>{ 
    console.log("connection is stablish");
}).catch((err)=>{ 
    console.log(err);
});

async function main(){ 
    await mongoose.connect(url);
};  
 
app.get("/",(req,res)=>{ 
    res.send("Hi, I am root");
});

const sessionOptions={ 
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() +7*24*60*60*1000,
        maxAge:7*24*60*1000,
        httpOnly:true,
    }

}; 

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{ 
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});


//Demo-of-User---------------------- 

// app.get("/demouser",async(req,res)=>{ 
//     let fakeUser=new User({ 
//         email:"student@gmail.com",
//         username:"delta-student",
//     });
    
//    let registerUser=await User.register(fakeUser,"helloworld");
//    res.send(registerUser);

// });




app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/user",users);


app.get("*",(req,res,next)=>{ 
    next(new ExpressError(404,"Page Not Found"));
});


app.use((err,req,res,next)=>{ 
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});  
});


app.listen(port,()=>{ 
    console.log(`Server is listening on port${port}`); 
});