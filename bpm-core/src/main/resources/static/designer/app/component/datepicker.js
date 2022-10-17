define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var Foundation = require('Foundation');

    Foundation.apply(Date.prototype, {
        //获取月的天数
        getMonthDays: function(a) {
            var b = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                c = this.getFullYear();
            return "undefined" == typeof a && (a = this.getMonth()), 0 !== c % 4 || 0 === c % 100 && 0 !== c % 400 || 1 !== a ? b[a] : 29
        }
    });

    var DatePickerWidget = Class.create({
        statics: {

            WEEKS: {
                Sunday: "星期日",
                Monday: "星期一",
                Tuesday: "星期二",
                Wednesday: "星期三",
                Thursday: "星期四",
                Friday: "星期五",
                Saturday: "星期六"
            },

            SHORT_WEEKS: {
                Sunday: "日",
                Monday: "一",
                Tuesday: "二",
                Wednesday: "三",
                Thursday: "四",
                Friday: "五",
                Saturday: "六"
            },

            MONTHS: {
                January: "一月",
                February: "二月",
                March: "三月",
                April: "四月",
                May: "五月",
                June: "六月",
                July: "七月",
                August: "八月",
                September: "九月",
                October: "十月",
                November: "十一月",
                December: "十二月"
            },

            SHORT_MONTHS: {
                January: "一",
                February: "二",
                March: "三",
                April: "四",
                May: "五",
                June: "六",
                July: "七",
                August: "八",
                September: "九",
                October: "十",
                November: "十一",
                December: "十二"
            },

            getWeekText: function(index) {
                this.weekTexts = this.weekTexts || [
                    this.WEEKS.Sunday,
                    this.WEEKS.Monday,
                    this.WEEKS.Tuesday,
                    this.WEEKS.Wednesday,
                    this.WEEKS.Thursday,
                    this.WEEKS.Friday,
                    this.WEEKS.Saturday
                ];
                return this.weekTexts[index]
            },

            getShortWeekText: function(index) {
                this.shortWeekTexts = this.shortWeekTexts || [
                    this.SHORT_WEEKS.Sunday,
                    this.SHORT_WEEKS.Monday,
                    this.SHORT_WEEKS.Tuesday,
                    this.SHORT_WEEKS.Wednesday,
                    this.SHORT_WEEKS.Thursday,
                    this.SHORT_WEEKS.Friday,
                    this.SHORT_WEEKS.Saturday
                ];
                return this.shortWeekTexts[index]
            },

            getMonthText: function(index) {
                this.monthTexts = this.monthTexts || [
                    this.MONTHS.January,
                    this.MONTHS.February,
                    this.MONTHS.March,
                    this.MONTHS.April,
                    this.MONTHS.May,
                    this.MONTHS.June,
                    this.MONTHS.July,
                    this.MONTHS.August,
                    this.MONTHS.September,
                    this.MONTHS.October,
                    this.MONTHS.November,
                    this.MONTHS.December
                ];
                return this.monthTexts[index]
            },

            getShortMonthText: function(index) {
                this.shortMonthTexts = this.shortMonthTexts || [
                    this.SHORT_MONTHS.January,
                    this.SHORT_MONTHS.February,
                    this.SHORT_MONTHS.March,
                    this.SHORT_MONTHS.April,
                    this.SHORT_MONTHS.May,
                    this.SHORT_MONTHS.June,
                    this.SHORT_MONTHS.July,
                    this.SHORT_MONTHS.August,
                    this.SHORT_MONTHS.September,
                    this.SHORT_MONTHS.October,
                    this.SHORT_MONTHS.November,
                    this.SHORT_MONTHS.December
                ];
                return this.shortMonthTexts[index]
            }

        },
        extend: Widget,
        CONSTS: {
            VIEWMODE: {
                YM: 0,
                YMD: 1,
                HMS: 2,
                YMDHMS: 3,
                HM: 4
            },
            MINYEAR: 1900,
            MAXYEAR: 2999,
            ELEMENT_TYPE: {
                prevm: 2,
                nextm: 3,
                title: 4,
                clear: 5,
                today: 6,
                dok: 7,
                prevy: 8,
                nexty: 9,
                cancel: 10,
                mok: 11,
                plus: 12,
                minus: 13,
                current: 15,
                day: 100,
                month: 200,
                year: 300
            }
        },
        _TT: {
            CALENDAR: "日历",
            CLEAR: "清空",
            TODAY: "今天",
            OK: "确定",
            CURRENT: "当前",
            TIME: "时间"
        },
        _defaultOptions: function() {
            return Foundation.apply(DatePickerWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fui_datepicker",
                viewMode: 1,
                endDate: null,
                startDate: null,
                date: null,
                onDateUpdate: null,
                onClear: null,
                onOk: null,
                onClose: null,
                onToday: null
            });
        },
        _init: function() {
            DatePickerWidget.superclass._init.apply(this);
            this.cache = { showYear: null, showMonth: null };
            this._initTables();
        },

        _initEvents: function() {
            this._unbindEvent(this.el.target);
            this._bindEvent(this.el.target, 'mouseover mouseup mouseout', function(element, event) {
                var target = event.target,
                    tdElement = $(target).closest("td"),
                    eventType = event.type,
                    elType = tdElement.data("element-xtype");

                if (Foundation.isEmpty(tdElement) || Foundation.isEmpty(elType) || tdElement.data('disabled')) {
                    return;
                }

                var options = this.options;
                if (!options.date) {
                    options.date = new Date;
                }
                switch (eventType) {
                    case 'mouseover':
                        tdElement.addClass("hover");
                        break;
                    case 'mouseout':
                        tdElement.removeClass("hover");
                        break;
                    case 'mouseup':
                        tdElement.removeClass("hover");
                        this._onTdElementMouseup(tdElement, elType);
                        break;
                }
            });
        },

        _onTdElementMouseup: function(tdElement, elType) {
            var ELEMENT_TYPE = this.CONSTS.ELEMENT_TYPE;
            var options = this.options;

            switch (elType) {
                case ELEMENT_TYPE.prevm:
                    this._toPrevMonth();
                    this._loadDateData(new Date(options.date));
                    this._applyCallback(options.onDateUpdate, this, arguments);
                    break;
                case ELEMENT_TYPE.nextm:
                    this._toNextMonth();
                    this._loadDateData(new Date(options.date));
                    this._applyCallback(options.onDateUpdate, this, arguments);
                    break;
                case ELEMENT_TYPE.title:
                    this._loadMonthData(new Date(this.cache.showYear, this.cache.showMonth));
                    this.el.monthtable.css({
                        position: "absolute",
                        top: 0,
                        zIndex: Widget.zIndex++
                    }).show("fast");
                    break;
                case ELEMENT_TYPE.clear:
                    this.options.date = null;
                    this.cache.selectedDate && this.cache.selectedDate.removeClass("selected");
                    this._applyCallback(options.onDateUpdate, this, arguments);
                    this._applyCallback(options.onClear, this, arguments);
                    break;
                case ELEMENT_TYPE.current:
                    this.options.date = new Date;
                    this._applyCallback(options.onDateUpdate, this, arguments);
                case ELEMENT_TYPE.today:
                    var today = new Date;
                    if (this.options.startDate && today < this.options.startDate || this.options.endDate && today > this.options.endDate) {
                        return;
                    }
                    this.options.date = today;
                    this.cache.selectedDate && this.cache.selectedDate.removeClass("selected");
                    this.cache.selectedDate = this.el.datetable.find("td.today").addClass("selected");
                    this._applyCallback(options.onDateUpdate, this, arguments);
                    this._applyCallback(options.onToday, this, arguments);
                    break;
                case ELEMENT_TYPE.dok:
                    this._applyCallback(options.onDateUpdate, this, arguments);
                    this._applyCallback(options.onOk, this, arguments);
                    break;
                case ELEMENT_TYPE.prevy:
                    this._toPrevDecade();
                    this._loadMonthData(new Date(this.options.date));
                    this._applyCallback(options.onDateUpdate, this, arguments);
                    break;
                case ELEMENT_TYPE.nexty:
                    this._toNextDecade();
                    this._loadMonthData(new Date(this.options.date));
                    this._applyCallback(options.onDateUpdate, this, arguments);
                    break;
                case ELEMENT_TYPE.mok:
                    this._loadDateData(new Date(this.options.date));
                    this._applyCallback(options.onDateUpdate, this, arguments);
                    this.el.monthtable.hide();
                    break;
                case ELEMENT_TYPE.cancel:
                    this._loadDateData(new Date(this.options.date));
                    this.el.monthtable.hide();
                    break;
                case ELEMENT_TYPE.year:
                    this.cache.selectedYear && this.cache.selectedYear.removeClass("selected");
                    this.cache.selectedYear = tdElement;
                    var date = this.options.date;
                    date.setFullYear(tdElement.text());
                    this._loadMonthData(new Date(date));
                    this._applyCallback(options.onDateUpdate, this, arguments);
                    break;
                case ELEMENT_TYPE.month:
                    this.cache.selectedMonth && this.cache.selectedMonth.removeClass("selected");
                    this.cache.selectedMonth = tdElement.addClass("selected");
                    this.options.date.setMonth(tdElement.data("month"));
                    this._applyCallback(options.onDateUpdate, this, arguments);
                    break;
                case ELEMENT_TYPE.day:
                    this.cache.selectedDate && this.cache.selectedDate.removeClass("selected");
                    this.cache.selectedDate = tdElement.addClass("selected");
                    var date = this.options.date;
                    date.setFullYear(this.cache.showYear);
                    date.setMonth(this.cache.showMonth)
                    date.setDate(tdElement.text());
                    this._applyCallback(options.onDateUpdate, this, arguments);
                    if (!this.el.timetable.parent().length) {
                        this._applyCallback(options.onClose, this, arguments);
                    }
                    break;
                case ELEMENT_TYPE.plus:
                    // b._doTimeInc(g, g.focus);
                    break;
                case ELEMENT_TYPE.minus:
                    // b._doTimeDec(g, g.focus)
            }
        },

        _toPrevMonth: function() {
            var startDate = this.options.startDate,
                date = this.options.date,
                showMonth = this.cache.showMonth,
                showYear = this.cache.showYear;

            if (startDate) {
                if (showYear > startDate.getFullYear()) {
                    showMonth > 0 ? this._setMonth(showMonth - 1) : (date.setFullYear(showYear - 1), this._setMonth(11))
                } else if (showYear == startDate.getFullYear() && showMonth > startDate.getMonth() && showMonth > 0) {
                    this._setMonth(showMonth - 1);
                    date < startDate && (date = new Date(startDate))
                }
            } else {
                if (showMonth > 0) {
                    this._setMonth(showMonth - 1)
                } else {
                    date.setFullYear(showYear - 1);
                    this._setMonth(11)
                }
            }
        },

        _toNextMonth: function() {
            var endDate = this.options.endDate,
                date = this.options.date,
                showMonth = this.cache.showMonth,
                showYear = this.cache.showYear;

            if (endDate) {
                if (showYear < endDate.getFullYear()) {
                    showMonth < 11 ? this._setMonth(showMonth + 1) : (date.setFullYear(showYear + 1), this._setMonth(0))
                } else if (showYear == endDate.getFullYear() && showMonth < endDate.getMonth()) {
                    this._setMonth(showMonth + 1);
                    date > endDate && (date = new Date(endDate));
                }
            } else {
                if (showMonth < 11) {
                    this._setMonth(showMonth + 1)
                } else {
                    this.setFullYear(showYear + 1);
                    this._setMonth(0)
                }
            }
        },

        _toPrevDecade: function() {
            var startDateMonth, startDateYear;
            var startDate = this.options.startDate;
            var date = this.options.date;
            var startYear = date.getFullYear() - 10;
            var month = date.getMonth();

            if (startDate) {
                startDateYear = startDate.getFullYear();
                if (startYear == startDateYear) {
                    startDateMonth = startDate.getMonth();
                }
            }

            if (!startDateYear || startDateYear < this.CONSTS.MINYEAR) {
                startDateYear = this.CONSTS.MINYEAR
            }

            if (startYear < startDateYear) {
                date.setFullYear(startDateYear);
                month < startDateMonth && date.setMonth(startDateMonth)
            } else {
                date.setFullYear(startYear)
            }
        },

        _toNextDecade: function() {
            var endDateMonth, endDateYear;
            var endDate = this.options.endDate;
            var date = this.options.date;
            var endYear = date.getFullYear() + 10;
            var month = date.getMonth();

            if (endDate) {
                endDateYear = endDate.getFullYear();
                if (endYear == endDateYear) {
                    endDateMonth = endDate.getMonth();
                }
            }

            if (!endDateYear || endDateYear > this.CONSTS.MAXYEAR) {
                endDateYear = this.CONSTS.MAXYEAR
            }

            if (endYear > endDateYear) {
                date.setFullYear(endDateYear);
                month < endDateMonth && date.setMonth(endDateMonth);
            } else {
                date.setFullYear(endYear);
            }
        },

        _setMonth: function(month) {
            var date = this.options.date,
                day = date.getDate(),
                endDate = this.options.endDate,
                startDate = this.options.startDate,
                monthDays = date.getMonthDays(month);

            if (day > monthDays) {
                date.setDate(monthDays);
            }
            date.setMonth(month);

            if (endDate && date > endDate) {
                date.setDate(endDate.getDate());
            }
            if (startDate && date < startDate) {
                date.setDate(startDate.getDate())
            }
        },

        _initTables: function() {
            var options = this.options;
            this.el.datetable = this._createDatePicker();
            this._loadDateData(new Date(options.date));
            this.el.monthtable = this._createMonthPicker();
            this.el.timetable = this._createTimePicker();

            this.setViewModel(this.options.viewMode);

            // switch (options.viewMode) {
            //     case this.CONSTS.VIEWMODE.YM:
            //         this._loadMonthData(new Date(this.options.date));
            //         this.el.monthtable.appendTo(this.el.target).show();
            //         break;
            //     case this.CONSTS.VIEWMODE.HMS:
            //         this._loadTimeData(this.el.timetable, this.options.date);
            //         this._addTimeOptPane(this.el.timetable);
            //         this.el.timetable.appendTo(this.el.target).show();
            //         break;
            //     case this.CONSTS.VIEWMODE.HM:
            //         this.el.timetable.remove();
            //         this.el.timetable = this._createTimePicker({ s: !1 });
            //         this._loadTimeData(this.el.timetable, this.options.date);
            //         this.el.timetable.appendTo(this.el.target).show();
            //         break;
            //     case this.CONSTS.VIEWMODE.YMD:
            //         this.el.datetable.appendTo(this.el.target).show();
            //         this.el.monthtable.hide().appendTo(this.el.target);
            //         break;
            //     default:
            //         this.el.datetable.appendTo(this.el.target).show();
            //         this.el.monthtable.hide().appendTo(this.el.target);
            //         var footer = $("<tr/>").prependTo(this.el.datetable.find("tfoot"));
            //         this._loadTimeData(this.el.timetable, this.options.date);
            //         this.el.timetable.show().appendTo($('<td colspan="7"/>').appendTo(footer))
            // }
        },

        _createCell: function(trElement, html, colspan, elementType, classes) {
            var tdElement = $("<td class/>").attr("colSpan", colspan).html(html).appendTo(trElement);
            if (elementType) {
                tdElement.data("element-xtype", elementType)
            }
            var cellClses = ['btn'];
            if (Foundation.isString(classes)) {
                cellClses.push(classes);
            } else if (Foundation.isArray(classes)) {
                cellClses = Foundation.Array.merge(cellClses, classes);
            }
            tdElement.addClass(cellClses.join(' '));
            return tdElement;
        },

        _createDatePicker: function() {
            var elementType = this.CONSTS.ELEMENT_TYPE;
            var dateTableElement = $('<table cellspacing = "2px" cellpadding = "0" class="dt"/>'),
                headerElement = $("<thead/>").appendTo(dateTableElement);

            var headerMainTrElement = $('<tr class="mainhead"/>');
            this.el.prevMonthBtn = this._createCell(headerMainTrElement, '<i class="icon-angleleft"/>', 1, elementType.prevm, "prevm");
            this.el.titleEl = this._createCell(headerMainTrElement, '', 5, elementType.title, 'title');
            this.el.nextMonthBtn = this._createCell(headerMainTrElement, '<i class="icon-angleright"/>', 1, elementType.nextm, 'nextm');
            headerMainTrElement.appendTo(headerElement);

            var weekTrElement = $("<tr/>");
            Foundation.Array.eachCount(7, function(i) {
                var classes = ['day', 'name'];
                if (i == 0 || i == 6) {
                    classes.push('weekend');
                }
                this._createCell(weekTrElement, DatePickerWidget.getShortWeekText(i), 1, null, classes);
            }, this);
            weekTrElement.appendTo(headerElement);

            var tbodyElement = $('<tbody onselectstart="return false"/>').appendTo(dateTableElement);
            Foundation.Array.eachCount(6, function(i) {
                var trElement = $("<tr/>").appendTo(tbodyElement);
                Foundation.Array.eachCount(7, function(j) {
                    $('<td/>').appendTo(trElement);
                }, this);
            }, this);

            var tfootElement = $("<tfoot/>").appendTo(dateTableElement);
            this._createCell($("<tr/>").appendTo(tfootElement), "", 7, null, 'split');

            var btnTrElement = $("<tr/>");
            this._createCell(btnTrElement, this._TT.CLEAR, 2, elementType.clear, "clear");
            this._createCell(btnTrElement, this._TT.TODAY, 3, elementType.today, "today");
            this._createCell(btnTrElement, this._TT.OK, 2, elementType.dok, "ok");
            btnTrElement.appendTo(tfootElement)

            return dateTableElement;
        },

        _createMonthPicker: function() {
            var monthTableElement = $('<table cellspacing="2px" cellpadding="0" class="mt"/>');
            var elementType = this.CONSTS.ELEMENT_TYPE;

            var tbodyElement = $("<tbody/>").appendTo(monthTableElement);
            var monthTrElement = $("<tr/>").appendTo(tbodyElement);

            Foundation.Array.eachCount(2, function(i) {
                $('<td class="month"/>').appendTo(monthTrElement);
            }, this);

            this._createCell(monthTrElement, '<i class="icon-angleleft"/>', 1, elementType.prevy, 'prevy');
            this._createCell(monthTrElement, '<i class="icon-angleright"/>', 1, elementType.nexty, 'nexty');

            Foundation.Array.eachCount(5, function(i) {
                var trElement = $("<tr/>").appendTo(tbodyElement);
                $('<td class="month"/><td class="month"/><td class="year"/><td class="year"/>').appendTo(trElement);
            }, this);

            var tfootElement = $("<tfoot/>").appendTo(monthTableElement);
            var footTrElement = $("<tr/>").appendTo(tfootElement);
            this._createCell(footTrElement, this._TT.OK, 4, elementType.mok, "ok");

            return monthTableElement;
        },

        _createTimePicker: function() {
            return $('<div/>');
        },

        _loadMonthData: function(date) {
            if (Foundation.isEmpty(date)) {
                return;
            }

            var year = date.getFullYear(),
                month = date.getMonth(),
                mYear = this.el.monthtable.data('data-mid-year');

            if (mYear) {
                if (year > mYear + 5) {
                    mYear += 10
                } else if (year < mYear - 4) {
                    mYear -= 10
                }
            } else {
                mYear = year;
            }
            this.el.monthtable.data("data-mid-year", mYear);

            var yearLists = Foundation.Array.mapCount(10, function(i) {
                return mYear + (i - 4)
            }, this);

            var yearTdElements = $("td.year", this.el.monthtable),
                monthTdElements = $("td.month", this.el.monthtable),
                options = this.options,
                startDate = options.startDate,
                endDate = options.endDate;

            var endDateYear, endDateMonth, startDateYear, startDateMonth;

            if (endDate) {
                endDateYear = endDate.getFullYear();
                if (year == endDateYear) {
                    endDateMonth = endDate.getMonth()
                }
            }

            if (!endDateYear || endDateYear > this.CONSTS.MAXYEAR) {
                endDateYear = this.CONSTS.MAXYEAR
            }

            if (startDate) {
                startDateYear = startDate.getFullYear();
                if (year == startDateYear) {
                    startDateMonth = startDate.getMonth();
                }
            }

            if (!startDateYear || startDateYear < this.CONSTS.MINYEAR) {
                startDateYear = this.CONSTS.MINYEAR
            }

            Foundation.Array.eachCount(12, function(i) {
                var monthTdElement = monthTdElements.eq(i).text(DatePickerWidget.getMonthText(i))
                    .data("element-xtype", this.CONSTS.ELEMENT_TYPE.month)
                    .data("month", i);

                if (i == month) {
                    this.cache.selectedMonth && this.cache.selectedMonth.removeClass("selected");
                    monthTdElement.addClass("selected");
                    this.cache.selectedMonth = monthTdElement;
                }

                if (!Foundation.isEmpty(startDateMonth) && i < startDateMonth || !Foundation.isEmpty(endDateMonth) && i > endDateMonth) {
                    monthTdElement.addClass("disabled").data("disabled", true)
                } else {
                    monthTdElement.removeClass("disabled").data("disabled", false)
                }

                if (i < 10) {
                    var yearTdElement = yearTdElements.eq(i).text(yearLists[i]).data('element-xtype', this.CONSTS.ELEMENT_TYPE.year);
                    if (yearLists[i] == year) {
                        this.cache.selectedYear && this.cache.selectedYear.removeClass("selected");
                        yearTdElement.addClass("selected");
                        this.cache.selectedYear = yearTdElement;
                    }

                    if (!Foundation.isEmpty(i) && yearLists[i] < startDateYear || !Foundation.isEmpty(endDateYear) && yearLists[i] > endDateYear) {
                        yearTdElement.addClass("disabled").data("disabled", true)
                    } else {
                        yearTdElement.removeClass("disabled").data("disabled", false)
                    }
                }
            }, this);

            var prevYearTdElement = $("td.prevy", this.el.monthtable).removeClass("disabled").data("disabled", false);
            if (yearLists[0] <= startDateYear) {
                prevYearTdElement.addClass("disabled").data("disabled", true).removeClass("hover");
            }
            var nextYearTdElement = $("td.nexty", this.el.monthtable).removeClass("disabled").data("disabled", false);
            if (yearLists[9] >= endDateYear) {
                nextYearTdElement.addClass("disabled").data("disabled", true).removeClass("hover")
            }
        },

        _loadTimeData: function() {

        },

        _loadDateData: function(date) {
            if (!date) {
                return;
            }

            var year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate();

            var nowDate = new Date(),
                nowYear = nowDate.getFullYear(),
                nowMonth = nowDate.getMonth(),
                nowDay = nowDate.getDate();

            this.cache.showYear = year;
            this.cache.showMonth = month;

            var startDate = this.options.startDate,
                endDate = this.options.endDate;

            this.el.titleEl.text(DatePickerWidget.getMonthText(month) + ', ' + year);

            var tempDate = new Date(date);
            tempDate.setDate(tempDate.getMonthDays() + 1);
            if (endDate && tempDate < endDate) {
                if (tempDate.getFullYear() > this.CONSTS.MAXYEAR) {
                    this.el.nextMonthBtn.addClass("disabled").removeClass("hover").data("disabled", true)
                } else {
                    this.el.nextMonthBtn.removeClass("disabled").data("disabled", false);
                }
            }

            tempDate = new Date(date);
            tempDate.setDate(0);
            if (startDate && tempDate > startDate) {
                if (tempDate.getFullYear() < this.CONSTS.MINYEAR) {
                    this.el.prevMonthBtn.addClass("disabled").removeClass("hover").data("disabled", true)
                } else {
                    this.el.prevMonthBtn.removeClass("disabled").data("disabled", false);
                    date.setDate(1)
                }
            }

            date.setDate(1);
            date.setDate(0 - date.getDay() % 7);
            date.setDate(date.getDate() + 1);

            var dayTrElement = this.el.datetable.find("tbody").children().eq(0);
            Foundation.isEmpty(dayTrElement) || Foundation.Array.eachCount(6, function(i) {
                var dayIndex = 0;
                var dayTdElements = dayTrElement.children();
                for (var j = 0; j < 7; ++j, date.setDate(dayIndex + 1)) {
                    var tdElement = dayTdElements.eq(j);
                    if (Foundation.isEmpty(tdElement)) {
                        break;
                    }
                    tdElement.removeClass().data('element-xtype', this.CONSTS.ELEMENT_TYPE.day);
                    dayIndex = date.getDate();
                    tdElement.text(dayIndex);

                    //当前月份
                    if (date.getMonth() == month) {
                        var disabled = false;
                        if (startDate && startDate > date || endDate && endDate < date) {
                            tdElement.addClass("day disabled");
                            disabled = true;
                        } else {
                            tdElement.addClass("day");
                            tdElement.data("disabled", disabled);
                        }
                        if (!disabled) {
                            //当前选中的
                            if (dayIndex == day) {
                                this.cache.selectedDate && this.cache.selectedDate.removeClass("selected");
                                tdElement.addClass("selected");
                                this.cache.selectedDate = tdElement;
                                this.cache.showDay = dayIndex;
                            }
                            //当天
                            if (date.getFullYear() == nowYear && date.getMonth() == nowMonth && dayIndex == nowDay) {
                                tdElement.addClass("today");
                            }
                            //周末
                            var day = date.getDay();
                            if ([0, 6].indexOf(day) != -1) {
                                tdElement.addClass("weekend")
                            }
                        }
                    } else {
                        tdElement.addClass("oday").data("disabled", true);
                    }
                }
                dayTrElement = dayTrElement.next();
            }, this);
        },

        setViewModel: function(viewMode) {

            console.log(viewMode)

            this.options.viewMode = viewMode;

            switch (viewMode) {
                case this.CONSTS.VIEWMODE.YM:
                    this._loadMonthData(new Date(this.options.date));
                    this.el.monthtable.appendTo(this.el.target).show();
                    break;
                case this.CONSTS.VIEWMODE.HMS:
                    this._loadTimeData(this.el.timetable, this.options.date);
                    this._addTimeOptPane(this.el.timetable);
                    this.el.timetable.appendTo(this.el.target).show();
                    break;
                case this.CONSTS.VIEWMODE.HM:
                    this.el.timetable.remove();
                    this.el.timetable = this._createTimePicker({ s: !1 });
                    this._loadTimeData(this.el.timetable, this.options.date);
                    this.el.timetable.appendTo(this.el.target).show();
                    break;
                case this.CONSTS.VIEWMODE.YMD:
                    this.el.datetable.appendTo(this.el.target).show();
                    this.el.monthtable.hide().appendTo(this.el.target);
                    break;
                default:
                    this.el.datetable.appendTo(this.el.target).show();
                    this.el.monthtable.hide().appendTo(this.el.target);
                    var footer = $("<tr/>").prependTo(this.el.datetable.find("tfoot"));
                    this._loadTimeData(this.el.timetable, this.options.date);
                    this.el.timetable.show().appendTo($('<td colspan="7"/>').appendTo(footer))
            }
        }

    });

    Widget.register('datepicker', DatePickerWidget);

    return DatePickerWidget;
});