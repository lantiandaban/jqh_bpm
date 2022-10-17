define(function(require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');

    var AddressPanel = Class.create({
        extend: FormWidgetSettingBasePanel,
        _getFormWidgetSettingOptions: function(formItem) {
            var self = this;
            var options = this.options;

            return [{
                    xtype: 'title',
                    title: "标题"
                },
                this.__getTitleConfig(), '-', {
                    xtype: 'title',
                    title: "地区标题"
                }, {
                    xtype: 'input',
                    value: formItem.getSettingByName('areaTitle'),
                    onAfterEdit: function(event, value) {
                        formItem.setAraeTitle(value);
                    }
                }, '-', {
                    xtype: 'title',
                    title: "描述信息"
                },
                this.__getDescTextAreaConfig(),
                '-', {
                    xtype: 'title',
                    title: "校验"
                },
                this.__getVisibleConfig(),
                this.__getReadonlyConfig(),
                this.__getRequiredConfig(),
                {
                    xtype: 'checkbox',
                    text: '显示详细地址',
                    value: formItem.getSettingByName('needDetail'),
                    onStateChange: function(selected) {
                        formItem.setCellVisible('detail', selected);
                    }
                }
            ]
        }
    });

    FormWidgetSettingBasePanel.register('address', AddressPanel);

    return AddressPanel;
});