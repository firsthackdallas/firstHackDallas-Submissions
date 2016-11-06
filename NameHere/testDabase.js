var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/userSchema');
var Service = require('./models/serviceSchema');
var calculator = require('./calculateDistance');
var database = require('./database');
var config = require('./config.json');

// connect to database
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to database");
});



var app = express();

app.use(bodyParser.json());

app.post('/testDB', (req, res) => {
    var data = req.body;
    database.addUser(data).then(function(response) {
        res.json(response);
    }, function(error) {
        res.json(error);
    });
});

app.post('/updateUser', (req, res) => {
    var data = req.body;
    database.updateUser(data).then(function(response) {
        res.json(response);
    }, function(error) {
        res.json(error);
    });
});

app.get('/getService', (req, res) => {
    var query = req.headers;
    database.getService(query).then(function(response) {
        res.json(response);
    }, function(error) {
        res.json(error);
    });
});

app.post('/addService', (req, res) => {
    var data = req.body;
    database.addService(data).then(function(response) {
        res.json(response);
    }, function(error) {
        res.json(error);
    });
});

app.listen(8080);