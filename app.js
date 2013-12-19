
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var apikit = require('./lib/apikit.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
//app.use(express.express('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.errorHandler());


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var api = new apikit('./raml/regression.yml', app, function(configuredApp){
    http.createServer(configuredApp).listen(configuredApp.get('port'), function(){
        console.log('Express server listening on port ' + configuredApp.get('port'));
    });
});
