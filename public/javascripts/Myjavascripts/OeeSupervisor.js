var socket = io({ transports: ['websocket'] });
socket.emit('/reqOeeSupervisor', true, 'loadPageOeeSupervisor');
socket.on('/resOeeSupervisor', function (data, type) {
	switch (type) {
		case 'loadPageOeeSupervisor': {
			ApexCharts.exec('chartQuality', 'updateSeries', [data.Quality * 100], true);
			ApexCharts.exec('chartPerformance', 'updateSeries', [data.Performance * 100], true);
			ApexCharts.exec('chartOee', 'updateSeries', [data.OEE*100], true);
			ApexCharts.exec('chartAvailability', 'updateSeries', [data.Availability*100], true);
			break;
		}
	}
});
$(document).ready(function () {
	$("#7days").click(function (event) {
		chartData.labels = [
			moment(moment().subtract(7, 'days')).format('L'),
			moment(moment().subtract(6, 'days')).format('L'),
			moment(moment().subtract(5, 'days')).format('L'),
			moment(moment().subtract(4, 'days')).format('L'),
			moment(moment().subtract(3, 'days')).format('L'),
			moment(moment().subtract(2, 'days')).format('L'),
			moment(moment().subtract(1, 'days')).format('L')

		]
		let preavailabilityData = [];
		let preperformanceData = [];
		let prequalityData = [];
		let preoeeData = [];
		for (let i = 23; i < 30; i++) {
			preavailabilityData[i - 23] = availabilityData[i];
		}
		chartData.datasets[0].data = preavailabilityData;
		for (let i = 23; i < 30; i++) {
			preperformanceData[i - 23] = performanceData[i];
		}
		chartData.datasets[1].data = preperformanceData;
		for (let i = 23; i < 30; i++) {
			prequalityData[i - 23] = qualityData[i];
		}
		chartData.datasets[2].data = prequalityData
		for (let i = 23; i < 30; i++) {
			preoeeData[i - 23] = oeeData[i];
		}
		chartData.datasets[3].data = preoeeData
		var dataset = chartData.datasets[3];

		for (var i = 0; i < dataset.data.length; i++) {
			if (dataset.data[i] < colorChangeValue) {
				dataset.backgroundColor[i] = 'rgb(255, 99, 132)';
			}
			if (dataset.data[i] > colorChangeValue) {
				dataset.backgroundColor[i] = 'rgb(54, 162, 235)';
			}
		}
		OeeHistory.update();
	});
	$("#15days").click(function (event) {
		chartData.labels = [
			moment(moment().subtract(15, 'days')).format('L'),
			moment(moment().subtract(14, 'days')).format('L'),
			moment(moment().subtract(13, 'days')).format('L'),
			moment(moment().subtract(12, 'days')).format('L'),
			moment(moment().subtract(11, 'days')).format('L'),
			moment(moment().subtract(10, 'days')).format('L'),
			moment(moment().subtract(9, 'days')).format('L'),
			moment(moment().subtract(8, 'days')).format('L'),
			moment(moment().subtract(7, 'days')).format('L'),
			moment(moment().subtract(6, 'days')).format('L'),
			moment(moment().subtract(5, 'days')).format('L'),
			moment(moment().subtract(4, 'days')).format('L'),
			moment(moment().subtract(3, 'days')).format('L'),
			moment(moment().subtract(2, 'days')).format('L'),
			moment(moment().subtract(1, 'days')).format('L'),
		]
		let preavailabilityData = [];
		let preperformanceData = [];
		let prequalityData = [];
		let preoeeData = [];
		for (let i = 15; i < 30; i++) {
			preavailabilityData[i - 15] = availabilityData[i];
		}
		chartData.datasets[0].data = preavailabilityData;
		for (let i = 15; i < 30; i++) {
			preperformanceData[i - 15] = performanceData[i];
		}
		chartData.datasets[1].data = preperformanceData;
		for (let i = 15; i < 30; i++) {
			prequalityData[i - 15] = qualityData[i];
		}
		chartData.datasets[2].data = prequalityData
		for (let i = 15; i < 30; i++) {
			preoeeData[i - 15] = oeeData[i];
		}
		chartData.datasets[3].data = preoeeData

		for (var i = 0; i < dataset.data.length; i++) {
			if (dataset.data[i] < colorChangeValue) {
				dataset.backgroundColor[i] = 'rgb(255, 99, 132)';
			}
			if (dataset.data[i] > colorChangeValue) {
				dataset.backgroundColor[i] = 'rgb(54, 162, 235)';
			}
		}

		OeeHistory.update();
	});
	$("#30days").click(function (event) {
		chartData.labels = [
			moment(moment().subtract(30, 'days')).format('L'),
			moment(moment().subtract(29, 'days')).format('L'),
			moment(moment().subtract(28, 'days')).format('L'),
			moment(moment().subtract(27, 'days')).format('L'),
			moment(moment().subtract(26, 'days')).format('L'),
			moment(moment().subtract(25, 'days')).format('L'),
			moment(moment().subtract(24, 'days')).format('L'),
			moment(moment().subtract(23, 'days')).format('L'),
			moment(moment().subtract(22, 'days')).format('L'),
			moment(moment().subtract(21, 'days')).format('L'),
			moment(moment().subtract(20, 'days')).format('L'),
			moment(moment().subtract(19, 'days')).format('L'),
			moment(moment().subtract(18, 'days')).format('L'),
			moment(moment().subtract(17, 'days')).format('L'),
			moment(moment().subtract(16, 'days')).format('L'),
			moment(moment().subtract(15, 'days')).format('L'),
			moment(moment().subtract(14, 'days')).format('L'),
			moment(moment().subtract(13, 'days')).format('L'),
			moment(moment().subtract(12, 'days')).format('L'),
			moment(moment().subtract(11, 'days')).format('L'),
			moment(moment().subtract(10, 'days')).format('L'),
			moment(moment().subtract(9, 'days')).format('L'),
			moment(moment().subtract(8, 'days')).format('L'),
			moment(moment().subtract(7, 'days')).format('L'),
			moment(moment().subtract(6, 'days')).format('L'),
			moment(moment().subtract(5, 'days')).format('L'),
			moment(moment().subtract(4, 'days')).format('L'),
			moment(moment().subtract(3, 'days')).format('L'),
			moment(moment().subtract(2, 'days')).format('L'),
			moment(moment().subtract(1, 'days')).format('L')
		]
		let preavailabilityData = [];
		let preperformanceData = [];
		let prequalityData = [];
		let preoeeData = [];
		for (let i = 0; i < 30; i++) {
			preavailabilityData[i] = availabilityData[i];
		}
		chartData.datasets[0].data = preavailabilityData;
		for (let i = 0; i < 30; i++) {
			preperformanceData[i] = performanceData[i];
		}
		chartData.datasets[1].data = preperformanceData;
		for (let i = 0; i < 30; i++) {
			prequalityData[i] = qualityData[i];
		}
		chartData.datasets[2].data = prequalityData
		for (let i = 0; i < 30; i++) {
			preoeeData[i] = oeeData[i];
		}
		chartData.datasets[3].data = preoeeData
		for (var i = 0; i < dataset.data.length; i++) {
			if (dataset.data[i] < colorChangeValue) {
				dataset.backgroundColor[i] = 'rgb(255, 99, 132)';
			}
			if (dataset.data[i] > colorChangeValue) {
				dataset.backgroundColor[i] = 'rgb(54, 162, 235)';
			}
		}
		OeeHistory.update();
	});
})
var availabilityData = [80, 90, 70, 96, 88, 87, 96, 99, 74, 78, 77, 76, 92, 99, 98, 76, 80, 85, 89, 95, 94, 96, 98, 100, 78, 81, 89, 83, 96, 99];
var performanceData = [99, 89, 87, 86, 84, 96, 99, 93, 92, 91, 82, 88, 89, 96, 95, 90, 100, 86, 87, 93, 96, 98, 100, 88, 83, 86, 96, 98, 78, 96];
var qualityData = [99, 98, 97, 100, 95, 99, 96, 98, 94, 97, 96, 93, 97, 99, 98, 96, 98, 97, 95, 92, 91, 93, 94, 96, 99, 100, 95, 98, 99, 99];
var oeeData = [];
for (let i = 0; i < 30; i++) {
	oeeData[i] = availabilityData[i] * performanceData[i] * qualityData[i] / 10000;
}
var chartColors = {
	red: '#ff073a',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(50,205,50)',
	blue: 'rgb(54, 162, 235)',
	purple: '#DF00FE',
	grey: 'rgb(201, 203, 207)'
};
var chartData = {
	labels: [
		moment(moment().subtract(7, 'days')).format('L'),
		moment(moment().subtract(6, 'days')).format('L'),
		moment(moment().subtract(5, 'days')).format('L'),
		moment(moment().subtract(4, 'days')).format('L'),
		moment(moment().subtract(3, 'days')).format('L'),
		moment(moment().subtract(2, 'days')).format('L'),
		moment(moment().subtract(1, 'days')).format('L')
	],
	datasets: [{
		type: 'line',
		label: 'Availability',
		borderColor: window.chartColors.yellow,
		borderWidth: 2,
		fill: false,
		data: [
			100, 78, 81, 89, 83, 96, 99
		]
	}, {
		type: 'line',
		label: 'Performance',
		borderColor: window.chartColors.red,
		borderWidth: 2,
		fill: false,
		data: [
			88, 83, 86, 96, 98, 78, 96
		]
	}, {
		type: 'line',
		label: 'Quality',
		borderColor: window.chartColors.green,
		borderWidth: 2,
		fill: true,
		data: [
			96, 99, 100, 95, 98, 99, 99
		]
	}, {
		type: 'bar',
		label: 'OEE',
		backgroundColor: [],
		data: [
			oeeData[23], oeeData[24], oeeData[25], oeeData[26], oeeData[27], oeeData[28], oeeData[29]
		]
	}]
};

