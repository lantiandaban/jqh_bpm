define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormTriggerWidget = require('./trigger');

    var PhoneFormMultiSelectWidget = Class.create({
        extend: FormTriggerWidget,
        xtype: FormTriggerWidget.XTYPE.MULTI_SELECT,
        settingPanelType: 'multi-select',
        _defaultOptions: function() {
            return Foundation.apply(PhoneFormMultiSelectWidget.superclass._defaultOptions.apply(this), {
                triggerExtCls: 'dui-combo'
            });
        },
        _defaultSetting: function() {
            return Foundation.apply(PhoneFormMultiSelectWidget.superclass._defaultSetting.apply(this), {
                title: "下拉复选框",
                placeholder: "",
                items: Foundation.Array.mapCount(3, function(i, count) {
                    var value = Foundation.String.format('选项{0}', i + 1);
                    return { value: value, text: value }
                }),
                sourceType: "custom",
                // async: {
                //     url: "/data/xxx.json",
                //     table: "",
                //     field: ""
                // },
                rely: null,
                async: null,
                allowRepetition: false
            })
        },
        _setting2Options: function(setting) {
            return Foundation.apply(PhoneFormMultiSelectWidget.superclass._setting2Options.apply(this, arguments), {
                items: setting.items
            })
        },
        setItems: function(items) {
            this.options.items = items;
            this.setSetting('items', items);
        }
    });
    return PhoneFormMultiSelectWidget;
});