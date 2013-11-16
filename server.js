var express = require('express');
var path = require('path');
var http = require('http');
var brands = require('./routes/brands');
var countries = require('./routes/countries');
var adverts = require('./routes/adverts');

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  // TODO should be created separate test server
  app.use('/test', express.static(path.join(__dirname, 'test')));
});

app.get('/api/brands', brands.findAll);
app.get('/api/countries', countries.findAll);

app.get('/api/adverts', adverts.findAll);
app.get('/api/adverts/:id', adverts.findById);
app.post('/api/adverts', adverts.add);
app.put('/api/adverts/:id', adverts.update);
app.delete('/api/adverts/:id', adverts.remove);

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});