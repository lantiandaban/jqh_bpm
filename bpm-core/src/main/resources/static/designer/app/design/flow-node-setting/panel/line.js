define(function (require, exports, module) {

    var Class = require('Class');
    var Foundation = require('Foundation');
    var FlowNodeSettingBasePanel = require('./base');
    var constants = require('../../constants');

    var FlowLineNodeSettingPanel = Class.create({
        extend: FlowNodeSettingBasePanel,

        _getFlowItemSettingOptions: function () {
            var self = this;
            var likeType = self.getNodeSettingByName('actionType', 'none');
            return [
                {
                    xtype: 'title',
                    title: "节点名称"
                },
                this.__getTitleConfig(), '-',
                {
                    xtype: 'title',
                    title: "节点描述"
                },
                this.__getDescConfig(), '-',
                {
                    xtype: 'title',
                    title: "连线类型"
                },
                {
                    xtype: 'combo',
                    widgetName: "actionType",
                    items: [{
                        value: 'none',
                        text: "直接扭转"
                    }, {
                        value: 'submit',
                        text: "启动填写"
                    }, {
                        value: 'agree',
                        text: "同意扭转"
                    }, {
                        value: 'refuse',
                        text: "拒绝退回"
                    }],
                    onDataFilter: function (item) {
                        if (likeType === item.value) {
                            item.selected = true;
                        }
                        return item;
                    },
                    onAfterItemSelect: function (element, item) {
                        var value = this.getValue();
                        self.setNodeSetting('actionType', value);

                    }
                },
                this.__getLineConditionBoxConfig()
            ]
        },

        __getLineConditionBoxConfig: function () {
            var self = this;

            var formItemWidgets = this.options.formItemWidgets;
            console.log(self.getNodeSettingByName('nodeId'));

            function onClick() {
                var conditions = self.getNodeSettingByName('conditions', []);
                layer.open({
                    type: 2,
                    shade: 0.3,
                    area: ['810px', '600px'],
                    isOutAnim: false,
                    closeBtn: false,
                    title: '设置连线条件',
                    content: [g.ctx + 'process/flow/line'],
                    success: function (layero, index) {
                        var body = layer.getChildFrame('body', index); //LAYER对象下的方法，获取子iframe中的DOM
                        window.iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                        var conditionText = JSON.stringify(conditions);
                        body.contents().find('#condition_val').val(conditionText);
                        body.contents().find('#fields_val').val(JSON.stringify(formItemWidgets));
                    },
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {
                        var body = layer.getChildFrame('body', index); //LAYER对象下的方法，获取子iframe中的DOM
                        var conditionText = body.contents().find('#condition_val').val();
                        if (conditionText && conditionText.length > 0) {
                            self.setNodeSetting('conditions', JSON.parse(conditionText));
                        }
                        layer.close(index);
                    }
                });
            }

            return {
                xtype: 'button',
                style: 'white',
                text: "点击设置扭转条件",
                widgetName: 'linkConditionButton',
                onClick: onClick
            }
        }
    });

    FlowNodeSettingBasePanel.register(constants.FLOW_NODE_XTYPE.LINE, FlowLineNodeSettingPanel);

    return FlowLineNodeSettingPanel;
});