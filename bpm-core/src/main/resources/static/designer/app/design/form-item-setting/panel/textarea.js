define(function(require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');

    var TextAreaPanel = Class.create({
        extend: FormWidgetSettingBasePanel,

        _getFormWidgetSettingOptions: function(formItem) {
            return [{
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
                    title: "默认值"
                },
                this.__getInputDefualtValueConfig(),
                '-', {
                    xtype: 'title',
                    title: "校验"
                },
                this.__getVisibleConfig(),
                this.__getReadonlyConfig(),
                this.__getRequiredConfig()
            ]
        }
    });

    FormWidgetSettingBasePanel.register('textarea', TextAreaPanel);

    return TextAreaPanel;
});