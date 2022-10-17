define(function (require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');
    var RelyImplement = require('../implements/rely');

    var SelectPanel = Class.create({
        extend: FormWidgetSettingBasePanel,
        implement: [RelyImplement],
        _getFormWidgetSettingOptions: function (formItem) {
            return [
                {
                    xtype: 'title',
                    title: "标题"
                },
                this.__getTitleConfig(), '-', {
                    xtype: 'title',
                    title: "提示文字"
                },
                this.__getPlaceholderConfig(), '-', {
                    xtype: 'title',
                    title: "描述信息"
                },
                this.__getDescTextAreaConfig(), '-', {
                    xtype: 'title',
                    title: "选项"
                },
                this.__getSelectWidgetValueTypeConfig(),
                this.__getOptionSelectGroupConfig(true, false),
                this.__getLinkOtherFormItemWidgetConfig(),
                this.__getRelyBtnConfig(true),
                this.__getLineDataQueryLoadConfig(),
                '-',
                {
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

    FormWidgetSettingBasePanel.register('select', SelectPanel);

    return SelectPanel;
});