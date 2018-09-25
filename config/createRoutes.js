var Inflector = require('inflector-js');
var resource=[];

module.exports = {

    //data= {controller:string,acrion:object}
    setResource: (data) => {
        resource=data;
    },
    getResource: () => {
        return resource;
    }
}
