define(function (require, exports, module) {
    require('../ext/operation');
    require('../ext/assign-user-box');

    var Class = require('Class');
    var Foundation = require('Foundation');
    var FlowNodeSettingBasePanel = require('./base');
    var constants = require('../../constants');

    var FlowTaskNodeSettingPanel = Class.create({
        statics: {
            completionPermissions: function (setting, formItemWidgets) {
                var permissions = Foundation.clone(setting.permissions || {});

                var widgetNames = [];
                Foundation.Object.each(permissions, function (widgetName) {
                    widgetNames.push(widgetName);
                }, this);

                Foundation.Array.forEach(formItemWidgets || [], function (widget) {
                    var widgetName = widget.getWidgetName();
                    if (Foundation.isEmpty(permissions[widgetName])) {
                        permissions[widgetName] = 0;
                    }
                    widgetNames = Foundation.Array.remove(widgetNames, widgetName);
                }, this);
                Foundation.Array.forEach(widgetNames, function (widgetName) {
                    delete permissions[widgetName]
                }, this);
                setting.permissions = permissions;
                return setting;
            }
        },
        extend: FlowNodeSettingBasePanel,

        _init: function () {
            FlowTaskNodeSettingPanel.superclass._init.apply(this);
            this.approvlShowIds = ["batchTitle",
                "btnTitle",
                "countersignTitle",
                "autoAgreeTitle",
                "noApprovalOperationTitle",
                "autoNextHoursTitle",
                "selectApprovalTitle"];
            var linkType = this.getNodeSettingByName('linkType');
            if (Foundation.isEmpty(linkType)) {
                linkType = 'create';
            }
            if (linkType != "approvl") {
                Foundation.Array.forEach(this.approvlShowIds, function (item, i) {
                    $("#" + item).next().hide();
                    $("#" + item).hide();
                });
            } else {
                Foundation.Array.forEach(this.approvlShowIds, function (item, i) {
                    $("#" + item).next().show();
                    $("#" + item).show();
                });
            }
        },

        _getFormItemsComboData: function () {
            var formItemWidgets = this.options.formItemWidgets;
            this.__ficd = this.__ficd || Foundation.Array.map(formItemWidgets, function (widget, i) {
                return {
                    xtype: widget.xtype,
                    text: widget.getTitle(),
                    value: widget.getWidgetName()
                }
            }, this);
            return Foundation.clone(this.__ficd)
        },
        _getBtns: function () {
            var self = this;
            var btns = [
                {key: 'btn-agree', text: '审批通过'},
                {key: 'btn-refuse', text: '审批拒绝'},
                {key: 'btn-transfer', text: '移交'},
                {key: 'btn-back', text: '打回'},
                {key: 'btn-print', text: '打印'}
            ];
            var bt = this.getNodeSettingByName('btns') + "";
            var result = [];

            function stateChange(selected, r) {
                var tmpValue = self.getNodeSettingByName('btns') + "";
                if (Foundation.isEmpty(tmpValue) || tmpValue == "undefined") {
                    if (selected) {
                        self.setNodeSetting('btns', r);
                    }
                } else {
                    var options = tmpValue.split(",");
                    if (selected) {
                        options.push(r);
                    } else {
                        Foundation.Array.remove(options, r);
                    }
                    self.setNodeSetting('btns', options.join(","));
                }
            }

            var rowSize = [];
            $.each(btns, function (idx, itm) {
                rowSize.push("auto");
                result.push([{
                    xtype: 'checkbox',
                    text: itm.text,
                    value: bt.indexOf(itm.key) != -1,
                    onStateChange: (selected) => {
                        stateChange(selected, itm.key);
                    }
                }]);
            });
            var tt = {
                xtype: "tablecontainer",
                rowSize: rowSize,
                colSize: ["auto"],
                items: result
            };

            return tt;
        },
        _getFlowItemSettingOptions: function () {
            var self = this;
            var linkType = self.getNodeSettingByName('linkType');
            if (Foundation.isEmpty(linkType)) {
                linkType = 'create';
                self.setNodeSetting('linkType', linkType)
            }
            var noApprovalOperation = self.getNodeSettingByName('noApprovalOperation');
            if (Foundation.isEmpty(noApprovalOperation)) {
                noApprovalOperation = "1";
                self.setNodeSetting('noApprovalOperation', noApprovalOperation)
            }
            return [
                {
                    xtype: 'title',
                    title: "节点名称",
                    visible: true
                },
                this.__getTitleConfig(),
                '-',
                {
                    xtype: 'title',
                    title: "节点描述"
                },
                this.__getDescConfig(),
                '-',
                {
                    xtype: 'title',
                    title: "环节类型"
                },
                {
                    xtype: 'combo',
                    widgetName: "linkType",
                    items: [{
                        value: 'create',
                        text: "创建"
                    }, {
                        value: 'approvl',
                        text: "审批"
                    }
                    // ,
                    //     {
                    //     value: 'submit',
                    //     text: "提交"
                    // }, {
                    //     value: 'archive',
                    //     text: "归档"
                    // }
                    ],
                    onDataFilter: function (item) {
                        if (linkType === item.value) {
                            item.selected = true;
                        }
                        return item;
                    },
                    onAfterItemSelect: function (element, item) {
                        var value = this.getValue();
                        self.setNodeSetting('linkType', value);
                        if (value != "approvl") {
                            Foundation.Array.forEach(self.approvlShowIds, function (item, i) {
                                $("#" + item).next().hide();
                                $("#" + item).hide();
                            });
                        } else {
                            Foundation.Array.forEach(self.approvlShowIds, function (item, i) {
                                $("#" + item).next().show();
                                $("#" + item).show();
                            });
                        }
                    }
                },
                {
                    xtype: 'title',
                    id: "btnTitle",
                    title: "显示按钮"
                },
                this._getBtns(),
                {
                    xtype: 'title',
                    id: "batchTitle",
                    title: "批量审批"
                },
                {
                    xtype: "tablecontainer",
                    rowSize: [20],
                    colSize: ["auto", 20],
                    items: [
                        [{
                            xtype: 'checkbox',
                            text: '允许批量',
                            value: this.getNodeSettingByName('batchApproval'),
                            onStateChange: function (selected) {
                                self.setNodeSetting('batchApproval', selected)
                            }
                        }]
                    ]
                },
                {
                    xtype: 'title',
                    title: "加签",
                    id: "countersignTitle",
                },
                {
                    xtype: "tablecontainer",
                    rowSize: [20],
                    colSize: ["auto", 20],
                    items: [
                        [{
                            xtype: 'checkbox',
                            text: '允许加签',
                            value: this.getNodeSettingByName('countersignFlag'),
                            onStateChange: function (selected) {
                                self.setNodeSetting('countersignFlag', selected)
                            }
                        }]
                    ]
                },
                {
                    xtype: 'title',
                    title: "自动同意规则",
                    id: "autoAgreeTitle",
                },
                this.__getAutoAgreeConfig(),
                {
                    xtype: 'title',
                    title: "无对应处理人",
                    id: "noApprovalOperationTitle"
                },
                {
                    xtype: 'combo',
                    widgetName: "noApprovalOperation",
                    items: [{
                        value: '1',
                        text: "超级管理员处理",
                    }, {
                        value: '2',
                        text: "跳过处理"
                    }, {
                        value: '3',
                        text: "不能提交"
                    }],
                    onDataFilter: function (item) {
                        if (noApprovalOperation === item.value) {
                            item.selected = true;
                        }
                        return item;
                    },
                    onAfterItemSelect: function (element, item) {
                        var value = this.getValue();
                        self.setNodeSetting('noApprovalOperation', value);
                    }
                }, {
                    xtype: 'title',
                    title: "超时自动扭转",
                    id: "autoNextHoursTitle",
                },
                this.__getAutoNextConfig(),
                {
                    xtype: 'title',
                    title: "手动选择审批人",
                    id: "selectApprovalTitle",
                },
                {
                    xtype: "tablecontainer",
                    rowSize: [20],
                    colSize: ["auto", 20],
                    items: [
                        [{
                            xtype: 'checkbox',
                            text: '手动',
                            value: this.getNodeSettingByName('selectApproval'),
                            onStateChange: function (selected) {
                                self.setNodeSetting('selectApproval', selected)
                            }
                        }]
                    ]
                },
                "-",
                {
                    xtype: 'title',
                    title: "审批人设置"
                },
                this.__getProcessApproverBoxConfig(),
                {
                    xtype: 'title',
                    title: "抄送设置"
                },
                this.__getProcessCcBoxConfig(),
                '-',
                {
                    xtype: 'title',
                    title: "操作权限"
                },
                this.__getFlowOperationConfig(),
                '-',
                {
                    xtype: 'title',
                    title: '节点监听器'
                },
                {
                    xtype: "tablecontainer",
                    rowSize: [120],
                    colSize: ["auto", 20],
                    items: [
                        [{
                            xtype: 'textarea',
                            placeholder: "输入节点监听器类名, 一行表示一个",
                            value: this.getNodeSettingByName('listeners'),
                            onAfterEdit: function (event, value) {
                                self.setNodeSetting('listeners', value);
                            }
                        }, {
                            xtype: "tooltip",
                            style: "tip",
                            text: "节点监听器，在这个节点发起审批后所执行的操作"
                        }]
                    ]
                }
            ]
        },

        //自动扭转设置
        __getAutoNextConfig: function () {
            var self = this;
            var nodeSettingByName = self.getNodeSettingByName('autoNextHours');
            return {
                xtype: "tablecontainer",
                rowSize: [20],
                colSize: ["auto", 50, 30],
                items: [
                    [{
                        xtype: 'checkbox',
                        text: '自动扭转',
                        value: !Foundation.isEmpty(nodeSettingByName),
                        onStateChange: function (selected) {
                            var titleInput = self.getWidgetByName('autoNextHours');
                            var autoNextHoursTip = self.getWidgetByName('autoNextHoursTip');
                            if (selected) {
                                titleInput.setVisible(true);
                                autoNextHoursTip.setVisible(true);
                            } else {
                                titleInput.setVisible(false);
                                autoNextHoursTip.setVisible(false);
                                titleInput.setValue("0");
                                self.setNodeSetting('autoNextHours', 0);
                            }
                        }
                    }, {
                        xtype: 'input',
                        placeholder: "小时",
                        widgetName: 'autoNextHours',
                        value: nodeSettingByName,
                        visible: !Foundation.isEmpty(nodeSettingByName),
                        onAfterEdit: function (event, value) {
                            self.setNodeSetting('autoNextHours', value);
                        }
                    }, {
                        xtype: "tooltip",
                        style: "tip",
                        widgetName: 'autoNextHoursTip',
                        visible: !Foundation.isEmpty(nodeSettingByName),
                        text: "流转到节点多久后自动扭转"
                    }]
                ]
            }
        },
        //自动同意规则
        __getAutoAgreeConfig: function () {
            var self = this;
            var tmpValue = self.getNodeSettingByName('autoAgree') + "";
            var one = false;
            var two = false;
            var three = false;
            if (!Foundation.isEmpty(tmpValue)) {
                var options = tmpValue.split(",");
                one = options.indexOf("1") != -1
                two = options.indexOf("2") != -1
                three = options.indexOf("3") != -1
            }

            function stateChange(selected, r) {
                var tmpValue = self.getNodeSettingByName('autoAgree');
                if (Foundation.isEmpty(tmpValue) || tmpValue == "undefined") {
                    if (selected) {
                        self.setNodeSetting('autoAgree', r);
                    }
                } else {
                    var options = tmpValue.split(",");
                    if (selected) {
                        options.push(r);
                    } else {
                        Foundation.Array.remove(options, r);
                    }
                    self.setNodeSetting('autoAgree', options.join(","));
                }
            }

            return {
                xtype: "tablecontainer",
                rowSize: ["auto", "auto"],
                colSize: ["auto", "auto"],
                items: [
                    [{
                        xtype: 'checkbox',
                        text: '处理人就是申请人',
                        value: one,
                        onStateChange: (selected) => {
                            stateChange(selected, "1");
                        }
                    }, {
                        xtype: 'checkbox',
                        text: '处理人和上一处理人相同',
                        value: two,
                        onStateChange: (selected) => {
                            stateChange(selected, "2");
                        }
                    }], [{
                        xtype: 'checkbox',
                        text: '处理人审批过',
                        value: three,
                        onStateChange: (selected) => {
                            stateChange(selected, "3");
                        }
                    }]
                ]
            }
        },
        // 弹出节点抄送人配置
        __getProcessCcBoxConfig: function () {
            var self = this;
            var formItemWidgets = this.options.formItemWidgets;

            function onClick() {
                var ccs = self.getNodeSettingByName('cc', []);
                layer.open({
                    type: 2,
                    shade: 0.3,
                    area: ['80%', '80%'],
                    title: '设置节点抄送人',
                    isOutAnim: false,
                    closeBtn: false,
                    content: [g.ctx + 'process/flow/cc'],
                    success: function (layero, index) {
                        var body = layer.getChildFrame('body', index);
                        window.iframeWin = window[layero.find('iframe')[0]['name']];
                        var ccText = JSON.stringify(ccs);
                        body.contents().find('#cc_val').val(ccText);
                        body.contents().find('#fields_val').val(JSON.stringify(formItemWidgets));
                    },
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {
                        var body = layer.getChildFrame('body', index);
                        var ccText = body.contents().find('#cc_val').val();
                        self.setNodeSetting('cc', JSON.parse(ccText));
                        layer.close(index);
                    }
                });
            }

            return {
                xtype: 'button',
                style: 'white',
                text: "去设置",
                widgetName: 'btnCcUser',
                onClick: onClick
            }
        },
        // 弹出节点审批人信息
        __getProcessApproverBoxConfig: function () {
            var self = this;
            var formItemWidgets = this.options.formItemWidgets;

            function onClick() {
                var approvers = self.getNodeSettingByName('approver', []);
                layer.open({
                    type: 2,
                    shade: 0.3,
                    area: ['80%', '80%'],
                    title: '设置节点审批人',
                    isOutAnim: false,
                    closeBtn: false,
                    content: [g.ctx + 'process/flow/approver'],
                    success: function (layero, index) {
                        var body = layer.getChildFrame('body', index);
                        window.iframeWin = window[layero.find('iframe')[0]['name']];
                        var approversText = JSON.stringify(approvers);
                        body.contents().find('#approver_val').val(approversText);
                        body.contents().find('#fields_val').val(JSON.stringify(formItemWidgets));
                    },
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {
                        var body = layer.getChildFrame('body', index);
                        var approversText = body.contents().find('#approver_val').val();
                        self.setNodeSetting('approver', JSON.parse(approversText));
                        layer.close(index);
                    }
                });
            }

            return {
                xtype: 'button',
                style: 'white',
                text: "去设置",
                widgetName: 'btnApprovalNode',
                onClick: onClick
            }
        },

        __getFlowOperationConfig: function () {
            var self = this;
            var formItemWidgets = this.options.formItemWidgets;
            var items = Foundation.Array.map(formItemWidgets, function (widget, i) {
                return {
                    title: widget.getTitle(),
                    widgetName: widget.getWidgetName()
                }
            }, this);
            return {
                xtype: 'x-flow-operation',
                items: items,
                value: this.getNodeSettingByName('permissions', {}),
                onAfterEdit: function () {
                    var permissions = this.getValue();
                    self.setNodeSetting('permissions', permissions);
                }
            }
        }
    }, function (Cls) {
        FlowNodeSettingBasePanel.register(constants.FLOW_NODE_XTYPE.TASK, Cls)
    });

    return FlowTaskNodeSettingPanel;
});