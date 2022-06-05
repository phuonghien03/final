var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var alarmCenterDataSchema = mongoose.Schema({
    event: String,
    value: Number,
    time_series: Date,
    unit: String
});

var alarmCenterData = mongoose.model('alarmcenterdatas', alarmCenterDataSchema);

var Excel = require('exceljs');
var workbook = new Excel.Workbook();
var moment = require('moment');
function excelreport(data) {
    workbook.xlsx.readFile('./report/excel/reporttemplate.xlsx')
        .then(function () {
            var worksheet = workbook.getWorksheet(1);
            var time_series;
            var event;
            var value;
            var time_series = [];
            var event = [];
            var value = [];
            var unit = [];
            var start_row = 5;
            for (var i = 0; i < data.length; i++) {
                time_series[i] = data[i].time_series;
                event[i] = data[i].event;
                value[i] = data[i].value;
                unit[i] = data[i].unit;
            }
            worksheet.getRow('3').getCell('D').value = moment().utcOffset(7).format("DD/MM/YYYY HH:mm:ss A");
            for (var i = 0; i < data.length; i++) {
                worksheet.getRow(i + start_row).getCell(1).value = i + 1;
                worksheet.getRow(i + start_row).getCell(2).value = moment(time_series[i]).utcOffset(7).format("DD/MM/YYYY HH:mm:ss A");
                worksheet.getRow(i + start_row).getCell(3).value = event[i];
                worksheet.getRow(i + start_row).getCell(4).value = parseFloat(value[i]).toFixed(4);
                worksheet.getRow(i + start_row).getCell(5).value = unit[i];
                worksheet.getRow(i + start_row).commit();
            }
            return workbook.xlsx.writeFile('./report/excel/reportAlarm.xlsx');
        })
}

function eventValueData(event, value, date, unit) {
    let body = {
        event: event,
        value: value,
        time_series: date,
        unit: unit
    }
    var create = new alarmCenterData(body);
    create.save(function (err, data) {
        if (err) return handleError(err);
    });
}
module.exports.alarmCenterData = alarmCenterData;
module.exports.excelreport = excelreport;
module.exports.eventValueData = eventValueData;
