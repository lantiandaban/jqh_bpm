define(function (require, exports, module) {
    var Class = require('../../class');
    var Component = require('../component');
    var Foundation = require('../../foundation');
    var Utils = require('../../util');
    var Button = require('../button');
    var Message = require('../message');

    /**
     * 获取滚动条的宽度
     * */
    function getScrollbarWidth() {
        var oP = document.createElement('p'),
            styles = {
                width: '100px',
                height: '100px',
                overflowY: 'scroll'
            }, i, scrollbarWidth;
        for (i in styles) oP.style[i] = styles[i];
        document.body.appendChild(oP);
        scrollbarWidth = oP.offsetWidth - oP.clientWidth;
        oP.remove();
        return scrollbarWidth;
    }

    /**
     * 多文件上传面板组件
     * */
    var MultiUploadPanel = Class.create({

        statics: {},

        extend: Component,

        baseCls: 'ui-multiupload-panel',

        url: '',

        method: 'POST',

        fileValField: 'file',

        accept: null,

        countLimit: null,

        sizeLimit: null,

        singleSizeLimit: null,

        params: {},

        columns: [
            {
                name: 'index',
                width: 40,
                align: 'center'
            },
            {
                title: '文件名称',
                name: 'filename',
                align: 'left'
            },
            {
                title: '文件类型',
                name: 'filetype',
                width: 80,
                align: 'center'
            },
            {
                title: '文件大小',
                name: 'size',
                width: 80,
                align: 'center'
            },
            {
                title: '上传进度',
                name: 'progress',
                width: 100,
                align: 'center'
            },
            {
                title: '上传状态',
                name: 'state',
                width: 80,
                align: 'center'
            },
            {
                title: '操作',
                name: 'operation',
                width: 50,
                align: 'center'
            }
        ],

        _beforeInit: function () {
            MultiUploadPanel.superclass._beforeInit.apply(this);
            this.rows = new Utils.ArrayList();
        },

        _init: function () {
            MultiUploadPanel.superclass._init.apply(this);

            this.renderToolbar();
            this.renderFilesBody();
        },

        renderToolbar: function () {
            this.el.toolbar = $('<div class="ui-multiupload-panel-toolbar"/>').appendTo(this.el.target);

            this.chooseFileBtn = new Button({
                appendToEl: this.el.toolbar,
                extClsList: ['ui-btn-webupload'],
                title: '浏览...',
                icon: 'ui-icon-search'
            });
            this.startUploadBtn = new Button({
                appendToEl: this.el.toolbar,
                title: "开始上传",
                icon: 'ui-icon-upload',
                handler: this.onStartUpload.bind(this)
            });
            this.emptyAllFileBtn = new Button({
                appendToEl: this.el.toolbar,
                title: "清空所有",
                icon: 'ui-icon-delete',
                handler: this.onEmptyAllFiles.bind(this)
            });
            this.createWebUpload();
        },

        createWebUpload: function () {
            this.webUploader = window.WebUploader.create({
                pick: {
                    id: this.chooseFileBtn.el.target[0],
                    innerHTML: '<i class="ui-icon ui-icon-search"></i><span>浏览...</span>',
                    multiple: true
                },
                server: this.url,
                method: this.method,
                fileVal: this.fileValField,
                accept: this.accept,
                fileNumLimit: this.countLimit,
                fileSizeLimit: this.sizeLimit,
                fileSingleSizeLimit: this.singleSizeLimit,
                formData: this.params,
                duplicate: true
            })
        },

        renderFilesBody: function () {
            this.el.header = $('<div class="ui-multiupload-panel-header"/>').appendTo(this.el.target);
            this.el.header.html(Foundation.String.format('<table class="ui-table"><colgroup></colgroup><thead>{0}</thead></table>', Foundation.Array.map(this.columns, function (column) {
                return Foundation.String.format('<th class="ui-table-col-{0}" data-name="{1}">{2}</th>',
                    column.align || 'left',
                    column.name,
                    column.title || "");
            }, this).join('')));

            this.el.box = $('<div class="ui-multiupload-panel-box"/>').appendTo(this.el.target);
            this.el.box.html('<table class="ui-table ui-table-hoverable"><colgroup></colgroup><tbody></tbody></table>');
            this.el.fileBody = this.el.box.find('tbody');
            this.calculateColumnsSize();
        },

        /**
         * 计算列宽度
         * */
        calculateColumnsSize: function () {
            var width = this.width;
            if (!Foundation.isNumber(this.width)) {
                width = this.el.target.width();
            }

            var colHTML = Foundation.Array.map(this.columns, function (column) {
                return Foundation.String.format('<col style="width: {0}px"/>', column.width);
            }, this).join('');
            this.el.target.find('colgroup').html(colHTML);
        },

        _initEvents: function () {
            this._bindDelegateEvent(this.el.fileBody, 'i.ui-multiupload-panel-row-remove', 'click', '_onRowRemoveBtnClick');

            this.webUploader.on('fileQueued', this.onUploadFileQueued.bind(this));
            this.webUploader.on('filesQueued', this.onUploadFilesQueued.bind(this));
            this.webUploader.on('fileDequeued', this.onUploadFileDequeued.bind(this));
            this.webUploader.on('uploadStart', this.onFileUploadStart.bind(this));
            this.webUploader.on('uploadProgress', this.onFileUploadProgress.bind(this));
            this.webUploader.on('uploadError', this.onFileUploadFailure.bind(this));
            this.webUploader.on('uploadSuccess', this.onFileUploadSuccess.bind(this));
            this.webUploader.on('error', this.onError.bind(this));
            this.webUploader.on('uploadFinished', this.onFileUploadFinished.bind(this));
            this.webUploader.on('uploadBeforeSend', this.uploadBeforeSend.bind(this));
        },
        uploadBeforeSend: function (object, data, headers) {
            headers['Authorization'] = "bearer " + getAuthorization();
        },
        /**
         * 当发生错误时触发
         * */
        onError: function (type, size, file) {
            switch (type) {
                case 'Q_EXCEED_NUM_LIMIT':
                    this.onFileCountExceed();
                    break;
                case 'Q_EXCEED_SIZE_LIMIT':
                    this.onFilesSizeExceed();
                    break;
                case 'Q_TYPE_DENIED':
                    this.onFileTypeError();
                    break;
                case 'F_EXCEED_SIZE':
                    this.onFileSizeExceed(file);
                    break;
            }
        },

        /**
         * 当文件数量超出设置的countLimit值
         * */
        onFileCountExceed: function () {
            Message.warning('文件数量超出了设置');
        },

        /**
         * 当文件总大小超出设置的sizeLimit值
         * */
        onFilesSizeExceed: function () {
            Message.warning('文件总大小超出了设置');
        },

        onFileSizeExceed: function (file) {
            this.fileSizeExceedList = this.fileSizeExceedList || [];
            this.fileSizeExceedList.push(file);
        },

        /**
         * 当文件类型不满足时触发
         * */
        onFileTypeError: function () {
            Message.warning('文件类型不正确');
        },

        /**
         * 当文件添加到队列中触发
         * */
        onUploadFileQueued: function (file) {
            this.addFileRow(file)
        },

        /**
         * 当一批文件添加到队列中触发
         * */
        onUploadFilesQueued: function (files) {
            if (!Foundation.isEmpty(this.fileSizeExceedList)) {

                var fileNames = Foundation.Array.map(this.fileSizeExceedList, function (file) {
                    return file.name;
                }, this);
                layer.open({
                    title: '温馨提示',
                    content: Foundation.String.format('单文件大小不能超过{0},以下选择的文件大小超出了范围:<br/>{1}', Foundation.utils.fileSize(this.singleSizeLimit), fileNames.join('<br/>')),
                    icon: 2
                });
                this.fireEvent('upload-file-size-exceed', fileNames, this.fileSizeExceedList);
            }
            this.fileSizeExceedList = [];
        },

        /**
         * 当文件被移除队列后触发
         * */
        onUploadFileDequeued: function (file) {
            this.removeFileRow(file)
        },

        /**
         * 当文件开始上传时
         * */
        onFileUploadStart: function (file) {
            this.renderFileRowColumnInner('state', file);
        },

        /**
         * 当文件上传后的实时进度反馈
         * */
        onFileUploadProgress: function (file, percentage) {
            var percent = Math.round(percentage * 100) / 100;
            this.renderFileRowColumnInner('progress', file, null, percent);
            this.fireEvent('file-progress-change', file, percent);
        },

        /**
         * 当文件上传失败
         * */
        onFileUploadFailure: function (file) {
            this.renderFileRowColumnInner('state', file);
            this.fireEvent('file-failure', file);
        },

        /**
         * 当文件上传成功
         * */
        onFileUploadSuccess: function (file, data) {
            this.renderFileRowColumnInner('state', file);
            var result = data.data;
            result = result || {};
            result._originalFile = file;

            var _file = this.rows.get(file.id);
            if (!Foundation.isEmpty(_file)) {
                _file.result = result;
                _file.success = true;
            }
            this.fireEvent('file-success', file, result, _file);
        },

        /**
         * 当所有文件都上传结束
         * */
        onFileUploadFinished: function () {
            this.uploading = false;
        },

        /**
         * 开始上传文件
         * */
        onStartUpload: function () {
            this.uploading = true;
            this.webUploader.upload();
            this.fireEvent('start-upload');
        },

        /**
         * 清空所有文件
         * */
        onEmptyAllFiles: function () {
            var fileIds = Foundation.clone(this.rows.keys);
            Foundation.Array.forEach(fileIds, function (fileId) {
                this.webUploader.removeFile(fileId, true)
            }, this);
            this.uploading = false;
            this.fireEvent('clear-all-files');
        },

        /**
         * 添加待上传的文件
         * */
        addFileRow: function (file) {
            var columns = {};
            var trElement = $('<tr/>').data('file', file).appendTo(this.el.fileBody);

            Foundation.Array.forEach(this.columns, function (column) {
                var columnHTML = Foundation.String.format('<td class="ui-table-col-{0}"/>',
                    column.align || 'left');
                var columnElement = columns[column.name] = $(columnHTML).appendTo(trElement);
                this.renderFileRowColumnInner(column.name, file, columnElement);
            }, this);

            this.rows.push(file.id, {
                file: file,
                element: trElement,
                columns: columns,
                success: false
            });
            this.fireEvent('add-file', file);
            this.checkBoxScroll();
        },

        /**
         * 渲染列内容
         * */
        renderFileRowColumnInner: function (name, file, columnElement, arg) {
            var row;
            if (Foundation.isEmpty(columnElement) && (row = this.rows.get(file.id))) {
                columnElement = row.columns[name];
            }
            if (Foundation.isEmpty(columnElement)) {
                return
            }
            var renderFn = Foundation.String.format('render{0}ColumnInner', Foundation.String.firstUpperCase(name));
            if (Foundation.isFunction(this[renderFn])) {
                this[renderFn](file, columnElement, arg);
            }
        },

        /**
         * 渲染文件序列号内容
         * */
        renderIndexColumnInner: function (file, columnElement) {
            var trElement = columnElement.closest('tr');
            columnElement.text(this.el.fileBody.find('tr').index(trElement) + 1);
        },

        /**
         * 渲染文件名列内容
         * */
        renderFilenameColumnInner: function (file, columnElement) {
            columnElement.text(file.name);
        },

        /**
         * 渲染文件类型列内容
         * */
        renderFiletypeColumnInner: function (file, columnElement) {
            columnElement.text(Foundation.String.format('.{0}', file.ext));
        },

        /**
         * 渲染文件大小列内容
         * */
        renderSizeColumnInner: function (file, columnElement) {
            columnElement.text(Foundation.utils.fileSize(file.size));
        },

        /**
         * 渲染文件上传进度列内容
         * */
        renderProgressColumnInner: function (file, columnElement, percentage) {
            var progress = (percentage || 0) * 100;
            var progressHTML = Foundation.String.format('<div class="ui-progress ui-progress-large ui-progress-party">' +
                '<div class="ui-progress-bar" style="width: {0}%"></div><div class="ui-progress-text">{1}%</div></div>',
                progress, progress);
            columnElement.html(progressHTML)
        },

        /**
         * 渲染文件上传状态列内容
         * */
        renderStateColumnInner: function (file, columnElement) {
            var stateText = "";
            switch (file.getStatus()) {
                case 'inited':
                case 'queued':
                    stateText = "等待上传";
                    break;
                case 'progress':
                    stateText = "上传中";
                    break;
                case 'complete':
                    stateText = "上传成功";
                    break;
                case 'error':
                case 'invalid':
                    stateText = "上传失败";
                    break;
                case 'cancelled':
                    stateText = "文件被移除";
                    break;
            }
            columnElement.text(stateText);
        },

        /**
         * 渲染文件操作列内容
         * */
        renderOperationColumnInner: function (file, columnElement) {
            columnElement.html('<i class="ui-multiupload-panel-row-remove ui-icon ui-icon-cross-circle"></i>');
        },

        /**
         * 删除文件列表中的文件
         * */
        removeFileRow: function (file) {
            var row = this.rows.get(file.id);
            row.element.remove();
            this.rows.removeAtKey(file.id);
            this.fireEvent('remove-file', file);

            this.rows.each(function (row) {
                this.renderFileRowColumnInner('index', row.file, row.columns.index)
            }, this);
            this.checkBoxScroll();
        },

        /**
         * 检查是否出现滚动条
         * */
        checkBoxScroll: function () {
            var hasScroll = (this.el.box[0].scrollHeight > this.el.box[0].clientHeight || this.el.box[0].offsetHeight > this.el.box[0].clientHeight);
            this.el.header.css('paddingRight', hasScroll ? this.__scrollbarWidth || (this.__scrollbarWidth = getScrollbarWidth()) : 0);
        },

        _onRowRemoveBtnClick: function (element) {
            var trElement = element.closest('tr');
            var file = trElement.data('file');
            this.webUploader.removeFile(file.id, true)
        },

        setHeight: function (height) {
            MultiUploadPanel.superclass.setHeight.apply(this, arguments);

            if (this.el.box) {
                var boxHeight = this.height - this.el.toolbar.outerHeight() - this.el.header.outerHeight();
                this.el.box.height(boxHeight);
            }
        },

        /**
         * 获取所有上传成功的文件
         * */
        getFiles: function () {
            var files = [];
            this.rows.each(function (row) {
                row.success && files.push(row.file);
            });
            return files
        },

        /**
         * 获取所有上传成功的文件返回数据
         * */
        getResults: function () {
            var results = [];
            this.rows.each(function (row) {
                row.success && results.push(row.result);
            });
            return results
        },

        /**
         * 清空文件列表
         * */
        clear: function () {
            this.onEmptyAllFiles();
        },

        /**
         * 设置上传参数
         * */
        setParams: function (params) {
            this.params = params || {};
            this.webUploader.option('formData', this.params);
        },

        destroy: function () {
            this.webUploader.destroy();
            this.chooseFileBtn.destroy();
            this.startUploadBtn.destroy();
            this.emptyAllFileBtn.destroy();
            MultiUploadPanel.superclass.destroy.apply(this);
        }

    });

    return MultiUploadPanel
});

