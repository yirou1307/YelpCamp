var Campground = require("../models/campground");

var middlewareObject = {};

middlewareObject.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
};

middlewareObject.checkCampgroundOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, found) {
			if (err) {
				console.log(err);
				res.redirect("back");
			} else if (found.author.id.equals(req.user._id)) {
				next();
			} else {
				res.redirect("back");
			}
		});
	} else {
		res.redirect("back");
	}
};

module.exports = middlewareObject;