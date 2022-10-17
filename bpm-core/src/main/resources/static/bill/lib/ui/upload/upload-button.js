define(function (require, exports, module) {
    var Class = require('../../class');
    var Foundation = require('../../foundation');
    var Button = require('../button');

    /**
     * 文件上传按钮组件
     * */
    var UploadButton = Class.create({

        extend: Button,

        extClsList: ['ui-btn-webupload'],

        multiUpload: false,

        uploadOptions: {},

        _beforeInit: function () {
            UploadButton.superclass._beforeInit.apply(this);
        },

        _init: function () {
            UploadButton.superclass._init.apply(this);
            if (!this.multiUpload) {
                this.renderWebUploader();
            }
        },

        renderWebUploader: function () {
            var buttonInnerHTML = this.el.target.html();

            var fileSingleSizeLimit = this.uploadOptions.fileSingleSizeLimit;
            if (!this.multiUpload && Foundation.isEmpty(fileSingleSizeLimit) && !Foundation.isEmpty(this.uploadOptions.sizeLimit)) {
                fileSingleSizeLimit = this.uploadOptions.sizeLimit;
            }

            this.webUploader = window.WebUploader.create({
                pick: {
                    id: this.el.target[0],
                    innerHTML: buttonInnerHTML,
                    multiple: false
                },
                auto: true,
                server: this.uploadOptions.url,
                method: this.uploadOptions.method,
                fileVal: this.uploadOptions.fileValField,
                accept: this.uploadOptions.accept,
                fileSizeLimit: this.uploadOptions.sizeLimit,
                fileSingleSizeLimit: fileSingleSizeLimit,
                formData: this.uploadOptions.params,
                duplicate: true
            })
        },

        _initEvents: function () {
            UploadButton.superclass._initEvents.apply(this);

            if (!this.multiUpload) {
                this.webUploader.on('beforeFileQueued', this.onSingleFileBeforeQueued.bind(this));
                this.webUploader.on('fileQueued', this.onSingleUploadFileQueued.bind(this));
                this.webUploader.on('uploadProgress', this.onSingleFileUploadProgress.bind(this));
                this.webUploader.on('uploadError', this.onSingleFileUploadFailure.bind(this));
                this.webUploader.on('uploadSuccess', this.onSingleFileUploadSuccess.bind(this));
                this.webUploader.on('error', this.onSingleFileUploadError.bind(this));
                this.webUploader.on('uploadBeforeSend', this.uploadBeforeSend.bind(this));
            }
        },
        uploadBeforeSend: function (object, data, headers) {
            headers['Authorization'] = "bearer " + getAuthorization();
        },
        onSingleFileBeforeQueued: function (file) {
            return this.fireEvent('single-upload-before-queued', file);
        },

        onSingleUploadFileQueued: function (file) {
            this.fireEvent('single-upload-start', file);
        },

        onSingleFileUploadFailure: function (file) {
            this.fireEvent('single-upload-failure', file);
        },

        onSingleFileUploadProgress: function (file, percentage) {
            this.fireEvent('single-upload-progress', file, percentage);
        },

        onSingleFileUploadError: function (type) {
            switch (type) {
                case 'Q_EXCEED_NUM_LIMIT':
                    break;
                case 'F_EXCEED_SIZE':
                case 'Q_EXCEED_SIZE_LIMIT':
                    this.onSingleFilesSizeExceed();
                    break;
                case 'Q_TYPE_DENIED':
                    this.onSingleFileTypeError();
                    break;
            }
        },

        /**
         * 当文件总大小超出设置的sizeLimit值
         * */
        onSingleFilesSizeExceed: function () {
            this.fireEvent('single-upload-exceed-size-limit-error');
        },

        /**
         * 当文件类型不满足时触发
         * */
        onSingleFileTypeError: function () {
            layer.open({
                title: '温馨提示',
                content: '文件类型不正确!',
                icon: 2
            });
        },

        onSingleFileUploadSuccess: function (file, data) {
            var result = data.data;
            result = result || {};
            result._originalFile = file;
            //this.onConfirmUploadFilesResult(result);
            this.fireEvent('single-upload-success', file, result);
        },

        _onButtonClick: function () {
            UploadButton.superclass._onButtonClick.apply(this);

            if (this.multiUpload) {
                this.multiFileUploadDialog = this.getMultiFileUploadDialog();
                this.multiFileUploadDialog.open();
            }
        },

        getMultiFileUploadDialog: function () {
            if (this.multiFileUploadDialog) {
                return this.multiFileUploadDialog
            }
            this.multiFileUploadDialog = new Hamster.ui.MultiUploadDialog({
                uploadOptions: Foundation.clone(this.uploadOptions)
            });
            this.multiFileUploadDialog.on('before-close', this.onMultiFileUploadDialogBeforeClose, this);
            this.multiFileUploadDialog.on('close', this.onMultiFileUploadDialogClose, this);
            this.multiFileUploadDialog.on('confirm-results', this.onConfirmUploadFilesResult, this);
            return this.multiFileUploadDialog;
        },

        onMultiFileUploadDialogBeforeClose: function () {
            if (this.multiFileUploadDialog.multiUploadPanel.uploading) {
                this.fireEvent('multi-files-close-dialog-on-uploading');
                return false;
            }
        },

        onMultiFileUploadDialogClose: function (dialog) {
            var multiFileUploadPanel = dialog.getContentWidget();
            multiFileUploadPanel && multiFileUploadPanel.clear();
        },

        onConfirmUploadFilesResult: function (results) {
            this.fireEvent('multi-files-confirm-finished', Foundation.Array.from(results));
        },

        destroy: function () {
            this.webUploader && this.webUploader.destroy();
            this.multiFileUploadDialog && this.multiFileUploadDialog.destroy();
            UploadButton.superclass.destroy.apply(this);
        }

    });

    return UploadButton
});

