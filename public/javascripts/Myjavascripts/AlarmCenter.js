var socket = io({ transports: ['websocket'] });

socket.emit('/reqAlarmCenter', true, 'loadPageAlarmCenter');

socket.on('/resAlarmCenter', function (data, type) {
    switch (type) {
        case 'loadPageAlarmCenter': {
            var transform = {
                tag: 'tr',
                children: [{
                    "tag": "td",
                    "html": "${no}"
                }, {
                    "tag": "td",
                    "html": "${time_series}"
                }, {
                    "tag": "td",
                    "html": "${event}"
                }, {
                    "tag": "td",
                    "html": "${value}"
                },
                {
                    "tag": "td",
                    "html": "${unit}"
                }]
            };
            for (var i = 0; i < data.length; i++) {
                data[i].value = parseFloat(data[i].value).toFixed(4);
                data[i].time_series = moment(moment(data[i].time_series)).format("DD/MM/YYYY hh:mm A");
                data[i].no= i+1;
            }
            console.log(data)
            $('#placar > tbody ').json2html(data, transform);
            break;
        }
        case 'loadPageRecipientEmail': {
            $("#Email1").attr("value", data[0].address)
            $("#Email2").attr("value", data[1].address)
            $("#Email3").attr("value", data[2].address)
            break;
        }
        case 'loadPageRecipientSms': {
            $("#Phone1").attr("value", data[0].address)
            $("#Phone2").attr("value", data[1].address)
            $("#Phone3").attr("value", data[2].address)
            break;
        }
    }
});

$(document).ready(function () {
    $("#submitEmail").click(function (event) {
        let email1 = document.getElementById("Email1").value;
        let email2 = document.getElementById("Email2").value;
        let email3 = document.getElementById("Email3").value;
        let bodyValue = [
            {
                "address": email1,
                "addresstypeid": 1
            },
            {
                "address": email2,
                "addresstypeid": 2
            },
            {
                "address": email3,
                "addresstypeid": 3
            }
        ]
        socket.emit('/reqAlarmCenter', bodyValue, 'updateRecipientEmail');
        window.alert("Update Email Successful!");
    });
    $("#submitSms").click(function (event) {
        let phone1 = document.getElementById("Phone1").value;
        let phone2 = document.getElementById("Phone2").value;
        let phone3 = document.getElementById("Phone3").value;
        let bodyValue = [
            {
                "address": phone1,
                "addresstypeid": 4
            },
            {
                "address": phone2,
                "addresstypeid": 5
            },
            {
                "address": phone3,
                "addresstypeid": 6
            }
        ]
        socket.emit('/reqAlarmCenter', bodyValue, 'updateRecipientSms');
        window.alert("Update Sms Successful!");
    });
    $("#testAlarm").click(function (event) {
        socket.emit('/reqAlarmCenter', { value: true }, 'testAlarm');
        window.alert("Test Alarm Successful!");
    });
    // Stop motor
    $("#motorStop").click(function (event) {
        socket.emit('/reqDashboard', { value: 'false' }, 'motorStop');
        window.alert("Stop Successful!");
    });
    // Set Value 
    $("#motorSetpoint").click(function (event) {
        let data = document.getElementById("motorSetpointbox").value;
        if (data <= 1500 && data >= 0 && data != '') {
            socket.emit('/reqDashboard', { value: data }, 'motorSetpoint');
            window.alert("Successful!");
        }
        else
            window.alert("Input not valid");
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

var timeNow = moment().format("DD/MM/YYYY");
$('input[name="datefilter"]').attr("value", timeNow + '-' + timeNow);
$(function () {

    $('input[name="datefilter"]').daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });

    $('input[name="datefilter"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + '-' + picker.endDate.format('DD/MM/YYYY'));
        $("tbody").empty();
        socket.emit('/reqAlarmCenter', { start: picker.startDate.utcOffset(0).format(), stop: picker.endDate.utcOffset(0).format() }, 'datePicker');
    });

    $('input[name="datefilter"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

});