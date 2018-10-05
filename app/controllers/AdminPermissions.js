var numeral = require('numeral');
var express = require('express');
var app = express();
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var flash = require('connect-flash')
var constant = require('../../config/constants');
var mongoose = require('mongoose');
var AdminPermissionsTable = require("../models/AdminPermissionsTable");
var AdminRolesTable = require("../models/AdminRolesTable");
const Validator = require('Validator');
const paginate = require('express-paginate');
const rules = {
    controller: 'required',
    action: 'required',
    status: 'required',
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
                        controller: new RegExp(req.query.title, "i"),
                    }, {
                        action: new RegExp(req.query.title, "i"),
                    }]
                }
            }

            if (req.query.sort) {
                let filter = {}
                filter[req.query.sort] = req.query.order;

                var [results, itemCount, optionRole] = await Promise.all([
                    AdminPermissionsTable.find(search).limit(req.query.limit).sort(filter).skip(req.skip).lean().exec(),
                    AdminPermissionsTable.count(search),
                    AdminRolesTable.find({}).lean().exec(),
                ]);

            } else {
                var [results, itemCount, optionRole] = await Promise.all([
                    AdminPermissionsTable.find(search).limit(req.query.limit).skip(req.skip).lean().exec(),
                    AdminPermissionsTable.count(search),
                    AdminRolesTable.find({}).lean().exec(),
                ]);

            }

            const pageCount = Math.ceil(itemCount / req.query.limit);

            res.render('AdminPermissions/index.ejs', {
                csrfToken: req.csrfToken(),
                req: req,
                title: 'Home page',
                error: req.flash("error"),
                success: req.flash("success"),
                info: req.flash('info'),
                listPermissions: results,
                pageCount,
                itemCount,
                currentPage: req.query.page,
                pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
                has_more: paginate.hasNextPages(req)(pageCount),
                optionRole: optionRole,
            });

        },
        add: async (req, res) => {
                var optionRole = await Promise.all([AdminRolesTable.find({}).lean().exec()]);
                if (app.locals.pathVariable.path != req.path) {
                    app.locals.pathVariable = '';
                }
                if (req.method == "POST") {
                    AdminPermissionsTable.find({}).sort([
                        ['_id', 'descending']
                    ]).limit(1).exec((err, AdminPermissionDB) => {
                        var v = Validator.make(req.body, rules);
                        if (v.fails()) {
                            app.locals.pathVariable = {
                                errors: v.getErrors(),
                                path: req.path,
                            };
                            res.redirect('/admin-permissions/add');
                        } else {
                            let AdminPermission = new AdminPermissionsTable();
                            var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
                            AdminPermission._id = (AdminPermissionDB.hasOwnProperty('0')) ? AdminPermissionDB[0]._id + 1 : 1;
                            AdminPermission.controller = req.body.controller;
                            AdminPermission.action = req.body.action;
                            AdminPermission.status = (req.body.status) ? 'active' : 'inactive';
                            AdminPermission.role_id = req.body.role_id;
                            AdminPermission.created_date = day;
                            AdminPermission.updated_date = day;

                            AdminPermission.save(function(err, result) {
                                if (err) {
                                    throw err;
                                    console.log("Error:", err);
                                } else {
                                    console.log('success');
                                    res.redirect('/admin-permissions/index');
                                }

                            });
                        }
                        // res.redirect('/admin-permissions/index');

                    });

                } else if (req.method == "GET") {
                    res.render('AdminPermissions/add.ejs', {
                        title: 'addddddd',
                        error: req.flash("error"),
                        errors: app.locals.pathVariable.errors,
                        success: req.flash("success"),
                        info: req.flash('info'),
                        csrfToken: req.csrfToken(),
                        optionRole: optionRole[0],
                    });
                }


            },
            edit: async (req, res) => {
                    if (app.locals.pathVariable.path != req.path) {
                        app.locals.pathVariable = '';
                    }
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
                                AdminPermissionsTable.findByIdAndUpdate(req.params.id, {
                                    $set: {
                                        controller: req.body.controller,
                                        action: req.body.action,
                                        status: (req.body.status) ? 'active' : 'inactive',
                                        role_id: req.body.role_id,
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
                                        res.redirect('/admin-permissions/index');
                                    }
                                });
                            }

                        } else if (req.method == "GET") {
                            AdminPermissionsTable.findOne({
                                _id: req.params.id
                            }).exec((err, result) => {
                                if (err) {
                                    console.log("Error:", err);

                                } else {
                                    if (result) {
                                        res.render('AdminPermissions/edit.ejs', {
                                            title: 'addddddd',
                                            error: req.flash("error"),
                                            success: req.flash("success"),
                                            info: req.flash('info'),
                                            errors: app.locals.pathVariable.errors,
                                            csrfToken: req.csrfToken(),
                                            adminPermission: result,
                                            optionRole: optionRole[0],
                                        });
                                    } else {
                                        res.redirect('/admin-permissions/index')
                                    }

                                }

                            });

                        }
                    } else {
                        res.redirect('/admin-permissions/index')
                    }

                },
                view: async (req, res) => {
                        var optionRole = await Promise.all([AdminRolesTable.find({}).lean().exec()]);
                        if (req.params.id.length > 0) {
                            if (req.method == "GET") {
                                AdminPermissionsTable.findOne({
                                    _id: req.params.id
                                }).exec((err, result) => {
                                    if (err) {
                                        console.log("Error:", err);

                                    } else {
                                        if (result) {
                                            res.render('AdminPermissions/view.ejs', {
                                                title: 'addddddd',
                                                error: req.flash("error"),
                                                success: req.flash("success"),
                                                info: req.flash('info'),
                                                csrfToken: req.csrfToken(),
                                                adminPermission: result,
                                                optionRole: optionRole,
                                            });
                                        } else {
                                            res.redirect('/admin-permissions/index')
                                        }

                                    }

                                });

                            }
                        } else {
                            res.redirect('/admin-permissions/index')
                        }

                    },
                    delete: (req, res) => {
                        if (req.params.id.length > 0) {
                            if (req.method == "POST") {
                                AdminPermissionsTable.deleteOne({
                                    _id: req.params.id
                                }).exec((err, result) => {
                                    if (err) {
                                        console.log("Error:", err);

                                    } else {
                                        res.redirect('/admin-permissions/index');
                                    }

                                });

                            }
                        } else {
                            res.redirect('/admin-permissions/index')
                        }

                    },

}
