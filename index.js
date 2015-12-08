"use strict";

require("dotenv").load();

const path = require("path"),
	express = require("express"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	bluebird = require("bluebird"),
	morgan = require("morgan"),
	debug = require("debug")("server"),
	app = express(),
	port = process.env.PORT || 8080,
	db = process.env.DB,
	routes = require("./routes/user");

mongoose.connect(db);
mongoose.Promise = bluebird.Promise;
mongoose.set("debug", true);

app.use(express.static(__dirname + "/public"));
app.use("/bower_components", express.static(__dirname + "/bower_components"));
app.use(morgan("dev"));
app.use(methodOverride());

app.get("/", (req, res) => {
	res.sendFile(path.join("index.html"));
});

app.use("/api/users", routes);

app.listen(port, () => {
	debug("conn")
});
