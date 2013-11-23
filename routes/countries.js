var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('motoads', server);

db.open(function(err, db) {
  if (!err) {
    console.log("Connected to motoads database");
    db.collection('countries', {strict: true}, function(err, collection) {
      if (err) {
        console.log("The countries collection does not exist. Creating it with sample data...");
        populateDB();
      }
    });
  }
});

exports.findAll = function(req, res) {
  db.collection('countries', function(err, collection) {
    collection.find().toArray(function(err, items) {
      console.log('countries send from DB');
      res.send(items);
    });
  });
};

var populateDB = function() {
  var fs = require('fs');
  var file = './data/countries.json';

  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    var countries = JSON.parse(data);
    db.collection('countries', function(err, collection) {
      if (err) {
        throw err;
      }
      collection.insert(countries, {safe: true}, function(err, result) {
        if (err) {
          throw err;
        }
      });
    });
  });
};