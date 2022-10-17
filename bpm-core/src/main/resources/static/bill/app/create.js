define(function (require, exports, module) {
    var Hamster = require('../lib/index');
    var BasePage = require('./page');
    var pageHtml = require('text!view/approval/edit.hbs');
    var ApprovalForm = require('./approval/form/index');
    var ApprovalFormToolbar = require('./approval/form/toolbar/index');
    var ApprovalEditPage = Class.create({
        extend: BasePage,
        _getContentElement: function () {
            return $(pageHtml)
        },

        _beforeInit: function () {
            BasePage.setContainer($('.bd-mian-lr-bd'));
            ApprovalEditPage.superclass._beforeInit.apply(this);
            this.formMode = g.mode;
            this.processId = g.processId;
            this.billId = g.billId;
            this.billTitle = '';
        },

        _init: function () {
            ApprovalEditPage.superclass._init.apply(this);
            this.el.form_title = this.el.target.find('h3.approval-form-title');
            this.el.approval_action_toolbar = this.el.target.find('.approval-form-action-toolbar');
            this.el.approval_form_wrapper = this.el.target.find('#formWrapper');
            this.el.approval_form_opinion = this.el.target.find('.approval-form-opinion');
            this.el.approval_form_opinion_tbody = this.el.approval_form_opinion.find('.approval-content');

            this.loader = new Hamster.ui.Loader({
                container: this.el.target
            });
            this.initActionToolbar();
            this.loadData();
        },

        initActionToolbar: function () {
            this.toolbar = new ApprovalFormToolbar({
                targetEl: this.el.approval_action_toolbar,
                actions: []
            });
            this.toolbar.relevance = this;
        },

        initApprovalForm: function () {
            var formData = this._formData;
            this.approvalForm = new ApprovalForm({
                targetEl: this.el.approval_form_wrapper,
                rows: this._form_setting.columnItems,
                layout: this._form_setting.attr.layout,
                permissions: this._permissions,
                data: formData,
                mode: this.formMode,
                billId: this.billId,
                processId: this.processId,
                taskId: this.taskId
            });
            this.toolbar.approvalForm = this.approvalForm;
            // if (this.approveLink) {
            //     $("#formWrapper").hide();
            //     $("#iframeWrapper").html("<iframe width='100%' height='100%' frameborder='0' name='_blank' id='_blank' src='" + g.targetUrl + this.approveLink + "?billId=" + this.billId + "'></iframe>");
            //     $("#iframeWrapper").height(this.approveFormHeight + "px");
            // } else {
                $("#iframeWrapper").hide();
            // }
        },
        createRemark: function (item) {
            var remark = item.userName;
            if (item.targetTaskType == 2) {
                remark = remark + "请求【" + item.targetUserName + "】加签";
            } else if (item.targetTaskType == 3) {
                remark = remark + "转办【" + item.targetUserName + "】";
            } else if (item.targetTaskType == 4) {
                remark = remark + "移交【" + item.targetUserName + "】";
            } else if (item.status == 8) {
                remark = remark + "提交审批单";
            } else if (item.status == 2) {
                remark = remark + "已同意审批单";
            } else if (item.status == 3) {
                remark = remark + "已拒绝审批单";
            } else if (item.status == 12) {
                remark = remark + "已打回审批单";
            } else if (item.status == 6) {
                remark = remark + "已撤回审批单";
            }
            return remark;

        },
        TaskType: function (type, status) {
            if (status == 6) {
                return '撤销';
            } else if (status == 8) {
                return '提交';
            }
            switch (type) {
                case 1:
                    return "审批";
                case 2:
                    return "加签";
                case 3:
                    return "转办";
                case 4:
                    return "移交";
                case 5:
                    return "自动跳转";
            }
        },
        ApprovalTrack: function () {
            if (Hamster.isEmpty(this._track)) {
                return
            }
            this.el.approval_form_opinion.show();
            Hamster.Array.forEach(this._track, function (record) {
                var htmlArray = [];
                var rowHtml = '';
                if (record.status == 1) {
                    htmlArray.push('<div class="approval-items">');
                    htmlArray.push('<span class="approval-items-id hasDot dotActive">');
                    htmlArray.push('<span>{0}</span>');
                    htmlArray.push('</span>');
                    htmlArray.push('<span>');
                    htmlArray.push('<span class="active-bac">{1}</span>');
                    htmlArray.push('</span>');
                    htmlArray.push('<span class="approval-status-text">审批中</span>');
                    htmlArray.push('</div>');
                    var tmpHtml = htmlArray.join("");
                    rowHtml = Hamster.String.format(tmpHtml,
                        record.nodeName,
                        record.userName);
                } else {
                    htmlArray.push('<div class="approval-items">');
                    htmlArray.push('<span class="approval-items-id hasDot">');
                    htmlArray.push('<span>{0}</span>');
                    htmlArray.push('<span class="approval-grey-text">{1}</span>');
                    htmlArray.push('</span>');
                    htmlArray.push('<span>');
                    htmlArray.push('{6}');
                    htmlArray.push('<span>{2}</span>');
                    htmlArray.push('<span class="approval-grey-text">{3}</span>');
                    htmlArray.push('</span>');
                    htmlArray.push('<span class="approval-items-text"> {4}</span>');
                    htmlArray.push('<span class="approval-items-minifont">{5} </span>');
                    htmlArray.push('</div>');
                    var title = '';
                    if (record.status == 6) {
                        title = "撤销";
                    } else if (record.status == 8) {
                        title = "创建";
                    } else {
                        title = record.nodeName;
                    }
                    var tmpHtml = htmlArray.join("");
                    rowHtml = Hamster.String.format(tmpHtml,
                        title,
                        moment(record.dateline * 1000).format('YYYY/MM/DD HH:mm'),
                        record.userName,
                        this.TaskType(record.taskType, record.status),
                        record.opinion,
                        this.createRemark(record),
                        '<img src="' + g.ctx + 'static/assets/image/user.png" class="approval-items-hp">',
                    );
                }
                $(rowHtml).appendTo(this.el.approval_form_opinion_tbody);
            }, this);
        },
        initApprovalOpinionScope: function () {
            if (Hamster.isEmpty(this._opinions)) {
                return
            }
            if (Hamster.isEmpty(this._track)) {
                this.el.approval_form_opinion.show();
                Hamster.Array.forEach(this._opinions, function (record) {
                    var htmlArray = [];
                    htmlArray.push('<div class="approval-items">');
                    htmlArray.push('<span class="approval-items-id hasDot">');
                    htmlArray.push('<span>{0}</span>');
                    htmlArray.push('<span class="approval-grey-text">{1}</span>');
                    htmlArray.push('</span>');
                    htmlArray.push('<span>');
                    htmlArray.push('{6}');
                    htmlArray.push('<span>{2}</span>');
                    htmlArray.push('<span class="approval-grey-text">{3}</span>');
                    htmlArray.push('</span>');
                    htmlArray.push('<span class="approval-items-text"> {4}</span>');
                    htmlArray.push('  <span class="approval-items-minifont">{5} </span>');
                    htmlArray.push(' </div>');
                    var tmpHtml = htmlArray.join("");
                    var rowHtml = Hamster.String.format(tmpHtml,
                        record.title,
                        '',
                        '',
                        '',
                        '',
                        '',
                        '');
                    $(rowHtml).appendTo(this.el.approval_form_opinion_tbody);
                }, this);
            } else {
                this.ApprovalTrack();
            }

        },

        _initEvents: function () {
            this.toolbar.on('validate-form', this.validateForm, this);
            this.toolbar.on('import-detail-data', this.importDetailData, this);
            this.toolbar.on('reimbursing-import-detail-data', this.importDetailData, this);

            this.toolbar.on('approval-submit', this.approvalSubmit, this);
            this.toolbar.on('approval-save', this.approvalSave, this);
            this.toolbar.on('approval-agreed', this.approvalAgreed, this);
            this.toolbar.on('approval-refused', this.approvalRefused, this);
            this.toolbar.on('approval-undo', this.approvalUndo, this);
            // 审批归档和确认
            this.toolbar.on('approval-archived', this.approvalArchived, this);
            this.toolbar.on('approval-present', this.approvalPresent, this);
        },

        /**
         * 获取form的请求数据地址
         * */
        getFormHttpAjaxUrl: function () {
            var sourcePage = this.getPassParam('list');
            var pageParam = '';
            if (!Hamster.isEmpty(sourcePage)) {
                pageParam = '?page=' + sourcePage;
            }
            if (this.formMode === 'create') {
                return 'bill/process/rest/create/' + this.processId;
            } else if (this.formMode === 'edit') {
                return 'bill/process/rest/edit/' + this.billId + pageParam;
            } else if (this.formMode === 'view') {
                return 'bill/process/rest/view/' + this.billId + pageParam;
            }
        },

        loadData: function () {
            this.loader.start();
            var self = this;
            var dataHttpAjax = new HttpAjax({
                url: this.getFormHttpAjaxUrl(),
                type: 'GET',
                data: {}
            });
            dataHttpAjax.successHandler(this.onApprovalDataSuccess.bind(this));
            dataHttpAjax.satusCodeHandler(400, function (xhr) {
                var result = JSON.parse(xhr.responseText);
                var message = '加载表单失败!';
                if (!Hamster.isEmpty(result.msg)) {
                    message = result.msg;
                }
                layer.open({
                    title: '温馨提示',
                    content: message,
                    icon: 2
                });
                self.loader.stop();
            });
            dataHttpAjax.satusCodeHandler(500, function () {
                Hamster.ui.Message.error('加载审批单失败!');
                self.loader.stop();
            });
            dataHttpAjax.send();
        },

        onApprovalDataSuccess: function (result) {
            this._form_setting = JSON.parse(result.form);
            this._formData = result.formData || {};
            this._opinions = result.opinions || [];
            this._track = result.track || [];
            this._permissions = result.permission || [];
            this._action_btns = result.btns || [];
            this.el.form_title.text(result.title + "_详情");
            this.billId = result.billId;
            this.processId = result.processId;
            this.taskId = result.taskId;
            this.billTitle = result.title;
            this.approveLink = result.approveLink;
            this.approveFormHeight = result.approveFormHeight;
            this.toolbar.setActions(this._action_btns);
            this.initApprovalForm();
            this.initApprovalOpinionScope();
            this.loader.stop();
        },

        /**
         * 导入明细
         * */
        importDetailData: function (data) {
            this.approvalForm.importDetailData(data)
        },
        windowClose: function () {
            setTimeout(() => {
                window.close();
            }, 5400);
            var second = 5;
            layer.alert('操作成功!窗口<span id="timeHtml">5</span>秒后自动关闭!', {
                icon: 1,
                closeBtn: false,
                title: '提示',
                btn: ['立即关闭']
            }, function () {
                // window.close();
                closeWindow();
            });
            var idx = setInterval(() => {
                second = second - 1;
                $("#timeHtml").html(second);
                if (second == 0) {
                    clearInterval(idx);
                    closeWindow();
                }
            }, 1000)
        },

        /**
         * 提交操作成功
         * */
        approvalSubmit: function () {
            this.windowClose();
        },

        /**
         * 保存操作成功
         * */
        approvalSave: function () {
            this.windowClose();
        },

        /**
         * 审批同意
         * */
        approvalAgreed: function () {
            this.approvalForm.setFormEdited(false);
            this.windowClose();
        },

        /**
         * 审批归档
         * */
        approvalArchived: function () {
            this.approvalForm.setFormEdited(false);
            this.windowClose();
        },

        /**
         * 审批确认
         * */
        approvalPresent: function () {
            this.approvalForm.setFormEdited(false);
            this.windowClose();
        },

        /**
         * 审批拒绝
         * */
        approvalRefused: function () {
            this.approvalForm.setFormEdited(false);
            this.windowClose();
        },

        /**
         * 撤销
         * */
        approvalUndo: function () {
            this.approvalForm.setFormEdited(false);
            this.windowClose();
        },

        /**
         * 验证表单
         * */
        validateForm: function () {
            return this.approvalForm.validate()
        },

        /**
         * 获取表单数据
         * */
        getFormData: function () {
            return this.approvalForm.getFormData()
        },

        /**
         * 当界面在切换之前处理
         * */
        beforeChangePage: function (title, url, options, breadcrumbs, callback) {
            var self = this;

            if (!this.approvalForm) {
                return true
            }

            if (this.approvalForm.formHasUploading()) {
                layer.confirm('当前表单有文件正在上传,确定要离开当前界面吗？', {
                    icon: 3,
                    title: '温馨提示'
                }, function (index) {
                    layer.close(index);
                    self.approvalForm.setFormEdited(false);
                    self.approvalForm.ignoreFileUploading = true;
                });
                return false
            }

            if (this.approvalForm.formHasEdited()) {
                layer.confirm('当前表单有数据未提交,确定要离开当前界面吗？', {icon: 3, title: '温馨提示'}, function (index) {
                    layer.close(index);
                    self.approvalForm.setFormEdited(false);
                    self.approvalForm.ignoreFileUploading = true;
                });
                return false
            }

            return true
        },

        destroy: function () {
            this.loader && this.loader.destroy();
            this.toolbar.destroy();
            this.approvalForm.destroy();
            ApprovalEditPage.superclass.destroy.apply(this);
        }

    });

    return ApprovalEditPage;
});