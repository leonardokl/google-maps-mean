"use strict";

const mongoose = require("mongoose"),
UserSchema = mongoose.Schema({
	username: {type: String, required: true},
	gender: {type: String, required: true},
	birthDate: {type: Date},
	campus: {type: String, required: true},
	location: {type: [Number], required: true}, // [Long, Lat]
	education: {type: String, required: true},
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now}
});

UserSchema.pre('save', function(next){
	let now = new Date();

	this.updated_at = now;
	if(!this.created_at) {
		this.created_at = now;
	}
	next();
});

UserSchema.index({location: '2dsphere'});

module.exports = mongoose.model("User", UserSchema);
