var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var idDataConfig;
var dashboardDataSchema = mongoose.Schema({
    Speed: {
        Setpoint: Number,
        Enable: Boolean
    }
    ,
    Voltage: {
        Setpoint: Number,
        Alarm: Boolean
    },
    Vibration: {
        Setpoint: Number,
        Alarm: Boolean
    },
    Time_Schedule: {
        Starttime: String,
        Stoptime: String,
        Mon: Boolean,
        Tue: Boolean,
        Wed: Boolean,
        Thu: Boolean,
        Fri: Boolean,
        Sat: Boolean,
        Sun: Boolean,
        Enable: Boolean
    },
    Current: {
        Setpoint: Number,
        Alarm: Boolean
    },
    Temperature: {
        Setpoint: Number,
        Alarm: Boolean
    }
});

var dashboardData = mongoose.model('dashboardData', dashboardDataSchema);

function checkDataBaseDashboard() {
    dashboardData.find({}, function (err, docs) {
        if (!err) {
            if (docs.length == 1) {
                idDataConfig = docs[0]._id;
                console.log('Had database!')
            }
            else {
                let body = {
                    Speed: {
                        Setpoint: 1,
                        Enable: true
                    }
                    ,
                    Voltage: {
                        Setpoint: 1,
                        Alarm: true
                    },
                    Vibration: {
                        Setpoint: 1,
                        Alarm: true
                    },
                    Time_Schedule: {
                        Starttime: 1,
                        Stoptime: 1,
                        Mon: true,
                        Tue: true,
                        Wed: true,
                        Thu: true,
                        Fri: true,
                        Sat: true,
                        Sun: true,
                        Enable: true
                    },
                    Current: {
                        Setpoint: true,
                        Alarm: true
                    },
                    Temperature: {
                        Setpoint: true,
                        Alarm: true
                    }
                }
                var create = new dashboardData(body);
                create.save(function (err, data) {
                    if (err) return handleError(err);
                    idDataConfig = data._id;
                    console.log('Created database!')
                });
            }
        }
        else {
            throw err;
        }
    });
}
function updateValueData(update) {
    dashboardData.findByIdAndUpdate(idDataConfig, update, { new: true }, function (err) {
        if (err) return handleError(err);
    })
}
module.exports.dashboardData = dashboardData;
module.exports.updateValueData = updateValueData;
module.exports.checkDataBaseDashboard = checkDataBaseDashboard;
