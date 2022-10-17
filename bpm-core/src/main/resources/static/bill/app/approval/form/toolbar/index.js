define(function (require, exports, module) {

    var Hamster = require('lib/index');
    var approvalOpinionOperation = require('./opinion');
    var ApprovalTrackDialog = require('./track-dialog');
    var ReimbursingImportDialog = require('./reimbursing-import-detail-dialog');
    require('app/approval/form/ext');
    var employeeDi = {
        _getContentElement: function () {
            var HTMLS = [];
            HTMLS.push('<div class="fill">');
            HTMLS.push('    <div class="search-box clearfix p-l-xs p-r-xs component-el" id="search_bar">');
            HTMLS.push('        <div class="search-item">');
            HTMLS.push('            <label>人员名称</label>');
            HTMLS.push('            <div class="search-item-content none-border component-el" id="search_username_input"></div>');
            HTMLS.push('        </div>');
            HTMLS.push('        <div class="search-item">');
            HTMLS.push('            <label>所在部门</label>');
            HTMLS.push('            <div class="search-item-content none-border component-el" id="search_org_tree"></div>');
            HTMLS.push('        </div>');
            HTMLS.push('        <div class="search-item">');
            HTMLS.push('            <label>岗位</label>');
            HTMLS.push('            <div class="search-item-content none-border component-el" id="search_position_tree"></div>');
            HTMLS.push('        </div>');
            HTMLS.push('        <div class="search-action-item component-el" id="search_submit_btn"></div>');
            HTMLS.push('    </div>');
            HTMLS.push('    <div class="p-xs"><div class="component-el" id="data_table_wrapper"></div></div>');
            HTMLS.push('</div>');
            return $(HTMLS.join(''))
        },
        _init: function () {
            this.initSearchBar();
            this.initDataTable();
        },
        initSearchBar: function () {
            this.usernameInput = new Hamster.ui.FormInput({
                appendToEl: $("#search_username_input")
            });
            this.organizationId = new Hamster.ui.TriggerSelect({
                placeholder: "请选择所属部门部门",
                valueField: 'id',
                displayField: 'name',
                required: true,
                execBlockName: 'organization-choose-panel',
                execBlockOptions: {},
                appendToEl: $("#search_org_tree")
            });
            this.positionIdSel = new Hamster.ui.TriggerSelect({
                placeholder: "请选择职位",
                valueField: 'id',
                displayField: 'name',
                required: true,
                execBlockName: 'position-choose-panel',
                execBlockOptions: {},
                appendToEl: $("#search_position_tree")
            });
            this.searchBtn = new Hamster.ui.Button({
                appendToEl: $("#search_submit_btn"),
                title: "搜索",
                handler: this.search.bind(this)
            });
        },

        initDataTable: function () {
            this._serverDataTable = new Hamster.ui.ServerDataTable({
                appendToEl: $("#data_table_wrapper"),
                border: true,
                url: 'user/center/datagrids',
                extClsList: ['ui-data-grid-border-t'],
                paging: true,
                pageSize: 10,
                multiSelect: true,
                hasIndex: false,
                columns: [
                    {
                        width: '40px',
                        orderable: false,
                        render: function (row, type, set, meta) {
                            return meta.settings._iDisplayStart + meta.row + 1;
                        },
                        className: 'text-center dt_index',
                        title: '序号'
                    },
                    {
                        data: 'username',
                        width: 100,
                        title: '姓名'
                    },
                    {
                        data: 'orgName',
                        width: 200,
                        title: '所在部门'
                    },
                    {
                        data: 'position',
                        width: 200,
                        title: '岗位'
                    }
                ],
                tableAutoWidth: true,
                height: 500,
                width: 600,
                originalDataTableOptions: {
                    ordering: true,
                    order: [[2, 'asc']]
                }
            });
        },

        search: function () {
            var orgId = 0;
            if (!Hamster.isEmpty(this.organizationId.getValue())) {
                orgId = this.organizationId.getValue()[0].id;
            }
            var positionId = 0;
            if (!Hamster.isEmpty(this.positionIdSel.getValue())) {
                positionId = this.positionIdSel.getValue()[0].id;
            }
            var params = {
                username: this.usernameInput.getValue(),
                orgId: orgId,
                positionId: positionId
            };
            this._serverDataTable.setParams(params);
            this._serverDataTable.reload();
        },

        getSelected: function () {
            return this._serverDataTable.getSelected();
        }
    }

    /**
     * 审批表单操作工具栏
     * */
    var ApprovalFormToolbar = Class.create({

        statics: {
            _action_button_options_map: {},
            registerActionButton: function (name, title, icon, handler, destroy) {
                var _name = Hamster.isObject(name) ? name.name : name;
                this._action_button_options_map[_name] = Hamster.isObject(name) ? Hamster.clone(name) : {
                    name: name,
                    title: title,
                    icon: icon,
                    handler: handler,
                    destroy: destroy
                };
            },
            getActionButtonConfig: function (name) {
                return this._action_button_options_map[name]
            }
        },

        extend: Component,

        baseCls: 'approval-form-action-toolbar',

        approvalForm: null,

        actions: [],

        _beforeInit: function () {
            ApprovalFormToolbar.superclass._beforeInit.apply(this);
            this._action_button_map = {};
            this._action_button_config_map = {};
        },

        _init: function () {
            ApprovalFormToolbar.superclass._init.apply(this);
            this.setActions(this.actions);
        },

        _initActionButtons: function () {
            Hamster.Array.forEach(this.actions, function (name) {
                var buttonConfig = ApprovalFormToolbar.getActionButtonConfig(name);
                var buttonOptions = {
                    appendToEl: this.el.target,
                    title: buttonConfig.title,
                    icon: buttonConfig.icon,
                    style: buttonConfig.style,
                    handler: this._onActionButtonClick.bind(this)
                };
                var button = new Hamster.ui.Button(buttonOptions);
                button.__name = name;

                this._action_button_map[buttonConfig.name] = button;
                this._action_button_config_map[buttonConfig.name] = buttonConfig;
            }, this);
        },
        _validationBill: function (params, dataHttpAjax) {
            var loader = this.relevance.loader;
            loader.setText('审批提交中,请稍后...');
            loader.start();
            var validationHttpAjax = new HttpAjax({
                url: 'bill/flow/rest/validation',
                type: 'POST',
                params: params
            });
            validationHttpAjax.successHandler(function (result) {
                loader.stop();
                loader.setText('数据加载中...');
                if (result.passedFlag) {
                    loader.setText('审批提交中,请稍后...');
                    loader.start();
                    dataHttpAjax.send();
                } else if (result.allowGoOnFlag) {
                    layer.confirm(result.tipMessage, {btn: ['继续', '取消']}, function () {
                        loader.setText('审批提交中,请稍后...');
                        loader.start();
                        dataHttpAjax.send();
                    });
                } else {
                    layer.confirm(result.tipMessage, {btn: ['确定']});
                }
            });
            validationHttpAjax.failureHandler(function () {
                layer.open({
                    title: '温馨提示',
                    content: '提交审批单失败!',
                    icon: 2
                });
                loader.stop();
                loader.setText('数据加载中...');
            });
            validationHttpAjax.satusCodeHandler(400, function (xhr) {
                var response = JSON.parse(xhr.responseText);
                if (!Hamster.isEmpty(response)) {
                    var message = response.message;
                    if (!Hamster.isEmpty(message)) {
                        layer.open({
                            title: '温馨提示',
                            content: message,
                            icon: 2
                        });
                        loader.stop();
                        loader.setText('数据加载中...');
                        return;
                    }
                }

                layer.open({
                    title: '温馨提示',
                    content: '提交审批单失败!',
                    icon: 2
                });
                loader.stop();
                loader.setText('数据加载中...');
            });
            validationHttpAjax.send();
        },
        _onActionButtonClick: function (button) {
            var name = button.__name;
            var config = this._action_button_config_map[name];
            var handler = config.handler;

            if (!Hamster.isFunction(handler)) {
                return
            }
            handler.apply(this, [button, this]);
        },

        setActions: function (actions) {
            this.actions = actions;
            this.actions.push("btn-close");
            Hamster.Object.each(this._action_button_map, function (name, button) {
                var config = this._action_button_config_map[name];
                Hamster.isFunction(config.destroy) && config.destroy();
                button.destroy();
            }, this);
            this._action_button_map = {};
            this._action_button_config_map = {};
            this._initActionButtons();
        },

        getFormData: function () {
            return this.approvalForm.getFormData()
        },

        getEditableFormData: function () {
            return this.approvalForm.getEditableFormData()
        },

        destroy: function () {
            Hamster.Object.each(this._action_button_map, function (name, button) {
                button && button.destroy();
            });
            ApprovalFormToolbar.superclass.destroy.apply(this, arguments);
        },

        validationManual: function(url, manualParamData, loader, call, params) {
            var self = this;
            var manualHttpAjax = new HttpAjax({
                url: url,
                type: 'POST',
                params: manualParamData
            });
            manualHttpAjax.successHandler(function (result) {
                var manualFlag = result.manualFlag;
                var nodeName = result.nodeName;
                loader.stop();
                if (manualFlag == 1) {
                    self._employeeSelectDialog = new Hamster.ui.Dialog({
                        title: "请选择审批人-下一节点名称:" + nodeName,
                        width: 1000,
                        contentPadding: 20,
                        height: 710,
                        contentHtml: employeeDi._getContentElement(),
                        btnItems: [{
                            name: 'close', title: '关闭', handler: function () {
                                self._employeeSelectDialog.close();
                            }
                        }, {
                            name: 'confirm', title: '确定', handler: function () {
                                if (Hamster.isEmpty(employeeDi.getSelected())) {
                                    layer.alert("请选择下个审批人");
                                    return;
                                }
                                var nextAppr = employeeDi.getSelected();
                                var userIds = [];
                                $.each(nextAppr,function (idx,itm){
                                    userIds.push(itm.id);
                                })
                                params.nextApprover = userIds.join(",");
                                self._employeeSelectDialog.close();
                                loader.setText('审批提交中,请稍后...');
                                loader.start();
                                call(params);
                            }
                        }]
                    });
                    self._employeeSelectDialog.on('open', function () {
                        employeeDi._init();
                    });
                    self._employeeSelectDialog.on('close', function () {
                        self._employeeSelectDialog.destroy();
                        self._employeeSelectDialog = null;
                    });
                    self._employeeSelectDialog.open();
                } else {
                    loader.setText('审批提交中,请稍后...');
                    loader.start();
                    call(params);
                }
            });
            this._validationBill(params,manualHttpAjax);
        }
    });
    /**
     * 关闭窗口按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-close', '关闭窗口', 'ui-icon-close', function () {
        var layerIdx = layer.confirm('是否确定关闭当前窗口?', {
            title: '警告',
            icon: 3,
            closeBtn: false,
            btn: ['确定', '取消'] //按钮
        }, () => {
            // window.close();
            //跨域处理关闭窗口 todo
            closeWindow();
        }, () => {
            layer.close(layerIdx);
        });
    });
    /**
     * 提交操作按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-submit', '提交', 'ui-icon-save', function (button, toolbar) {
        var self = this;
        if (!toolbar.trigger('validate-form')) {
            layer.open({
                title: '温馨提示',
                content: '申请单有字段未填写，请检查!',
                icon: 0
            });
            return
        }
        var loader = this.relevance.loader;
        var submitFunc = function (params) {
            var dataHttpAjax = new HttpAjax({
                url: 'bill/flow/rest/submit',
                type: 'POST',
                params: params
            });
            dataHttpAjax.successHandler(function (result) {
                loader.stop();
                loader.setText('数据加载中...');
                layer.open({
                    title: '温馨提示',
                    content: '审批提交成功！',
                    icon: 1
                });
                toolbar.fireEvent('approval-submit', result);
            });
            dataHttpAjax.failureHandler(function () {
                layer.open({
                    title: '温馨提示',
                    content: '提交审批单失败!',
                    icon: 2
                });
                loader.stop();
                loader.setText('数据加载中...');
            });
            dataHttpAjax.satusCodeHandler(400, function (xhr) {
                var response = JSON.parse(xhr.responseText);
                if (!Hamster.isEmpty(response)) {
                    var message = response.msg;
                    if (!Hamster.isEmpty(message)) {
                        layer.open({
                            title: '温馨提示',
                            content: message,
                            icon: 2
                        });
                        loader.stop();
                        loader.setText('数据加载中...');
                        return;
                    }
                }

                layer.open({
                    title: '温馨提示',
                    content: '提交审批单失败!',
                    icon: 2
                });
                loader.stop();
                loader.setText('数据加载中...');
            });
            dataHttpAjax.send();
        };
        var formData = toolbar.getFormData();
        var params = {
            processId: toolbar.relevance.processId,
            title: toolbar.relevance.billTitle,
            code: toolbar.relevance.billCode,
            formData: JSON.stringify(formData)
        };

        if (!Hamster.isEmpty(toolbar.relevance.billId) && toolbar.relevance.billId != 0) {
            params.billId = toolbar.relevance.billId
        }
        var manualParamData = {
            processId: toolbar.relevance.processId,
            formData: JSON.stringify(toolbar.getFormData())
        };
        var url = 'bill/flow/rest/manual/flag/submit';
        self.validationManual(url, manualParamData, loader, submitFunc, params);
    });

    /**
     * 保存操作按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-save', '保存', 'ui-icon-cloud-upload-o', function (button, toolbar) {
        if (!toolbar.trigger('validate-form')) {
            layer.open({
                title: '温馨提示',
                content: '申请单有字段未填写，请检查!',
                icon: 0
            });
            return
        }

        var loader = this.relevance.loader;
        loader.setText('审批单保存中,请稍后...');
        loader.start();
        var formData = toolbar.getFormData();

        var params = {
            processId: toolbar.relevance.processId,
            title: toolbar.relevance.billTitle,
            code: toolbar.relevance.billCode,
            formData: JSON.stringify(formData)
        };
        if (!Hamster.isEmpty(toolbar.relevance.billId)) {
            params.id = toolbar.relevance.billId
        }

        var dataHttpAjax = new HttpAjax({
            url: 'bill/flow/rest/drafts',
            type: 'POST',
            params: params
        });

        dataHttpAjax.successHandler(function (result) {
            toolbar.relevance.billId = result.id;
            layer.open({
                title: '温馨提示',
                content: '保存审批单成功!',
                icon: 1
            });
            loader.stop();
            loader.setText('数据加载中...');
            toolbar.fireEvent('approval-save', result);
        });
        dataHttpAjax.failureHandler(function () {
            layer.open({
                title: '温馨提示',
                content: '保存失败!',
                icon: 2
            });
            loader.stop();
            loader.setText('数据加载中...');
        });
        dataHttpAjax.send();
    });

    /**
     * 审批通过操作按钮
     * */
    ApprovalFormToolbar.registerActionButton({
        name: 'btn-agree',
        title: '审批通过',
        icon: 'ui-icon-save',
        style: 'success',
        handler: function (button, toolbar) {

            var self = this;
            var manualParamData = {
                billId: toolbar.relevance.billId,
                taskId: toolbar.relevance.taskId,
                formData: JSON.stringify(toolbar.getEditableFormData())
            };
            var manualHttpAjax = new HttpAjax({
                url: 'bill/flow/rest/manual/flag',
                type: 'POST',
                params: manualParamData
            });
            manualHttpAjax.successHandler(function (result) {
                var callback = function (opinionValue, employeeId) {
                    var loader = self.relevance.loader;
                    loader.setText('审批提交中,请稍后...');
                    loader.start();
                    var paramData = {
                        billId: toolbar.relevance.billId,
                        taskId: toolbar.relevance.taskId,
                        content: opinionValue,
                        nextApprover: employeeId,
                        formData: JSON.stringify(toolbar.getEditableFormData())
                    };
                    var dataHttpAjax = new HttpAjax({
                        url: 'bill/flow/rest/agree',
                        type: 'POST',
                        params: paramData
                    });
                    dataHttpAjax.successHandler(function (result) {
                        layer.open({
                            title: '温馨提示',
                            content: '审批成功!',
                            icon: 1
                        });
                        loader.stop();
                        loader.setText('数据加载中...');
                        toolbar.fireEvent('approval-agreed', result);
                    });
                    dataHttpAjax.satusCodeHandler(400, function (xhr) {
                        var result = JSON.parse(xhr.responseText);
                        var message = '审批失败';
                        if (!Hamster.isEmpty(result.msg)) {
                            message = result.msg;
                        }
                        layer.open({
                            title: '温馨提示',
                            content: message,
                            icon: 2
                        });
                        loader.stop();
                        loader.setText('数据加载中...');
                    });
                    dataHttpAjax.failureHandler(function () {
                        layer.open({
                            title: '温馨提示',
                            content: '审批失败!',
                            icon: 2
                        });
                        loader.stop();
                        loader.setText('数据加载中...');
                    });
                    dataHttpAjax.send();
                };
                var config = {
                    placeholder: "请输入审批意见",
                    content: "同意",
                    emptyTip: "审批意见不能为空",
                    success: callback,
                    title: "审批意见",
                    result: result
                };
                approvalOpinionOperation.showDialog(config)
            });
            manualHttpAjax.send();
        },
        destroy: function () {
            approvalOpinionOperation.destroyDialog();
        }
    });

    /**
     * 审批拒绝操作按钮
     * */
    ApprovalFormToolbar.registerActionButton({
        name: 'btn-refuse',
        title: '审批拒绝',
        icon: 'ui-icon-close',
        style: 'danger',
        handler: function (button, toolbar) {
            var self = this;
            var callback = function (opinionValue) {
                var loader = self.relevance.loader;
                loader.setText('审批提交中,请稍后...');
                loader.start();

                var dataHttpAjax = new HttpAjax({
                    url: 'bill/flow/rest/refuse',
                    type: 'POST',
                    params: {
                        billId: toolbar.relevance.billId,
                        taskId: toolbar.relevance.taskId,
                        content: opinionValue,
                        formData: JSON.stringify(toolbar.getEditableFormData())
                    }
                });
                dataHttpAjax.successHandler(function (result) {
                    layer.open({
                        title: '温馨提示',
                        content: '审批拒绝成功!',
                        icon: 1
                    });
                    loader.stop();
                    loader.setText('数据加载中...');
                    toolbar.fireEvent('approval-refused', result);
                });
                dataHttpAjax.satusCodeHandler(400, function (xhr) {
                    var result = JSON.parse(xhr.responseText);
                    var message = '审批失败';
                    if (!Hamster.isEmpty(result.msg)) {
                        message = result.msg;
                    }
                    layer.open({
                        title: '温馨提示',
                        content: message,
                        icon: 2
                    });
                    loader.stop();
                    loader.setText('数据加载中...');
                });
                dataHttpAjax.failureHandler(function () {
                    loader.stop();
                    loader.setText('数据加载中...');
                    layer.open({
                        title: '温馨提示',
                        content: '审批拒绝失败!',
                        icon: 2
                    });
                });
                dataHttpAjax.send();
            };
            var config = {
                placeholder: "请输入拒绝原因",
                content: "不同意。",
                emptyTip: "拒绝原因不能为空",
                success: callback,
                title: "拒绝原因",
                result: {}
            };
            approvalOpinionOperation.showDialog(config)
        },
        destroy: function () {
            approvalOpinionOperation.destroyDialog();
        }
    });

    /**
     * 退回操作按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-back', '退回', 'ui-icon-save', function (button, toolbar) {
        var self = this;
        var callback = function (opinionValue,employeeId,targetTaskId) {
            var loader = self.relevance.loader;
            loader.setText('审批提交中,请稍后...');
            loader.start();
            var dataHttpAjax = new HttpAjax({
                url: 'bill/flow/rest/repulse',
                type: 'POST',
                params: {
                    billId: toolbar.relevance.billId,
                    taskId: toolbar.relevance.taskId,
                    content: opinionValue,
                    targetTaskId: targetTaskId,
                    nextApprover: employeeId,
                    formData: JSON.stringify(toolbar.getEditableFormData())
                }
            });
            dataHttpAjax.successHandler(function (result) {
                layer.open({
                    title: '温馨提示',
                    content: '审批退回成功!',
                    icon: 1
                });
                loader.stop();
                loader.setText('数据加载中...');
                toolbar.fireEvent('approval-refused', result);
            });
            dataHttpAjax.failureHandler(function () {
                loader.stop();
                loader.setText('数据加载中...');
                layer.open({
                    title: '温馨提示',
                    content: '撤回失败!',
                    icon: 2
                });
            });
            dataHttpAjax.send();
        };
        var config = {
            placeholder: "请输入退回原因",
            content: "",
            emptyTip: "退回原因不能为空",
            success: callback,
            title: "退回原因",
            result: {},
            billId:toolbar.relevance.billId,
            returnFlag:1
        };
        approvalOpinionOperation.showDialog(config);
    }, function () {
        approvalOpinionOperation.destroyDialog();
    });

    /**
     * 撤销操作按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-cancel', '撤销', 'ui-icon-rollback', function (button, toolbar) {
        var self = this;
        var callback = function (opinionValue) {
            var loader = self.relevance.loader;
            loader.setText('审批提交中,请稍后...');
            loader.start();
            var dataHttpAjax = new HttpAjax({
                url: 'bill/flow/rest/cancel',
                type: 'POST',
                params: {
                    billId: toolbar.relevance.billId,
                    taskId: toolbar.relevance.taskId,
                    content: opinionValue
                }
            });
            dataHttpAjax.successHandler(function (result) {
                layer.open({
                    title: '温馨提示',
                    content: '撤销申请成功!',
                    icon: 1
                });
                loader.stop();
                loader.setText('数据加载中...');
                toolbar.fireEvent('approval-undo', result);
            });
            dataHttpAjax.failureHandler(function () {
                layer.open({
                    title: '温馨提示',
                    content: '撤销失败!',
                    icon: 2
                });
                loader.stop();
                loader.setText('数据加载中...');
            });
            dataHttpAjax.send();
        };
        var config = {
            placeholder: "请输入撤销原因",
            content: "",
            emptyTip: "撤销原因不能为空",
            success: callback,
            title: "撤销原因",
            result: {}
        };
        approvalOpinionOperation.showDialog(config);
    }, function () {
        approvalOpinionOperation.destroyDialog();
    });

    /**
     * 归档操作按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-archived', '归档', 'ui-icon-inbox', function (button, toolbar) {
        var self = this;
        layer.confirm('您确定要进行归档么', {icon: 3, title: '温馨提示'}, function (index) {
            var loader = self.relevance.loader;
            loader.setText('归档中,请稍后...');
            loader.start();
            var dataHttpAjax = new HttpAjax({
                url: 'bill/flow/rest/archived',
                type: 'POST',
                params: {
                    billId: toolbar.relevance.billId,
                    taskId: toolbar.relevance.taskId,
                    formData: JSON.stringify(toolbar.getEditableFormData())
                }
            });
            dataHttpAjax.successHandler(function (result) {
                loader.stop();
                loader.setText('数据加载中...');
                layer.open({
                    title: '温馨提示',
                    content: '归档成功!',
                    icon: 1
                });
                toolbar.fireEvent('approval-archived', result);
            });
            dataHttpAjax.failureHandler(function () {
                loader.stop();
                loader.setText('数据加载中...');
                layer.open({
                    title: '温馨提示',
                    content: '归档失败!',
                    icon: 2
                });
            });
            dataHttpAjax.send();

            layer.close(index);
        });
    });

    /**
     * 确认操作按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-present', '确认', 'ui-icon-save', function (button, toolbar) {
        var self = this;
        layer.confirm('您确定要确认该审批单么', {icon: 3, title: '温馨提示'}, function (index) {
            var loader = self.relevance.loader;
            loader.setText('处理中,请稍后...');
            loader.start();
            var dataHttpAjax = new HttpAjax({
                url: 'bill/flow/rest/present',
                type: 'POST',
                params: {
                    billId: toolbar.relevance.billId,
                    taskId: toolbar.relevance.taskId,
                    formData: JSON.stringify(toolbar.getEditableFormData())
                }
            });
            dataHttpAjax.successHandler(function (result) {
                layer.open({
                    title: '温馨提示',
                    content: '确认成功!',
                    icon: 1
                });
                loader.stop();
                loader.setText('数据加载中...');
                toolbar.fireEvent('approval-present', result);
            });
            dataHttpAjax.failureHandler(function () {
                layer.open({
                    title: '温馨提示',
                    content: '确认失败!',
                    icon: 2
                });
                loader.stop();
                loader.setText('数据加载中...');
            });
            dataHttpAjax.send();

            layer.close(index);
        });
    });

    /**
     * 删除操作按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-deleted', '删除', 'ui-icon-delete', function (button, toolbar) {
        var dataHttpAjax = new HttpAjax({
            url: 'api/bill/flow/delete',
            type: 'POST',
            params: {
                billId: toolbar.relevance.billId
            }
        });
        dataHttpAjax.successHandler(function (result) {
            Hamster.ui.Message.success('删除成功');
        });
        dataHttpAjax.failureHandler(function () {
            Hamster.ui.Message.error('删除失败!');
        });
        dataHttpAjax.send();
    });

    /**
     * 移交操作按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-transfer', '移交', 'ui-icon-save', function (button, toolbar) {
        console.log(button, toolbar);
        var self = this;
        var call = function (turnUser) {
            var turnHttpAjax = new HttpAjax({
                url: 'bill/flow/rest/turn',
                type: 'POST',
                params: {
                    billId: toolbar.relevance.billId,
                    taskId: toolbar.relevance.taskId,
                    turnUser: turnUser
                }
            });
            turnHttpAjax.successHandler(function (result) {
                self._employeeSelectDialog.close();
            });
            turnHttpAjax.send();
        }
        self._employeeSelectDialog = new Hamster.ui.Dialog({
            title: "请选择移交的审批人:",
            width: 1000,
            contentPadding: 20,
            height: 710,
            contentHtml: employeeDi._getContentElement(),
            btnItems: [{
                name: 'close', title: '关闭', handler: function () {
                    self._employeeSelectDialog.close();
                }
            }, {
                name: 'confirm', title: '确定', handler: function () {
                    if (Hamster.isEmpty(employeeDi.getSelected())) {
                        layer.alert("请选择移交的审批人");
                        return;
                    }
                    var nextAppr = employeeDi.getSelected();
                    var userIds = [];
                    $.each(nextAppr,function (idx,itm){
                        userIds.push(itm.id);
                    })
                    call(userIds);
                }
            }]
        });
        self._employeeSelectDialog.on('open', function () {
            employeeDi._init();
        });
        self._employeeSelectDialog.on('close', function () {
            self._employeeSelectDialog.destroy();
            self._employeeSelectDialog = null;
        });
        self._employeeSelectDialog.open();
    });

    /**
     * 结束流程操作按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-end', '结束流程', 'ui-icon-save', function (button, toolbar) {
        console.log(button, toolbar);
    });

    /**
     * 加签操作按钮
     * */
    ApprovalFormToolbar.registerActionButton({
        name: 'btn-endorse',
        title: '加签',
        icon: 'ui-icon-save',
        handler: function (button, toolbar) {
            var self = this;

            var callback = function (opinionValue, employeeId) {
                var loader = self.relevance.loader;
                loader.setText('审批提交中,请稍后...');
                loader.start();
                var paramData = {
                    billId: toolbar.relevance.billId,
                    taskId: toolbar.relevance.taskId,
                    content: opinionValue,
                    nextApprover: employeeId,
                    formData: JSON.stringify(toolbar.getEditableFormData())
                };
                var dataHttpAjax = new HttpAjax({
                    url: 'bill/flow/rest/endorse',
                    type: 'POST',
                    params: paramData
                });
                dataHttpAjax.successHandler(function (result) {
                    layer.open({
                        title: '温馨提示',
                        content: '审批成功!',
                        icon: 1
                    });
                    loader.stop();
                    loader.setText('数据加载中...');
                    toolbar.fireEvent('approval-agreed', result);
                });
                dataHttpAjax.satusCodeHandler(400, function (xhr) {
                    var result = JSON.parse(xhr.responseText);
                    var message = '审批失败';
                    if (!Hamster.isEmpty(result.msg)) {
                        message = result.msg;
                    }
                    layer.open({
                        title: '温馨提示',
                        content: message,
                        icon: 2
                    });
                    loader.stop();
                    loader.setText('数据加载中...');
                });
                dataHttpAjax.failureHandler(function () {
                    layer.open({
                        title: '温馨提示',
                        content: '审批失败!',
                        icon: 2
                    });
                    loader.stop();
                    loader.setText('数据加载中...');
                });
                dataHttpAjax.send();
            }
            var config = {
                placeholder: "加签原因",
                content: "需要加签",
                emptyTip: "请输入加签原因",
                success: callback,
                title: "加签原因",
                employeeTriggerPlaceholder: "请选择加签审批人",
                employeeDialogTitle: "加签审批人选择",
                employeeEmptyTip: "加签审批人不能为空",
                result: {manualFlag: 1}
            };
            approvalOpinionOperation.showDialog(config)
        },
        destroy: function () {
            approvalOpinionOperation.destroyDialog();
        }
    });

    /**
     * 挂起操作按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-hang', '挂起', 'ui-icon-save', function (button, toolbar) {
        console.log(button, toolbar);
    });

    /**
     * 跳转操作按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-jump', '跳转', 'ui-icon-save', function (button, toolbar) {
        console.log(button, toolbar);
    });

    /**
     * 撤回操作按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-recall', '撤回', 'ui-icon-rollback', function (button, toolbar) {
        console.log(button, toolbar);
    });

    /**
     * 轨迹操作按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-track', '轨迹', 'ui-icon-fork', function (button, toolbar) {
        var trackDialog = new ApprovalTrackDialog({
            billId: toolbar.relevance.billId,
            processId: toolbar.relevance.processId
        });
        trackDialog.on('success', function (data) {

        });
        trackDialog.on('close', function () {
            trackDialog.destroy();
            trackDialog = null;
        });
        trackDialog.open();
    });
    // ApprovalFormToolbar.registerActionButton('btn-print', '打印', 'ui-icon-printer', function
    // (button, toolbar) { window.open(g.ctx + "bill/flow/rest/print?billId=" +
    // toolbar.relevance.billId); }); todo 下载

    ApprovalFormToolbar.registerActionButton('btn-print', '打印', 'ui-icon-printer', function (button, toolbar) {

        // window.open(g.ctx + "bill/flow/rest/print?billId=" + toolbar.relevance.billId);

        var manualHttpAjax = new HttpAjax({
            url: 'bill/flow/rest/print?billId=' + toolbar.relevance.billId,
            type: 'GET'
        });
        manualHttpAjax.successHandler(function (result) {
            var printWin=window.open("打印窗口", "_blank");
            printWin.document.write(result);
            printWin.document.close();
            printWin.print();
            printWin.close();
        });
        manualHttpAjax.send();
    });

    /**
     * 记账导入按钮
     * */
    ApprovalFormToolbar.registerActionButton('btn-gender-tally-time', '记账导入', 'ui-icon-rollback', function (button, toolbar) {
        var importDialog = new ReimbursingImportDialog({
            processId: toolbar.relevance.processId
        });
        importDialog.on('success', function (data) {
            Hamster.ui.Message.success('导入记账成功!');
            toolbar.fireEvent('reimbursing-import-detail-data', data);
        });
        importDialog.on('close', function () {
            importDialog.destroy();
            importDialog = null;
        });
        importDialog.open();
    });

    return ApprovalFormToolbar;

});