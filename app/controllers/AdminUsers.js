var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var flash = require('connect-flash')
var constant = require('../../config/constants');
var mongoose = require('mongoose');
var AdminUsersTable = require("../models/AdminUsersTable");
var Validator = require('Validator')
const paginate = require('express-paginate');
var rules = {
    name: 'required',
    email: 'required|email',
    password: 'between:111,115'
}
module.exports = {
    index: async (req, res) => {
            // AdminUsersTable.find({}).exec(function(err, result) {
            // if (err) {
            //     console.log("Error:", err);
            // } else {
            //         var test = 'stringify';
            //         console.log(req.query.page);
            //         console.log(JSON.stringify(result));
            //         res.render('AdminUsers/index.ejs', {
            // title: 'Home page',
            // error: req.flash("error"),
            // success: req.flash("success"),
            // info: req.flash('info'),
            //             listUsers: result,
            //         });
            //     }
            // });

            const [results, itemCount] = await Promise.all([
                AdminUsersTable.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
                AdminUsersTable.estimatedDocumentCount({})
            ]);

            const pageCount = Math.ceil(itemCount / req.query.limit);
            console.log('pageCount:' + pageCount + '=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            // if (req.accepts('json')) {
            //     // inspired by Stripe's API response for list objects
            //     res.json({
            //         object: 'list',
            //         has_more: paginate.hasNextPages(req)(pageCount),
            //         data: results
            //     });
            // } else {
            // if (req.query.page > pageCount) {
            //     req.query.page = pageCount;
            // }
            console.log(JSON.stringify(results));
            res.render('AdminUsers/index.ejs', {
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
            // }
        },
        add: (req, res) => {
            if (req.method == "POST") {
                module.exports.uploadInfo(req, res);

            } else if (req.method == "GET") {
                res.render('AdminUsers/add.ejs', {
                    title: 'addddddd',
                    error: req.flash("error"),
                    success: req.flash("success"),
                    csrfToken: req.csrfToken()
                });
            }


        },
        edit: (req, res) => {
            if (req.params.id.length > 0) {
                if (req.method == "POST") {
                    module.exports.uploadInfo(req, res, req.params.id);

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
                                    csrfToken: req.csrfToken(),
                                    adminUser: result
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
        view: (req, res) => {
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
                                    adminUser: result
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
        uploadInfo: (req, res, id = null) => {
            // if (id.length > 0) {
            //
            // }
            AdminUsersTable.find({
                _id: id
            }).sort([
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
        }

}
