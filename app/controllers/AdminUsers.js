var AdminUsersTable = require("../models/AdminUsersTable");
var AdminRolesTable = require("../models/AdminRolesTable");
const Utils = require('../controllers/Utils');
const Utility = new Utils.Utility();
var rules = {
    name: 'required',
    email: 'required|email',
    // password: 'min:6',
    role_id: 'integer',

}
Utility.app.locals.pathVariable = {
    path: ''
};
exports.index = async (req, res) => {
    let response = new Utils.Controller(req, res, 'AdminUsers');
    var paginations = await response.pagination();
    res.render('AdminUsers/index.ejs', {
        csrfToken: req.csrfToken(),
        req: req,
        title: 'Home page',
        error: req.flash("error"),
        success: req.flash("success"),
        info: req.flash('info'),
        listUsers: paginations.results,
        pageCount: paginations.pageCount,
        itemCount: paginations.itemCount,
        currentPage: req.query.page,
        pages: Utility.paginate.getArrayPages(req)(3, paginations.pageCount, req.query.page),
        has_more: Utility.paginate.hasNextPages(req)(paginations.pageCount),
    });

};
exports.add = async (req, res) => {
    var optionRole = await AdminRolesTable.find({}).lean().exec();
    if (Utility.app.locals.pathVariable.path != req.path) {
        Utility.app.locals.pathVariable = '';
    }
    if (req.method == "POST") {
        let controller = new Utils.Controller(req, res, 'AdminUsers');
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
            let adminUser = new AdminUsersTable();
            if (!Utility.empty(req.body.password)) {
                req.body.password = adminUser.generateHash(req.body.password);
            }
            let adminUserNew = await controller.createEntity(req.body);
            adminUserNew.save(function(err, result) {
                if (err) {
                    error = req.flash('error', 'cant not save data');
                    res.redirect('/admin/admin-users/add');
                } else {
                    success = req.flash('success', 'update complete');
                    res.redirect('/admin/admin-users/index');
                }
            });

        }

    } else if (req.method == "GET") {
        res.render('AdminUsers/add.ejs', {
            title: 'addddddd',
            error: req.flash("error"),
            errors: Utility.app.locals.pathVariable.errors,
            info: req.flash('info'),
            optionRole: optionRole,
            success: req.flash("success"),
            csrfToken: req.csrfToken()
        });
    }
};
exports.edit = async (req, res) => {
    var optionRole = await AdminRolesTable.find({}).lean().exec();
    let controller = new Utils.Controller(req, res, 'AdminUsers');
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
                        res.redirect('/admin/admin-users/index');
                    } else {
                        error = req.flash('error', 'cant not save data');
                        res.redirect('back');
                    }
                });
            }
        }
        dataEntity = await controller.getEntityById(req.params.id);
        if (dataEntity) {
            res.render('AdminUsers/edit.ejs', {
                title: 'addddddd',
                error: req.flash("error"),
                success: req.flash("success"),
                info: req.flash('info'),
                errors: Utility.app.locals.pathVariable.errors,
                csrfToken: req.csrfToken(),
                adminUser: dataEntity,
                optionRole: optionRole,
            });
        } else {
            res.redirect('/admin/admin-users/index')
        }
    } else {
        res.redirect('/admin/admin-users/index')
    }

};
exports.view = async (req, res) => {
    var optionRole = await AdminRolesTable.find({}).lean().exec();
    var controller = new Utils.Controller(req, res, 'AdminUsers');
    if (req.params.id.length > 0) {
        dataEntity = await controller.getEntityById(req.params.id);
        if (req.method == "GET") {
            if (!Utility.empty(dataEntity)) {
                res.render('AdminUsers/view.ejs', {
                    title: 'addddddd',
                    error: req.flash("error"),
                    success: req.flash("success"),
                    csrfToken: req.csrfToken(),
                    adminUser: dataEntity,
                    optionRole: optionRole,
                    info: req.flash('info'),
                });
            } else {
                res.redirect('/admin-users/index')
            }

        }
    } else {
        res.redirect('/admin-users/index')
    }

};
exports.delete = (req, res) => {
    if (req.params.id.length > 0) {
        if (req.method == "POST") {
            AdminUsersTable.deleteOne({
                _id: req.params.id
            }).exec((err, result) => {
                if (err) {
                    console.log("Error:", err);

                } else {
                    res.redirect('/admin/admin-users/index');
                }

            });

        }
    } else {
        res.redirect('/admin/admin-users/index')
    }

};
exports.login = (req, res) => {
    if (req.session.user) {
        info: req.flash('info');
        success: req.flash('success');
        error: req.flash('error');
        res.redirect('/admin/admin-users/index');

    }
    else {
        res.render('newLogin', {
            info: req.flash('info'),
            success: req.flash('success'),
            error: req.flash('error'),
            csrfToken: req.csrfToken(),
            layout: false,
        });

    }

};
exports.logout = (req, res) => {
    req.session.destroy();
    req.logout();
    res.redirect('/admin/login');
};
