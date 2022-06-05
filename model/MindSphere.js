var request = require("request");
var moment = require('moment');
var recipientidData;
var recipientnameData;
var messageCategoryId;
function getToken(clientID, clientCredential, bodyObject, callback) {
    var xSpaceAuthKey = 'Basic ' + Buffer.from(clientID + ':' + clientCredential).toString('base64');
    var options = {
        method: 'POST',
        url: 'https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token',
        headers:
        {
            'cache-control': 'no-cache',
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-SPACE-AUTH-KEY': xSpaceAuthKey,
        },
        body: bodyObject,
        json: true
    };

    request(options, function (error, response, body) {
        if (error) console.log(error);
        else callback(body.access_token);
    });
}


function getUsers(token, callback) {
    var options = {
        method: 'GET',
        url: 'https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users',
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else callback(body)
    });
}

function getAssetId(token, assetName, callback) {
    var options = {
        method: 'GET',
        url: 'https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets',
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: 'Bearer ' + token,
            Accept: 'application/hal+json',
            'Content-Type': 'application/hal+json'
        }
    };
    request(options, function (error, response, body) {
        var _id = null;
        if (error) console.log(error);
        if (JSON.parse(body)._embedded) {
            var _arrAssets = JSON.parse(body)._embedded.assets;
            if (_arrAssets) {
                for (var _asset of _arrAssets) {
                    if (_asset.name == assetName) {
                        _id = _asset.assetId
                        //callback(_id);
                        break;
                    }
                }
            }
        }
        callback(_id);
    });
}

function getLatestData_old(token, assetId, aspectName, callback) {
    var options = {
        method: 'GET',
        url: 'https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/' + assetId + '/' + aspectName,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else callback(body[0])
    });
}

function getLatestData(token, assetId, aspectName, callback) {
    var latestTime;
    var returnObject = {};
    getLatestData_old(token, assetId, aspectName, function (data) {
        if (data) {
            latestTime = data._time;
            var preTime = moment(latestTime).subtract(10, 'seconds').toISOString();
            getTimeSeriesDataFromTime(token, assetId, aspectName, preTime, latestTime, function (arrData) {
                if (arrData.length > 0) {
                    //returnObject = arrData[arrData.length - 1];
                    for (var i = arrData.length - 1; i >= 0; i--) {
                        for (var item in arrData[i]) {
                            if (!returnObject.hasOwnProperty(item)) returnObject[item] = arrData[i][item];
                        }
                    }
                    callback(returnObject);
                }
            })
        }

    });
}

function getTimeSeriesDataFromTime(token, assetId, aspectName, startTime, stopTime, callback) {
    var options = {
        method: 'GET',
        url: 'https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/' + assetId + '/' + aspectName + '?from=' + startTime + '&to=' + stopTime + '&limit=10',
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else callback(body)
    });
}

function putData(token, assetId, aspectName, data, callback) {
    var options = {
        method: 'PUT',
        url: 'https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/' + assetId + '/' + aspectName,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error);
            callback(false);
        }
        else callback(true);
    });
}


function getCtrlData(token, assetId, aspectName, callback) {
    var options = {
        method: 'GET',
        url: 'https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/' + assetId + '/' + aspectName,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: {},
        json: true
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        callback(body)
    });
}
//----------------------- NOTIFICATION EMAIL AND SMS ----------------------
function createRecipient(token, bodyObject, callback) {
    var options = {
        method: 'POST',
        url: 'https://gateway.eu1.mindsphere.io/api/notification/v3/recipient/',
        headers:
        {
            Authorization: 'Bearer ' + token,
        },
        body: bodyObject,
        json: true
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else {
            if (body.length == 1) {
                if (body[0].status == 400)
                    searchRecipient(token, bodyObject.recipientname, function (data) {
                        callback(data);
                    })
            }
            else
                callback(body);
        }
    });
}

function searchRecipient(token, bodyObject, callback) {
    var options = {
        method: 'POST',
        url: 'https://gateway.eu1.mindsphere.io/api/notification/v3/recipient/search',
        headers:
        {
            Authorization: 'Bearer ' + token,
        },
        body: { "name": bodyObject },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else {
            callback(body[0].recipientid);
        }
    });
}

