define(function(require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');
    var RelyImplement = require('../implements/rely');

    var NumberPanel = Class.create({
        extend: FormWidgetSettingBasePanel,
        implement: [RelyImplement],

        _getFormWidgetSettingOptions: function(formItem) {
            var options = this.options;

            return [{
                xtype: 'title',
                title: "标题"
            }, {
                xtype: 'input',
                value: formItem.getSettingByName('title'),
                onAfterEdit: function(event, value) {
                    formItem.setTitle(value);
                }
            }, '-', {
                xtype: 'title',
                title: "提示文字"
            }, {
                xtype: 'input',
                value: formItem.getSettingByName('placeholder'),
                onAfterEdit: function(event, value) {
                    formItem.setPlaceholder(value);
                }
            }, '-', {
                xtype: 'title',
                title: "描述信息"
            },this.__getDescTextAreaConfig(), '-', {
                xtype: 'title',
                title: "选项"
            },
                this.__getSelectWidgetValueTypeConfig(),
                this.__getLinkOtherFormItemWidgetConfig(),
                this.__getRelyBtnConfig(),
                this.__getOptionSelectGroupConfig(true, function(result) {
                    formItem.setItems(result.items);
                    formItem.setValue(result.text);
                }),
                this.__getLineDataQueryLoadConfig(), '-', {
                    xtype: 'title',
                    title: "校验"
                },
                this.__getVisibleConfig(),
                this.__getReadonlyConfig(),
                this.__getRequiredConfig()
            ]
        }
    });

    FormWidgetSettingBasePanel.register('multi-select', NumberPanel);

    return NumberPanel;
});