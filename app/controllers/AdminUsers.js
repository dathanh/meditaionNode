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
var rules = {
    name: 'required',
    password_confirm: 'required',
    email: 'required|email',
    password: 'min:6|password',
    role_id: 'integer',

}
app.locals.pathVariable = {
    path: ''
};
module.exports = {
    index: async (req, res) => {
            var search = {};
            if (req.query.title) {
                search = {
                    $or: [{
                        email: new RegExp(req.query.title, "i"),
                    }, {
                        name: new RegExp(req.query.title, "i"),
                    }]
                }
            }
            console.log(search);
            if (req.query.sort) {
                let filter = {}
                filter[req.query.sort] = req.query.order;
                var [results, itemCount] = await Promise.all([
                    AdminUsersTable.find(search).limit(req.query.limit).sort(filter).skip(req.skip).lean().exec(),
                    AdminUsersTable.count(search)
                ]);

            } else {
                var [results, itemCount] = await Promise.all([
                    AdminUsersTable.find(search).limit(req.query.limit).skip(req.skip).lean().exec(),
                    AdminUsersTable.count(search)
                ]);

            }

            const pageCount = Math.ceil(itemCount / req.query.limit);

            res.render('AdminUsers/index.ejs', {
                csrfToken: req.csrfToken(),
                req: req,
                title: 'Home page',
                error: req.flash("error"),
                success: req.flash("success"),
                info: req.flash('info'),
                listUsers: results,
                pageCount,
                itemCount,
                currentPage: req.query.page,
                pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
                has_more: paginate.hasNextPages(req)(pageCount),
            });

        },
        add: async (req, res) => {
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
                        console.log(JSON.stringify(req.body));
                        var v = Validator.make(req.body, rules);
                        v.extend('password', validateConfirmPassword, "Password and confirm password were unequal")
                        if (v.fails()) {
                            app.locals.pathVariable = {
                                errors: v.getErrors(),
                                path: req.path,
                            };
                            // app.locals.preData = req.body;
                            // console.log(app.locals.preData);
                            // for (fieldErrr in v.getErrors()) {
                            //     app.locals.preData[fieldErrr] = '';
                            // }
                            // app.locals.preData = req.body;
                            res.redirect('/admin-users/add');
                        } else {
                            let adminUser = new AdminUsersTable();
                            var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
                            adminUser._id = adminUserDB[0]._id + 1;
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
                                    console.log("Error:", err);
                                } else {
                                    console.log('success');
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


            },
            edit: async (req, res) => {
                    var optionRole = await Promise.all([AdminRolesTable.find({}).lean().exec()]);
                    if (req.params.id.length > 0) {
                        if (app.locals.pathVariable.path != req.path) {
                            app.locals.pathVariable = '';
                        }
                        if (req.method == "POST") {
                            var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
                            AdminUsersTable.findByIdAndUpdate(req.params.id, {
                                $set: {
                                    name: req.body.name,
                                    // email: req.body.email,
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
                                    console.log("Error:", err);
                                } else {
                                    console.log('success');
                                    res.redirect('/admin-users/index');
                                }
                            });

                        } else if (req.method == "GET") {
                            AdminUsersTable.findOne({
                                _id: req.params.id
                            }).exec((err, result) => {
                                if (err) {
                                    console.log("Error:", err);

                                } else {
                                    console.log(JSON.stringify(optionRole));
                                    if (result) {
                                        res.render('AdminUsers/edit.ejs', {
                                            title: 'addddddd',
                                            error: req.flash("error"),
                                            success: req.flash("success"),
                                            errors: app.locals.pathVariable,
                                            csrfToken: req.csrfToken(),
                                            adminUser: result,
                                            info: req.flash('info'),
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

                },
                view: async (req, res) => {
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

                    },
                    delete: (req, res) => {
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

                    },
                    login: (req, res) => {
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
                                // params: req.params(),
                            });

                        }

                    },
                    logout: (req, res) => {
                        req.logout();
                        req.session.destroy();
                        res.redirect('/admin/login');
                    }


}
