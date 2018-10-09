var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({
    profile: 'meditation'
});
AWS.config.credentials = credentials;
AWS.config.update({
    region: 'us-east-2'
});
const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-2'
});
var getTable = function(events, ctx, callback) {

    var scanningParameters = {
        TableName: 'DT-Chat-Conversations',
        Limit: 100,
        FilterExpression: 'Username = :username',
        ExpressionAttributeValues: {
            ':username': 'Dathanh'
        }

    };

    docClient.scan(scanningParameters, function(err, data) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });

}
// var getData = (events, context, callback) => {
//     var params = {
//         TableName: 'DT-Chat-Conversations',
//         Key: {
//             "Username":"Dathanh"
//         }
//     }
//     docClient.get(params, function(err, data) {
//         if (err) {
//             callback(err, null);
//         } else {
//             callback(null, data);
//         }
//     });
// }


getTable('test', 'nono', (bug, data) => {
    console.log(data);
});
