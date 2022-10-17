define(function(require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');

    var LocationPanel = Class.create({
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
                    title: "描述信息"
                },
                this.__getDescTextAreaConfig(), '-', {
                    xtype: 'title',
                    title: "定位范围"
                },
                this.__getLocationScopeListConfig(),
                '-',
                {
                    xtype: 'title',
                    title: "设置操作权限"
                }, {
                    xtype: 'checkbox',
                    text: '允许微调',
                    value: formItem.getSettingByName('adjustable'),
                    onStateChange: function(selected) {
                        self.getWidgetByName('scope').setEnable(selected);
                        formItem.setSetting('adjustable', selected)
                    }
                }, {
                    xtype: 'combo',
                    widgetName: 'scope',
                    items: [{
                        value: 100,
                        text: "100米"
                    }, {
                        value: 300,
                        text: "300米",
                        selected: true
                    }, {
                        value: 500,
                        text: "500米"
                    }, {
                        value: 1000,
                        text: "1000米"
                    }, {
                        value: 1500,
                        text: "1500米"
                    }, {
                        value: 5000,
                        text: "5000米"
                    }],
                    enable: formItem.getSettingByName('adjustable'),
                    onDataFilter: function(item, index) {
                        item.selected = item.value == formItem.getSettingByName('radius');
                        return item;
                    },
                    onAfterItemSelect: function(element, item) {
                        var value = this.getValue();

                    }
                },
                '-',
                {
                    xtype: 'title',
                    title: "校验"
                },
                this.__getRequiredConfig()
            ]
        }
    });

    FormWidgetSettingBasePanel.register('location', LocationPanel);

    return LocationPanel;
});