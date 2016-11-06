var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
	id: {
		type: String,
		require: true
	},
	name: String,
	ssn: String,
	address: String,
	sex: String,
	martial_status: String,
	education_level: String
});

var User = mongoose.model('User', user);

module.exports = User;