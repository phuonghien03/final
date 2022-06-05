var optionsPerformance = {
	series: [100],
	chart: {
		id: 'chartPerformance',
		height: 230,
		type: 'radialBar',
		toolbar: {
			show: false
		}
	},
	plotOptions: {
		radialBar: {
			startAngle: 0,
			endAngle: 360,
			hollow: {
				margin: 0,
				size: '70%',
				background: '#fff',
				image: undefined,
				imageOffsetX: 0,
				imageOffsetY: 0,
				position: 'front',
				dropShadow: {
					enabled: true,
					top: 3,
					left: 0,
					blur: 4,
					opacity: 0.24
				}
			},
			track: {
				background: '#fff',
				strokeWidth: '67%',
				margin: 0, // margin is in pixels
				dropShadow: {
					enabled: true,
					top: -3,
					left: 0,
					blur: 4,
					opacity: 0.35
				}
			},

			dataLabels: {
				show: true,
				name: {
					offsetY: -10,
					show: false,
					color: '#888',
					fontSize: '17px'
				},
				value: {
					formatter: function (val) {
						return parseFloat(val).toFixed(2) + '%';
					},
					color: '#111',
					fontSize: '36px',
					show: true,
				}
			}
		}
	},
	fill: {
		type: 'gradient',
		gradient: {
			shade: 'dark',
			type: 'horizontal',
			shadeIntensity: 0.5,
			gradientToColors: ['#ABE5A1'],
			inverseColors: true,
			opacityFrom: 1,
			opacityTo: 1,
			stops: [0, 1500]
		}
	},
	stroke: {
		lineCap: 'round'
	},
	labels: ['Rpm'],
};
socket.on('/resDashboard', function (data, type) {
	switch (type) {
		case 'gaugeSpeed': {
			ApexCharts.exec('chartPerformance', 'updateSeries', [data.Motor_Performance * 100], true);
			break;
		}
	}
});
var chartPerformance = new ApexCharts(document.querySelector("#chartPerformance"), optionsPerformance);
chartPerformance.render();

