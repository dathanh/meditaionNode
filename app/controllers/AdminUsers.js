var numeral = require('numeral');
var express = require('express');
var app = express();
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var flash = require('connect-flash')
var constant = require('../../config/constants');
var mongoose = require('mongoose');
var AdminUsersTable = require("../models/AdminUsersTable");
var AdminRolesTable = require("../models/AdminRolesTable");
const Validator = require('Validator');
const paginate = require('express-paginate');
const Utils = require('../controllers/Utils');
const Utility = new Utils.Utility();
var rules = {
    name: 'required',
    email: 'required|email',
    password: 'min:6',
    role_id: 'integer',

}
app.locals.pathVariable = {
    path: ''
};
exports.index = async (req, res) => {
    let response = new Utils.Controller(req, res, 'AdminUsers');
    var paginations = await response.pagination();
    res.render('AdminUsers/index.ejs', {
        csrfToken: req.csrfToken(),
        req: req,
        title: 'Home page',
        error: req.flash("error"),
        success: req.flash("success"),
        info: req.flash('info'),
        listUsers: paginations.results,
        pageCount: paginations.pageCount,
        itemCount: paginations.itemCount,
        currentPage: req.query.page,
        pages: paginate.getArrayPages(req)(3, paginations.pageCount, req.query.page),
        has_more: paginate.hasNextPages(req)(paginations.pageCount),
    });

};
exports.add = async (req, res) => {
    var optionRole = await AdminRolesTable.find({}).lean().exec();
    if (app.locals.pathVariable.path != req.path) {
        app.locals.pathVariable = '';
    }
    if (req.method == "POST") {
        AdminUsersTable.find({}).sort([
            ['_id', 'descending']
        ]).limit(1).exec((err, adminUserDB) => {
            function validateConfirmPassword(name, value, params) {
                if (value === req.body.password_confirm) {
                    return true;
                }
                return false;
            }
            let controller = new Utils.Controller(req, res, 'AdminUsers');
            var v = Validator.make(req.body, rules);
            v.extend('password', validateConfirmPassword, "Password and confirm password were unequal")
            if (v.fails()) {
                app.locals.pathVariable = {
                    errors: v.getErrors(),
                    path: req.path,
                };
                info = req.flash('info');
                success = req.flash('success');
                error = req.flash('error');
                res.redirect('back');
            } else {
                let adminUser = new AdminUsersTable();
                var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
                adminUser._id = (adminUserDB.hasOwnProperty('0')) ? AdminPermissionDB[0]._id + 1 : 1;
                adminUser.name = req.body.name;
                adminUser.email = req.body.email;
                adminUser.role_id = req.body.role_id;
                adminUser.password = adminUser.generateHash(req.body.password);
                adminUser.status = (req.body.status) ? 'active' : 'inactive';
                adminUser.lock = (req.body.lock) ? 'lock' : 'normal';
                adminUser.created_date = day;
                adminUser.updated_date = day;

                adminUser.save(function(err, result) {
                    if (err) {
                        throw err;
                    } else {
                        res.redirect('/admin-users/index');
                    }

                });
            }
            // res.redirect('/admin-users/index');

        });

    } else if (req.method == "GET") {

        res.render('AdminUsers/add.ejs', {
            title: 'addddddd',
            error: req.flash("error"),
            errors: app.locals.pathVariable.errors,
            info: req.flash('info'),
            optionRole: optionRole,
            success: req.flash("success"),
            csrfToken: req.csrfToken()
        });
    }


};
exports.edit = async (req, res) => {
    var optionRole = await Promise.all([AdminRolesTable.find({}).lean().exec()]);
    if (req.params.id.length > 0) {
        if (app.locals.pathVariable.path != req.path) {
            app.locals.pathVariable = '';
        }
        if (req.method == "POST") {
            var v = Validator.make(req.body, rules);
            if (v.fails()) {
                app.locals.pathVariable = {
                    errors: v.getErrors(),
                    path: req.path,
                };
                info = req.flash('info');
                success = req.flash('success');
                error = req.flash('error');
                res.redirect('back');
            } else {
                var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
                AdminUsersTable.findByIdAndUpdate(req.params.id, {
                    $set: {
                        name: req.body.name,
                        role_id: req.body.role_id,
                        status: (req.body.status) ? 'active' : 'inactive',
                        lock: (req.body.locked) ? 'lock' : 'normal',
                        updated_date: day,
                    }
                }, {
                    new: true
                }, function(err, result) {
                    if (err) {
                        throw err;
                    } else {
                        res.redirect('/admin-users/index');
                    }
                });
            }
        } else if (req.method == "GET") {
            AdminUsersTable.findOne({
                _id: req.params.id
            }).exec((err, result) => {
                if (err) {
                    console.log("Error:", err);
                } else {
                    if (result) {
                        res.render('AdminUsers/edit.ejs', {
                            title: 'addddddd',
                            error: req.flash("error"),
                            success: req.flash("success"),
                            info: req.flash('info'),
                            errors: app.locals.pathVariable.errors,
                            csrfToken: req.csrfToken(),
                            adminUser: result,
                            optionRole: optionRole[0],
                        });
                    } else {
                        res.redirect('/admin-users/index')
                    }

                }

            });

        }
    } else {
        res.redirect('/admin-users/index')
    }

};
exports.view = async (req, res) => {
    var optionRole = await Promise.all([AdminRolesTable.find({}).lean().exec()]);

    if (req.params.id.length > 0) {
        if (req.method == "GET") {
            AdminUsersTable.findOne({
                _id: req.params.id
            }).exec((err, result) => {
                if (err) {
                    console.log("Error:", err);

                } else {
                    if (result) {
                        res.render('AdminUsers/view.ejs', {
                            title: 'addddddd',
                            error: req.flash("error"),
                            success: req.flash("success"),
                            csrfToken: req.csrfToken(),
                            adminUser: result,
                            optionRole: optionRole[0],
                            info: req.flash('info'),
                        });
                    } else {
                        res.redirect('/admin-users/index')
                    }

                }

            });

        }
    } else {
        res.redirect('/admin-users/index')
    }

};
exports.delete = (req, res) => {
    if (req.params.id.length > 0) {
        if (req.method == "POST") {
            AdminUsersTable.deleteOne({
                _id: req.params.id
            }).exec((err, result) => {
                if (err) {
                    console.log("Error:", err);

                } else {
                    res.redirect('/admin-users/index');
                }

            });

        }
    } else {
        res.redirect('/admin-users/index')
    }

};
exports.login = (req, res) => {
    if (req.session.user) {
        info: req.flash('info');
        success: req.flash('success');
        error: req.flash('error');
        res.redirect('/admin-users/index');

    }
    else {
        // req.flash('info', "info demo");
        // req.flash('success', "success demo");
        // req.flash('error', "errors demo");
        res.render('newLogin', {
            info: req.flash('info'),
            success: req.flash('success'),
            error: req.flash('error'),
            csrfToken: req.csrfToken(),
            layout: false,
        });

    }

};
exports.logout = (req, res) => {
    req.session.destroy();
    req.logout();
    res.redirect('/admin/login');
};