function createTemplate(token, bodyObject, htmlEmailTemplate, htmlSmSTemplate, callback) {
    var options = {
        method: 'POST',
        url: 'https://gateway.eu1.mindsphere.io/api/notification/v3/template/',
        headers:
        {
            Authorization: 'Bearer ' + token,
        },
        formData: {
            'templateInfo': JSON.stringify(bodyObject),
            'templateFiles': [htmlEmailTemplate, htmlSmSTemplate],
        },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else {
            if (body.status == 400)
                searchTemplateDetails(token, function (data) {
                   
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].templatesetName == bodyObject.templatesetName) {
                            var datacallback = { templatesetId: data[i].templatesetId, templateIdemail: data[i].templateList[0].templateId, templateIdsms: data[i].templateList[1].templateId };
                            break;
                        }
                    }
                    callback(datacallback);
                })
            else {
                callback({ templatesetId: body.templatesetId, templateIdemail: body.templateList[0].templateId, templateIdsms: body.templateList[1].templateId });
            }
        }
    });
}

function searchTemplateDetails(token, callback) {
    var options = {
        method: 'GET',
        url: 'https://gateway.eu1.mindsphere.io/api/notification/v3/template/templatelistdetails',
        headers:
        {
            Authorization: 'Bearer ' + token,
        },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else {
            callback(body);
        }
    });
}

function createCommunicationCategory(token, recipientdata, templatedata, callback) {
    var options = {
        method: 'POST',
        url: 'https://gateway.eu1.mindsphere.io/api/notification/v3/communicationcategories/',
        headers:
        {
            Authorization: 'Bearer ' + token,
        },
        body: {
            "from": "Siemens",
            "msgCategoryName": "Category for MotorDemo App",
            "priority": 1,
            "recipients": [{
                "position": "TO",
                "recipientId": recipientdata
            }],
            "subject": "MotorDemo",
            "templates": [
                {
                    "templateId": templatedata.templateIdemail,
                    "commChannelName": "Email",
                    "templatesetId": templatedata.templatesetId
                },
                {
                    "templateId": templatedata.templateIdsms,
                    "commChannelName": "SMS",
                    "templatesetId": templatedata.templatesetId
                }]
        },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else {
            if (body.length == 1) {
                if (body[0].status == 400)
                    searchCommunicationCategory(token, function (data) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].msgCategoryName == options.body.msgCategoryName) {
                                callback(data[i].msgCategoryId);
                                break;
                            }
                        }
                    })
            }
            else
                callback(body);
        }
    });
}

function searchCommunicationCategory(token, callback) {
    var options = {
        method: 'GET',
        url: 'https://gateway.eu1.mindsphere.io/api/notification/v3/communicationcategories/',
        headers:
        {
            Authorization: 'Bearer ' + token,
        },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else {
            callback(body);
        }
    });
}

function updateRecipient(token, value, callback) {
    var bodyObject = {
        "recipientid": recipientidData,
        "recipientname": recipientnameData,
        "recipientdetail": value
    }
    var options = {
        method: 'PUT',
        url: 'https://gateway.eu1.mindsphere.io/api/notification/v3/recipient/',
        headers:
        {
            Authorization: 'Bearer ' + token,
        },
        body: bodyObject,
        json: true
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else {
            callback(body);
        }
    });
}

function createNotificationEmailSmS(token, bodyRecipient, bodyTemplate, htmlEmailTemplate, htmlSmSTemplate, callback) {
    createRecipient(token, bodyRecipient, function (data) {
        recipientidData = data;
        console.log("recipientidData:",recipientidData)
        recipientnameData = bodyRecipient.recipientname;
        createTemplate(token, bodyTemplate, htmlEmailTemplate, htmlSmSTemplate, function (data) {
            var templatedata = data;
            console.log("templatedata:",templatedata)
            createCommunicationCategory(token, recipientidData, templatedata, function (data) {
                messageCategoryId = data;
                console.log("messageCategoryId:",messageCategoryId)
                callback(data);
            })
        })
    })
}

function triggerNotification(token, event, value, time, unit ) {
    var options = {
        method: 'POST',
        url: 'https://gateway.eu1.mindsphere.io/api/notification/v3/publisher/messages',
        headers:
        {
            Authorization: 'Bearer ' + token,
        },
        body:
        {
            "body": {
                "mailToUnsubscribe": "tri.tran@biendongco.vn",
                "event": event,
                "value": value,
                "time" : time,
                "unit" : unit
            },
            "messageCategoryId": messageCategoryId
        },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else {
            console.log(body);
        }
    });
}
module.exports.getToken = getToken;
module.exports.getUsers = getUsers;
module.exports.getAssetId = getAssetId;
module.exports.getLatestData = getLatestData;
module.exports.getTimeSeriesDataFromTime = getTimeSeriesDataFromTime;
module.exports.putData = putData;
module.exports.getCtrlData = getCtrlData;

module.exports.createNotificationEmailSmS = createNotificationEmailSmS;
module.exports.updateRecipient = updateRecipient;
module.exports.triggerNotification = triggerNotification;