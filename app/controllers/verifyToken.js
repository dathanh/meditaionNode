var https = require('https');
var jose = require('node-jose');
const constants = require('../../config/constants');

var keys_url = 'https://cognito-idp.' + constants.region + '.amazonaws.com/' + constants.userpool_id + '/.well-known/jwks.json';

exports.handler = (accessToken, context, callback) => {
    var token = accessToken;
    var sections = token.split('.');
    // get the kid from the headers prior to verification
    var header = jose.util.base64url.decode(sections[0]);
    header = JSON.parse(header);
    var kid = header.kid;
    // download the public keys
    https.get(keys_url, function(response) {
        if (response.statusCode == 200) {
            response.on('data', function(body) {
                var keys = JSON.parse(body)['keys'];
                // search for the kid in the downloaded public keys
                var key_index = -1;
                for (var i = 0; i < keys.length; i++) {
                    if (kid == keys[i].kid) {
                        key_index = i;
                        break;
                    }
                }
                if (key_index == -1) {
                    console.log('Public key not found in jwks.json');
                    callback('Public key not found in jwks.json');
                }
                // construct the public key
                jose.JWK.asKey(keys[key_index]).
                then(function(result) {
                    // verify the signature
                    jose.JWS.createVerify(result).
                    verify(token).
                    then(function(result) {
                        // now we can use the claims
                        var claims = JSON.parse(result.payload);
                        // additionally we can verify the token expiration
                        current_ts = Math.floor(new Date() / 1000);
                        if (current_ts > claims.exp) {
                            callback('Token is expired');
                        }
                        // and the Audience (use claims.client_id if verifying an access token)
                        if (claims.aud != constants.app_client_id) {
                            callback('Token was not issued for this audience');
                        }
                        callback(null, claims);
                    }).
                    catch(function() {
                        callback('Signature verification failed');
                    });
                });
            });
        }
    });
}
