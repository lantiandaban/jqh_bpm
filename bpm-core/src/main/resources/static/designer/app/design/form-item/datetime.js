define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormTriggerWidget = require('./trigger');

    var PhoneFormDateTimeWidget = Class.create({
        extend: FormTriggerWidget,
        xtype: FormTriggerWidget.XTYPE.DATETIME,
        settingPanelType: 'datetime',
        _defaultOptions: function() {
            return Foundation.apply(PhoneFormDateTimeWidget.superclass._defaultOptions.apply(this), {
                triggerExtCls: 'dui-datetime'
            });
        },
        _defaultSetting: function() {
            return Foundation.apply(PhoneFormDateTimeWidget.superclass._defaultSetting.apply(this), {
                title: "日期时间",
                placeholder: '选择日期',
                visible: true,
                format: "yyyy-MM-dd",
                valueType: "custom",
                value: "",
                rely: {},
                formula: {}
            })
        },
        _setting2Options: function(setting) {
            return Foundation.apply(PhoneFormDateTimeWidget.superclass._setting2Options.apply(this, arguments), {

            })
        }
    });

    return PhoneFormDateTimeWidget;

});