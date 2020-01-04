var request = require('request');
var config = require('../helpers/config');

function Common() { }

Common.prototype.getDistanceFromGoogleMapApi = function (origin, destination) {
    return new Promise(async (resolve, reject) => {
        var endPoint = config.googlemap.routeapiEndPoint + '?origins=' + origin + '&destinations=' + destination + '&key=' + config.googlemap.key;
        var req = {
            url: endPoint,
            method: 'GET',
        };
        request(req, function (error, response, body) {
            try {
                if (error) throw error;
                if (!error && response.statusCode == 200) {
                    var result = JSON.parse(body);
                    if (result.status == "OK") {
                        var theWholeRouteDistanceArray = [];
                        result.rows.map(function (num) {
                            num.elements.map(function (value) {
                                theWholeRouteDistanceArray.push(value.distance.value);
                            })
                        })
                        var smallestDistance = theWholeRouteDistanceArray.reduce(function (p, v) {
                            return (p < v ? p : v);
                        })
                        resolve(smallestDistance);
                    } else {
                        reject("Invalid request to google map api, Status: " + result.status);
                    }
                }
            } catch (e) {
                reject(e);
            }
        });
    });
};

module.exports = new Common();