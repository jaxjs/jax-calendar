/**
 * jax calendar plugin
 *
 * Calendar plugin that extends the Jax HTTP Library (requires JQuery.)
 *
 * @link       https://github.com/jaxjs/jax-calendar
 * @category   jax-calendar
 * @author     Nick Sagona, III <dev@nolainteractive.com>
 * @copyright  Copyright (c) 2009-2018 NOLA Interactive, LLC. (http://www.nolainteractive.com)
 * @license    http://www.jaxjs.org/license     New BSD License
 * @version    3.0
 *
 *     Example: jax.calendar('#calendar_icon', '#date_field', {"fade" : 250});
 *
 */

if (window.jax == undefined) {
    window.jax = {};
}

jax.dateFormat     = 'mm/dd/yyyy';
jax.otherMonths    = true;
jax.calendarMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
jax.calendarDays   = [
    'S', 'M', 'T', 'W', 'T', 'F', 'S'
];
jax.calendarFade = 0;

// Function to initialize the calendar
jax.calendar = function(clickObject, dateField, options) {
    //dateFormat, months, days , fade
    var field  = dateField;
    var format = ((options != undefined) && (options.dateFormat != undefined)) ? options.dateFormat : jax.dateFormat;

    jax.dateFormat = format;

    if ((options != undefined) && (options.otherMonths != undefined)) {
        jax.otherMonths = options.otherMonths;
    }
    if ((options != undefined) && (options.months != undefined) && (options.months.constructor == Array)) {
        jax.calendarMonths = options.months;
    }
    if ((options != undefined) && (options.days != undefined) && (options.days.constructor == Array)) {
        jax.calendarDays = options.days;
    }
    if ((options != undefined) && (options.fade != undefined)) {
        jax.calendarFade = options.fade;
    }
    if (clickObject.constructor != Array) {
        clickObject = [clickObject];
    }

    for (var i = 0; i < clickObject.length; i++) {
        var curClickObject = clickObject[i];
        window.jQuery(curClickObject).click(function () {
            if (window.jQuery('#calendar')[0] != undefined) {
                if (jax.calendarFade > 0) {
                    window.jQuery('#calendar').fadeOut(jax.calendarFade, function() {
                        window.jQuery('#calendar').remove();
                    });
                } else {
                    window.jQuery('#calendar').hide();
                    window.jQuery('#calendar').remove();
                }
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
    window.jQuery(parent).append('<div id="calendar"></div>');
    window.jQuery('#calendar').append('<a id="calendar-close" href="#" class="calendar-close-link"><span>x</span></a>');
    window.jQuery('#calendar').append('<h5 id="calendar-header" data-field="' + field + '" data-format="' + format +
        '" data-date="' + d.getMonth() + '-' + d.getFullYear() + '"><a href="#" id="prev-month" class="calendar-nav-link" onclick="jax.prevMonth(); return false;"><span>&lt;</span></a><span id="calendar-header-span">' + window.jax.calendarMonths[d.getMonth()] + ' ' + d.getFullYear() + '</span><a id="next-month" href="#" class="calendar-nav-link" onclick="jax.nextMonth(); return false;"><span>&gt;</span></a></h5>');
    window.jQuery('#calendar-close').click(function() {
        if (jax.calendarFade > 0) {
            window.jQuery('#calendar').fadeOut(jax.calendarFade, function() {
                window.jQuery('#calendar').remove();
            });
        } else {
            window.jQuery('#calendar').hide();
            window.jQuery('#calendar').remove();
        }
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
    var prevDate    = new Date(y, m, 1, 0, 0, 0);
    var nextDate    = new Date(y, m, numOfDays + 1);

    prevDate.setHours(-1);

    var prevMonth   = prevDate.getMonth() + 1;
    var prevDay     = prevDate.getDate() - firstDay.getDay() + 1;
    var prevYear    = prevDate.getFullYear();
    var nextMonth   = nextDate.getMonth() + 1;
    var nextDay     = nextDate.getDate();
    var nextYear    = nextDate.getFullYear();

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
                    curClass = ' class="day-outside"';
                    if (window.jax.otherMonths) {
                        curDateValue = prevMonth + '/' + prevDay + '/' + prevYear;
                        window.jQuery('#calendar-table-row-' + (i + 1)).append('<td><a href="" onclick="window.jax.setDateValue(\'' + curDateValue + '\'); return false;"' + curClass + '>' + prevDay + '</a></td>');
                        prevDay++;
                    } else {
                        window.jQuery('#calendar-table-row-' + (i + 1)).append('<td' + curClass + '>&nbsp;</td>');
                    }
                }
            } else {
                if (d <= numOfDays) {
                    curDateValue = (m + 1) + '/' + d + '/' + y;
                    curClass     = ((curDay != null) && (curDay == d)) ? ' class="day-on"' : '';
                    window.jQuery('#calendar-table-row-' + (i + 1)).append('<td><a href="" onclick="window.jax.setDateValue(\'' + curDateValue + '\'); return false;"' + curClass + '>' + d + '</a></td>');
                    d++;
                } else {
                    curClass = ' class="day-outside"';
                    if (window.jax.otherMonths) {
                        curDateValue = nextMonth + '/' + nextDay + '/' + nextYear;
                        window.jQuery('#calendar-table-row-' + (i + 1)).append('<td><a href="" onclick="window.jax.setDateValue(\'' + curDateValue + '\'); return false;"' + curClass + '>' + nextDay + '</a></td>');
                        nextDay++;
                    } else {
                        window.jQuery('#calendar-table-row-' + (i + 1)).append('<td' + curClass + '>&nbsp;</td>');
                    }
                }
            }
        }
    }
    if (jax.calendarFade > 0) {
        window.jQuery('#calendar').fadeIn(jax.calendarFade);
    } else {
        window.jQuery('#calendar').show();
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
    if (window.jQuery(window.jQuery('#calendar-header').data('field'))[0].onchange != undefined) {
        window.jQuery(window.jQuery('#calendar-header').data('field')).trigger('change');
    }
    if (jax.calendarFade > 0) {
        window.jQuery('#calendar').fadeOut(jax.calendarFade, function() {
            window.jQuery('#calendar').remove();
        });
    } else {
        window.jQuery('#calendar').hide();
        window.jQuery('#calendar').remove();
    }
};
