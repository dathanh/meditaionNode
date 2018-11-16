var ArticlesTable = require("../models/ArticlesTable");
const Utils = require('../controllers/Utils');
const Utility = new Utils.Utility();
var rules = {
    name: 'required',
    title: 'required',
    description: 'min:6',
    // thumbnail: 'emptythumbnail',
    status: 'required',

}

Utility.app.locals.pathVariable = {
    path: ''
};
exports.index = async (req, res) => {
    let response = new Utils.Controller(req, res, 'Articles');
    var paginations = await response.pagination();
    res.render('Articles/index.ejs', {
        csrfToken: req.csrfToken(),
        req: req,
        title: 'Home page',
        error: req.flash("error"),
        success: req.flash("success"),
        info: req.flash('info'),
        listArticles: paginations.results,
        pageCount: paginations.pageCount,
        itemCount: paginations.itemCount,
        currentPage: req.query.page,
        pages: Utility.paginate.getArrayPages(req)(3, paginations.pageCount, req.query.page),
        has_more: Utility.paginate.hasNextPages(req)(paginations.pageCount),
    });

};
exports.add = async (req, res) => {
    if (Utility.app.locals.pathVariable.path != req.path) {
        Utility.app.locals.pathVariable = '';
    }
    if (req.method == "POST") {
        let controller = new Utils.Controller(req, res, 'Articles');
        var v = Utility.Validator.make(req.body, rules);
        if (v.fails()) {
            Utility.app.locals.pathVariable = {
                errors: v.getErrors(),
                path: req.path,
            };
            info = req.flash('info');
            success = req.flash('success');
            error = req.flash('error');
            res.redirect('back');
        } else {
            await controller.uploadFile('thumbnail', (data) => {
                if (data) {
                    req.body.thumbnail = data
                }
            });
            let article = await controller.createEntity(req.body);
            article.save(function(err, result) {
                if (err) {
                    error = req.flash('error', 'cant not save data');
                    res.redirect('/admin/articles/add');
                } else {
                    success = req.flash('success', 'update complete');
                    res.redirect('/admin/articles/index');
                }
            });
        }

    } else if (req.method == "GET") {

        res.render('Articles/add.ejs', {
            title: 'addddddd',
            error: req.flash("error"),
            errors: Utility.app.locals.pathVariable.errors,
            info: req.flash('info'),
            success: req.flash("success"),
            csrfToken: req.csrfToken()
        });
    }


};
exports.edit = async (req, res) => {
    var controller = new Utils.Controller(req, res, 'Articles');
    if (req.params.id.length > 0) {
        if (Utility.app.locals.pathVariable.path != req.path) {
            Utility.app.locals.pathVariable = '';
        }
        if (req.method == "POST") {
            let requireThumbnail = (name, value, params) => {
                return (!empty(req.files.thumbnail));
            }
            var v = Utility.Validator.make(req.body, rules);
            v.extend('emptythumbnail', requireThumbnail, "Thumbnail is required");
            if (v.fails()) {
                Utility.app.locals.pathVariable = {
                    errors: v.getErrors(),
                    path: req.path,
                };
                info = req.flash('info');
                success = req.flash('success');
                error = req.flash('error');
                res.redirect('back');
            } else {
                await controller.uploadFile('thumbnail', (data) => {
                    if (data) {
                        req.body.thumbnail = data
                    }
                });
                await controller.updateById(req.params.id, req.body, (data) => {
                    if (data) {
                        success = req.flash('success', 'update complete');
                        res.redirect('/admin/articles/index');
                    } else {
                        error = req.flash('error', 'cant not save data');
                        res.redirect('back');
                    }
                });

            }
        } else if (req.method == "GET") {
            dataEntity = await controller.getEntityById(req.params.id);
            if (dataEntity) {
                res.render('Articles/edit.ejs', {
                    title: 'addddddd',
                    error: req.flash("error"),
                    success: req.flash("success"),
                    info: req.flash('info'),
                    errors: Utility.app.locals.pathVariable.errors,
                    csrfToken: req.csrfToken(),
                    article: dataEntity,
                });
            } else {
                res.redirect('/admin/articles/index')
            }

        }
    } else {
        res.redirect('/admin/articles/index')
    }

};
exports.view = async (req, res) => {
    var controller = new Utils.Controller(req, res, 'Articles');
    if (req.params.id.length > 0) {
        if (req.method == "GET") {
            dataEntity = await controller.getEntityById(req.params.id);
            if (dataEntity) {
                res.render('Articles/view.ejs', {
                    title: 'addddddd',
                    error: req.flash("error"),
                    success: req.flash("success"),
                    info: req.flash('info'),
                    errors: Utility.app.locals.pathVariable.errors,
                    csrfToken: req.csrfToken(),
                    article: dataEntity,
                });
            } else {
                res.redirect('/admin/articles/index')
            }
        }
    } else {
        res.redirect('/articles/index')
    }

};
exports.delete = (req, res) => {
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

};
