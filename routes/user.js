const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const passport = require("passport");
const {saveRedirectUrl }  = require("../middleware.js");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const userController=require("../controller/user.js");



router
.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.userSignup));


router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: 'login', failureFlash: true }),userController.userLogin);


router.get("/logout",userController.userLogout);

module.exports = router;