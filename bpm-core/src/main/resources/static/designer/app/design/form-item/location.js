define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormTriggerWidget = require('./trigger');

    var PhoneFormLocationWidget = Class.create({
        extend: FormTriggerWidget,
        xtype: FormTriggerWidget.XTYPE.LOCATION,
        settingPanelType: 'location',
        isGroup: true,
        _defaultOptions: function() {
            return Foundation.apply(PhoneFormLocationWidget.superclass._defaultOptions.apply(this), {
                triggerExtCls: 'dui-location'
            });
        },
        _defaultSetting: function() {
            return Foundation.apply(PhoneFormLocationWidget.superclass._defaultSetting.apply(this), {
                title: "位置定位",
                adjustable: true,
                radius: 100,
                limits: []
            })
        },
        _setting2Options: function(setting) {
            return Foundation.apply(PhoneFormLocationWidget.superclass._setting2Options.apply(this, arguments), {

            })
        }
    });
    return PhoneFormLocationWidget;
});