  

/**
 *
 * @author sog
 * @version 1.0
 */
define(function (require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');
    var FormulaImplement = require('../implements/formula');

    var DetailCalculatePanel = Class.create({
        extend: FormWidgetSettingBasePanel,
        implement: [FormulaImplement],
        _defaultOptions: function () {
            return Foundation.apply(DetailCalculatePanel.superclass._defaultOptions.apply(this), {});
        },
        _getFormWidgetSettingOptions: function () {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;
            var formItemOptions = options.formItem.options;

            return [
                {
                    xtype: 'title',
                    title: "标题"
                },
                this.__getTitleConfig(),
                '-', {
                    xtype: 'title',
                    title: "计算表达式"
                },
                this.__getFormulaBtnConfig(),

                this.__getSubtotalConfig(), '-', {
                    xtype: 'title',
                    title: "校验"
                },
                this.__getVisibleConfig()
            ]
        }
    });

    FormWidgetSettingBasePanel.register('detailcalculate', DetailCalculatePanel);

    return DetailCalculatePanel;
});