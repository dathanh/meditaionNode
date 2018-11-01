var Inflector = require('inflector-js');
module.exports = {
    Controller: {
        AdminUsers: {
            __prefix: Inflector.dasherize(Inflector.underscore("AdminUsers")),
            index: {
                method: ["get"],
                routes: "/admin-users/index",
                link: "/admin-users/index",
            },
            add: {
                method: ["get", "post", "put"],
                routes: "",
            },
            edit: {
                method: ["post", "put", 'get'],
                routes: "/admin-users/edit/:id",
            },
            view: {
                method: ['get'],
                routes: "/admin-users/view/:id",
            },
            delete: {
                method: ["delete", "put", "post"],
                routes: "/admin-users/delete/:id",
            },
        },
        AdminPermissions: {
            __prefix: Inflector.dasherize(Inflector.underscore("AdminPermissions")),
            index: {
                method: ["get"],
                routes: "/admin-permissions/index",
            },
            add: {
                method: ["get", "post", "put"],
                routes: "",
            },
            edit: {
                method: ["post", "put", 'get'],
                routes: "/admin-permissions/edit/:id",
            },
            view: {
                method: ['get'],
                routes: "/admin-permissions/view/:id",
            },
            delete: {
                method: ["delete", "put", "post"],
                routes: "/admin-permissions/delete/:id",
            },
        },
        AdminRoles: {
            __prefix: Inflector.dasherize(Inflector.underscore("AdminRoles")),
            index: {
                method: ["get"],
                routes: "/admin-roles/index",
            },
            add: {
                method: ["get", "post", "put"],
                routes: "",
            },
            edit: {
                method: ["post", "put", 'get'],
                routes: "/admin-roles/edit/:id",
            },
            view: {
                method: ['get'],
                routes: "/admin-roles/view/:id",
            },
            delete: {
                method: ["delete", "put", "post"],
                routes: "/admin-roles/delete/:id",
            },
        },
        Articles: {
            __prefix: Inflector.dasherize(Inflector.underscore("Articles")),
            index: {
                method: ["get"],
                routes: "/articles/index",
            },
            add: {
                method: ["get", "post", "put"],
                routes: "",
            },
            edit: {
                method: ["post", "put", 'get'],
                routes: "/articles/edit/:id",
            },
            view: {
                method: ['get'],
                routes: "/articles/view/:id",
            },
            delete: {
                method: ["delete", "put", "post"],
                routes: "/articles/delete/:id",
            },
        },
        AwsArticles: {
            __prefix: Inflector.dasherize(Inflector.underscore("AwsArticles")),
            index: {
                method: ["get"],
                routes: "/aws-articles/index",
            },
            view: {
                method: ["get"],
                routes: "/aws-articles/view/:id",
            },
            add: {
                method: ["get", "post", "put"],
                routes: "/aws-articles/add",
            },
            edit: {
                method: ["get", "post", "put"],
                routes: "/aws-articles/edit/:id",
            },
        },
    },
    Api: {
        AdminUsers: {
            getUser: {
                method: ["get"],
                routes: "",
            },
            login: {
                method: ["post", "get"],
                routes: "",
            },
            upload: {
                method: ["post"],
                routes: "",
            }
        },
        Articles: {
            getArticles: {
                method: ["get"],
                routes: "/articles/all",
            },
            detailArticles: {
                method: ["get"],
                routes: "/articles/:id",
            },
            addArticles: {
                method: ["post"],
                routes: "/articles/add",
            },
            editArticles: {
                method: ["post"],
                routes: "/articles/edit/:id",
            },
        }
    }
}
