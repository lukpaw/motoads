var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('motoads', server);

db.open(function(err, db) {
  if (!err) {
    console.log("Connected to motoads database");
    db.collection('adverts', {strict: true}, function(err, collection) {
      if (err) {
        console.log("The adverts collection does not exist. Creating it with sample data...");
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

exports.findById = function(req, res) {
  var id = req.params.id;
  console.log('Retrieving advert: ' + id);
  db.collection('adverts', function(err, collection) {
    collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
      res.send(item);
    });
  });
};

exports.add = function(req, res) {
  var advert = req.body;
  console.log('Adding advert: ' + JSON.stringify(advert));
  db.collection('adverts', function(err, collection) {
    collection.insert(advert, {safe: true}, function(err, result) {
      if (err) {
        res.send({'error': 'An error has occurred'});
      } else {
        console.log('Success: ' + JSON.stringify(result[0]));
        res.send(result[0]);
      }
    });
  });
};

exports.update = function(req, res) {
  var id = req.params.id;
  var advert = req.body;
  console.log('Updating advert: ' + id);
  console.log(JSON.stringify(advert));
  delete advert._id;
  db.collection('adverts', function(err, collection) {
    collection.update({'_id': new BSON.ObjectID(id)}, advert, {safe: true}, function(err, result) {
      if (err) {
        console.log('Error updating advert: ' + err);
        res.send({'error': 'An error has occurred'});
      } else {
        console.log('' + result + ' document(s) updated');
        res.send(advert);
      }
    });
  });
};

exports.remove = function(req, res) {
  var id = req.params.id;
  console.log('Removing advert: ' + id);
  db.collection('adverts', function(err, collection) {
    collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function(err, result) {
      if (err) {
        res.send({'error': 'An error has occurred - ' + err});
      } else {
        console.log('' + result + ' document(s) removed');
        res.send(req.body);
      }
    });
  });
};

var populateDB = function() {
  var fs = require('fs');
  var file = './data/adverts.json';

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