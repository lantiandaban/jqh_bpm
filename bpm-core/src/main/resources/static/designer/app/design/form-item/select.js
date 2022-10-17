define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormTriggerWidget = require('./trigger');

    var PhoneFormSelectWidget = Class.create({
        extend: FormTriggerWidget,
        xtype: FormTriggerWidget.XTYPE.SELECT,
        settingPanelType: 'select',
        _defaultOptions: function() {
            return Foundation.apply(PhoneFormSelectWidget.superclass._defaultOptions.apply(this), {
                triggerExtCls: 'dui-combo'
            });
        },
        _defaultSetting: function() {
            return Foundation.apply(PhoneFormSelectWidget.superclass._defaultSetting.apply(this), {
                title: "下拉选择",
                placeholder: "",
                sourceType: "custom", //数据源类型
                items: Foundation.Array.mapCount(3, function(i, count) {
                    var value = Foundation.String.format('选项{0}', i + 1);
                    return { value: value, text: value }
                }),
                rely: null,
                // async: {
                //     url: "/data/xxx.json",
                //     table: "",
                //     field: ""
                // },
                async: null,
                allowRepetition: false
            })
        },
        _setting2Options: function(setting) {
            return Foundation.apply(PhoneFormSelectWidget.superclass._setting2Options.apply(this, arguments), {
                items: setting.items
            })
        },
        setItems: function(items) {
            this.options.items = items;
            this.setSetting('items', items);
        }

    });
    return PhoneFormSelectWidget;
});