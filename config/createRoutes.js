var express = require('express');
var router = express.Router();
var AdminUsers = require('../app/controllers/AdminUsers');
// var home = require('../app/controllers/home');
var Inflector = require('inflector-js');
var resource = {
    AdminUsers: {
        __prefix: Inflector.dasherize(Inflector.underscore("AdminUsers")),
        index: {
            method: ["get"],
            routes: "",
        },
        add: {
            method: ["get", "post", "put"],
            routes: "",
        },
        edit: {
            method: ["post", "put"],
            routes: "",
        },
        delete: {
            method: ["delete", "put"],
            routes: "",
        },
    },
};
var getFilename = () => {
    var controllers = {};
    const path = require('path');
    const fs = require('fs');
    //joining path of directory
    const directoryPath = path.join(__dirname, '../app/controllers');
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
        controllers[file.replace('.js', '')] = require('../app/controllers/' + file.replace('.js', ''));
    });
    return controllers;
};
module.exports = {
    setRoutes: () => {
        fileControllers = getFilename();

        for (var controller in resource) {
            if (resource.hasOwnProperty(controller)) {
                for (var action in resource[controller]) {
                    if (resource[controller].hasOwnProperty(action)) {
                        tmpAction = resource[controller][action];
                        resource[controller][action].routes = '/' + Inflector.dasherize(Inflector.underscore(controller)) + '/' + Inflector.dasherize(Inflector.underscore(action));
                        // router.get('/admin-users/index', AdminUsers[action]);
                        for (var method in resource[controller][action]['method']) {
                            if ((fileControllers[controller][action]) && controller != 'home') {
                                switch (resource[controller][action]['method'][method]) {
                                    case "post":
                                        router.post(tmpAction.routes, fileControllers[controller][action]);
                                        break;
                                    case "put":
                                        break;
                                    case "delete":

                                        break;
                                    case "put":
                                        break;
                                    case "get":
                                        router.get(tmpAction.routes, fileControllers[controller][action]);
                                        break
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    getResource: () => {
        return resource;
    },
    getRouter: () => {
        return router;
    }
}
