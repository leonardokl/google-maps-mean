"use strict";

const User = require("../models/user");

module.exports = {
	getAll(req, res) {
		User.find()
			.then(users => {
				res.status(200).json(users);
			})
			.catch(err => {
				res.status(500).json(err);
			});
	},

	create(req, res) {
		let user = new User(req.body);

		user.save()
			.then(user => {
				res.status(200).json(user);
			})
			.catch(err => {
				res.status(500).json(err);
			});
	}
};
