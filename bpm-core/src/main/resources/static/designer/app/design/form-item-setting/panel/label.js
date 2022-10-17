define(function(require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');
    var RelyImplement = require('../implements/rely');
    var FormulaImplement = require('../implements/formula');

    var LabelPanel = Class.create({
        extend: FormWidgetSettingBasePanel,
        _getFormWidgetSettingOptions: function(formItem) {
            var self = this;
            var options = this.options;

            return [{
                xtype: 'title',
                title: "标题文字"
            }, {
                xtype: 'input',
                value: formItem.getSettingByName('value'),
                onAfterEdit: function(event, value) {
                    formItem.setValue(value);
                }
            }, '-', {
                xtype: 'title',
                title: "布局位置"
            }, {
                xtype: 'combo',
                items: [{
                    value: 0,
                    text: "左对齐"
                }, {
                    value: 1,
                    text: "右对齐"
                }, {
                    value: 2,
                    text: "居中对齐"
                }],
                onDataFilter: function(item, index) {
                    item.selected = formItem.getSettingByName('align') == item.value;
                    return item;
                },
                onAfterItemSelect: function(element, item) {

                }
            }]
        }
    });

    FormWidgetSettingBasePanel.register('label', LabelPanel);

    return LabelPanel;
});