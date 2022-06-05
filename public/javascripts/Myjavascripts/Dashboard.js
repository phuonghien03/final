var socket = io({ transports: ["websocket"] });

//------------------------------- Motor Speed Control -------------------------------


$(document).ready(function () {
    socket.emit('/reqDashboard', true, 'loadPageDashBoard');
    // Update Speed gauge
    socket.on('/resDashboard', function (data, type) {
        switch (type) {
            case 'loadPageDashBoard': {
                let dataEnable = data.Speed.Enable;
                let dataInputSetpoint = data.Speed.Setpoint;
                console.log(data)
                $('#enableSpeed').prop('checked', dataEnable).change()
                $('#motorSetpointbox').val(dataInputSetpoint)
                if (dataEnable == true) {
                    $("#motorStart").attr("disabled", false);
                    $("#motorStop").attr("disabled", false);
                    $("#motorSetpoint").attr("disabled", false);
                    $("#motorSetpointbox").attr("disabled", false);
                }
                else {
                    $("#motorStart").attr("disabled", true);
                    $("#motorStop").attr("disabled", true);
                    $("#motorSetpoint").attr("disabled", true);
                    $("#motorSetpointbox").attr("disabled", true);
                }
                break;
            };
            case 'gaugeSpeed': {
                console.log(data)
                let speed = data.Motor_Speed;
                speed = Math.ceil(speed);
                $("#GaugeMeter_1").gaugeMeter({ used: parseInt(speed), percent: parseInt(speed) });
                break;
            }
            // Update led staus signal
            case 'statusMotor': {
                let statusSignal = data;
                if (statusSignal == true) {
                    document.getElementById("textStatus").innerHTML = "Running";
                    document.getElementById("textStatus").style.color = '#80FF00';
                    document.getElementById("ledStatus").className = "led led-green";
                }
                else if (statusSignal == false) {
                    document.getElementById("textStatus").innerHTML = "Stopped";
                    document.getElementById("textStatus").style.color = '#F00';
                    document.getElementById("ledStatus").className = "led led-red";
                }
                break;
            }
        }
    });


    $("#GaugeMeter_1").gaugeMeter({ used: 0, percent: 0 });
    // Start motor
    $("#motorStart").click(function (event) {
        socket.emit('/reqDashboard', { value: 'true', lop : "1" }, 'motorStart');
        // window.alert("Start Successful!");
    });
    // Stop motor
    $("#motorStop").click(function (event) {
        socket.emit('/reqDashboard', { value: 'false' }, 'motorStop');
        // window.alert("Stop Successful!");
    });
    // Set Value 
    $("#motorSetpoint").click(function (event) {
        let data = document.getElementById("motorSetpointbox").value;
        if (data <= 1500 && data >= 0 && data != '') {
            socket.emit('/reqDashboard', { value: data }, 'motorSetpoint');
            // window.alert("Successful!");
        }
        else if (data > 1500) {
            $('#motorSetpointbox').val(1500)
            // window.alert("Input not valid");
        }
        else if (data < 0) {
            $('#motorSetpointbox').val(0)
            window.alert("Input not valid");
        }
    });

    // Enable button
    $(function () {
        $('#enableSpeed').change(function () {
            if ($(this).prop('checked')) {
                $("#motorStart").attr("disabled", false);
                $("#motorStop").attr("disabled", false);
                $("#motorSetpoint").attr("disabled", false);
                $("#motorSetpointbox").attr("disabled", false);
                socket.emit('/reqDashboard', { value: true }, 'motorEnableControl');
            }
            else {
                $("#motorStart").attr("disabled", true);
                $("#motorStop").attr("disabled", true);
                $("#motorSetpoint").attr("disabled", true);
                $("#motorSetpointbox").attr("disabled", true);
                socket.emit('/reqDashboard', { value: false }, 'motorEnableControl');
            }
        })

    })


})

//------------------------------- Voltage -------------------------------

let dateTime_volt;
let volt;
socket.on('/resDashboard', function (data, type) {
    switch (type) {
        case 'loadPageDashBoard': {
            let dataAlarm = data.Voltage.Alarm;
            let dataInputSetpoint = data.Voltage.Setpoint;
            $('#enableVoltage').prop('checked', dataAlarm).change()
            $('#voltageSetpointbox').val(dataInputSetpoint)
            voltChart.options.annotation.annotations[0].value = dataInputSetpoint;
            voltChart.update();
            break;
        };
        case 'gaugeSpeed': {
            dateTime_volt = Date.now();
            volt = parseFloat(data.Motor_Voltage).toFixed(2);
            break;
        }
    }
});

