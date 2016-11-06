const fetch = require('node-fetch');
var config = require('./config.json');

function calculateDistance(to) {
	return new Promise( (resolve, reject) => {
		var from = config.myLocation;
		// console.log(from);
		// console.log(to, "to here");

		var url = formatURL(from, to);
		// console.log(url);
		fetch(
			url
		).then(response => {
			return response.json();
		}).then(data => {
			return resolve(data.rows[0].elements[0].distance.text);
		}).catch(function(error) {
			return reject(error);
		});
	});
}

function formatURL(from, to) {
	return "https://maps.googleapis.com/maps/api/distancematrix/json?" + 
		"origins=" + replaceSpace(from) +
		"&destinations=" + replaceSpace(to) +
		"&units=imperial" + 
		"&key=" + config.googleAPI;
}

function replaceSpace(location) {
	location = location.split('#').join('');
	return location.split(' ').join('+');
}

// calculateDistance("900 Jackson Street #410, Dallas, TX 75202", "219 Sunset Ave., Ste. 116-A, Dallas, TX 75208-4531");
exports.calculateDistance = calculateDistance;