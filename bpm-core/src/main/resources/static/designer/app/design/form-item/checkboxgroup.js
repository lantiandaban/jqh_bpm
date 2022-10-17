define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormSelectGroupWiget = require('./selectgroup');

    var PhoneFormCheckBoxGroupWidget = Class.create({
        extend: FormSelectGroupWiget,
        xtype: FormSelectGroupWiget.XTYPE.CHECKBOX_GROUP,
        settingPanelType: 'checkboxgroup',
        _defaultOptions: function() {
            return Foundation.apply(PhoneFormCheckBoxGroupWidget.superclass._defaultOptions.apply(this), {
                isRadio: false
            });
        },
        _defaultSetting: function() {
            return Foundation.apply(PhoneFormCheckBoxGroupWidget.superclass._defaultSetting.apply(this), {
                title: "复选按钮组",
                items: Foundation.Array.mapCount(3, function(i, count) {
                    var value = Foundation.String.format('选项{0}', i + 1);
                    return { value: value, text: value }
                }),
                allowRepetition: false
            })
        },
        _setting2Options: function(setting) {
            return Foundation.apply(PhoneFormCheckBoxGroupWidget.superclass._setting2Options.apply(this, arguments), {
                items: setting.items
            })
        }
    });
    return PhoneFormCheckBoxGroupWidget;
});