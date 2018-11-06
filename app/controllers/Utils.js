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
    async uploadFile(fieldName, callback) {
        let testUtility = new Utility();
        if (!empty(this.req.files[fieldName])) {
            let imageData = this.req.files[fieldName];
            let fileName = new Date().getTime() + testUtility.path.extname(this.req.files[fieldName].name);
            var imagePath = `/upload/image/${fileName}`;
            const directoryPath = path.join(__dirname, `../../public/upload/image/${fileName}`);
            // var test = imageData.mv(directoryPath);
            await imageData.mv(directoryPath).then(() => {
                callback(imagePath);
            }, (error) => {
                callback(false);
            });
        } else {
            callback(false);
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
        console.log(newEntity);
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
        this.Routes = require('../../config/listRoutes');
    }

}
module.exports = {
    ApiStructure,
    Controller,
    Utility
};
