var Inflector = require('inflector-js')
module.exports = [{
        name: 'AdminUsers',
        icon: 'users',
        index: {
            link: '/' + Inflector.dasherize(Inflector.underscore('AdminUsers')) + '/index',
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
            link: '/admin-permissions/index',
            name: 'List Admin Permissions'
        },
        add: {
            link: '/admin-permissions/add',
            name: 'Add Admin Permission'
        }
    },
    {
        name: 'AdminRoles',
        icon: 'flask',
        index: {
            link: '/admin-roles/index',
            name: 'List Admin Roles'
        },
        add: {
            link: '/admin-roles/add',
            name: 'Add Admin Roles'
        }
    },
    {
        name: 'Articles',
        icon: 'flask',
        index: {
            link: '/articles/index',
            name: 'List Articles'
        },
        add: {
            link: '/articles/add',
            name: 'Add Articles'
        }
    }, {
        name: 'AwsArticles',
        icon: 'flask',
        index: {
            link: '/aws-articles/index',
            name: 'List Aws Articles'
        },
        add: {
            link: '/aws-articles/add',
            name: 'Add Aws Articles'
        }
    }
]
