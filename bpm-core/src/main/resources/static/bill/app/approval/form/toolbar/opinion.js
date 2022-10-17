define(function (require, exports, module) {

    var Hamster = require('lib/index');

    /**
     * 审批意见填写面板类
     * */
    var ApprovalOpinionPanel = Class.create({
        extend: Component,
        _init: function () {
            ApprovalOpinionPanel.superclass._init.apply(this);
            this._textarea = new Hamster.ui.FormTextArea({
                appendToEl: this.el.target,
                height: 190
            });
        },

        setPlaceholder: function (placeholder) {
            this.placeholder = placeholder;
            this._textarea.setPlaceholder(placeholder);
        },

        setOpionionValue: function (content) {
            this._textarea.setValue(content);
        },
        getOpinionValue: function () {
            return this._textarea.getValue()
        },
        getEmployeeValue: function () {
            if (Hamster.isEmpty(this._employeeTrigger.getValue())) {
                return '';
            }
            return this._employeeTrigger.getValue()[0].id;
        },

        getTargetTaskId: function () {
            if (Hamster.isEmpty(this._taskSelect.getValue())) {
                return '';
            }
            return this._taskSelect.getValue();
        },

        reset: function () {
            this._textarea.setValue("")
        }

    });

    /**
     * 审批意见相关处理
     * */
    var ApprovalOpinionOperation = Class.create({

        _getDialogBtnItems: function () {
            var confirmBtnItem = {
                name: 'confirm',
                icon: 'ui-icon-check',
                title: "确定",
                handler: this.onConfirmBtnClick.bind(this)
            };
            var cancelBtnItem = {
                name: 'cancel',
                icon: 'ui-icon-close',
                title: "取消",
                handler: this.onCancelBtnClick.bind(this)
            };
            return [cancelBtnItem, confirmBtnItem]
        },

        createOpinionDialog: function () {
            this._dialog = new Hamster.ui.Dialog({
                width: 450,
                height: 385,
                contentPadding: 20,
                autoClose: true,
                btnItems: this._getDialogBtnItems(),
                contentComp: ApprovalOpinionPanel
            });
            this._dialog.on('close', this.onDialogClosed.bind(this));
            this._dialog.on('open', this.onDialogOpend.bind(this))
        },
        showDialog: function (config) {
            this.config = config;
            var manualFlag = 0;
            var nodeName = '';
            if (config.result) {
                manualFlag = config.result.manualFlag;
                nodeName = config.result.nodeName;
            }
            this.employeeFlag = manualFlag;
            this.returnFlag = config.returnFlag;
            if (!this._dialog) {
                this.createOpinionDialog();
            }
            this.placeholder = config.placeholder;
            this.content = config.content;
            this.emptyTip = config.emptyTip;
            this._success_callback = config.success;
            this._dialog.setTitle(config.title);
            if (!Hamster.isEmpty(nodeName)) {
                this._dialog.setTitle(config.title + '-下一节点名称:' + nodeName);
            }

            this._dialog.open();
        },

        onDialogClosed: function () {
            this._success_callback = null;
            this._dialog.getContentWidget().reset();
            if (this._employeeTrigger) {
                this._employeeTrigger.destroy();
            }
        },
        appendEmployeeTrigger: function () {
            var ttt = this._dialog.getContentComp();
            ttt._employeeTrigger = new Hamster.ui.TriggerSelect({
                appendToEl: ttt.el.target,
                placeholder: this.config.employeeTriggerPlaceholder || '请选择下一个审批人',
                valueField: 'id',
                displayField: 'username',
                selectDialogTitle: this.config.employeeDialogTitle || "请选择操作人员",
                execBlockName: 'employee-single-choose-panel',
                execBlockOptions: {}
            });
        },
        nodeSelectChanage: function (val) {
            var ttt = this._dialog.getContentComp();
            var data = ttt._taskSelect.getData();
            if (this._taskMap == undefined) {
                this._taskMap = {};
                for (var prop in data) {
                    var itm = data[prop];
                    this._taskMap[itm.id] = itm.selectApproval
                }
            }
            if (this._taskMap[val]) {
                this.employeeFlag == 1
                this.appendEmployeeTrigger();
            } else {
                this.employeeFlag == 0
            }
        },
        onDialogOpend: function () {
            var ttt = this._dialog.getContentComp();
            if (ttt._employeeTrigger) {
                ttt._employeeTrigger.destroy();
            }
            if (this.employeeFlag == 1) {
                this.appendEmployeeTrigger();
            }
            if (ttt._taskSelect) {
                ttt._taskSelect.destroy();
                this._taskMap = undefined;
            }
            if (this.returnFlag) {
                ttt._taskSelect = new Hamster.ui.ComboBox({
                    appendToEl: ttt.el.target,
                    url: 'bill/list/rest/history/tasks',
                    params: {billId: this.config.billId},
                    async: true,
                    valueField: 'id',
                    displayField: 'nodeName'
                });
                ttt._taskSelect.on('change', this.nodeSelectChanage, this);
            }
            this._dialog.getContentWidget().setPlaceholder(this.placeholder);
            this._dialog.getContentWidget().setOpionionValue(this.content);
        },

        onConfirmBtnClick: function () {
            var opinionValue = this._dialog.getContentComp().getOpinionValue();

            if (Hamster.isEmpty(opinionValue)) {
                layer.alert(this.emptyTip);
                return;
            }
            var employeeValue = 0;
            if (this.employeeFlag == 1) {
                employeeValue = this._dialog.getContentComp().getEmployeeValue();
                if (Hamster.isEmpty(employeeValue)) {
                    layer.alert(this.config.employeeEmptyTip || "请选择下个审批人");
                    return;
                }
            }
            var targetTaskId;
            if (this.returnFlag) {
                targetTaskId = this._dialog.getContentComp().getTargetTaskId();
                if (Hamster.isEmpty(targetTaskId)) {
                    layer.alert("请选择退回节点");
                    return;
                }
            }
            Hamster.Function.call(this._success_callback, this, [opinionValue, employeeValue, targetTaskId]);
            this._dialog.close();

        },

        onCancelBtnClick: function () {
            this._dialog.close();
        },

        destroyDialog: function () {
            if (this._dialog) {
                this._dialog.close();
                this._dialog.destroy();
                this._dialog = null;
            }
        }

    });

    return new ApprovalOpinionOperation();
});