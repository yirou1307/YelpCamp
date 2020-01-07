var express = require("express");
var app = express();

app.set("view engine", "ejs");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/yelp_camp")

var methodOverride = require("method-override");
app.use(methodOverride("_method"));

var passport = require("passport");
var localStategy = require("passport-local");
app.use(require("express-session")({
	secret: "MaoMao is the best and cutiest baby",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var User = require("./models/user");

passport.use(new localStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

var authRoutes = require("./routes/auth");
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3000, process.env.IP, function() {
	console.log("The Yelp camp has started!");
});