const Utils = require('../controllers/Utils');
const Utility = new Utils.Utility();
var AdminUsersTable = require("../models/AdminUsersTable");
var Validator = require('Validator')
var rules = {
    name: 'required',
    email: 'required|email',
    password: 'between:111,115'
}
exports.getUser = (req, res) => {
    let response = new Utils.ApiStructure(req, res);
    try {
        var decoded = Utility.jsonwebtoken.verify(req.header('Authorization'), 'secretKey');
        response.actionSuccess(decoded);
    } catch (err) {
        response.actionInvalid(err);
    }

};
exports.getAllUsers = (req, res) => {
    AdminUsersTable.find({}).exec((err, result) => {
        var response = new Utils.ApiStructure(req, res);
        if (err) {
            response.actionInvalid(err);
        } else {
            if (Utility.empty(result)) {
                response.actionNotFound();
            } else {
                response.actionSuccess(result);
            }

        }
    });
}
exports.login = (req, res) => {
    let response = new Utils.ApiStructure(req, res);
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
                        let test = Utility.jsonwebtoken.sign({
                            _id: adminUser[0]._id,
                            name: adminUser[0].name,
                            email: adminUser[0].email,
                        }, 'secretKey', {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        response.actionSuccess({
                            _id: adminUser[0]._id,
                            name: adminUser[0].name,
                            email: adminUser[0].email,
                            token: test
                        });
                    }

                } else {
                    response.actionInvalid("User dont exist");
                }
            }

        });
    } else {
        response.actionInvalid("Method Invalid");
    }
};
exports.upload = (req, res) => {
    if (req.method == "POST") {
        var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");

        require("fs").writeFile("out.png", base64Data, 'base64', function(err) {
            console.log(err);
        });
    }
};
exports.checkLogin = (req, res, next) => {
    let response = new Utils.ApiStructure(req, res);
    if (req.header('Authorization')) {
        try {
            var dataUser = Utility.jsonwebtoken.verify(req.header('Authorization'), 'secretKey');
            AdminUsersTable.findOne({
                email: dataUser.email
            }).lean().exec((err, adminLogin) => {
                if (err) {
                    response.actionInvalid("Authorization Invalid");
                } else {
                    next();
                }
            })
        } catch (err) {
            response.actionInvalid("Authorization Invalid");
        }

    } else {
        response.actionInvalid("Authorization Invalid");
    }

};
