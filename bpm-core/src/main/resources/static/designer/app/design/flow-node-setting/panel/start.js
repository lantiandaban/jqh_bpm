define(function (require, exports, module) {

    var Class = require('Class');
    var Foundation = require('Foundation');
    var FlowNodeSettingBasePanel = require('./base');
    var constants = require('../../constants');

    var FlowStartNodeSettingPanel = Class.create({
        extend: FlowNodeSettingBasePanel,

        _getFlowItemSettingOptions: function () {
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
                this.__getDescConfig()
            ]
        }
    });

    FlowNodeSettingBasePanel.register(constants.FLOW_NODE_XTYPE.START, FlowStartNodeSettingPanel);

    return FlowStartNodeSettingPanel;
});