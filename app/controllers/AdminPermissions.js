const AdminPermissionsTable = require("../models/AdminPermissionsTable");
const AdminRolesTable = require("../models/AdminRolesTable");
const Utils = require('../controllers/Utils');
const Utility = new Utils.Utility();
const rules = {
    controller: 'required',
    action: 'required',
    status: 'required',
    role_id: 'integer',

}
Utility.app.locals.pathVariable = {
    path: ''
};
exports.index = async (req, res) => {
    let controller = new Utils.Controller(req, res, 'AdminPermissions');
    var paginations = await controller.pagination();
    var optionRole = await AdminRolesTable.find({}).lean().exec();
    console.log(controller.buildRoutes({action:'edit',options:{id:5}}));;
    res.render('AdminPermissions/index.ejs', {
        csrfToken: req.csrfToken(),
        req: req,
        title: 'Home page',
        error: req.flash("error"),
        success: req.flash("success"),
        info: req.flash('info'),
        listPermissions: paginations.results,
        pageCount: paginations.pageCount,
        itemCount: paginations.itemCount,
        currentPage: req.query.page,
        pages: Utility.paginate.getArrayPages(req)(3, paginations.pageCount, req.query.page),
        has_more: Utility.paginate.hasNextPages(req)(paginations.pageCount),
        optionRole: optionRole,
    });

};
exports.add = async (req, res) => {
    var optionRole = await AdminRolesTable.find({}).lean().exec();
    if (Utility.app.locals.pathVariable.path != req.path) {
        Utility.app.locals.pathVariable = '';
    }
    if (req.method == "POST") {
        let controller = new Utils.Controller(req, res, 'AdminPermissions');
        var v = Utility.Validator.make(req.body, rules);
        if (v.fails()) {
            console.log(v.getErrors());
            Utility.app.locals.pathVariable = {
                errors: v.getErrors(),
                path: req.path,
            };
            res.redirect('/admin/admin-permissions/add');
        } else {
            let AdminPermissions = await controller.createEntity(req.body);
            AdminPermissions.save(function(err, result) {
                if (err) {
                    error = req.flash('error', 'cant not save data');
                    res.redirect('/admin/admin-permissions/add');
                } else {
                    success = req.flash('success', 'update complete');
                    res.redirect('/admin/admin-permissions/index');
                }
            });
        }
    } else if (req.method == "GET") {
        res.render('AdminPermissions/add.ejs', {
            title: 'addddddd',
            error: req.flash("error"),
            errors: Utility.app.locals.pathVariable.errors,
            success: req.flash("success"),
            info: req.flash('info'),
            csrfToken: req.csrfToken(),
            optionRole: optionRole,
        });
    }


};
exports.edit = async (req, res) => {
    let controller = new Utils.Controller(req, res, 'AdminPermissions');
    var optionRole = await AdminRolesTable.find({}).lean().exec();
    if (req.params.id.length > 0) {
        if (Utility.app.locals.pathVariable.path != req.path) {
            Utility.app.locals.pathVariable = '';
        }
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
                        res.redirect('/admin/admin-permissionss/index');
                    } else {
                        error = req.flash('error', 'cant not save data');
                        res.redirect('back');
                    }
                });
            }

        } else if (req.method == "GET") {
            dataEntity = await controller.getEntityById(req.params.id);
            if (dataEntity) {
                res.render('AdminPermissions/edit.ejs', {
                    title: 'addddddd',
                    error: req.flash("error"),
                    success: req.flash("success"),
                    info: req.flash('info'),
                    errors: Utility.app.locals.pathVariable.errors,
                    csrfToken: req.csrfToken(),
                    adminPermission: dataEntity,
                    optionRole: optionRole,
                });
            } else {
                res.redirect('/admin/admin-permissions/index')
            };
        }
    } else {
        res.redirect('/admin-permissions/index')
    }

};
exports.view = async (req, res) => {
    let controller = new Utils.Controller(req, res, 'AdminPermissions');
    var optionRole = await AdminRolesTable.find({}).lean().exec();
    if (req.params.id.length > 0) {
        if (req.method == "GET") {
            dataEntity = await controller.getEntityById(req.params.id);
            if (dataEntity) {
                res.render('AdminPermissions/view.ejs', {
                    title: 'addddddd',
                    error: req.flash("error"),
                    success: req.flash("success"),
                    info: req.flash('info'),
                    csrfToken: req.csrfToken(),
                    adminPermission: dataEntity,
                    optionRole: optionRole,
                });
            } else {
                res.redirect('/admin-permissions/index')
            }
        }
    } else {
        res.redirect('/admin-permissions/index')
    }

};
exports.delete = (req, res) => {
    if (req.params.id.length > 0) {
        if (req.method == "POST") {
            AdminPermissionsTable.deleteOne({
                _id: req.params.id
            }).exec((err, result) => {
                if (err) {
                    console.log("Error:", err);

                } else {
                    res.redirect('/admin-permissions/index');
                }

            });
        }
    } else {
        res.redirect('/admin-permissions/index')
    }
};
