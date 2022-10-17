  

define(function(require, exports, module) {

    var WIDGET_XTYPE = {
        LABEL: 'label',
        TEXT: 'text',
        TEXTAREA: 'textarea',
        NUMBER: 'number',
        MONEY: 'money',
        DATETIME: 'datetime',
        SELECT: 'select',
        MULTI_SELECT: 'mulitselect',
        RADIO: 'radio',
        CHECKBOX: 'checkbox',
        RADIO_GROUP: 'radiogroup',
        CHECKBOX_GROUP: 'checkboxgroup',
        LOCATION: 'location',
        ADDRESS: 'address',
        DATETIME_SCOPE: 'datetimescope',
        EXPLAIN: 'explain',
        FILE_UPLOAD: 'fileupload',
        IMAGE_UPLOAD: 'imageupload',
        LINK_QUEYR: 'linkquery',
        DETAIL_GROUP: 'detailgroup',
        TRIGGER_SELECT: 'triggerselect',
        DETAIL_CALCULATE: 'detailcalculate',
        biz: 'biz'
    };

    exports.WIDGET_XTYPE = WIDGET_XTYPE;


    exports.FLOW_NODE_XTYPE = {
        START: 'start',
        END: 'end',
        LINE: 'line',
        TASK: 'task',
        JUDGE: 'judge',
        DEFAULT: 'def'
    };

    exports.PROCESS_USER_TYPE_VALUES = {
        USER: 1,
        POSITION: 2,
        FORM_ITEM_VALUE: 3,
        FORM_CONDITION: 4,
        FLOW_NODE: 5,
        FLOW_NODE_USER: 6,
        PRV_FLOW_NODE_SUPERIOR: 7,
        NONE: 8,
        PROJECT: 9,
        CUSTOMER: 10
    };





    // exports.LINK_QUERY_AVAILABLE_FIELDS = [
    //     WIDGET_XTYPE.TEXT,
    //     WIDGET_XTYPE.TEXTAREA,
    //     WIDGET_XTYPE.NUMBER,
    //     WIDGET_XTYPE.MONEY,
    //     WIDGET_XTYPE.SELECT,
    //     WIDGET_XTYPE.DATETIME
    // ];

    // var LINK_QUERY_FIELDS_VALUE_TYPEMAP = {};
    //
    // LINK_QUERY_FIELDS_VALUE_TYPEMAP[WIDGET_XTYPE.TEXT] = 'string';
    // LINK_QUERY_FIELDS_VALUE_TYPEMAP[WIDGET_XTYPE.TEXTAREA] = 'string';
    // LINK_QUERY_FIELDS_VALUE_TYPEMAP[WIDGET_XTYPE.SELECT] = 'string';
    // LINK_QUERY_FIELDS_VALUE_TYPEMAP[WIDGET_XTYPE.NUMBER] = 'number';
    // LINK_QUERY_FIELDS_VALUE_TYPEMAP[WIDGET_XTYPE.MONEY] = 'number';
    // LINK_QUERY_FIELDS_VALUE_TYPEMAP[WIDGET_XTYPE.DATETIME] = 'date';
    //
    // exports.LINK_QUERY_FIELDS_VALUE_TYPEMAP = LINK_QUERY_FIELDS_VALUE_TYPEMAP;


});