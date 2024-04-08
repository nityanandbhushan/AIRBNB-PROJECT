const express = require("express");
const app = express();
const User = require("../models/user.js");

module.exports.renderSignUpForm= (req, res) => {
    console.log("signup");
    res.render("./users/signup.ejs");
}; 
module.exports.userSignup=async (req, res) => {
 
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }  
            req.flash("success", "welcome to wanderlust");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup"); 
    }
}; 
module.exports.renderLoginForm= (req, res) => {
    res.render("./users/login.ejs");
}; 

module.exports.userLogin= async (req, res) => {

    req.flash("success", "Welcome back to Wanderlust");
    
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}; 

module.exports.userLogout=(req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");

        // res.redirect("/res.locals.redirectUrl");
        res.redirect("/listings");
        // console.log(res.locals.redirectUrl);
    });
};