var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var flash = require('connect-flash')
var constant = require('../../config/constants');
var mongoose = require('mongoose');
var ArticlesTable = require("../models/ArticlesTable");
var Validator = require('Validator');
var jsonwebtoken = require('jsonwebtoken');
const path = require('path');
const empty = require('is-empty');

var rules = {
    name: 'required',
    title: 'required',
    description: 'required',
    thumbnail: 'emptythumbnail',
    status: 'required',
}
module.exports = {
    getArticles: (req, res) => {
        ArticlesTable.find({}).lean().exec(function(err, result) {
            if (err) {
                console.log("Error:", err);
            } else {
                res.header("Access-Control-Allow-Origin", "http://localhost:8042"); //* will allow from all cross domain
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.header("Access-Control-Allow-Methods", "GET");
                res.send({
                    status: 'success',
                    data: result,
                });
                res.end();
            }
        });
    },
    detailArticles: (req, res) => {
        if (req.params.id) {
            ArticlesTable.find({
                _id: req.params.id,
            }).lean().exec(function(err, result) {
                if (err) {
                    res.status('500').send({
                        status: 'Failure',
                        message: 'Methods Invalid',
                    });
                } else {
                    if (!empty(result)) {
                        res.header("Access-Control-Allow-Origin", "http://localhost:8042"); //* will allow from all cross domain
                        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                        res.header("Access-Control-Allow-Methods", "GET");
                        res.status(200).send({
                            status: 'Success',
                            data: result,
                        });
                        res.end();
                    } else {
                        res.status('500').send({
                            status: 'Failure',
                            message: 'Methods Invalid',
                        });
                    }

                }
            });
        } else {
            res.status('500').send({
                status: 'Failure',
                message: 'Methods Invalid',
            });
        }

    },
    addArticles: (req, res) => {

        if (req.method == "POST") {
            ArticlesTable.find({}).sort([
                ['_id', 'descending']
            ]).limit(1).exec((err, articleDB) => {
                var requireThumbnail = (name, value, params) => {
                    return (!empty(req.files));
                }
                var v = Validator.make(req.body, rules);
                v.extend('emptythumbnail', requireThumbnail, "Thumbnail is required");
                if (v.fails()) {
                    res.status(500).send({
                        status: 'Failure',
                        message: v.getErrors(),
                    });
                } else {
                    let article = new ArticlesTable();
                    var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
                    let thumbnail = req.files.thumbnail;
                    var thumbnailPath = `/upload/image/${req.files.thumbnail.name}`;
                    const directoryPath = path.join(__dirname, `../../public/upload/image/${req.files.thumbnail.name}`);
                    thumbnail.mv(directoryPath, function(err) {
                        if (err) {
                            res.status(500).send({
                                status: 'Failure',
                                message: 'image cant upload',
                            });

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
                                    res.status(500).send('cant post new article');
                                } else {
                                    res.status(200).send({
                                        status: 'Success',
                                        data: result,
                                    });
                                }

                            });
                        }
                    });


                }

            });

        }

    }

}
