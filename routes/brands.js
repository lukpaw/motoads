var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('motoads', server);

db.open(function(err, db) {
  if (!err) {
    console.log("Connected to motoads database");
    db.collection('brands', {strict: true}, function(err, collection) {
      if (err) {
        console.log("The brands collection does not exist. Creating it with sample data...");
        populateDB();
      }
    });
  }
});

exports.findAll = function(req, res) {
  db.collection('brands', function(err, collection) {
    collection.find().toArray(function(err, items) {
      console.log('brands send from DB');
      res.send(items);
    });
  });
};

var populateDB = function() {
  var fs = require('fs');
  var file = './data/brands.json';

  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    var brands = JSON.parse(data);
    db.collection('brands', function(err, collection) {
      if (err) {
        throw err;
      }
      collection.insert(brands, {safe: true}, function(err, result) {
        if (err) {
          throw err;
        }
      });
    });
  });
};