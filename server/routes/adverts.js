var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('motoads', server);

db.open(function(err, db) {
  if (!err) {
    console.log("Connected to 'motoads' database");
    db.collection('adverts', {strict: true}, function(err, collection) {
      if (err) {
        console.log("The 'adverts' collection doesn't exist. Creating it with sample data...");
        populateDB();
      }
    });
  }
});

exports.findAll = function(req, res) {
  db.collection('adverts', function(err, collection) {
    collection.find().toArray(function(err, items) {
      console.log('adverts send from DB');
      res.send(items);
    });
  });
};

var populateDB = function() {
  var fs = require('fs');
  var file = './server/data/adverts.json';

  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    var adverts = JSON.parse(data);
    db.collection('adverts', function(err, collection) {
      if (err) {
        throw err;
      }
      collection.insert(adverts, {safe: true}, function(err, result) {
        if (err) {
          throw err;
        }
      });
    });
  });
};