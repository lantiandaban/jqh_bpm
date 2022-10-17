define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormTriggerWidget = require('./trigger');

    var PhoneFormTriggerSelectWidget = Class.create({
        extend: FormTriggerWidget,
        xtype: FormTriggerWidget.XTYPE.TRIGGER_SELECT,
        settingPanelType: 'triggerselect',
        _defaultOptions: function() {
            return Foundation.apply(PhoneFormTriggerSelectWidget.superclass._defaultOptions.apply(this), {
                triggerExtCls: 'dui-tirggetselect'
            });
        },
        _defaultSetting: function() {
            return Foundation.apply(PhoneFormTriggerSelectWidget.superclass._defaultSetting.apply(this), {
                title: "弹出选择",
                placeholder: "",
                datasource: {type: 'table'}
            })
        },
        _setting2Options: function(setting) {
            return Foundation.apply(PhoneFormTriggerSelectWidget.superclass._setting2Options.apply(this, arguments), {

            })
        }
    });
    return PhoneFormTriggerSelectWidget;
});