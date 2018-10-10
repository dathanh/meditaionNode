var numeral = require('numeral');
var express = require('express');
var app = express();
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var flash = require('connect-flash')
var constant = require('../../config/constants');
var mongoose = require('mongoose');
var ArticlesTable = require("../models/ArticlesTable");
var LambdaFunction = require("../lambda/LambdaFunction");
const Validator = require('Validator');
const paginate = require('express-paginate');
const empty = require('is-empty');
const path = require('path');
var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({
    profile: 'meditation'
});
AWS.config.credentials = credentials;
AWS.config.update({
    region: 'us-east-2'
});
const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-2'
});
var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {
        Bucket: 'meditationnodejs'
    }
});
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
exports.index = async (req, res) => {
    LambdaFunction.getArticles('ArticlesTable', 'fake', (err, data) => {
        res.render('AwsArticles/index.ejs', {
            csrfToken: req.csrfToken(),
            req: req,
            title: 'Home page',
            error: req.flash("error"),
            success: req.flash("success"),
            info: req.flash('info'),
            listArticles: data.Items,

        });
    })

};

exports.add = (req, res) => {
    if (app.locals.pathVariable.path != req.path) {
        app.locals.pathVariable = '';
    }
    if (req.method == "POST") {
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

            res.redirect('/aws-articles/add');
        } else {
            let article = new ArticlesTable();
            var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
            LambdaFunction.maxId('ArticlesTable', (err, maxId) => {
                LambdaFunction.getArticles(maxId + 1, 'fake', (err, data) => {
                    if (data.Count == 0) {
                        LambdaFunction.addArticles(req.body, 'fake', (err, data) => {
                            var params = {
                                Bucket: 'meditationnodejs/upload',
                                Key: req.files.thumbnail.name,
                                Body: req.files.thumbnail.data,
                                ACL: 'public-read-write',
                                ContentType: req.files.thumbnail.mimetype,
                            };
                            s3.upload(params, function(err, data) {
                                if (err) {
                                    console.log('error in callback');
                                    console.log(err);
                                }
                                if (data) {
                                    var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
                                    var params = {
                                        TableName: 'ArticlesTable',
                                        Item: {
                                            "id": maxId + 1,
                                            "name": req.body.name,
                                            "title": req.body.title,
                                            "description": req.body.description,
                                            "thumbnail": data.Location,
                                            "status": "active",
                                            "created_date": day,
                                            "updated_date": day,
                                        }
                                    };
                                    var documentClient = new AWS.DynamoDB.DocumentClient();
                                    documentClient.put(params, function(err, data) {});
                                }
                            });
                        })
                    }
                })
            });
            res.redirect('/aws-articles/add');
        }

    } else if (req.method == "GET") {

        res.render('AwsArticles/add.ejs', {
            title: 'addddddd',
            error: req.flash("error"),
            errors: app.locals.pathVariable.errors,
            info: req.flash('info'),
            success: req.flash("success"),
            csrfToken: req.csrfToken()
        });
    }
}

exports.edit = (req, res) => {
    if (req.params.id.length > 0) {
        if (app.locals.pathVariable.path != req.path) {
            app.locals.pathVariable = '';
        }
        LambdaFunction.getArticlesById(req.params.id, 'fake', (err, articleData) => {
            if (articleData) {
                if (req.method == "POST") {
                    if (!empty(req.files.thumbnail)) {
                        var params = {
                            Bucket: 'meditationnodejs/upload',
                            Key: req.files.thumbnail.name,
                            Body: req.files.thumbnail.data,
                            ACL: 'public-read-write',
                            ContentType: req.files.thumbnail.mimetype,
                        };
                        s3.upload(params, function(err, thumbnailUploaded) {
                            if (err) {
                                console.log('error in callback');
                                console.log(err);
                            }
                            if (thumbnailUploaded) {
                                LambdaFunction.updateArticles(req.body, {
                                    id: req.params.id,
                                    thumbnail: thumbnailUploaded.Location,
                                }, (err, data) => {
                                    console.log('loi --------------' + err);
                                    console.log(data);
                                });
                            }
                        });
                    } else {
                        LambdaFunction.updateArticles(req.body, {
                            id: req.params.id,
                            thumbnail: articleData.Item.thumbnail,
                        }, (err, data) => {
                            console.log('loi --------------' + err);
                            console.log(data);
                        });
                    }

                    res.redirect('/aws-articles/index');

                } else {
                    res.render('Articles/edit.ejs', {
                        title: 'addddddd',
                        error: req.flash("error"),
                        success: req.flash("success"),
                        info: req.flash('info'),
                        errors: app.locals.pathVariable.errors,
                        csrfToken: req.csrfToken(),
                        article: articleData.Item,
                    });
                }
            } else {
                res.redirect('/articles/index')
            }
        })

    } else {
        res.redirect('/aws-articles/index')
    }

}

exports.view = (req, res) => {
    LambdaFunction.getArticlesById(req.params.id, 'fake', (err, data) => {
        if (data) {
            console.log(data.Item);
            res.render('AwsArticles/view.ejs', {
                title: 'addddddd',
                error: req.flash("error"),
                success: req.flash("success"),
                info: req.flash('info'),
                errors: app.locals.pathVariable.errors,
                csrfToken: req.csrfToken(),
                article: data.Item,
            });
        } else {
            res.redirect('/aws-articles/index')
        }
    })
}
