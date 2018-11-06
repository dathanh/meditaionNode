var ArticlesTable = require("../models/ArticlesTable");
const Utils = require('../controllers/Utils');
const Utility = new Utils.Utility();
var rules = {
    name: 'required',
    title: 'required',
    description: 'required',
    thumbnail: 'emptythumbnail',
    status: 'required',
};
exports.getArticles = (req, res) => {
    let response = new Utils.ApiStructure(req, res);
    ArticlesTable.find({}).lean().exec(function(err, result) {
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
};
exports.detailArticles = (req, res) => {
    let response = new Utils.ApiStructure(req, res);
    if (req.params.id) {
        ArticlesTable.find({
            _id: req.params.id,
        }).lean().exec(function(err, result) {
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
    } else {
        response.actionInvalid();
    }

};
exports.addArticles = async (req, res) => {
    let response = new Utils.ApiStructure(req, res);
    if (req.method == "POST") {
        var requireThumbnail = (name, value, params) => {
            return (!Utility.empty(req.files));
        }
        var v = Utility.Validator.make(req.body, rules);
        v.extend('emptythumbnail', requireThumbnail, "Thumbnail is required");
        if (v.fails()) {
            response.actionInvalid(v.getErrors());
        } else {
            let controller = new Utils.Controller(req, res, 'Articles');
            await controller.uploadFile('thumbnail', (data) => {
                if (data) {
                    req.body.thumbnail = data
                }
            });
            let article = await controller.createEntity(req.body);
            article.save(function(err, result) {
                if (err) {
                    response.actionInvalid('cant post new article');
                } else {
                    response.actionSuccess(result);
                }
            });
        }

    }

};
exports.editArticles = async (req, res) => {
    if (req.method == "POST") {
        let response = new Utils.ApiStructure(req, res);
        let controller = new Utils.Controller(req, res, 'Articles');
        await controller.uploadFile('thumbnail', (data) => {
            if (data) {
                req.body.thumbnail = data
            }
        });
        await controller.updateById(req.params.id, req.body, (data) => {
            if (data) {
                response.actionSuccess(data);
            } else {
                response.actionInvalid('cant post edit article');
            }
        });

    }

};
