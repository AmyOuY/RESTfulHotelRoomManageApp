var express = require("express"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost/roomApp");


var roomSchema = new mongoose.Schema({
	number: Number,
	capacity: Number,
	price: Number,
	image: String,
	description: String	
});


var Room = mongoose.model("Room", roomSchema);


// var newRoom = new Room({
// 	number: 101,
// 	capacity: 1,
// 	price: 150,
// 	image: "https://www.photosforclass.com/download/px_97083",
// 	description: "Cozy single room with large bed and good view of the beautiful garden"	
// });


// newRoom.save(function(err, room){
// 	if (err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log(room);
// 	}
// });


app.get("/", function(req, res){
	res.redirect("/rooms");
});


app.get("/rooms", function(req, res){
	Room.find({}, function(err, rooms){
		if (err){
			console.log(err);
		}
		else{
			res.render("index", {rooms: rooms});
		}
	});
});


app.get("/rooms/new", function(req, res){
	res.render("new");
});


app.post("/rooms", function(req, res){
	req.body.room.description = req.sanitize(req.body.room.description);
	Room.create(req.body.room, function(err, newRoom){
		if (err){
			res.render("new");
		}
		else{
			res.redirect("/rooms");
		}
	});
});


app.get("/rooms/:id", function(req, res){
	Room.findById(req.params.id, function(err, foundRoom){
		if (err){
			res.redirect("/rooms");
		}
		else{
			res.render("show", {room: foundRoom});
		}
	});
});


app.get("/rooms/:id/edit", function(req, res){
	Room.findById(req.params.id, function(err, foundRoom){
		if (err){
			res.redirect("/rooms");
		}
		else{
			res.render("edit", {room: foundRoom});
		}
	});
});


app.put("/rooms/:id", function(req, res){
	req.body.room.description = req.sanitize(req.body.room.description);
	Room.findByIdAndUpdate(req.params.id, req.body.room, function(err, updatedRoom){
		if (err){
			res.redirect("/rooms");
		}
		else{
			res.redirect("/rooms/" + req.params.id);
		}
	});
});


app.delete("/rooms/:id", function(req, res){
	Room.findByIdAndRemove(req.params.id, function(err, deletedRoom){
		if (err){
			res.redirect("/rooms");
		}
		else{
			res.redirect("/rooms");
		}
	});
});


app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The hotel room management app server is running!");
});
