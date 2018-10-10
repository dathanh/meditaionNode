var dateFormat = require('dateformat');
var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({
    profile: 'meditation'
});

var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {
        Bucket: 'meditationnodejs'
    }
});
AWS.config.credentials = credentials;
AWS.config.update({
    region: 'us-east-2'
});
const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-2'
});
exports.getArticles = (events, ctx, callback) => {

    var scanningParameters = {
        TableName: events,
    };

    docClient.scan(scanningParameters, (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
};
exports.getArticlesById = (events, ctx, callback) => {

    var scanningParameters = {
        TableName: 'ArticlesTable',
        Limit: 1,
        Key: {
            id: parseInt(events),
        }

    };

    docClient.get(scanningParameters, (err, data) => {

        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
};
exports.addArticles = (events, ctx, callback) => {
    var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
    var params = {
        TableName: 'ArticlesTable',
        Item: {
            "id": 1,
            "title": "Everything happens all at once.",
            "description": "The Big New Movie efw nonon",
            "thumbnail": "link thumbnail 23232",
            "status": "active",
            "created_date": day,
            "updated_date": day,
        }
    };

    var documentClient = new AWS.DynamoDB.DocumentClient();

    documentClient.put(params, function(err, data) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}
exports.deleteArticles = (events, ctx, callback) => {
    var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
    var params = {
        TableName: 'ArticlesTable',
        Key: {
            "id": events
        },
    };

    var documentClient = new AWS.DynamoDB.DocumentClient();

    documentClient.delete(params, function(err, data) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}
exports.updateArticles = (events, ctx, callback) => {
    var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
    var params = {
        TableName: 'ArticlesTable',
        Key: {
            "id": parseInt(ctx.id)
        },
        UpdateExpression: "set title = :t,description = :d, thumbnail = :th",
        ExpressionAttributeValues: {
            // ":n": events.name,
            ":t": events.title,
            ":d": events.description,
            ":th": ctx.thumbnail,

        },
        ReturnValues: "UPDATED_OLD"
    };

    var documentClient = new AWS.DynamoDB.DocumentClient();

    documentClient.update(params, function(err, data) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}
exports.uploadFileS3 = (events, ctx, callback) => {
    var params = {
        Bucket: 'meditationnodejs/upload',
        Key: events.name,
        Body: events.data,
        ACL: 'public-read-write',
        ContentType: events.mimetype,
    };
    s3.upload(params, function(err, data) {
        if (err) {
            console.log('error in callback');
            console.log(err);
        }
        callback(data);
    });
}
exports.getFileFromS3 = () => {
    var params = {
        Bucket: "meditationnodejs",

    };
    s3.listObjects(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response

    });
}

exports.maxId = (database, callback) => {
    var scanningParameters = {
        TableName: database,
        Select: 'COUNT'
    };

    docClient.scan(scanningParameters, (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data.Count);
        }
    });
}
