define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormInputWidget = require('./input');

    var PhoneFormMoneyWidget = Class.create({
        extend: FormInputWidget,
        xtype: FormInputWidget.XTYPE.MONEY,
        settingPanelType: 'money',
        _defaultOptions: function() {
            return Foundation.apply(PhoneFormMoneyWidget.superclass._defaultOptions.apply(this), {
                isTextArea: false
            });
        },
        _defaultSetting: function() {
            return Foundation.apply(PhoneFormMoneyWidget.superclass._defaultSetting.apply(this), {
                title: "金额",
                placeholder: "请输入金额",
                valueType: "custom",
                value: "",
                rely: null,
                formula: null
            })
        },
        getOptions: function() {
            return $.extend(PhoneFormMoneyWidget.superclass.getOptions.apply(this), {

            });
        }
    });
    return PhoneFormMoneyWidget;
});