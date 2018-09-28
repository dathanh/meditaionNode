var Inflector = require('inflector-js');
module.exports = {
    Controller: {
        AdminUsers: {
            __prefix: Inflector.dasherize(Inflector.underscore("AdminUsers")),
            index: {
                method: ["get"],
                routes: "",
            },
            add: {
                method: ["get", "post", "put"],
                routes: "",
            },
            edit: {
                method: ["post", "put"],
                routes: "",
            },
            delete: {
                method: ["delete", "put"],
                routes: "",
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
