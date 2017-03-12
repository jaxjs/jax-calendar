/**
 * jax calendar plugin
 *
 * Calendar plugin that extends the Jax HTTP Library (requires JQuery.)
 *
 * @link       https://github.com/jaxjs/jax-calendar
 * @category   jax-calendar
 * @author     Nick Sagona, III <dev@nolainteractive.com>
 * @copyright  Copyright (c) 2009-2017 NOLA Interactive, LLC. (http://www.nolainteractive.com)
 * @license    http://www.jaxjs.org/license     New BSD License
 * @version    3.0
 *
 *     Example: jax.calendar('#calendar_icon', '#date_field');
 *
 */

if (window.jax == undefined) {
    window.jax = {};
}

jax.dateFormat     = 'mm/dd/yyyy';
jax.calendarMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
jax.calendarDays   = [
    'S', 'M', 'T', 'W', 'T', 'F', 'S'
];
// Function to initialize the calendar
jax.calendar = function(clickObject, dateField, dateFormat, months, days) {
    var field  = dateField;
    var format = (dateFormat != undefined) ? dateFormat : jax.dateFormat;

    jax.dateFormat = format;

    if ((months != undefined) && (months.constructor == Array)) {
        jax.calendarMonths = months;
    }
    if ((days != undefined) && (days.constructor == Array)) {
        jax.calendarDays = days;
    }
    if (clickObject.constructor != Array) {
        clickObject = [clickObject];
    }

    for (var i = 0; i < clickObject.length; i++) {
        var curClickObject = clickObject[i];
        window.jQuery(curClickObject).click(function () {
            if (window.jQuery('#calendar')[0] != undefined) {
                window.jQuery('#calendar').remove();
            } else {
                window.jax.buildCalendar(window.jQuery(curClickObject).parent(), field, format);
            }
            return false;
        });
    }
};

jax.buildCalendar = function(parent, field, format) {
    if (window.jQuery(field).val() != '') {
        var d      = new Date(window.jQuery(field).val());
        var curDay = d.getUTCDate();
    } else {
        var d      = new Date();
        var curDay = null;
    }
    console.log(format);
    window.jQuery(parent).append('<div id="calendar"></div>');
    window.jQuery('#calendar').append('<a id="calendar-close" href="#" class="calendar-close-link">x</a>');
    window.jQuery('#calendar').append('<h5 id="calendar-header" data-field="' + field + '" data-format="' + format +
        '" data-date="' + d.getMonth() + '-' + d.getFullYear() + '"><a href="#" id="prev-month" class="calendar-nav-link" onclick="jax.prevMonth(); return false;">&lt;</a><span id="calendar-header-span">' + window.jax.calendarMonths[d.getMonth()] + ' ' + d.getFullYear() + '</span><a id="next-month" href="#" class="calendar-nav-link" onclick="jax.nextMonth(); return false;">&gt;</a></h5>');
    window.jQuery('#calendar-close').click(function() {
        window.jQuery('#calendar').remove();
        return false;
    });
    window.jax.buildMonth(d.getMonth() + '-' + d.getFullYear(), curDay);
    return false;
};

jax.nextMonth = function() {
    var d    = window.jQuery('#calendar-header').data('date');
    var dAry = d.split('-');
    if (dAry[0] == 11) {
        var m = 0;
        var y = parseInt(dAry[1]) + 1;
    } else {
        var m = parseInt(dAry[0]) + 1;
        var y = dAry[1];
    }
    window.jQuery('#calendar-header').data('date', m + '-' + y);
    window.jQuery('#calendar-header-span')[0].innerHTML = window.jax.calendarMonths[m] + ' ' + y;
    window.jax.buildMonth(m + '-' + y);
};

jax.prevMonth = function() {
    var d = window.jQuery('#calendar-header').data('date');
    var dAry = d.split('-');
    if (dAry[0] == 0) {
        var m = 11;
        var y = parseInt(dAry[1]) - 1;
    } else {
        var m = parseInt(dAry[0]) - 1;
        var y = dAry[1];
    }
    window.jQuery('#calendar-header').data('date', m + '-' + y);
    window.jQuery('#calendar-header-span')[0].innerHTML = window.jax.calendarMonths[m] + ' ' + y;
    window.jax.buildMonth(m + '-' + y);
};

