define(function (require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var TriggerWidget = require('./trigger');
    var Foundation = require('Foundation');

    var DateTimeWidget = Class.create({
        extend: TriggerWidget,
        _defaultOptions: function () {
            return Foundation.apply(DateTimeWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fui_datetime",
                triggerIcon: "icon-widget-datetime",
                allowBlank: !0,
                format: "YYYY-MM-DD",
                hasTime: false,
                onAfterEdit: null,
                edge: {width: 240, height: 315}
            });
        },
        _init: function () {
            DateTimeWidget.superclass._init.apply(this);
        },

        _initDefaultValue: function () {
            var options = this.options;
            if (!Foundation.isEmpty(options.value)) {
                this.setValue(options.value, true);
            }
        },

        _onTriggerClick: function () {
            var self = this;
            if (this.isEnabled()) {
                laydate({
                    istime: this.options.hasTime,
                    format: this.options.format,
                    choose: function (value) {
                        self.setValue(value);
                    }
                })
            }
        },

        setFormat: function (format) {
            this.options.format = format;
            if (Foundation.isEmpty(this.value)) {
                return
            }
            var date = moment(this.value);
            var newDate = moment();
            date.hour(newDate.hour());
            date.minute(newDate.minute());
            this.setValue(date.format(format));
        },

        setHasTime: function (hasTime) {
            this.options.hasTime = hasTime;
        },

        setValue: function (value, isInit) {
            this.value = value;
            this.el.input.val(value);
            isInit || this._applyCallback(this.options.onAfterEdit, this, [value])
        },

        getValue: function () {
            return this.value
        }

    });

    Widget.register('datetime', DateTimeWidget);

    return DateTimeWidget;
});