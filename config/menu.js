var Inflector = require('inflector-js')
module.exports = [
    {
        name: 'AdminUsers',
        icon: 'dimonds',
        index: {
            link: Inflector.dasherize(Inflector.underscore('AdminUsers'))+'/index',
            name: 'List Admin Usres'
        },
        add: {
            link: 'admin-users/add',
            name: 'Add Admin Usres'
        }
    },
    {
        name: 'AdminPermissions',
        icon: 'users',
        index: {
            link: 'admin-users/index',
            name: 'List Admin Permissions'
        },
        add: {
            link: 'admin-users/add',
            name: 'Add Admin Permission'
        }
    },
    {
        name: 'AdminRoles',
        icon: 'users',
        index: {
            link: 'admin-roles/index',
            name: 'List Admin Roles'
        },
        add: {
            link: 'admin-roles/add',
            name: 'Add Admin Roles'
        }
    }
]
