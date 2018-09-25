var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var flash = require('connect-flash')
var constant = require('../../config/constants');
var mongoose = require('mongoose');
var AdminUsersTable = require("../models/AdminUsersTable");

module.exports = {
    index: (req, res) => {
        AdminUsersTable.find({}).exec(function(err, result) {
            if (err) {
                console.log("Error:", err);
            } else {
                console.log(JSON.stringify(result));
                res.render('AdminUsers/index.ejs', {
                    title: 'Home page',
                    error: req.flash("error"),
                    success: req.flash("success"),
                    listUsers: result,
                });
            }
        });
    }
}
