define(function (require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');

    var RadioGroupPanel = Class.create({
        extend: FormWidgetSettingBasePanel,

        _getFormWidgetSettingOptions: function (formItem) {


            return [{
                xtype: 'title',
                title: "标题"
            },
                this.__getTitleConfig(), '-', {
                    xtype: 'title',
                    title: "描述信息"
                },
                this.__getDescTextAreaConfig(), '-', {
                    xtype: 'title',
                    title: "选项"
                }, '-',
                this.__getOptionSelectGroupConfig(false, false, function (result) {
                    formItem.setItems(result.items)
                }), '-', {
                    xtype: 'title',
                    title: "校验"
                },
                this.__getVisibleConfig(),
                this.__getReadonlyConfig(),
                this.__getRequiredConfig(),
                {
                    xtype: 'checkbox',
                    text: '不允许重复',
                    value: formItem.getSettingByName('allowRepetitiony'),
                    onStateChange: function (selected) {
                        formItem.setSetting('allowRepetitiony', selected);
                    }
                }
            ]
        }
    });

    FormWidgetSettingBasePanel.register('radiogroup', RadioGroupPanel);

    return RadioGroupPanel;
});