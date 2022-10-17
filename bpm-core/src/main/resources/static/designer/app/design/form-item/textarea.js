define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormInputWidget = require('./input');

    var PhoneFormTextAreaWidget = Class.create({
        extend: FormInputWidget,
        xtype: FormInputWidget.XTYPE.TEXTAREA,
        settingPanelType: 'textarea',
        _defaultOptions: function() {
            return Foundation.apply(PhoneFormTextAreaWidget.superclass._defaultOptions.apply(this), {
                isTextArea: true
            });
        },

        _defaultSetting: function() {
            return Foundation.apply(PhoneFormTextAreaWidget.superclass._defaultSetting.apply(this), {
                title: "多行文本",
                placeholder: "请输入多行文本",
                value: ""
            })
        },

        _setting2Options: function(setting) {
            return Foundation.apply(PhoneFormTextAreaWidget.superclass._setting2Options.apply(this, arguments), {

            })
        }
    });
    return PhoneFormTextAreaWidget;
});