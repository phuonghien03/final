var socket = io({ transports: ['websocket'] });



// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create("chartdiv", am4charts.PieChart3D);
chart.innerRadius = am4core.percent(40);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

chart.legend = new am4charts.Legend();

chart.legend.labels.template.text = "[bold {color}]{name} :[/]";
chart.legend.valueLabels.template.fill = am4core.color("#FFFFFF");
chart.legend.itemContainers.template.clickable = false;
chart.legend.itemContainers.template.focusable = false;
chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default;
socket.emit('/reqDataAnalytics', true, 'loadPageDataAnalytics');

socket.on('/resDataAnalytics', function (data, type) {
  chart.data = [
    {
      country: "Running",
      litres: 20,
      "color": am4core.color("#39FF14")
    },
    {
      country: "Stop",
      litres: 4,
      "color": am4core.color("red")
    }
  ];
  switch (type) {
    case 'loadPageDataAnalytics': {
      chart.data[0].litres = data.Runtime;
      chart.data[1].litres = data.Faulttime;
      console.log(data)
      break;
    }
    case 'updateTime': {
      chart.data[0].litres = data.Runtime;
      chart.data[1].litres = data.Faulttime;
      break;
    }
  }
});
var series = chart.series.push(new am4charts.PieSeries3D());
series.dataFields.value = "litres";
series.dataFields.category = "country";
series.slices.template.propertyFields.fill = "color";
series.labels.template.disabled = true;


