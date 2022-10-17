define(function (require, exports, module) {
    var Class = require('../../class');
    var Foundation = require('../../foundation');
    var Dialog = require('../dialog');
    var MultiUploadPanel = require('./multi-upload-panel');

    /**
     * 弹出层组件
     * */
    var MultiUploadDialog = Class.create({

        extend: Dialog,

        title: "多文件上传",

        width: 800,

        height: 500,

        uploadOptions: {},

        multiUploadPanelOptionMapping: {

            url: 'url',

            method: 'method',

            fileValField: 'fileValField',

            accept: 'accept',

            countLimit: 'countLimit',

            sizeLimit: 'sizeLimit',

            singleSizeLimit: 'fileSingleSizeLimit'

        },

        _beforeInit: function () {
            this.btnItems = this.getFooterButtonItems();

            MultiUploadDialog.superclass._beforeInit.apply(this);

            this.contentComp = MultiUploadPanel;
            this.contentCompOptions = this.getContentUploadPanelCompOptions();
        },

        onContentWidgetInited: function (widget) {
            this.multiUploadPanel = widget;
        },

        /**
         * 获取弹出层的底部按钮
         * */
        getFooterButtonItems: function () {
            return [{
                name: 'cancel',
                icon: 'ui-icon-close',
                title: "取消",
                handler: this.onCancel.bind(this)
            }, {
                name: 'confirm',
                icon: 'ui-icon-check',
                title: "确定",
                handler: this.onConfirm.bind(this)
            }]
        },

        /**
         * 获取上传面板组件的配置
         * */
        getContentUploadPanelCompOptions: function () {
            var options = {};
            Foundation.Object.each(this.multiUploadPanelOptionMapping, function (key, value) {
                options[key] = this.uploadOptions[value]
            }, this);
            return options
        },

        /**
         * 取消操作,直接关闭
         * */
        onCancel: function () {
            this.close(true);
        },

        /**
         * 确定操作
         * */
        onConfirm: function () {
            var results = this.multiUploadPanel.getResults();
            this.fireEvent('confirm-results', results);
            this.close();
        },

        setHeight: function (height) {
            MultiUploadDialog.superclass.setHeight.apply(this, arguments);
            this._contentCompWidget.resize(this.getBodySize());
        },

        destroy: function (empty) {
            MultiUploadDialog.superclass.destroy.apply(this, arguments);
        }

    });

    return MultiUploadDialog
});

