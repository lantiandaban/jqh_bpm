define(function(require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');

    var CheckBoxGroupPanel = Class.create({
        extend: FormWidgetSettingBasePanel,

        _getFormWidgetSettingOptions: function(formItem) {
            var self = this;
            var options = this.options;
            var formItemOptions = options.formItem.options;

            function onGroupItemsChange() {
                formItem.setItems(this.getResults().items)
            }

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
                this.__getOptionSelectGroupConfig(false, true, function(result) {
                    formItem.setItems(result.items)
                }), '-', {
                    xtype: 'title',
                    title: "校验"
                },
                this.__getVisibleConfig(),
                this.__getReadonlyConfig(),
                this.__getRequiredConfig()
            ]
        }
    });

    FormWidgetSettingBasePanel.register('checkboxgroup', CheckBoxGroupPanel);

    return CheckBoxGroupPanel;
});