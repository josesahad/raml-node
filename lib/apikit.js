/**
 * Created by juancavallotti on 19/12/13.
 */
var raml = require('raml-parser');

/**
 * Create a new apikit router
 * @param filename the raml file to define the routes.
 * @param expressApp the express app.
 * @param callback the callback function when the resources are completely loaded.
 * @param errorCallback the error callback, invoked when there are errors parsing the raml file.
 */
module.exports = function(filename, expressApp, callback, errorCallback) {

    raml.loadFile(filename).then(
        function(data) {
            //successful parsing of the raml file.
            var apiResources = data.resources;
            console.info("Loaded Resources from the RAML file");
            console.info(apiResources);

            //go through the api resources.
            for (var i=0;i<apiResources.length;i++) {

                //for each defined method
                for (var j=0;j<apiResources[i].methods.length;j++) {

                    //what method
                    var method = apiResources[i].methods[j].method;

                    //what path
                    var resourcePath = apiResources[i].relativeUri;

                    //load the api handler

                    try {
                        var handler = require('../routes' + apiResources[i].relativeUri);
                    } catch (exception) {
                        console.error("Got error while loading resource handler for: " + method + " " + resourcePath);
                        console.error(exception);

                        //do not add.
                        continue;
                    }
                    //add to the express app.
                    expressApp[method](resourcePath, handler[method]);
                    console.info("Added " + method + " " + resourcePath);
                }
            }

            //if the callback is not present return.
            if (!callback) {
                console.error("There is no handler for transmitting the results.");
            }

            //invoke the callback
            callback(expressApp);

        },
        function(error) {
            if (!errorCallback) {
                return;
            }
            errorCallback(raml);
        }
    );
}