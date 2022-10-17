define(function(require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');

    var ExplainPanel = Class.create({
        extend: FormWidgetSettingBasePanel,
        _defaultOptions: function() {
            return Foundation.apply(ExplainPanel.superclass._defaultOptions.apply(this), {

            });
        },
        _getFormWidgetSettingOptions: function() {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;
            var formItemOptions = options.formItem.options;

            return [{
                xtype: 'title',
                title: "描述信息"
            }, {
                xtype: 'textarea',
                value: formItemOptions.value,
                onAfterEdit: function(event, value) {
                    formItem.setText(value);
                }
            }, '-', {
                xtype: 'title',
                title: "位置"
            }, {
                xtype: 'combo',
                items: [{
                    value: 1,
                    text: "上方",
                    selected: formItemOptions.direction == 'top'
                }, {
                    value: 2,
                    text: "下方",
                    selected: formItemOptions.direction == 'bottom'
                }],
                onAfterItemSelect: function(element, item) {
                    var value = this.getValue();
                    switch (value) {
                        case 1:
                            formItem.setDirection('top');
                            break;
                        case 2:
                            formItem.setDirection('bottom');
                            break;
                    }
                }
            }]
        }
    });

    FormWidgetSettingBasePanel.register('explain', ExplainPanel);

    return ExplainPanel;
});