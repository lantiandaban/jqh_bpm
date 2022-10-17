define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormSelectGroupWidget = require('./selectgroup');

    var PhoneFormRadioGroupWidget = Class.create({
        extend: FormSelectGroupWidget,
        xtype: FormSelectGroupWidget.XTYPE.RADIO_GROUP,
        settingPanelType: 'radiogroup',

        _defaultOptions: function() {
            return Foundation.apply(PhoneFormRadioGroupWidget.superclass._defaultOptions.apply(this), {
                isRadio: true
            });
        },
        _defaultSetting: function() {
            return Foundation.apply(PhoneFormRadioGroupWidget.superclass._defaultSetting.apply(this), {
                title: "单选按钮组",
                items: Foundation.Array.mapCount(3, function(i, count) {
                    var value = Foundation.String.format('选项{0}', i + 1);
                    return { value: value, text: value }
                }),
                allowRepetition: false
            })
        },
        _setting2Options: function(setting) {
            return Foundation.apply(PhoneFormRadioGroupWidget.superclass._setting2Options.apply(this, arguments), {
                items: setting.items
            })
        }
    });
    return PhoneFormRadioGroupWidget;
});