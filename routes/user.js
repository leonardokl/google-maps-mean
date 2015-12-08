"use strict";

const express = require("express"),
	router = new express.Router(),
	bodyParser = require("body-parser"),
	UserCtrl = require("../controllers/user");

router.use(bodyParser.json());

router.route("/")
	.get(UserCtrl.getAll)
	.post(UserCtrl.create);

module.exports = router;
