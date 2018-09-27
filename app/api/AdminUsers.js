var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var flash = require('connect-flash')
var constant = require('../../config/constants');
var mongoose = require('mongoose');
var AdminUsersTable = require("../models/AdminUsersTable");
var Validator = require('Validator')

var rules = {
    name: 'required',
    email: 'required|email',
    password: 'between:111,115'
}
module.exports = {
    getUser: (req, res) => {
        AdminUsersTable.find({}).exec(function(err, result) {
            if (err) {
                console.log("Error:", err);
            } else {
                res.send(result);
                res.end();
            }
        });
    },


}
