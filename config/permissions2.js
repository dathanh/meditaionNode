const AdminPermissionsTable = require("../app/models/AdminPermissionsTable");
const acl = require('express-acl');
const Inflector = require('inflector-js');
var resource = []

module.exports = {
    login: async (req, res, next) => {
            if (req.session.user) {
                var permissionRole = await AdminPermissionsTable.find({
                    role_id: req.session.user.role_id
                }).lean().exec();
                permissionRole.forEach((permission) => {
                    let routes = (permission.controller === '*') ? '*' : '/' + Inflector.dasherize(Inflector.underscore(permission.controller)) + '/' + Inflector.dasherize(Inflector.underscore(permission.action)) + '/*';
                    resource.push({
                        resource: routes,
                        methods: "*",
                        action: 'allow',
                    });
                });
                console.log(JSON.stringify(resource));
                const options = {
                    // baseUrl: 'admin-users',
                    rules: [{
                        group: req.session.user.email,
                        permissions: resource

                    }],
                    yml: true,
                    // defaultRole: req.session.user.role_id.toString(),
                    roleSearchPath: 'session.user.email',
                    denyCallback: (req, res) => {
                        info = req.flash('info');
                        success = req.flash('success');
                        error = req.flash('error', 'Permission denied');
                        return res.redirect('back');

                    }
                };

                acl.config(options);
                next();
            } else {
                res.redirect('/admin/login');
            }
        },
        checkPermissions: () => acl.authorize
}
