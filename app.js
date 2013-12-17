
/**
 * Module dependencies.
 */

var express = require('express');
var raml = require('raml-parser');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.express('dev'));
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

raml.loadFile('raml/regression.yml').then( function(data) {
    var apiResources = data.resources;
    console.log(data.resources[0].methods);

    for (var i=0;i<apiResources.length;i++) {
        for (var j=0;j<apiResources[i].methods.length;j++) {
            app[apiResources[i].methods[j].method](apiResources[i].relativeUri,
                require('./routes' + apiResources[i].relativeUri)[apiResources[i].methods[j].method]);
            console.log(apiResources[i].methods[j].method);
        }

        console.log(apiResources[i].relativeUri);
    }

    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
}, function(error) {
    console.log('Error parsing: ' + error);
});