$(document).ready(function () {
    // Set alarm range
    $("#voltageSetpoint").click(function (event) {
        let data = document.getElementById("voltageSetpointbox").value;
        if (data != '') {
            voltChart.options.annotation.annotations[0].value = data;
            voltChart.update();
            socket.emit('/reqDashboard', { value: data }, 'voltageSetpointAlarm');
        }
    });
    $(function () {
        $('#enableVoltage').change(function () {
            if ($(this).prop('checked')) {
                socket.emit('/reqDashboard', { value: true }, 'voltageEnableAlarm');
            }
            else
                socket.emit('/reqDashboard', { value: false }, 'voltageEnableAlarm');
        })
    })
})

let chartColorsvolt = {
    green: '#39ff14'
};

function randomScalingFactorvolt() {
    return (Math.random() > 0.5 ? 1.0 : 0.8) * Math.round(Math.random() * 10) + 220;
}

function onRefreshvolt(chart) {
    chart.config.data.datasets.forEach(function (dataset) {
        dataset.data.push({
            x: dateTime_volt,
            y: volt
        });
    });
}
var voltColor = Chart.helpers.color;
let configVoltChart = {
    type: 'line',
    data: {
        datasets: [{
            label: '',
            backgroundColor: voltColor(chartColorsvolt.green).alpha(0.5).rgbString(),
            borderColor: chartColorsvolt.green,
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: []
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: false
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                display: false,
                type: 'time',
                time: {
                    displayFormats: {
                        second: 'HH:MM:ss'
                    }
                },
                ticks: {
                    fontColor: "#ffffff",
                },
                realtime: {
                    duration: 25000,
                    refresh: 1000,
                    delay: 0000,
                    onRefresh: onRefreshvolt
                }
            }],
            yAxes: [{
                ticks: {
                    fontColor: "#ffffff",
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Volt',
                    fontColor: "#ffffff",
                    fontSize: '16'
                },
                gridLines: {
                    display: true,
                    color: "#5a8d03"
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem) {
                    return Number(tooltipItem.yLabel) + " V";
                }
            }
        },
        annotation: {
            annotations: [{
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: '226',
                borderColor: '#ff0000',
                borderWidth: 2
            }]
        }
    }
};

window.voltChart = new Chart(document.getElementById('voltChart').getContext('2d'), configVoltChart);


//------------------------------- Vibration -------------------------------


