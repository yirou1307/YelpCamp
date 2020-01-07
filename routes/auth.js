var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


// ROOT ROUTE:
router.get("/", function(req, res) {
	res.redirect("/campgrounds");
});

// SHOW REGISTER PAGE:
router.get("/register", function(req, res) {
	res.render("register");
});

// HANDLING USER SIGNUP
router.post("/register", function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	User.register(new User({username: username}), password, function(err, newUser) {
		if (err) {
			console.log(err);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			res.redirect("/campgrounds");
		});
	});
});

// SHOW LOGIN PAGE:
router.get("/login", function(req, res) {
	res.render("login");
});

// HANDLING LOGIN LOGIC
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}));

// LOGOUT
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/login")
});


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;