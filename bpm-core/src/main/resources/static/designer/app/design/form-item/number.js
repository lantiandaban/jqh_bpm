define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormInputWidget = require('./input');

    var PhoneFormNumberWidget = Class.create({
        extend: FormInputWidget,
        xtype: FormInputWidget.XTYPE.NUMBER,
        settingPanelType: 'number',
        _defaultOptions: function() {
            return Foundation.apply(PhoneFormNumberWidget.superclass._defaultOptions.apply(this), {
                isTextArea: false
            });
        },
        _defaultSetting: function() {
            return Foundation.apply(PhoneFormNumberWidget.superclass._defaultSetting.apply(this), {
                title: "数字",
                placeholder: "请输入数字",
                valueType: "custom",
                value: "",
                rely: null,
                formula: null,
                decimals: {
                    enabled: true,
                    length: 3
                }
            })
        },
        _setting2Options: function(setting) {
            return Foundation.apply(PhoneFormNumberWidget.superclass._setting2Options.apply(this, arguments), {

            })
        }
    });
    return PhoneFormNumberWidget;
});