var colorChangeValue = 80; //set this to whatever is the deciding color change value
var dataset = chartData.datasets[3];
for (var i = 0; i < dataset.data.length; i++) {
	if (dataset.data[i] < colorChangeValue) {
		dataset.backgroundColor[i] = 'rgb(246,36,71)';
	}
	if (dataset.data[i] > colorChangeValue) {
		dataset.backgroundColor[i] = 'rgb(0,111,230)';
	}
}

// OeeHistory.update();
var configTemperatureChart = {
	type: 'bar',
	data: chartData,
	options: {
		responsive: true,
		maintainAspectRatio: false,
		title: {
			display: false
		},
		tooltips: {
			mode: 'index',
			intersect: true,
			callbacks: {
				label: function (tooltipItem) {
					return chartData.datasets[tooltipItem.datasetIndex].label + ' : ' + Number(tooltipItem.yLabel) + " %";
				}
			}
		},
		scales: {
			xAxes: [{
				ticks: {
					fontColor: "#ffffff",
				}
			}],
			yAxes: [{
				ticks: {
					fontColor: "#ffffff",
					suggestedMin: 0,
					suggestedMax: 100
				},
				scaleLabel: {
					display: true,
					labelString: '%',
					fontColor: "#ffffff",
					fontSize: '16'
				},
				gridLines: {
					display: true,
					color: "rgb(106,53,156)"
				}
			}]
		},
		legend: {
			display: true,
			labels: {
				fontColor: '#FFFFFF'
			}
		}
	}
};
window.OeeHistory = new Chart(document.getElementById('oeeHistoryChart').getContext('2d'), configTemperatureChart);