var socket = io({ transports: ['websocket'] });

socket.emit('/reqDashboard', true, 'loadPageDashBoard');

socket.on('/resDashboard', function (data, type) {
	switch (type) {
		case 'loadPageDashBoard': {
			let dataStartTime = data.Time_Schedule.Starttime;
			let dataStopTime = data.Time_Schedule.Stoptime;
			var hours = moment.duration(moment(dataStopTime, 'HH:mm').diff(moment(dataStartTime, 'HH:mm'))).asHours();
			var dataweek = [data.Time_Schedule.Sun,
			data.Time_Schedule.Mon,
			data.Time_Schedule.Tue,
			data.Time_Schedule.Wed,
			data.Time_Schedule.Thu,
			data.Time_Schedule.Fri,
			data.Time_Schedule.Sat
			]
			var nextoneDateofWeek = moment(moment().add(1, 'days')).day()
			var nexttwoDateofWeek = moment(moment().add(2, 'days')).day()
			if (dataweek[nextoneDateofWeek])
				chartDataPredict.datasets[0].data[5] = 0.6 * 3000 * hours;
			else
				chartDataPredict.datasets[0].data[5] = 0;
			if (dataweek[nexttwoDateofWeek])
				chartDataPredict.datasets[0].data[6] = 0.6 * 3000 * hours;
			else
				chartDataPredict.datasets[0].data[6] = 0;
			chartDataPredict.datasets[0].borderColor[5] = 'blue';
			financialPredict.update();
			break;
		}
	}
});


//------------------------------- Financial Predict Chart ------------------------------
var chartColors = {
	red: '#ff073a',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: '#DF00FE',
	grey: 'rgb(201, 203, 207)'
};
var chartDataPredict = {
	labels: [moment(moment().subtract(4, 'days')).format('L'),
	moment(moment().subtract(3, 'days')).format('L'),
	moment(moment().subtract(2, 'days')).format('L'),
	moment(moment().subtract(1, 'days')).format('L'),
	moment(moment().subtract(0, 'days')).format('L'),
	moment(moment().add(1, 'days')).format('L'),
	moment(moment().add(2, 'days')).format('L')
	],
	datasets: [{
		type: 'line',
		label: 'Cost',
		borderColor: 'rgb(244,255,0)',
		backgroundColor: 'rgba(244,255,0,0.2)',
		borderWidth: 2,
		fill: true,
		data: [
			12.75 * 3000,
			14.7 * 3000,
			13.8 * 3000,
			15.9 * 3000,
			12.72 * 3000
		]
	}]

};

var configfinancialPredict = {
	type: 'line',
	data: chartDataPredict,
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
					return chartDataPredict.datasets[tooltipItem.datasetIndex].label + ' : ' + Number(tooltipItem.yLabel) + " Vnd";
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
				},
				scaleLabel: {
					display: true,
					labelString: 'Vnd',
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
			display: false,
			labels: {
				fontColor: '#FFFFFF'
			}
		},
		annotation: {
			annotations: [{
				type: 'line',
				mode: 'vertical',
				scaleID: 'x-axis-0',
				value: chartDataPredict.labels[4],
				borderColor: 'rgba(255,36,0,0.75)',
				borderWidth: 2
			}]
		}
	}
};

window.financialPredict = new Chart(document.getElementById('financialPredict').getContext('2d'), configfinancialPredict);

