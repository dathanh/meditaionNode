const numeral = require('numeral');
const bcrypt = require('bcrypt-nodejs');
const dateFormat = require('dateformat');
const jsonwebtoken = require('jsonwebtoken');
const empty = require('is-empty');
const Validator = require('Validator');
const paginate = require('express-paginate');
const path = require('path');
const RESPONSE_CODE_NOT_FOUND = 404;
const RESPONSE_CODE_UN_AUTHORIZATION = 401;
const RESPONSE_CODE_BAD_REQUEST = 500;
const RESPONSE_CODE_SUCCESS = 200;

class ApiStructure {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    };
    sendJson(message, statusCode = 200) {
        this.res.header("Access-Control-Allow-Origin", "http://localhost:8042"); //* will allow from all cross domain
        this.res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        this.res.header("Access-Control-Allow-Methods", "GET");
        this.res.status(statusCode);
        this.res.send(message);
    }
    actionInvalid(message = 'Bad request!') {
        this.sendJson({
            'message': message,
            'data': null
        }, RESPONSE_CODE_BAD_REQUEST);
    }

    actionNotFound(message = 'Data not found!') {
        this.sendJson({
            'message': message,
            'data': null
        }, RESPONSE_CODE_NOT_FOUND);
    }
    actionSuccess(response = {}, message = 'Successful') {
        this.sendJson({
            'success': true,
            'message': message,
            'data': response
        }, RESPONSE_CODE_SUCCESS);
    }
    static testSend() {
        return 'test statis';
    }

};
class Controller {
    constructor(req, res, TableName) {
        this.req = req;
        this.res = res;
        this.table = require("../models/" + TableName + 'Table');
        this.uploadPath = {};
    };
    async uploadFile(fieldName) {
        let testUtility = new Utility();
        if (!empty(this.req.files[fieldName])) {
            let imageData = this.req.files[fieldName];
            let fileName = new Date().getTime() + testUtility.path.extname(this.req.files[fieldName].name);
            var imagePath = `/upload/image/${fileName}`;
            const directoryPath = path.join(__dirname, `../../public/upload/image/${fileName}`);
            // var test = imageData.mv(directoryPath);
            try {
                var filePath = await imageData.mv(directoryPath);
                return fileName;
            } catch (e) {
                return false;
            }
        } else {
            return false;
        }
    };
    async createEntity(reqData) {
        let lastEntity = await this.table.find({}).sort([
            ['_id', 'descending']
        ]).limit(1).exec();
        let testUtility = new Utility();
        let newEntity = new this.table()
        for (var bodyField in reqData) {
            if (reqData.hasOwnProperty(bodyField)) {
                newEntity[bodyField] = reqData[bodyField]
            }
        }
        newEntity._id = parseInt(lastEntity[0]._id) + 1;
        newEntity.created_date = testUtility.dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
        newEntity.updated_date = testUtility.dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
        newEntity.status = (reqData.status) ? 'active' : 'inactive';

        return newEntity;
    };
    async uploadBase64() {
        let testUtility = new Utility();
        if (!testUtility.empty(req.body.image)) {
            var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
            var fileName = Math.floor(new Date.now() / 1000) + '.png';
            const directoryPath = Utility.path.join(__dirname, `../../public/upload/image/${fileName}`);
            require("fs").writeFile(directoryPath, base64Data, 'base64', function(err) {
                console.log(err);
            });
        }
    }
    async updateById(id, reqData, callback) {
        let Table = this.table;
        let testUtility = new Utility();
        let odlData = await Table.find({
            _id: id
        }).lean().exec();
        if (testUtility.empty(odlData)) {
            callback(false);
        } else {
            let dataUpdate = {};
            for (let bodyField in reqData) {
                if (reqData.hasOwnProperty(bodyField)) {
                    dataUpdate[bodyField] = !testUtility.empty(reqData[bodyField]) ? reqData[bodyField] : odlData[0][bodyField]
                }
            }
            let a = await Table.findOneAndUpdate({
                _id: id
            }, {
                $set: dataUpdate
            }, {
                new: true
            }, function(err, result) {
                if (err) {
                    callback(false);
                } else {
                    callback(result);
                }
            });
        }
    }
    async pagination() {
        var search = {};
        if (this.req.query.title) {
            search = {
                $or: [{
                    email: new RegExp(this.req.query.title, "i"),
                }, {
                    name: new RegExp(this.req.query.title, "i"),
                }]
            }
        }

        if (this.req.query.sort) {
            let filter = {}
            filter[this.req.query.sort] = this.req.query.order;
            var [results, itemCount] = await Promise.all([
                this.table.find(search).limit(this.req.query.limit).sort(filter).skip(req.skip).lean().exec(),
                this.table.estimatedDocumentCount(search)
            ]);

        } else {
            var [results, itemCount] = await Promise.all([
                this.table.find(search).limit(this.req.query.limit).skip(this.req.skip).lean().exec(),
                this.table.estimatedDocumentCount(search)
            ]);

        }
        const pageCount = Math.ceil(itemCount / this.req.query.limit);
        return {
            results: results,
            itemCount: itemCount,
            pageCount: pageCount
        }
    }
    async getEntityById(idEntity) {
        let entityData = '';
        try {
            entityData = await this.table.findOne({
                _id: idEntity,
            }).lean().exec();
            return entityData;
        } catch (e) {
            return false;
        }
    }
    buildRoutes(routesPart, request = this.req) {
        const url = require('url');
        const empty = require('is-empty');
        const camelCase = require('camelcase');
        const Inflector = require('inflector-js');
        const fullUrl = url.parse(request.protocol + '://' + request.get('host') + request.originalUrl);
        let pathParams = fullUrl.pathname.split('/')
        let controllersList = require('../../config/listRoutes').Controller;
        let prefix = '';
        let controller = '';
        if (!empty(controllersList.__prefix) || !empty(routesPart.prefix)) {
            if (empty(routesPart.prefix)) {
                prefix = controllersList.__prefix.replace('/', '');
            } else {
                prefix = routesPart.prefix;
            }
        }
        if (!empty(routesPart.controller)) {
        } else {
            for (var key in pathParams) {
                if (pathParams.hasOwnProperty(key)) {
                    if ((key !== '0') && (pathParams[key] === prefix)) {
                        controller = camelCase(pathParams[parseInt(key) + 1], {
                            pascalCase: true
                        });
                        break;
                    }
                }
            }
            if (empty(controller)) {
                controller = camelCase(pathParams[1], {
                    pascalCase: true
                });
            }
        }

        let action = 'index';
        if (!empty(routesPart.action)) {
            action = routesPart.action;
        }

        if (!empty(controllersList[controller][action])) {
            let routesInConfig = !empty(controllersList[controller][action].routes) ? controllersList[controller][action].routes : '';
            if (!empty(routesInConfig)) {
                let options = ''
                if (!empty(routesPart.options)) {
                    let linkIncudeOptions = routesInConfig;
                    for (var optionField in routesPart.options) {
                        if (routesPart.options.hasOwnProperty(optionField)) {
                            linkIncudeOptions = linkIncudeOptions.replace(':' + optionField, routesPart.options[optionField]);
                        }
                    }
                    return linkIncudeOptions;
                } else {
                    return routesInConfig;
                }
            } else {
                return '/' + Inflector.dasherize(Inflector.underscore(controller)) + '/' + Inflector.dasherize(Inflector.underscore(action));
            }

        } else {
            return '#';
        }
    }

}
class Utility {
    constructor() {
        this.numeral = require('numeral');
        this.bcrypt = require('bcrypt-nodejs');
        this.dateFormat = require('dateformat');
        this.flash = require('connect-flash')
        this.mongoose = require('mongoose');
        this.Validator = require('Validator');
        this.jsonwebtoken = require('jsonwebtoken');
        this.express = require('express');
        this.path = require('path');
        this.empty = require('is-empty');
        this.Inflector = require('inflector-js');
        this.Routes = require('../../config/listRoutes').Controller;
        this.express = require('express');
        this.paginate = require('express-paginate');;
        this.app = this.express();
        this.buildRoutes = (controller, action, pass = []) => {
            let controllersList = {};
            controllersList = this.Routes;
            for (var controller in controllersList) {
                if (controller == '__prefix') {
                    var __prefix = controller;
                }
                for (var action in controllersList[controller]) {
                    if (controller == '__prefix') {
                        var __prefix = controllersList[controller];
                    }
                    if (controllersList[controller].hasOwnProperty(action) && (controller !== '__prefix')) {
                        if (controllersList[controller][action].routes == "") {
                            controllersList[controller][action].routes = '/' + this.Inflector.dasherize(this.Inflector.underscore(controller)) + '/' + this.Inflector.dasherize(this.Inflector.underscore(action));
                        }
                        controllersList[controller][action].link = __prefix + controllersList[controller][action].routes
                    }
                }
            }
            return controllersList;
        }
    }

}
module.exports = {
    ApiStructure,
    Controller,
    Utility
};
