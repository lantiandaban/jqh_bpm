define(function (require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');
    var RelyImplement = require('../implements/rely');
    var FormulaImplement = require('../implements/formula');

    var DateTimePanel = Class.create({
        extend: FormWidgetSettingBasePanel,
        implement: [RelyImplement, FormulaImplement],
        _defaultOptions: function () {
            return Foundation.apply(DateTimePanel.superclass._defaultOptions.apply(this), {});
        },
        _getFormWidgetSettingOptions: function () {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;

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
                    title: "类型"
                }, {
                    xtype: 'combo',
                    items: [{
                        value: 'yyyy-MM-dd',
                        text: "日期（年-月-日）"
                    }, {
                        value: 'yyyy-MM-dd HH:mm',
                        text: "日期时间（年-月-日 时:分）"
                    }],
                    onDataFilter: function (item, index) {
                        item.selected = item.value == formItem.getSettingByName('format');
                        return item;
                    },
                    onAfterItemSelect: function (element, item) {
                        var format = this.getValue();
                        formItem.setSetting('format', format);
                        var defaultDateInput = self.getWidgetByName("defaultInput");
                        defaultDateInput.setHasTime(format == 'yyyy-MM-dd HH:mm');
                        defaultDateInput.setFormat(format == 'yyyy-MM-dd' ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm");
                    }
                }, '-', {
                    xtype: 'title',
                    title: "默认值"
                },
                this.__getInputWidgetValueTypeConfig(),
                this.__getInputDefualtValueConfig(),
                this.__getRelyBtnConfig(),
                this.__getFormulaBtnConfig(),
                '-', {
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

    FormWidgetSettingBasePanel.register('datetime', DateTimePanel);

    return DateTimePanel;
});