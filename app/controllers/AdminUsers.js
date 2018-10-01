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
    index: (req, res) => {
        AdminUsersTable.find({}).exec(function(err, result) {
            if (err) {
                console.log("Error:", err);
            } else {
                var test = 'stringify';
                console.log(JSON.stringify(result));
                res.render('AdminUsers/index.ejs', {
                    title: 'Home page',
                    error: req.flash("error"),
                    success: req.flash("success"),
                    info: req.flash('info'),
                    listUsers: result,
                });
            }
        });
    },
    add: (req, res) => {
        if (req.method == "POST") {
            AdminUsersTable.find().sort([
                ['_id', 'descending']
            ]).limit(1).exec((err, adminUserDB) => {
                var v = Validator.make(req.body, rules)

                if (v.fails()) {
                    var errors = v.getErrors()
                    console.log(errors)
                }
                // res.redirect('/admin-users/index');
                let adminUser = new AdminUsersTable();
                var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
                adminUser._id = adminUserDB[0]._id + 1;
                // adminUser.first_name = req.body.controller.first_name;
                // adminUser.last_name = req.body.controller.last_name;
                adminUser.email = req.body.email
                adminUser.password = adminUser.generateHash(req.body.password);
                adminUser.status = req.body.status;
                adminUser.created_date = day;
                adminUser.updated_date = day;

                adminUser.save(function(err, result) {
                    if (err) {
                        throw err;
                        console.log("Error:", err);
                    } else {
                        console.log('success');
                        res.redirect('/admin-users/index');
                    }

                });
            });

        } else if (req.method == "GET") {
            res.render('AdminUsers/add.ejs', {
                title: 'addddddd',
                error: req.flash("error"),
                success: req.flash("success"),
                csrfToken: req.csrfToken()
            });
        }


    },

}
