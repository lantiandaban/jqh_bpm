define(function(require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');

    var DateTimeScopePanel = Class.create({
        extend: FormWidgetSettingBasePanel,
        _defaultOptions: function() {
            return Foundation.apply(DateTimeScopePanel.superclass._defaultOptions.apply(this), {

            });
        },
        _getFormWidgetSettingOptions: function(formItem) {
            var self = this;
            var options = this.options;

            return [{
                    xtype: 'title',
                    title: "标题"
                },
                this.__getTitleConfig(), '-', {
                    xtype: 'title',
                    title: "开始日期标题"
                }, {
                    xtype: 'input',
                    value: formItem.getSettingByName('beginTimeTitle'),
                    onAfterEdit: function(event, value) {
                        formItem.setBeginDateTimeTitle(value);
                    }
                }, '-', {
                    xtype: 'title',
                    title: "结束日期标题"
                }, {
                    xtype: 'input',
                    value: formItem.getSettingByName('endTimeTitle'),
                    onAfterEdit: function(event, value) {
                        formItem.setEndDateTimeTitle(value);
                    }
                }, '-', {
                    xtype: 'title',
                    title: "描述信息"
                }, {
                    xtype: 'textarea',
                    onAfterEdit: function(event, value) {

                    }
                }, '-', {
                    xtype: 'title',
                    title: "类型"
                }, {
                    xtype: 'combo',
                    items: [{
                        value: "date",
                        text: "日期（年-月-日）"
                    }, {
                        value: "datatime",
                        text: "日期时间（年-月-日 时:分）"
                    }],
                    onAfterItemSelect: function(element, item) {

                    }
                }, '-', {
                    xtype: 'title',
                    title: "时长"
                }, {
                    xtype: 'checkbox',
                    text: '自动计算时长（单位：小时）',
                    value: formItem.getSettingByName('autoDuration'),
                    onStateChange: function(selected) {
                        formItem.setCellVisible('duration', selected);
                    }
                }, '-', {
                    xtype: 'title',
                    title: "校验"
                },
                this.__getVisibleConfig(),
                this.__getReadonlyConfig(),
                this.__getRequiredConfig()
            ]
        }
    });

    FormWidgetSettingBasePanel.register('datetimescope', DateTimeScopePanel);

    return DateTimeScopePanel;
});