var dateTime_vibration;
var vibration;
socket.on('/resDashboard', function (data, type) {
    switch (type) {
        case 'loadPageDashBoard': {
            let dataAlarm = data.Vibration.Alarm;
            let dataInputSetpoint = data.Vibration.Setpoint;
            $('#enableVibration').prop('checked', dataAlarm).change()
            $('#vibrationSetpointbox').val(dataInputSetpoint)
            vibrationChart.options.annotation.annotations[0].value = dataInputSetpoint;
            vibrationChart.options.annotation.annotations[1].value = -dataInputSetpoint;
            vibrationChart.update();
            break;
        };
        case 'gaugeSpeed': {
            dateTime_vibration = Date.now();
            vibration = parseFloat(data.Motor_Vibration).toFixed(6);
            break;
        }
    }
});
$(document).ready(function () {
    // Set alarm range
    $("#vibrationSetpoint").click(function (event) {
        let data = document.getElementById("vibrationSetpointbox").value;
        if (data != '') {
            vibrationChart.options.annotation.annotations[0].value = data;
            vibrationChart.options.annotation.annotations[1].value = -data;
            vibrationChart.update();
            socket.emit('/reqDashboard', { value: data }, 'vibrationSetpointAlarm');
        }
    });
    $(function () {
        $('#enableVibration').change(function () {
            if ($(this).prop('checked')) {
                socket.emit('/reqDashboard', { value: true }, 'vibrationEnableAlarm');
            }
            else
                socket.emit('/reqDashboard', { value: false }, 'vibrationEnableAlarm');
        })
    })
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

function randomScalingFactor() {
    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 1);
}

function onRefresh(chart) {
    chart.config.data.datasets.forEach(function (dataset) {
        dataset.data.push({
            x: dateTime_vibration,
            y: vibration
        });
    });
}

var color = Chart.helpers.color;
var configVibrationChart = {
    type: 'line',
    data: {
        datasets: [{
            label: '',
            backgroundColor: color(chartColors.purple).alpha(0.5).rgbString(),
            borderColor: chartColors.purple,
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: []
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: false
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                display: false,
                type: 'time',
                time: {
                    displayFormats: {
                        second: 'HH:MM:ss'
                    }
                },
                ticks: {
                    fontColor: "#ffffff",
                },
                realtime: {
                    duration: 25000,
                    refresh: 1000,
                    delay: 0000,
                    onRefresh: onRefresh
                }
            }],
            yAxes: [{
                ticks: {
                    fontColor: "#ffffff",
                },
                scaleLabel: {
                    display: true,
                    labelString: 'mm/s',
                    fontColor: "#ffffff",
                    fontSize: '16'
                },
                gridLines: {
                    display: true,
                    color: "rgb(106,53,156)"
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem) {
                    return Number(tooltipItem.yLabel) + " mm/s";
                }
            }
        },
        annotation: {
            annotations: [{
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: '0',
                borderColor: '#ff0000',
                borderWidth: 2
            },
            {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: '0',
                borderColor: '#ff0000',
                borderWidth: 2
            }]
        }
    }
};

window.vibrationChart = new Chart(document.getElementById('vibrationChart').getContext('2d'), configVibrationChart);


//------------------------------- Curent -------------------------------

let dateTime_current;
let current;
socket.on('/resDashboard', function (data, type) {
    switch (type) {
        case 'loadPageDashBoard': {
            let dataAlarm = data.Current.Alarm;
            let dataInputSetpoint = data.Current.Setpoint;
            $('#enableCurrent').prop('checked', dataAlarm).change()
            $('#currentSetpointbox').val(dataInputSetpoint)
            currentChart.options.annotation.annotations[0].value = dataInputSetpoint;
            currentChart.update();
            break;
        };
        case 'gaugeSpeed': {
            dateTime_current = Date.now();
            current = parseFloat(data.Motor_Current).toFixed(2);
            break;
        }
    }
});

$(document).ready(function () {
    // Set alarm range
    $("#currentSetpoint").click(function (event) {
        let data = document.getElementById("currentSetpointbox").value;
        if (data != '') {
            currentChart.options.annotation.annotations[0].value = data;
            currentChart.update();
            socket.emit('/reqDashboard', { value: data }, 'currentSetpointAlarm');
        }
    });
    $(function () {
        $('#enableCurrent').change(function () {
            if ($(this).prop('checked')) {
                socket.emit('/reqDashboard', { value: true }, 'currentEnableAlarm');
            }
            else
                socket.emit('/reqDashboard', { value: false }, 'currentEnableAlarm');
        })
    })
})

var chartColorscurrent = {
    blue: '#15f4ee'
};

function randomScalingFactorcurrent() {
    return (Math.random() > 0.5 ? 1.0 : 0.7) * Math.round(Math.random() * 10 + 10);
}

function onRefreshcurrent(chart) {
    chart.config.data.datasets.forEach(function (dataset) {
        dataset.data.push({
            x: dateTime_current,
            y: current
        });
    });
}
var currentColor = Chart.helpers.color;
let configCurrentChart = {
    type: 'line',
    data: {
        datasets: [{
            label: '',
            backgroundColor: currentColor(chartColorscurrent.blue).alpha(0.5).rgbString(),
            borderColor: chartColorscurrent.blue,
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: []
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: false
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                display: false,
                type: 'time',
                time: {
                    displayFormats: {
                        second: 'HH:MM:ss'
                    }
                },
                ticks: {
                    fontColor: "#ffffff",
                },
                realtime: {
                    duration: 25000,
                    refresh: 1000,
                    delay: 0000,
                    onRefresh: onRefreshcurrent
                }
            }],
            yAxes: [{
                ticks: {
                    fontColor: "#ffffff",
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Ampe',
                    fontColor: "#ffffff",
                    fontSize: '16'
                },
                gridLines: {
                    display: true,
                    color: "#0f66e9"
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem) {
                    return Number(tooltipItem.yLabel) + " A";
                }
            }
        },
        annotation: {
            annotations: [{
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: '226',
                borderColor: '#ff0000',
                borderWidth: 2
            }]
        }
    }
};

window.currentChart = new Chart(document.getElementById('currentChart').getContext('2d'), configCurrentChart);


//------------------------------- Temperature -------------------------------


var dateTime_temperature;
var temperature;
socket.on('/resDashboard', function (data, type) {
    switch (type) {
        case 'loadPageDashBoard': {
            let dataAlarm = data.Temperature.Alarm;
            let dataInputSetpoint = data.Temperature.Setpoint;
            $('#enableTemperature').prop('checked', dataAlarm).change()
            $('#temperatureSetpointbox').val(dataInputSetpoint)
            temperatureChart.options.annotation.annotations[0].value = dataInputSetpoint;
            temperatureChart.update();
            break;
        };
        case 'gaugeSpeed': {
            dateTime_temperature = Date.now();
            temperature = parseFloat(data.Motor_Temperature).toFixed(2);
            break;
        }
    }
});
$(document).ready(function () {
    // Set alarm range
    $("#temperatureSetpoint").click(function (event) {
        let data = document.getElementById("temperatureSetpointbox").value;
        if (data != '') {
            temperatureChart.options.annotation.annotations[0].value = data;
            temperatureChart.update();
            socket.emit('/reqDashboard', { value: data }, 'temperatureSetpointAlarm');
        }
    });
    $(function () {
        $('#enableTemperature').change(function () {
            if ($(this).prop('checked')) {
                socket.emit('/reqDashboard', { value: true }, 'temperatureEnableAlarm');
            }
            else
                socket.emit('/reqDashboard', { value: false }, 'temperatureEnableAlarm');
        })
    })
})

var chartColorstemperature = {
    yellow: '#ffdf01'
};

function randomScalingFactortemperature() {
    return (Math.random() > 0.5 ? 1.0 : 0.5) + 60;
}

function onRefreshtemperature(chart) {
    chart.config.data.datasets.forEach(function (dataset) {
        dataset.data.push({
            x: dateTime_temperature,
            y: temperature
        });
    });
}
var temperatureColor = Chart.helpers.color;
var configTemperatureChart = {
    type: 'line',
    data: {
        datasets: [{
            label: '',
            backgroundColor: temperatureColor(chartColorstemperature.yellow).alpha(0.5).rgbString(),
            borderColor: chartColorstemperature.yellow,
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: []
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: false
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                display: false,
                type: 'time',
                time: {
                    displayFormats: {
                        second: 'HH:MM:ss'
                    }
                },
                ticks: {
                    fontColor: "#ffffff",
                },
                realtime: {
                    duration: 25000,
                    refresh: 1000,
                    delay: 0000,
                    onRefresh: onRefreshtemperature
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
                    color: "#fcc201"
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem) {
                    return Number(tooltipItem.yLabel) + " ºC";
                }
            }
        },
        annotation: {
            annotations: [{
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: '226',
                borderColor: '#ff0000',
                borderWidth: 2
            }]
        }
    }
};

window.temperatureChart = new Chart(document.getElementById('temperatureChart').getContext('2d'), configTemperatureChart);

//------------------------------- Time Schedule -------------------------------
socket.on('/resDashboard', function (data, type) {
    switch (type) {
        case 'loadPageDashBoard': {
            let dataEnable = data.Time_Schedule.Enable;
            let dataStartTime = data.Time_Schedule.Starttime;
            let dataStopTime = data.Time_Schedule.Stoptime;
            $('#enableTimeSchedule').prop('checked', dataEnable).change()
            $('#startTimeBox').val(dataStartTime)
            $('#stopTimeBox').val(dataStopTime)
            $('#weekday-mon').prop('checked', data.Time_Schedule.Mon).change()
            $('#weekday-tue').prop('checked', data.Time_Schedule.Tue).change()
            $('#weekday-wed').prop('checked', data.Time_Schedule.Wed).change()
            $('#weekday-thu').prop('checked', data.Time_Schedule.Thu).change()
            $('#weekday-fri').prop('checked', data.Time_Schedule.Fri).change()
            $('#weekday-sat').prop('checked', data.Time_Schedule.Sat).change()
            $('#weekday-sun').prop('checked', data.Time_Schedule.Sun).change()
            break;
        };
        case 'clock': {
            let RuntimeHours = moment(data).hour();
            let RuntimeMinutes = moment(data).minute();
            $("#clock").text(RuntimeHours + ":" + RuntimeMinutes);
            break;
        }
    }
});

$(document).ready(function () {
    // Get value set Time Schedule
    //console.log(moment("2020-06-09T07:29:00.000Z").hour())
    $('#submitTime').click(function (event) {
        let startTimeBox = document.getElementById('startTimeBox').value;
        let stopTimeBox = document.getElementById('stopTimeBox').value;
        let idCheckDayOfWeek = ['#weekday-mon', '#weekday-tue', '#weekday-wed', '#weekday-thu', '#weekday-fri', '#weekday-sat', '#weekday-sun'];
        let valueCheckDayOfWeek = [];
        for (let i = 0; i < idCheckDayOfWeek.length; i++) {
            if ($(idCheckDayOfWeek[i]).is(":checked")) {
                valueCheckDayOfWeek[i] = true;
            }
            else
                valueCheckDayOfWeek[i] = false;
        }
        let timeSchedule = {
            startTime: startTimeBox,
            stopTime: stopTimeBox,
            mon: valueCheckDayOfWeek[0],
            tue: valueCheckDayOfWeek[1],
            wed: valueCheckDayOfWeek[2],
            thu: valueCheckDayOfWeek[3],
            fri: valueCheckDayOfWeek[4],
            sat: valueCheckDayOfWeek[5],
            sun: valueCheckDayOfWeek[6],
        }
        socket.emit('/reqDashboard', timeSchedule, 'timeSchedule');
        window.alert("Submit Successful!");
    });

    // Enable or Not Time Schedule
    $(function () {
        $('#enableTimeSchedule').change(function () {
            if ($(this).prop('checked')) {
                socket.emit('/reqDashboard', { value: true }, 'timeScheduleEnable');
            }
            else {
                socket.emit('/reqDashboard', { value: false }, 'timeScheduleEnable');
            }
        })
    })
})