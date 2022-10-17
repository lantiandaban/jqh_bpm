define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormInputWidget = require('./input');

    var PhoneFormTextWidget = Class.create({
        extend: FormInputWidget,
        xtype: FormInputWidget.XTYPE.TEXT,
        settingPanelType: 'text',

        _defaultOptions: function() {
            return Foundation.apply(PhoneFormTextWidget.superclass._defaultOptions.apply(this), {
                isTextArea: false
            });
        },

        _defaultSetting: function() {
            return Foundation.apply(PhoneFormTextWidget.superclass._defaultSetting.apply(this), {
                title: "单行文本",
                placeholder: "请输入文本",
                valueType: "custom",
                value: "",
                rely: null,
                formula: null,
                format: "none",
                scan: {
                    editable: true,
                    type: "barCode"
                }
            })
        },
        _setting2Options: function(setting) {
            return Foundation.apply(PhoneFormTextWidget.superclass._setting2Options.apply(this, arguments), {

            })
        }
    });

    return PhoneFormTextWidget;
});