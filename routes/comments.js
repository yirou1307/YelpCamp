var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// NEW ROUTE
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, data) {
		if (err) {
			console.log(err)
		} else {
			res.render("comments/new", {data, data});
		}
	});
});

// CREATE ROUTE
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
	var campgroundId = req.params.id;
	Campground.findById(campgroundId, function(err, cg) {
		if (err) {
			console.log(err)
		} else {
			Comment.create({
				content: req.body.content,
			}, function(err, cmt) {
				if (err) {
					console.log(err);
				} else {
					cmt.author.id = req.user._id;
					cmt.author.username = req.user.username;
					cmt.save();
					cg.comments.push(cmt);
					cg.save();
				}
				res.redirect("/campgrounds/" + campgroundId);
			});
		}
	})
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;
