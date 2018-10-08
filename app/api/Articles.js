var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var flash = require('connect-flash')
var constant = require('../../config/constants');
var mongoose = require('mongoose');
var ArticlesTable = require("../models/ArticlesTable");
var Validator = require('Validator')
var jsonwebtoken = require('jsonwebtoken');

var rules = {
    name: 'required',
    title: 'required',
    description: 'required',
    status: 'required',
    thumbnail: 'required',

}
module.exports = {
    getArticles: (req, res) => {
        ArticlesTable.find({}).lean().exec(function(err, result) {
            if (err) {
                console.log("Error:", err);
            } else {
                res.header("Access-Control-Allow-Origin", "http://localhost:8042"); //* will allow from all cross domain
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.header("Access-Control-Allow-Methods", "GET");
                res.send(result);
                res.end();
            }
        });
    }

}
