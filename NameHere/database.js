var mongoose = require('mongoose');
var User = require('./models/userSchema');
var Service = require('./models/serviceSchema');
var calculator = require('./calculateDistance');

var config = require('./config.json');



function getService(query) {
    return new Promise(function(resolve, reject) {
        Service.find({}, function(err, data) {
            if (err) return reject(err);
            else {
                var promises = [];
                var result = [];
                data.map((service, index, array) => {
                    promises.push(calculator.calculateDistance(service.location).then(distance => {
                        result.push({service: service, distance: distance});
                    }, error => {
                        
                    }));
                });

                Promise.all(promises).then(function() {
                    resolve(result.slice(0, 3));
                });
            }
        });


    });
}

function addService(data) {
    return new Promise(function (resolve, reject) {
        Service.create(data, function(err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

function addUser(data) {
    return new Promise(function (resolve, reject) {
        User.create(data, function(err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

function updateUser(data) {
    return new Promise(function (resolve, reject) {
        User.update({OauthToken: data.OauthToken}, data, (error) => {
            if (error) return reject(error);
            else return resolve('update all field');
        });
    });
}

exports.getService = getService;
exports.addService = addService;
exports.addUser = addUser;
exports.updateUser = updateUser;