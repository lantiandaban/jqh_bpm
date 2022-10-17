define(function(require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');
    var RelyImplement = require('../implements/rely');
    var FormulaImplement = require('../implements/formula');

    var MoneyPanel = Class.create({
        extend: FormWidgetSettingBasePanel,
        implement: [RelyImplement, FormulaImplement],
        _defaultOptions: function() {
            return Foundation.apply(MoneyPanel.superclass._defaultOptions.apply(this), {

            });
        },
        _getFormWidgetSettingOptions: function() {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;
            var formItemOptions = options.formItem.options;

            return [{
                    xtype: 'title',
                    title: "标题"
                },
                this.__getTitleConfig(), '-', {
                    xtype: 'title',
                    title: "提示文字"
                }, {
                    xtype: 'input',
                    value: formItemOptions.placeholder,
                    onAfterEdit: function(event, value) {
                        formItem.setPlaceholder(value);
                    }
                }, '-', {
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
                    xtype: 'tablecontainer',
                    rowSize: [20],
                    colSize: ["auto", 20],
                    items: [
                        [{
                            xtype: 'checkbox',
                            text: '显示大写金额',
                            value: formItem.getSettingByName('capitalAmount'),
                            onStateChange: function(selected) {
                                formItem.setSetting('capitalAmount', selected);
                            }
                        }, {
                            xtype: "tooltip",
                            style: "tip",
                            text: "输入数字后自动显示大写金额文字"
                        }]
                    ]
                },
                this.__getSubtotalConfig()
            ]
        }
    });

    FormWidgetSettingBasePanel.register('money', MoneyPanel);

    return MoneyPanel;
});