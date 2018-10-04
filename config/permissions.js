var acl = require('acl');
var AdminPermissionsTable = require("../app/models/AdminPermissionsTable");
var Inflector = require('inflector-js');
acl = new acl(new acl.memoryBackend());

var resource = [];
var getUserId = () => 'dathanh';
module.exports = async (req, res, next) => {
    console.log(JSON.stringify(req.session.user));
    console.log("--------------------Session" + req.session.user.role_id);
    var permissionRole = await AdminPermissionsTable.find({
        role_id: req.session.user.role_id
    }).lean().exec();
    permissionRole.forEach((permission) => {
        resource.push('/' + Inflector.dasherize(Inflector.underscore(permission.controller)) + '/' + Inflector.dasherize(Inflector.underscore(permission.action)));
    });
    acl.allow([{
        roles: 'admin',
        allows: [{
                resources: resource,
                permissions: '*'
            },

        ]
    }])
    acl.addUserRoles(req.session.user.email, 'admin');
    console.log(resource);
    if (req.path.indexOf('?')) {
        var pathParser = req.path.split("?")[0];
        pathParser = pathParser.split("/");
    } else {
        var pathParser = req.path.split("/");
    }
    var pathCheck = '/' + pathParser[1] + '/' + pathParser[2];
    acl.isAllowed(req.session.user.email, pathCheck, '*',
        function(err, resPermission) {
            if (resPermission) {
                next()
            } else {
                info = req.flash('info');
                success = req.flash('success');
                error = req.flash('error', 'Permission denied');
                res.redirect('back');
            }
        })
}
