define(function (require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');
    var RelyImplement = require('../implements/rely');
    var FormulaImplement = require('../implements/formula');

    var NumberPanel = Class.create({
        extend: FormWidgetSettingBasePanel,
        implement: [RelyImplement, FormulaImplement],

        _getFormWidgetSettingOptions: function () {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;

            var decimals = formItem.getSettingByName('decimals');
            var decimalsEnabled = decimals && decimals.enabled || false;

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
                this.__getInputWidgetValueTypeConfig(),
                this.__getInputDefualtValueConfig(),
                this.__getRelyBtnConfig(),
                this.__getFormulaBtnConfig(), '-', {
                    xtype: 'title',
                    title: "校验"
                },
                this.__getVisibleConfig(),
                this.__getReadonlyConfig(),
                this.__getRequiredConfig(),
                {
                    xtype: 'checkbox',
                    text: '允许小数',
                    value: decimalsEnabled,
                    onStateChange: function (selected) {
                        var allowDecimalWidget = self.getWidgetByName("allowDecimal");
                        allowDecimalWidget.setVisible(selected);

                        if (selected) {
                            decimals = decimals || {};
                            decimals.enabled = true;
                            decimals.length = allowDecimalWidget.getValue();
                            formItem.setSetting('decimals', decimals);
                        } else {
                            formItem.setSetting('decimals', {enabled: false});
                        }
                    }
                }, {
                    xtype: 'input',
                    widgetName: "allowDecimal",
                    value: decimalsEnabled && decimals.length || 2,
                    visible: decimalsEnabled,
                    onAfterEdit: function (event, value) {
                        decimals.length = value;
                        formItem.setSetting('decimals', decimals);
                    }
                },
                this.__getSubtotalConfig()
            ]
        }
    });

    FormWidgetSettingBasePanel.register('number', NumberPanel);

    return NumberPanel;
});