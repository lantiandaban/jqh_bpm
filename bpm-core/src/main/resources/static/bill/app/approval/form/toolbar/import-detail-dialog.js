define(function (require, exports, module) {

    var Hamster = require('lib/index');
    var importDetailHtml = require('text!view/approval/form/import-detail.hbs');

    /**
     * 审批明细导入弹出框
     * */
    var ApprovalImportDetailDialog = Class.create({

        statics: {},

        extend: Hamster.ui.Dialog,

        title: '明细导入',

        width: 560,

        height: 580,

        contentPadding: 20,

        contentHtml: importDetailHtml,

        processId: null,

        _beforeInit: function () {
            this.btnItems = [
                {
                    name: 'confirm',
                    icon: 'ui-icon-check',
                    title: "导入",
                    handler: this.onConfirm.bind(this)
                }
            ];
            ApprovalImportDetailDialog.superclass._beforeInit.apply(this);
        },

        onRenderContent: function () {
            ApprovalImportDetailDialog.superclass.onRenderContent.apply(this);
            this.renderFileUploadInput();
            var $linkTpl = this.el._dialog_content.find('#link-imptpl');
            var $linkTplV = this.el._dialog_content.find('#link-imptpl-v');
            var templateURL = g.ctx + 'api/process/detail/template/'+ this.processId;
            $linkTpl.prop('href', templateURL);
            $linkTplV.prop('href', templateURL);
        },

        renderFileUploadInput: function () {
            this.fileUploadInput = new Hamster.ui.UploadInput({
                appendToEl: this.el._dialog_content.find('.approval-import-detail-file'),
                auto: false,
                url: g.ctx + 'api/bill/details/import',
                accept: {
                    title: '文件',
                    mimeTypes: 'application/vnd.ms-excel'
                },
                width: 280
            });
            this.fileUploadInput.on('start', this.onFileUploadStart, this);
            this.fileUploadInput.on('complete', this.onFileUploadComplete, this);
            this.fileUploadInput.on('success', this.onFileUploadSuccess, this);
            this.fileUploadInput.on('failure', this.onFileUploadFailure, this);
        },

        onFileUploadStart: function () {
            this.loader = this.loader || new Hamster.ui.Loader({
                    container: this.getBodyElement()
                });
            this.loader.start();
        },

        onFileUploadComplete: function () {
            this.loader.stop();
        },

        onFileUploadSuccess: function (file, result) {
            this.fireEvent('success', result);
            this.close();
        },

        onFileUploadFailure: function () {
            console.warn('文件上传失败');
        },

        onConfirm: function () {
            if (!this.fileUploadInput.file) {
                layer.open({
                    title: '温馨提示',
                    content: '请先选择文件上传!',
                    icon: 2
                });
                return;
            }
            this.fileUploadInput.setParams({
                processId: this.processId
            });
            this.fileUploadInput.upload();
        },

        destroy: function () {
            this.fileUploadInput.destroy();
            this.loader && this.loader.destroy();
            ApprovalImportDetailDialog.superclass.destroy.apply(this, arguments);
        }

    });

    return ApprovalImportDetailDialog;
});