  

/**
 *
 * @author sog
 * @version 1.0
 */
define(function (require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    // var Foundation = require('Foundation');

    var BizSettingPanel = Class.create({
        extend: FormWidgetSettingBasePanel,

        _getFormWidgetSettingOptions: function (formItem) {

            return [
                {
                    xtype: 'title',
                    title: "标题"
                },
                this.__getTitleConfig(),
                {
                    xtype: 'title',
                    title: "描述信息"
                },
                this.__getDescTextAreaConfig(),
                '-',
                {
                    xtype: 'title',
                    title: "业务字段"
                }, {
                    xtype: 'combo',
                    items: [{
                        value: "loginUser",
                        text: "登录人名称"
                    }, {
                        value: "department",
                        text: "登录人部门"
                    }, {
                        value: "billTitle",
                        text: "审批标题"
                    }, {
                        value: "billCode",
                        text: "审批编号"
                    }],
                    onDataFilter: function (item, index) {
                        item.selected = item.value == formItem.getSettingByName('type');
                        return item;
                    },
                    onAfterItemSelect: function (element, item) {
                        var type = this.getValue();
                        formItem.setSetting('type', type);
                        formItem.setType(type);
                    }
                }, '-',
                {
                    xtype: 'checkbox',
                    text: '可编辑模式',
                    value: formItem.getSettingByName('canEdit'),
                    onStateChange: function (selected) {
                        formItem.setSetting('canEdit', selected);
                    }
                },
                this.__getVisibleConfig()
            ]
        }
    });

    FormWidgetSettingBasePanel.register('biz', BizSettingPanel);

    return BizSettingPanel;
});