//------------------------------- Variant Chart ------------------------------
$(document).ready(function () {
	$("#selectCurrent").click(function (event) {
		$("#selectVariable").text("Current");
		configTemperatureChart.options.scales.yAxes[0].scaleLabel.labelString = 'Ampe';
		configTemperatureChart.options.tooltips.callbacks.label = function (tooltipItem) {
			return chartData.datasets[tooltipItem.datasetIndex].label + ' : ' + Number(tooltipItem.yLabel) + " A";
		}
		chartData.datasets[0].data = [2.2, 2.5, 2.1, 2.5, 2.9, 2.0, 2.0, 2.2, 2.0, 2.5, 2.2, 2.3]
		chartData.datasets[1].data = [1.3, 1.7, 1.6, 1.5, 1.5, 1.5, 1.8, 1.1, 1.3, 1.5, 1.8, 1.5]
		chartData.datasets[2].data = [1.8, 1.9, 2.0, 2.1, 1.8, 1.7, 2.0, 1.5, 1.8, 1.7, 2.0, 2.2]
		temperatureChart.update();
	});
	$("#selectVibration").click(function (event) {
		$("#selectVariable").text("Vibration");
		configTemperatureChart.options.scales.yAxes[0].scaleLabel.labelString = 'mm/s';
		configTemperatureChart.options.tooltips.callbacks.label = function (tooltipItem) {
			return chartData.datasets[tooltipItem.datasetIndex].label + ' : ' + Number(tooltipItem.yLabel) + " mm/s";
		}
		chartData.datasets[0].data = [0.004, 0.002, 0.001, 0.002, 0.003, 0.004, 0.005, 0.001, 0.006, 0.002, 0.002, 0.002]
		chartData.datasets[1].data = [-0.004, 0.001, -0.001, -0.001, -0.001, 0.002, -0.001, -0.001, -0.006, -0.001, -0.003, -0.004]
		chartData.datasets[2].data = [0.002, 0.0015, 0.000, 0.001, 0.0015, 0.003, 0.002, 0.000, 0.002, 0.0015, 0.001, -0.001]
		temperatureChart.update();
	});
	$("#selectTemperature").click(function (event) {
		$("#selectVariable").text("Temperature");
		configTemperatureChart.options.scales.yAxes[0].scaleLabel.labelString = 'ºC';
		configTemperatureChart.options.tooltips.callbacks.label = function (tooltipItem) {
			return chartData.datasets[tooltipItem.datasetIndex].label + ' : ' + Number(tooltipItem.yLabel) + " ºC";
		}
		chartData.datasets[0].data = [70, 75, 65, 80, 64, 77, 50, 66, 74, 67, 69, 80]
		chartData.datasets[1].data = [44, 52, 45, 50, 46, 42, 44, 51, 53, 59, 55, 52]
		chartData.datasets[2].data = [60, 68, 62, 66, 60, 65, 48, 63, 70, 62, 66, 68]
		temperatureChart.update();
	});
	$("#selectVoltage").click(function (event) {
		$("#selectVariable").text("Voltage");
		configTemperatureChart.options.scales.yAxes[0].scaleLabel.labelString = 'Volt';
		configTemperatureChart.options.tooltips.callbacks.label = function (tooltipItem) {
			return chartData.datasets[tooltipItem.datasetIndex].label + ' : ' + Number(tooltipItem.yLabel) + " V";
		}

		chartData.datasets[0].data = [229.5, 231, 232, 230, 235, 232.5, 235, 231, 233, 233.3, 235, 232]
		chartData.datasets[1].data = [228.5, 229, 229, 226, 229, 228, 229, 229, 227, 227, 229, 229]
		chartData.datasets[2].data = [229, 230, 231, 228, 230, 231, 233, 230, 230, 229, 230, 231]
		temperatureChart.update();
	});
})

var chartColors = {
	red: '#ff073a',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: '#DF00FE',
	grey: 'rgb(201, 203, 207)'
};

var chartData = {
	labels: ['00:00-02:00', '02:00-04:00', '04:00-06:00', '06:00-08:00',
		'08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00',
		'16:00-18:00', '18:00-20:00', '20:00-22:00', '22:00-24:00'
	],
	datasets: [{
		type: 'line',
		label: 'Highest',
		borderColor: window.chartColors.red,
		borderWidth: 2,
		fill: false,
		data: [
			70,
			75,
			65,
			80,
			64,
			77,
			50,
			66,
			74,
			67,
			69,
			80
		]
	}, {
		type: 'line',
		label: 'Lowest',
		borderColor: window.chartColors.blue,
		borderWidth: 2,
		fill: true,
		data: [
			44,
			52,
			45,
			50,
			46,
			42,
			44,
			51,
			53,
			59,
			55,
			52
		]
	}, {
		type: 'bar',
		label: 'Average',
		backgroundColor: 'rgba(0, 255, 0,1)',
		data: [
			60,
			68,
			62,
			66,
			60,
			65,
			48,
			63,
			70,
			62,
			66,
			68
		]
	}]

};
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
					return chartData.datasets[tooltipItem.datasetIndex].label + ' : ' + Number(tooltipItem.yLabel) + " ºC";
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
				},
				scaleLabel: {
					display: true,
					labelString: 'ºC',
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
window.temperatureChart = new Chart(document.getElementById('temperatureChart').getContext('2d'), configTemperatureChart);

//------------------------------- Data Power Chart ------------------------------

var chartColorsPower = {
	red: '#ff073a',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: '#DF00FE',
	grey: 'rgb(201, 203, 207)'
};
var colorPower = Chart.helpers.color;
var configPowerChart = {
	type: 'radar',
	data: {
		labels: [
			'00:00-04:00', '04:00-08:00', '08:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-24:00'
		],
		datasets: [{
			label: '',
			backgroundColor: colorPower(window.chartColorsPower.red).alpha(0.2).rgbString(),
			borderColor: window.chartColorsPower.red,
			pointBackgroundColor: window.chartColorsPower.red,
			data: [
				2.6,
				2.5,
				2.7,
				2.9,
				2.7,
				2.6
			]
		}]
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		legend: {
			display: false
		},
		title: {
			display: false
		},
		scale: {
			ticks: {
				beginAtZero: true
			},
			gridLines: {
				color: "white"
			},
			pointLabels: {
				fontColor: "white",
				fontSize: 14
			},
		},
		tooltips: {
			callbacks: {
				label: function (tooltipItem) {
					return Number(tooltipItem.yLabel) + " kWh : " + Number(parseFloat(tooltipItem.yLabel * 3000).toFixed(2)) + " vnd";
				}
			}
		}
	}
};

window.powerChart = new Chart(document.getElementById('powerChart').getContext('2d'), configPowerChart);



