var Inflector = require('inflector-js')
module.exports = [{
        name: 'AdminUsers',
        icon: 'users',
        index: {
            link: '/admin/' + Inflector.dasherize(Inflector.underscore('AdminUsers')) + '/index',
            name: 'List Admin Usres',
        },
        add: {
            link: '/admin-users/add',
            name: 'Add Admin Usres'
        }
    },
    {
        name: 'AdminPermissions',
        icon: 'diamond',
        index: {
            link: '/admin/admin-permissions/index',
            name: 'List Admin Permissions'
        },
        add: {
            link: '/admin/admin-permissions/add',
            name: 'Add Admin Permission'
        }
    },
    {
        name: 'AdminRoles',
        icon: 'flask',
        index: {
            link: '/admin/admin-roles/index',
            name: 'List Admin Roles'
        },
        add: {
            link: '/admin/admin-roles/add',
            name: 'Add Admin Roles'
        }
    },
    {
        name: 'Articles',
        icon: 'flask',
        index: {
            link: '/admin/articles/index',
            name: 'List Articles'
        },
        add: {
            link: '/admin/articles/add',
            name: 'Add Articles'
        }
    }, {
        name: 'AwsArticles',
        icon: 'flask',
        index: {
            link: '/admin/aws-articles/index',
            name: 'List Aws Articles'
        },
        add: {
            link: '/admin/aws-articles/add',
            name: 'Add Aws Articles'
        }
    }
]
