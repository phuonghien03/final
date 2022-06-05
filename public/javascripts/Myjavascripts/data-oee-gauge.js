var socket = io({ transports: ['websocket'] });
var options = {
	series: [100],
	chart: {
		id: 'chartOee',
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

// setInterval(function(){
// 	let data=Math.random()*100
// 	ApexCharts.exec('chartOee', 'updateSeries', [data], true);
// },1000)
socket.on('/resDashboard', function (data, type) {
	switch (type) {
		case 'gaugeSpeed': {
			ApexCharts.exec('chartOee', 'updateSeries', [data.Motor_OEE*100], true);
			break;
		}
	}
});
var chart = new ApexCharts(document.querySelector("#chartOee"), options);
chart.render();



