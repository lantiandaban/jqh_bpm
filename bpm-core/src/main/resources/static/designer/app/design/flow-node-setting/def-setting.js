   

define(function(require, exports, module) {
    var Foundation = require('Foundation');
    var constants = require('../constants');
    var PROCESS_USER_TYPE_VALUES = constants.PROCESS_USER_TYPE_VALUES;

    var DEFAULT_FLOW_NODE_SETTING = {};

    var defualtSetting = {
        title: "",
        desc: ""
    };


    DEFAULT_FLOW_NODE_SETTING[constants.FLOW_NODE_XTYPE.DEFAULT] = {

    };

    DEFAULT_FLOW_NODE_SETTING[constants.FLOW_NODE_XTYPE.START] = {

    };

    DEFAULT_FLOW_NODE_SETTING[constants.FLOW_NODE_XTYPE.END] = {

    };

    DEFAULT_FLOW_NODE_SETTING[constants.FLOW_NODE_XTYPE.LINE] = {
        conditions: [],
        actionType: 'agree'
    };

    DEFAULT_FLOW_NODE_SETTING[constants.FLOW_NODE_XTYPE.TASK] = {
        approver: [],
        cc: [],
        permissions: null
    };

    DEFAULT_FLOW_NODE_SETTING[constants.FLOW_NODE_XTYPE.JUDGE] = {

    };

    Foundation.Object.each(DEFAULT_FLOW_NODE_SETTING, function (type, setting) {
        DEFAULT_FLOW_NODE_SETTING[type] = Foundation.apply({}, setting, defualtSetting);
    });

    return DEFAULT_FLOW_NODE_SETTING
});