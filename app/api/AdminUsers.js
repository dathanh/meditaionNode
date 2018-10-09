var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var flash = require('connect-flash')
var constant = require('../../config/constants');
var mongoose = require('mongoose');
var AdminUsersTable = require("../models/AdminUsersTable");
var Validator = require('Validator')
var jsonwebtoken = require('jsonwebtoken');

var rules = {
    name: 'required',
    email: 'required|email',
    password: 'between:111,115'
}
module.exports = {
    getUser: (req, res) => {
        var decoded = jsonwebtoken.verify(req.header('Authorization'), 'secretKey');
        res.send(decoded);
        AdminUsersTable.find({}).exec((err, result) => {
            if (err) {
                console.log("Error:", err);
            } else {
                res.header("Access-Control-Allow-Origin", "http://localhost:8042"); //* will allow from all cross domain
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.header("Access-Control-Allow-Methods", "GET");
                res.send(result);
                res.end();
            }
        });
    },
    login: (req, res) => {
        if (req.method == "POST") {
            console.log(req.body.email);
            AdminUsersTable.find({
                email: req.body.email
            }).exec(function(err, adminUser) {
                if (err) {
                    console.log("Error:", err);
                } else {
                    if (adminUser.length > 0) {
                        if (adminUser[0].validPassword(req.body.password)) {
                            let test = jsonwebtoken.sign({
                                _id: adminUser[0]._id,
                                name: adminUser[0].name,
                                email: adminUser[0].email,
                            }, 'secretKey', {
                                expiresIn: 86400 // expires in 24 hours
                            });
                            res.send({
                                _id: adminUser[0]._id,
                                name: adminUser[0].name,
                                email: adminUser[0].email,
                                token: test
                            });
                        }

                    } else {
                        res.send('dont exists')
                    }
                }

            });
        } else {
            res.header("Access-Control-Allow-Origin", "http://localhost:8042"); //* will allow from all cross domain
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "GET");
            res.send({
                error: "Methods Invalid"
            });
            res.end();
        }
    },
    upload: (req, res) => {
        if (req.method == "POST") {
            var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");

            require("fs").writeFile("out.png", base64Data, 'base64', function(err) {
                console.log(err);
            });
        }
    },
    checkLogin: (req, res, next) => {
        if (req.header('Authorization')) {
            try {
                var dataUser = jsonwebtoken.verify(req.header('Authorization'), 'secretKey');
                AdminUsersTable.findOne({
                    email: dataUser.email
                }).lean().exec((err, adminLogin) => {
                    if (err) {
                        res.end('Authorization Invalid');
                    } else {
                        next();
                    }
                })
            } catch (err) {
                res.end('Authorization Invalid');
            }

        } else {
            res.end('Authorization Invalid');
        }

    }



}
