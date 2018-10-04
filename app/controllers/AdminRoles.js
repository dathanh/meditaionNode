var numeral = require('numeral');
var express = require('express');
var app = express();
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var flash = require('connect-flash')
var constant = require('../../config/constants');
var mongoose = require('mongoose');
var AdminRolesTable = require("../models/AdminRolesTable");
var Validator = require('Validator')
const paginate = require('express-paginate');
var rules = {
    name: 'required',
    description: 'required',
    status: 'required',
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
                        description: new RegExp(req.query.title, "i"),
                    }, {
                        name: new RegExp(req.query.title, "i"),
                    }]
                }
            }
            console.log(search);
            if (req.query.sort) {
                let filter = {}
                filter[req.query.sort] = req.query.order;
                console.log(filter);
                var [results, itemCount] = await Promise.all([
                    AdminRolesTable.find(search).limit(req.query.limit).sort(filter).skip(req.skip).lean().exec(),
                    AdminRolesTable.count(search)
                ]);

            } else {
                var [results, itemCount] = await Promise.all([
                    AdminRolesTable.find(search).limit(req.query.limit).skip(req.skip).lean().exec(),
                    AdminRolesTable.count(search)
                ]);

            }

            const pageCount = Math.ceil(itemCount / req.query.limit);

            res.render('AdminRoles/index.ejs', {
                csrfToken: req.csrfToken(),
                req: req,
                title: 'Home page',
                error: req.flash("error"),
                success: req.flash("success"),
                info: req.flash('info'),
                listRoles: results,
                pageCount,
                itemCount,
                currentPage: req.query.page,
                pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
                has_more: paginate.hasNextPages(req)(pageCount),
            });

        },
        add: (req, res) => {
            if (app.locals.pathVariable.path != req.path) {
                app.locals.pathVariable = '';
            }
            if (req.method == "POST") {
                AdminRolesTable.find({}).sort([
                    ['_id', 'descending']
                ]).limit(1).exec((err, AdminRoleDB) => {
                    var v = Validator.make(req.body, rules);
                    if (v.fails()) {
                        console.log(v.getErrors());
                        app.locals.pathVariable = {
                            errors: v.getErrors(),
                            path: req.path,
                        };
                        res.redirect('/admin-roles/add');
                    } else {
                        let AdminRole = new AdminRolesTable();
                        var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
                        AdminRole._id = (AdminRoleDB.hasOwnProperty('0')) ? AdminRoleDB[0]._id + 1 : 1;
                        AdminRole.name = req.body.name;
                        AdminRole.description = req.body.description;
                        AdminRole.status = (req.body.status) ? 'active' : 'inactive';
                        AdminRole.created_date = day;
                        AdminRole.updated_date = day;

                        AdminRole.save(function(err, result) {
                            if (err) {
                                throw err;
                                console.log("Error:", err);
                            } else {
                                console.log('success');
                                res.redirect('/admin-roles/index');
                            }

                        });
                    }
                    // res.redirect('/admin-roles/index');

                });

            } else if (req.method == "GET") {
                res.render('AdminRoles/add.ejs', {
                    title: 'addddddd',
                    error: req.flash("error"),
                    errors: app.locals.pathVariable.errors,
                    success: req.flash("success"),
                    info: req.flash('info'),
                    csrfToken: req.csrfToken()
                });
            }


        },
        edit: (req, res) => {
            if (req.params.id.length > 0) {
                if (app.locals.pathVariable.path != req.path) {
                    app.locals.pathVariable = '';
                }
                if (req.method == "POST") {
                    var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
                    AdminRolesTable.findByIdAndUpdate(req.params.id, {
                        $set: {
                            name: req.body.name,
                            description: req.body.description,
                            status: (req.body.status) ? 'active' : 'inactive',
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
                            res.redirect('/admin-roles/index');
                        }
                    });

                } else if (req.method == "GET") {
                    AdminRolesTable.findOne({
                        _id: req.params.id
                    }).exec((err, result) => {
                        if (err) {
                            console.log("Error:", err);

                        } else {
                            if (result) {
                                res.render('AdminRoles/edit.ejs', {
                                    title: 'addddddd',
                                    error: req.flash("error"),
                                    success: req.flash("success"),
                                    info: req.flash('info'),
                                    errors: app.locals.pathVariable,
                                    csrfToken: req.csrfToken(),
                                    adminRole: result,
                                });
                            } else {
                                res.redirect('/admin-roles/index')
                            }

                        }

                    });

                }
            } else {
                res.redirect('/admin-roles/index')
            }

        },
        view: (req, res) => {
            if (req.params.id.length > 0) {
                if (req.method == "GET") {
                    AdminRolesTable.findOne({
                        _id: req.params.id
                    }).exec((err, result) => {
                        if (err) {
                            console.log("Error:", err);

                        } else {
                            if (result) {
                                res.render('AdminRoles/view.ejs', {
                                    title: 'addddddd',
                                    error: req.flash("error"),
                                    success: req.flash("success"),
                                    info: req.flash('info'),
                                    csrfToken: req.csrfToken(),
                                    adminRole: result
                                });
                            } else {
                                res.redirect('/admin-roles/index')
                            }

                        }

                    });

                }
            } else {
                res.redirect('/admin-roles/index')
            }

        },
        delete: (req, res) => {
            if (req.params.id.length > 0) {
                if (req.method == "POST") {
                    AdminRolesTable.deleteOne({
                        _id: req.params.id
                    }).exec((err, result) => {
                        if (err) {
                            console.log("Error:", err);

                        } else {
                            res.redirect('/admin-roles/index');
                        }

                    });

                }
            } else {
                res.redirect('/admin-roles/index')
            }

        },

}
