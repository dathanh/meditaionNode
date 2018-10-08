var numeral = require('numeral');
var express = require('express');
var app = express();
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var flash = require('connect-flash')
var constant = require('../../config/constants');
var mongoose = require('mongoose');
var ArticlesTable = require("../models/ArticlesTable");
const Validator = require('Validator');
const paginate = require('express-paginate');
const empty = require('is-empty');
const path = require('path');
var rules = {
    name: 'required',
    title: 'required',
    description: 'min:6',
    thumbnail: 'emptythumbnail',
    status: 'required',

}
var uploadThumbnail = (req, res) => {

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

            if (req.query.sort) {
                let filter = {}
                filter[req.query.sort] = req.query.order;
                var [results, itemCount] = await Promise.all([
                    ArticlesTable.find(search).limit(req.query.limit).sort(filter).skip(req.skip).lean().exec(),
                    ArticlesTable.count(search)
                ]);

            } else {
                var [results, itemCount] = await Promise.all([
                    ArticlesTable.find(search).limit(req.query.limit).skip(req.skip).lean().exec(),
                    ArticlesTable.count(search)
                ]);

            }

            const pageCount = Math.ceil(itemCount / req.query.limit);

            res.render('Articles/index.ejs', {
                csrfToken: req.csrfToken(),
                req: req,
                title: 'Home page',
                error: req.flash("error"),
                success: req.flash("success"),
                info: req.flash('info'),
                listArticles: results,
                pageCount,
                itemCount,
                currentPage: req.query.page,
                pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
                has_more: paginate.hasNextPages(req)(pageCount),
            });

        },
        add: async (req, res) => {
                if (app.locals.pathVariable.path != req.path) {
                    app.locals.pathVariable = '';
                }
                if (req.method == "POST") {
                    ArticlesTable.find({}).sort([
                        ['_id', 'descending']
                    ]).limit(1).exec((err, articleDB) => {
                        var requireThumbnail = (name, value, params) => {
                            return (!empty(req.files.thumbnail));
                        }
                        var v = Validator.make(req.body, rules);
                        v.extend('emptythumbnail', requireThumbnail, "Thumbnail is required");
                        if (v.fails()) {
                            console.log(v.getErrors());
                            app.locals.pathVariable = {
                                errors: v.getErrors(),
                                path: req.path,
                            };
                            info = req.flash('info');
                            success = req.flash('success');
                            error = req.flash('error');

                            res.redirect('/articles/add');
                        } else {
                            let article = new ArticlesTable();
                            var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
                            let thumbnail = req.files.thumbnail;
                            var thumbnailPath = `/upload/image/${req.files.thumbnail.name}`;
                            const directoryPath = path.join(__dirname, `../../public/upload/image/${req.files.thumbnail.name}`);
                            thumbnail.mv(directoryPath, function(err) {
                                if (err) {
                                    app.locals.pathVariable.errors = {
                                        thumbnail: "upload thumbnail error"
                                    };

                                } else {
                                    article._id = (articleDB.hasOwnProperty('0')) ? articleDB[0]._id + 1 : 1;

                                    article.name = req.body.name;
                                    article.title = req.body.title;
                                    article.description = req.body.description;
                                    article.thumbnail = thumbnailPath;
                                    article.status = (req.body.status) ? 'active' : 'inactive';
                                    article.created_date = day;
                                    article.updated_date = day;
                                    article.save(function(err, result) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            res.redirect('/articles/index');
                                        }

                                    });
                                }
                            });


                        }

                    });

                } else if (req.method == "GET") {

                    res.render('Articles/add.ejs', {
                        title: 'addddddd',
                        error: req.flash("error"),
                        errors: app.locals.pathVariable.errors,
                        info: req.flash('info'),
                        success: req.flash("success"),
                        csrfToken: req.csrfToken()
                    });
                }


            },
            edit: async (req, res) => {
                    if (req.params.id.length > 0) {
                        if (app.locals.pathVariable.path != req.path) {
                            app.locals.pathVariable = '';
                        }
                        if (req.method == "POST") {
                            let requireThumbnail = (name, value, params) => {
                                return (!empty(req.files.thumbnail));
                            }
                            var v = Validator.make(req.body, rules);
                            v.extend('emptythumbnail', requireThumbnail, "Thumbnail is required");
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
                                let thumbnail = req.files.thumbnail;
                                //joining path of directory
                                const directoryPath = path.join(__dirname, `../../public/upload/image/${ req.files.thumbnail.name}`);
                                thumbnail.mv(directoryPath, function(err) {
                                    if (err) {
                                        app.locals.pathVariable.errors = {
                                            thumbnail: "upload thumbnail error"
                                        };

                                    } else {
                                        ArticlesTable.findByIdAndUpdate(req.params.id, {
                                            $set: {
                                                name: req.body.name,
                                                title: req.body.title,
                                                description: req.body.description,
                                                thumbnail: `/upload/image/${ req.files.thumbnail.name}`,
                                                status: (req.body.status) ? 'active' : 'inactive',
                                                updated_date: day,
                                            }
                                        }, {
                                            new: true
                                        }, function(err, result) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                res.redirect('/articles/index');
                                            }
                                        });
                                    }
                                });

                            }
                        } else if (req.method == "GET") {
                            ArticlesTable.findOne({
                                _id: req.params.id
                            }).exec((err, result) => {
                                if (err) {
                                    console.log("Error:", err);
                                } else {
                                    if (result) {
                                        res.render('Articles/edit.ejs', {
                                            title: 'addddddd',
                                            error: req.flash("error"),
                                            success: req.flash("success"),
                                            info: req.flash('info'),
                                            errors: app.locals.pathVariable.errors,
                                            csrfToken: req.csrfToken(),
                                            article: result,
                                        });
                                    } else {
                                        res.redirect('/articles/index')
                                    }

                                }

                            });

                        }
                    } else {
                        res.redirect('/articles/index')
                    }

                },
                view: async (req, res) => {
                        if (req.params.id.length > 0) {
                            if (req.method == "GET") {
                                ArticlesTable.findOne({
                                    _id: req.params.id
                                }).exec((err, result) => {
                                    if (err) {
                                        console.log("Error:", err);

                                    } else {
                                        if (result) {
                                            res.render('Articles/view.ejs', {
                                                title: 'addddddd',
                                                error: req.flash("error"),
                                                success: req.flash("success"),
                                                info: req.flash('info'),
                                                csrfToken: req.csrfToken(),
                                                article: result,
                                            });
                                        } else {
                                            res.redirect('/articles/index')
                                        }

                                    }

                                });

                            }
                        } else {
                            res.redirect('/articles/index')
                        }

                    },
                    delete: (req, res) => {
                        if (req.params.id.length > 0) {
                            if (req.method == "POST") {
                                ArticlesTable.deleteOne({
                                    _id: req.params.id
                                }).exec((err, result) => {
                                    if (err) {
                                        console.log("Error:", err);
                                    } else {
                                        res.redirect('/articles/index');
                                    }

                                });

                            }
                        } else {
                            res.redirect('/articles/index')
                        }

                    },

}
