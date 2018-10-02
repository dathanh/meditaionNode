var Inflector = require('inflector-js');
module.exports = {
    Controller: {
        AdminUsers: {
            __prefix: Inflector.dasherize(Inflector.underscore("AdminUsers")),
            index: {
                method: ["get"],
                routes: "/admin-users/index",
            },
            add: {
                method: ["get", "post", "put"],
                routes: "",
            },
            edit: {
                method: ["post", "put",'get'],
                routes: "/admin-users/edit/:id",
            },
            view: {
                method: ['get'],
                routes: "/admin-users/view/:id",
            },
            delete: {
                method: ["delete", "put","post"],
                routes: "/admin-users/delete/:id",
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
        }
    }
}