jax.buildMonth= function(date, curDay) {
    var dAry = date.split('-');
    var m = parseInt(dAry[0]);
    var y = parseInt(dAry[1]);

    if (window.jQuery('#calendar-table')[0] != undefined) {
        window.jQuery('#calendar-table').remove();
    }

    window.jQuery('#calendar').append('<table id="calendar-table" cellpadding="0" cellspacing="0"></table>');
    window.jQuery('#calendar-table').append('<tr id="calendar-table-header"></tr>');
    for (var i = 0; i < window.jax.calendarDays.length; i++) {
        window.jQuery('#calendar-table-header').append('<th>' + window.jax.calendarDays[i] + '</th>');
    }

    var numOfDays   = new Date(y, m + 1, 0).getDate();
    var firstDay    = new Date(y, m, 1);
    var numOfWeeks  = Math.ceil((firstDay.getDay() + numOfDays) / 7);

    var d = 1;
    for (var i = 0; i < numOfWeeks; i++) {
        window.jQuery('#calendar-table').append('<tr id="calendar-table-row-' + (i + 1) + '"></tr>');
        for (var j = 0; j < 7; j++) {
            if (i == 0) {
                if (j >= firstDay.getDay()) {
                    curDateValue = (m + 1) + '/' + d + '/' + y;
                    curClass     = ((curDay != null) && (curDay == d)) ? ' class="day-on"' : '';
                    window.jQuery('#calendar-table-row-' + (i + 1)).append('<td><a href="" onclick="window.jax.setDateValue(\'' + curDateValue + '\'); return false;"' + curClass + '>' + d + '</a></td>');
                    d++;
                } else {
                    window.jQuery('#calendar-table-row-' + (i + 1)).append('<td>&nbsp;</td>');
                }
            } else {
                if (d <= numOfDays) {
                    curDateValue = (m + 1) + '/' + d + '/' + y;
                    curClass     = ((curDay != null) && (curDay == d)) ? ' class="day-on"' : '';
                    window.jQuery('#calendar-table-row-' + (i + 1)).append('<td><a href="" onclick="window.jax.setDateValue(\'' + curDateValue + '\'); return false;"' + curClass + '>' + d + '</a></td>');
                    d++;
                } else {
                    window.jQuery('#calendar-table-row-' + (i + 1)).append('<td>&nbsp;</td>');
                }
            }
        }
    }
};

jax.setDateValue = function(date) {
    var format = window.jQuery('#calendar-header').data('format').toLowerCase();

    if (format.indexOf(' ') != -1) {
        var sep = ' ';
    } else if (format.indexOf('-') != -1) {
        var sep = '-';
    } else if (format.indexOf('.') != -1) {
        var sep = '.';
    } else {
        var sep = '/';
    }

    var dAry = date.split('/');
    var m = parseInt(dAry[0]);
    var d = parseInt(dAry[1]);
    var y = parseInt(dAry[2]);
    if (m < 10) {
        m = '0' + m.toString();
    } else {
        m = m.toString();
    }
    if (d < 10) {
        d = '0' + d.toString();
    } else {
        d = d.toString();
    }
    y = y.toString();
    if ((y.length == 4) && (format.indexOf('yyyy') == -1) && (format.indexOf('yy') != -1)) {
        y = y.substring(2);
    }

    switch (format) {
        case 'mm/dd/yyyy':
        case 'mm/dd/yy':
        case 'm/d/yyyy':
        case 'm/d/yy':
        case 'mm-dd-yyyy':
        case 'mm-dd-yy':
        case 'm-d-yyyy':
        case 'm-d-yy':
        case 'mm.dd.yyyy':
        case 'mm.dd.yy':
        case 'm.d.yyyy':
        case 'm.d.yy':
        case 'mm dd yyyy':
        case 'mm dd yy':
        case 'm d yyyy':
        case 'm d yy':
            date = m + sep + d + sep + y;
            break;
        case 'yyyy/mm/dd':
        case 'yy/mm/dd':
        case 'yyyy/m/d':
        case 'yy/m/d':
        case 'yyyy-mm-dd':
        case 'yy-mm-dd':
        case 'yyyy-m-d':
        case 'yy-m-d':
        case 'yyyy.mm.dd':
        case 'yy.mm.dd':
        case 'yyyy.m.d':
        case 'yy.m.d':
        case 'yyyy mm dd':
        case 'yy mm dd':
        case 'yyyy m d':
        case 'yy m d':
            date = y + sep + m + sep + d;
            break;
        case 'dd/mm/yyyy':
        case 'dd/mm/yy':
        case 'd/m/yyyy':
        case 'd/m/yy':
        case 'dd-mm-yyyy':
        case 'dd-mm-yy':
        case 'd-m-yyyy':
        case 'd-m-yy':
        case 'dd.mm.yyyy':
        case 'dd.mm.yy':
        case 'd.m.yyyy':
        case 'd.m.yy':
        case 'dd mm yyyy':
        case 'dd mm yy':
        case 'd m yyyy':
        case 'd m yy':
            date = d + sep + m + sep + y;
            break;
    }
    window.jQuery(window.jQuery('#calendar-header').data('field')).val(date);
    window.jQuery('#calendar').remove();
};