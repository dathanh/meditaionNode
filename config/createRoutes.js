var express = require('express');
var router = express.Router();
var AdminUsers = require('../app/controllers/AdminUsers');
// var home = require('../app/controllers/home');
var Inflector = require('inflector-js');
var permissionCheck = require('./permissions');

module.exports = {
    setRoutes: (filename) => {
        fileControllers = module.exports.getFilename(filename);

        for (var controller in resource) {
            if (resource.hasOwnProperty(controller)) {
                for (var action in resource[controller]) {
                    if (resource[controller].hasOwnProperty(action)) {
                        tmpAction = resource[controller][action];
                        if (resource[controller][action].routes == "") {
                            resource[controller][action].routes = '/' + Inflector.dasherize(Inflector.underscore(controller)) + '/' + Inflector.dasherize(Inflector.underscore(action));
                        }
                        if (fileControllers[controller].hasOwnProperty('index')) {
                            router.get('/' + Inflector.dasherize(Inflector.underscore(controller)), permissionCheck, fileControllers[controller].index);
                        }

                        for (var method in resource[controller][action]['method']) {
                            if ((fileControllers[controller][action]) && controller != 'home') {
                                switch (resource[controller][action]['method'][method]) {
                                    case "post":
                                        router.post(tmpAction.routes, permissionCheck, fileControllers[controller][action]);
                                        break;
                                    case "put":
                                        break;
                                    case "delete":

                                        break;
                                    case "put":
                                        break;
                                    case "get":
                                        router.get(tmpAction.routes, permissionCheck, fileControllers[controller][action]);
                                        break
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    getResource: () => resource,
    setResource: listRoutes => resource = listRoutes,
    getRouter: () => router,
    getFilename: (filename = 'controllers') => {
        console.log(filename);
        var controllers = {};
        const path = require('path');
        const fs = require('fs');
        //joining path of directory
        const directoryPath = path.join(__dirname, `../app/${filename}`);
        //passsing directoryPath and callback function
        // fs.readdir(directoryPath, function(err, files) {
        //     //handling error
        //     if (err) {
        //         return console.log('Unable to scan directory: ' + err);
        //     }
        //     //listing all files using forEach
        //     files.forEach(function(file) {
        //         controllers[file.replace('.js', '')] = require('../app/controllers/' + file.replace('.js', ''));
        //         console.log(controllers[file.replace('.js', '')] );
        //     });
        //     return controllers;
        // });
        var file = fs.readdirSync(directoryPath);
        file.forEach(function(file) {
            controllers[file.replace('.js', '')] = require(`../app/${filename}/` + file.replace('.js', ''));
        });
        return controllers;
    },
}
