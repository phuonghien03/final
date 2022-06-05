var express = require('express');
var router = express.Router();

/* GET Dashboard page. */
router.get('/', function(req, res, next) {
  res.render('Dashboard');
});
/* GET OeeSupervisor page. */
router.get('/OeeSupervisor', function(req, res, next) {
  res.render('OeeSupervisor');
});
/* GET DataAnalytics page. */
router.get('/DataAnalytics', function(req, res, next) {
  res.render('DataAnalytics');
});
/* GET AlarmCenter page. */
router.get('/AlarmCenter', function(req, res, next) {
  res.render('AlarmCenter');
});
/* GET Infomation page. */
router.get('/AugmentedReality', function(req, res, next) {
  res.render('AugmentedReality');
});
/* Export Alarm to excel */
router.get('/alarm/report/:mode', function(req, res, next) {
  res.download('./report/excel/reportAlarm.xlsx');
});
/* Export PDF Motor */
router.get('/report/:pdf', function(req, res, next) {
  res.download('./report/pdf/simotics-sd-1le5-d81-1-ao-en-2018.pdf');
});
module.exports = router;
