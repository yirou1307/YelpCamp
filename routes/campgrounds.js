var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

// INDEX ROUTE
router.get("/campgrounds", function(req, res) {
	Campground.find({}, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {data: data, currentUser: req.user});
		}
	});
});

// NEW ROUTE:
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// CREATE ROUTE:
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	Campground.create({
		name: name, 
		image: image,
		description: description,
		author: author,
		comments: []
	}, function(err, newCampground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds/new");
		} else {
			res.redirect("/campgrounds");
		}
	});
});
	
// SHOW ROUTE:
router.get("/campgrounds/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, found) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/show", {data: found});
		}
	});
});

// EDIT:
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, found) {
		res.render("campgrounds/edit", {data: found});
	});
});

// UPDATE:
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body, function(err, updated) {
		if (err) {
			console.log(err);
		} else {
			console.log(updated);
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY:
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
	// find campground in DB;
	Campground.findByIdAndRemove(req.params.id, function(err, found) {
		if (err) {
			console.log(err);
		} else {
			// remove all comments below from DB;
			found.comments.forEach(function(comment) {
				Comment.findByIdAndRemove(comment._id, function(err) {
					if (err) {
						console.log(err);
					}
				});
			});
			res.redirect("/");
		}
	});
});

module.exports = router;