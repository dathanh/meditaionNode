var AdminRolesTable = require("../models/AdminRolesTable");
const Utils = require('../controllers/Utils');
const Utility = new Utils.Utility();
var rules = {
    name: 'required',
    description: 'required',
    status: 'required',
}
Utility.app.locals.pathVariable = {
    path: ''
};
exports.index = async (req, res) => {
    let controller = new Utils.Controller(req, res, 'AdminRoles');
    var paginations = await controller.pagination();
    res.render('AdminRoles/index.ejs', {
        csrfToken: req.csrfToken(),
        req: req,
        buildRoutes: controller.buildRoutes,
        title: 'Home page',
        error: req.flash("error"),
        success: req.flash("success"),
        info: req.flash('info'),
        listRoles: paginations.results,
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
    let controller = new Utils.Controller(req, res, 'AdminRoles');
    if (req.method == "POST") {
        var v = Utility.Validator.make(req.body, rules);
        if (v.fails()) {
            console.log(v.getErrors());
            Utility.app.locals.pathVariable = {
                errors: v.getErrors(),
                path: req.path,
            };
            res.redirect('/admin-roles/add');
        } else {
            let AdminRole = await controller.createEntity(req.body);
            AdminRole.save(function(err, result) {
                if (err) {
                    error = req.flash('error', 'cant not save data');
                    res.redirect('/admin/admin-roles/add');
                } else {
                    success = req.flash('success', 'update complete');
                    res.redirect('/admin/admin-roles/index');
                }
            });
        }

    } else {
        res.render('AdminRoles/add.ejs', {
            title: 'addddddd',
            req: req,
            buildRoutes: controller.buildRoutes,
            error: req.flash("error"),
            errors: Utility.app.locals.pathVariable.errors,
            success: req.flash("success"),
            info: req.flash('info'),
            csrfToken: req.csrfToken()
        });
    }

};
exports.edit = async (req, res) => {
    if (req.params.id.length > 0) {
        if (Utility.app.locals.pathVariable.path != req.path) {
            Utility.app.locals.pathVariable = '';
        }
        let controller = new Utils.Controller(req, res, 'AdminRoles');
        if (req.method == "POST") {
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
                await controller.updateById(req.params.id, req.body, (data) => {
                    if (data) {
                        success = req.flash('success', 'update complete');
                        res.redirect('/admin/admin-roles/index');
                    } else {
                        error = req.flash('error', 'cant not save data');
                        res.redirect('back');
                    }
                });
            }
        } else {
            dataEntity = await controller.getEntityById(req.params.id);
            if (dataEntity) {
                res.render('AdminRoles/edit.ejs', {
                    title: 'addddddd',
                    req: req,
                    buildRoutes: controller.buildRoutes,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    info: req.flash('info'),
                    errors: Utility.app.locals.pathVariable.errors,
                    csrfToken: req.csrfToken(),
                    adminRole: dataEntity,
                });
            } else {
                res.redirect('/admin/admin-roles/index')
            }
        }
    } else {
        res.redirect('/admin/admin-roles/index')
    }
};
exports.view = async (req, res) => {
    if (req.params.id.length > 0) {
        if (req.method == "GET") {
            dataEntity = await controller.getEntityById(req.params.id);
            if (dataEntity) {
                res.render('AdminRoles/view.ejs', {
                    title: 'addddddd',
                    req: req,
                    buildRoutes: controller.buildRoutes,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    info: req.flash('info'),
                    csrfToken: req.csrfToken(),
                    adminRole: dataEntity,
                });
            } else {
                res.redirect('/admin-roles/index')
            }
        }
    } else {
        res.redirect('/admin-roles/index')
    }
};
exports.delete = (req, res) => {
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
};
