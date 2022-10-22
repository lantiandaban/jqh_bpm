/*
 * Copyright © 2015-2018, AnHui Mobiao technology co. LTD Inc. All Rights Reserved.
 */

/**
 *
 * @author yishin
 * @version 1.0
 */
'use strict';
require(['text!view/process/approver_table_tbody.hbs'
        , 'text!view/process/approver_condition.hbs'
        , 'text!view/process/approver.hbs'
        , 'modules/employee-dialog'
        , 'modules/organization-dialog'
        , 'modules/position-dialog'
        , 'text!view/process/approver_setting.hbs'],
    function (tbodyTxt, conditionTxt, approverTxt, personDialog, organizationDialog, positionDialog, approver_panel_html) {
        var page = {
            approverCondition: [],
            select2Fields: [],
            tbodyTpl: Handlebars.compile(tbodyTxt),
            approverCondtionTpl: Handlebars.compile(conditionTxt),
            approverTpl: Handlebars.compile(approverTxt),
            UserProjectRelation: [
                {id: 'project_manager', text: '报销项目的项目经理'},
                {id: 'project_director', text: '报销项目的项目总监'},
                {id: 'project_presale_head', text: '报销项目的售前负责人'}
            ],
            el: {
                val: '#approver_val',
                conditionDt: '#approver-condition-dt'
            },
            dataInit: () => {
                var txtValue = $(page.el.val).val();
                if (txtValue) {
                    page.approverCondition = JSON.parse(txtValue);
                }

                var fieldVal = $('#fields_val').val();
                if (fieldVal) {
                    var formFields = JSON.parse(fieldVal);
                    $.each(formFields, function (i, element) {
                        var fieldData = {
                            'id': element.options.widgetName,
                            'text': element.options.title
                        };
                        page.select2Fields.push(fieldData);
                    })
                }
            },
            renderTable: () => {
                var html = page.tbodyTpl(page.approverCondition);
                var $DT = $(page.el.conditionDt);

                $DT.find('tbody').html(html);

                $DT.find('a.weight').editable({
                    disabled: true,
                    mode: 'inline',
                    validate: function (value) {
                        var isNumber = S(value).isNumeric();
                        if (!isNumber) {
                            return "请输入数字";
                        }
                    }
                });
                $DT.hoverIntent(
                    function () {
                        $(this).find('a.weight').editable('toggleDisabled');
                    },
                    function () {
                        var weightLink = $(this).find('a.weight');
                        weightLink.editable('toggleDisabled');
                    }
                );

                $DT.find('a.weight').on('save', function (e, param) {
                    var newWeigth = param.newValue;
                    var dataId = $(this).data('id');
                    if (dataId) {
                        $.each(page.approverCondition, function (coi, liCond) {
                            if (liCond.id == dataId) {
                                liCond.weight = newWeigth;
                            }
                        });
                        $(page.el.val).val(JSON.stringify(page.approverCondition));
                    }
                })
            },
            /**
             * 销毁 select2 取消select2选中事件
             * @param $selects
             */
            closeSelect2: ($selects) => {
                $selects.forEach(function ($select) {
                    if ($select.hasClass("select2-hidden-accessible")) {
                        $select.select2('destroy').hide();
                    } else {
                        $select.hide();
                    }
                })
            },
            renderApprover: (approverPanel) => {
                approverPanel.find('input.ipt-approver-value').data('action', 1)
                    .prop('placeholder', "选择人员")
                    .css("display", "inline");
                approverPanel.find("select.hr_type").select2({
                    dropdownCssClass: 'increasedzindexclass',
                    language: 'zh-CN'
                });
                approverPanel.find("select.app_type").select2({
                    dropdownCssClass: 'increasedzindexclass',
                    language: 'zh-CN'
                }).on("select2:select", function () {
                    var appType = parseInt(this.value);
                    switch (appType) {
                        case 1: {
                            approverPanel.find('input.ipt-approver-value').data('action', 1)
                                .prop('placeholder', "选择人员")
                                .css("display", "inline");
                            page.closeSelect2([approverPanel.find("select.cus_type"),
                                approverPanel.find("select.pro_type"),
                                approverPanel.find("select.app_field"),
                                approverPanel.find("select.org_type")]);
                            approverPanel.find("select.hr_type").show().select2({
                                dropdownCssClass: 'increasedzindexclass',
                                language: 'zh-CN'
                            });
                            break;
                        }
                        case 2: {
                            page.closeSelect2([approverPanel.find("select.hr_type"),
                                approverPanel.find("select.org_type"),
                                approverPanel.find("select.cus_type")]);
                            approverPanel.find('input.ipt-approver-value').css("display", "none");
                            approverPanel.find("select.pro_type").show().select2({
                                dropdownCssClass: 'increasedzindexclass',
                                language: 'zh-CN'
                            });
                            break;
                        }
                        case 3: {
                            approverPanel.find('input.ipt-approver-value').css("display", "none");
                            page.closeSelect2([approverPanel.find("select.hr_type"),
                                approverPanel.find("select.org_type"),
                                approverPanel.find("select.pro_type")]);
                            approverPanel.find("select.cus_type").show().select2({
                                dropdownCssClass: 'increasedzindexclass',
                                language: 'zh-CN'
                            });
                            break;
                        }
                        case 5: {
                            //审批人是表单的某个字段值
                            approverPanel.find('input.ipt-approver-value').css("display", "none");
                            page.closeSelect2([approverPanel.find("select.hr_type"),
                                approverPanel.find("select.org_type"),
                                approverPanel.find("select.pro_type")]);
                            approverPanel.find("select.app_field").show().select2({
                                dropdownCssClass: 'increasedzindexclass',
                                language: 'zh-CN',
                                data: page.select2Fields
                            });
                            approverPanel.find("select.cus_type").show().select2({
                                dropdownCssClass: 'increasedzindexclass',
                                language: 'zh-CN'
                            });
                            break;
                        }
                        default:
                            break;
                    }
                });
                approverPanel.find("select.countersign").select2({
                    dropdownCssClass: 'increasedzindexclass',
                    language: 'zh-CN'
                }).on("select2:select", (e) => {
                    var id = e.params.data.id;
                    var appType = parseInt(id);
                    switch (appType) {
                        case 1:
                        case 2:
                            approverPanel.find('input.ipt-countersign-value').hide();
                            break;
                        case 3:
                            approverPanel.find('input.ipt-countersign-value').css('display', 'inline').show();
                            approverPanel.find('input.ipt-countersign-value').attr("placeholder", "请输入数量");
                            break;
                        case 4:
                            approverPanel.find('input.ipt-countersign-value').css('display', 'inline').show();
                            approverPanel.find('input.ipt-countersign-value').attr("placeholder", "请输入百分比");
                            break;
                        default:
                            break;
                    }
                });
                approverPanel.find("select.hr_type").on("select2:select", function () {
                    var htType = parseInt(this.value);
                    var $orgSelect2 = approverPanel.find("select.org_type");
                    switch (htType) {
                        case 1: {
                            page.closeSelect2([$orgSelect2]);
                            approverPanel.find('input.ipt-approver-value').data('action', 1)
                                .prop('placeholder', "选择人员")
                                .css("display", "inline");
                            approverPanel.find('input.ipt-organization-level').hide();
                            break;
                        }
                        case 2: {
                            $orgSelect2.show().select2({
                                dropdownCssClass: 'increasedzindexclass',
                                language: 'zh-CN'
                            });
                            approverPanel.find('input.ipt-approver-value').data('action', 2)
                                .prop('placeholder', "选择职位")
                                .css("display", "inline");
                            approverPanel.find('input.ipt-organization-level').hide();
                            break;
                        }
                        case 3: {
                            page.closeSelect2([$orgSelect2]);
                            approverPanel.find('input.ipt-approver-value').data('action', 2)
                                .prop('placeholder', "选择职位")
                                .css("display", "inline");
                            approverPanel.find('input.ipt-organization-level').hide();
                            break;
                        }
                        case 4: {
                            page.closeSelect2([$orgSelect2, approverPanel.find('select.cus_type')]);
                            approverPanel.find('input.ipt-approver-value').data('action', 0).hide();
                            approverPanel.find('input.ipt-organization-level').hide();
                            break;
                        }
                        case 5: {
                            $orgSelect2.show().select2({
                                dropdownCssClass: 'increasedzindexclass',
                                language: 'zh-CN'
                            });
                            approverPanel.find('input.ipt-organization-level').css('display', 'inline').show();
                            approverPanel.find('input.ipt-approver-value').data('action', 0).hide();
                            break;
                        }
                        default:
                            break;
                    }
                });
                approverPanel.find("select.org_type").on("select2:select", function () {
                    approverPanel.find('input.ipt-approver-value').css("display", "none");
                    var orgType = parseInt(this.value);
                    switch (orgType) {
                        case 1: {
                            approverPanel.find('input.ipt-approver-value').css("display", "none");
                            break;
                        }
                        case 2: {
                            approverPanel.find('input.ipt-approver-value').data('action', 2)
                                .prop('placeholder', "选择职位")
                                .css("display", "inline");
                            break;
                        }
                        default:
                            break;
                    }
                });
                approverPanel.on('click', 'input.ipt-approver-value', function (e) {
                    e.preventDefault();
                    var action = $(this).data('action');
                    if (action) {
                        var intAction = parseInt(action);
                        var iptSelect = approverPanel.find('input.ipt-approver-select-value');
                        var iptValue = approverPanel.find('input.ipt-approver-value');
                        var iptSelectValue = iptSelect.val();
                        var selectObj = JSON.parse(iptSelectValue);
                        switch (intAction) {
                            case 1:
                                personDialog.open({
                                    choices: selectObj,
                                    type: 1,
                                    callback: function (choiceOrganizations) {
                                        if (choiceOrganizations) {
                                            var names = [];
                                            var tmp = [];
                                            $.each(choiceOrganizations, function (i, val) {
                                                names.push(val.name);
                                                val.orgId = (val.orgId + "").replace("ORG", "");
                                                tmp.push(val)
                                            });

                                            iptSelect.val(JSON.stringify(tmp));
                                            iptValue.val(names.join(','));
                                        }
                                    }
                                });
                                break;
                            case 2:
                                positionDialog.open({
                                    choices: selectObj,
                                    callback: function (choicPositions) {
                                        if (choicPositions) {
                                            var names = [];
                                            $.each(choicPositions, function (i, val) {
                                                names.push(val.name);
                                            });
                                            iptSelect.val(JSON.stringify(choicPositions));
                                            iptValue.val(names.join(','));
                                        }
                                    }
                                });
                                break;
                            default:
                                break;
                        }
                    }
                })
            },
            renderCondition: (conditions) => {
                conditions.find('select.con_type').select2({
                    dropdownCssClass: 'increasedzindexclass',
                    language: 'zh-CN'
                }).on("select2:select", function () {
                    var type = this.value;
                    var $selInclude = conditions.find('select.con_relatio2');
                    var $formFieldSelect = conditions.find('select.con_field');
                    var $comboValueSelect = conditions.find('select.combo_value');
                    var $relationSelect = conditions.find('select.con_relatio');
                    if (type === '1') {
                        $formFieldSelect.show().select2({
                            dropdownCssClass: 'increasedzindexclass',
                            language: 'zh-CN',
                            data: page.select2Fields
                        });
                        $relationSelect.show().select2({
                            dropdownCssClass: 'increasedzindexclass',
                            language: 'zh-CN'
                        });
                        if ($selInclude.hasClass("select2-hidden-accessible")) {
                            $selInclude.select2('destroy').hide();
                        }
                        if ($comboValueSelect.hasClass("select2-hidden-accessible")) {
                            $comboValueSelect.select2('destroy').html("").hide();
                        }
                        conditions.find('input.ipt-value').data('action', '0')
                            .css("display", "inline")
                            .removeClass('w250')
                            .prop('placeholder', '请输入条件值')
                            .prop('readonly', false);
                    } else if (type === '7') {
                        page.closeSelect2([$formFieldSelect, $selInclude, $comboValueSelect, $relationSelect]);
                        conditions.find('input.ipt-value').data('action', '0').hide();
                    } else if (type === '5') {
                        if ($comboValueSelect.hasClass("select2-hidden-accessible")) {
                            $comboValueSelect.select2('destroy').html("").hide();
                        }
                        if ($formFieldSelect.hasClass("select2-hidden-accessible")) {
                            $formFieldSelect.select2('destroy').hide();
                        }
                        if ($relationSelect.hasClass("select2-hidden-accessible")) {
                            $relationSelect.select2('destroy').hide();
                        }
                        $selInclude.show().select2({
                            dropdownCssClass: 'increasedzindexclass',
                            language: 'zh-CN'
                        });
                        $comboValueSelect.show().select2({
                            dropdownCssClass: 'increasedzindexclass',
                            language: 'zh-CN',
                            tags: true,
                            data: g.project_types,
                            multiple: true
                        });
                        conditions.find('input.ipt-value').data('action', '0').hide();
                    } else if (type === '6') {
                        if ($comboValueSelect.hasClass("select2-hidden-accessible")) {
                            $comboValueSelect.select2('destroy').html("").hide();
                        }
                        if ($formFieldSelect.hasClass("select2-hidden-accessible")) {
                            $formFieldSelect.select2('destroy').hide();
                        }
                        if ($relationSelect.hasClass("select2-hidden-accessible")) {
                            $relationSelect.select2('destroy').hide();
                        }
                        if ($selInclude.hasClass("select2-hidden-accessible")) {
                            $selInclude.select2('destroy').hide();
                        }
                        $relationSelect.show().select2({
                            dropdownCssClass: 'increasedzindexclass',
                            language: 'zh-CN'
                        });

                        $relationSelect.show().select2({
                            dropdownCssClass: 'increasedzindexclass',
                            language: 'zh-CN'
                        });
                        $comboValueSelect.show().select2({
                            dropdownCssClass: 'increasedzindexclass',
                            language: 'zh-CN',
                            tags: true,
                            data: page.UserProjectRelation,
                            multiple: false
                        });
                        conditions.find('input.ipt-value').data('action', '0').hide();
                    } else {
                        var tip = '请点击选择职位';
                        if (type === '3') {
                            tip = '请点击选择部门';
                        } else if (type === '4') {
                            tip = '请点击选择人员';
                        }
                        if ($formFieldSelect.hasClass("select2-hidden-accessible")) {
                            $formFieldSelect.select2('destroy').hide();
                        }
                        if ($relationSelect.hasClass("select2-hidden-accessible")) {
                            $relationSelect.select2('destroy').hide();
                        }
                        if ($comboValueSelect.hasClass("select2-hidden-accessible")) {
                            $comboValueSelect.select2('destroy').html("").hide();
                        }
                        $selInclude.show().select2({
                            dropdownCssClass: 'increasedzindexclass',
                            language: 'zh-CN'
                        });
                        conditions.find('input.ipt-value')
                            .css("display", "inline")
                            .data('action', type)
                            .addClass('w250')
                            .prop('placeholder', tip)
                            .prop('readonly', true);
                    }
                });
                var removeBtn = conditions.find('button.act_remove_condition');
                if (removeBtn) {
                    removeBtn.click(function (e) {
                        e.preventDefault();
                        conditions.remove();
                    });
                }
                conditions.on('click', 'input.ipt-value', function (e) {
                    e.preventDefault();
                    var action = $(this).data('action');
                    if (action) {
                        var intAction = parseInt(action);
                        var iptSelect = conditions.find('input.ipt-select-value');
                        var iptValue = conditions.find('input.ipt-value');
                        var iptSelectValue = iptSelect.val();
                        var selectObj = JSON.parse(iptSelectValue);
                        switch (intAction) {
                            case 2:
                                positionDialog.open({
                                    choices: selectObj,
                                    callback: function (choicPositions) {
                                        if (choicPositions) {
                                            var names = [];
                                            $.each(choicPositions, function (i, val) {
                                                names.push(val.name);
                                            });
                                            iptSelect.val(JSON.stringify(choicPositions));
                                            iptValue.val(names.join(','));
                                        }
                                    }
                                });
                                break;
                            case 3:
                                organizationDialog.open({
                                    choices: selectObj,
                                    callback: function (choiceOrganizations) {
                                        if (choiceOrganizations) {
                                            var names = [];
                                            var tmp = [];
                                            $.each(choiceOrganizations, function (i, val) {
                                                names.push(val.name);
                                                val.pid = (val.pid + "").replace("ORG", "");
                                                val.id = (val.id + "").replace("ORG", "");
                                                tmp.push(val);
                                            });
                                            iptSelect.val(JSON.stringify(tmp));
                                            iptValue.val(names.join(','));
                                        }
                                    }
                                });
                                break;
                            case 4:
                                personDialog.open({
                                    choices: selectObj,
                                    type: 1,
                                    callback: function (choiceOrganizations) {
                                        if (choiceOrganizations) {
                                            var names = [];
                                            var tmp = [];
                                            $.each(choiceOrganizations, function (i, val) {
                                                names.push(val.name);
                                                val.orgId = (val.orgId + "").replace("ORG", "");
                                                tmp.push(val);
                                            });
                                            iptSelect.val(JSON.stringify(tmp));
                                            iptValue.val(names.join(','));
                                        }
                                    }
                                });
                                break;
                            default:
                                break;
                        }
                    }
                })

            },
            approvlValue: {
                selectValues: function (layero) {
                    return layero.find('input.ipt-approver-select-value').val()
                }
            },
            dialogOpenCall: (layero, index, conditionIndex) => {
                var $content = layero.find('.layui-layer-content');
                $content.css('overflow', 'hidden');
                // 初始化信息
                var conditionHtml = page.approverCondtionTpl({
                    index: conditionIndex,
                    add: true
                });
                var approverHtml = page.approverTpl();
                var conditionPanel = layero.find('#condition_panel');
                var approverPanel = layero.find('#approver_panel');
                conditionPanel.html(conditionHtml);
                approverPanel.html(approverHtml);
                var conditions = conditionPanel.find('#approver_condition_1');
                page.renderCondition(conditions);
                page.renderApprover(approverPanel);
                conditionIndex++;
                conditions.find('button.act_add_condition').click(function () {
                    var conditionHtml = page.approverCondtionTpl({
                        index: conditionIndex,
                        add: false
                    });
                    conditionPanel.append(conditionHtml);
                    var conditions = conditionPanel.find('#approver_condition_' + conditionIndex);
                    page.renderCondition(conditions);
                    conditionIndex++
                })
            },
            getSubject: (layero) => {
                var subject = {};
                subject['type'] = parseInt(layero.find("select.app_type").val());
                switch (subject.type) {
                    case 1:
                        subject['hrType'] = parseInt(layero.find("select.hr_type").val());
                        switch (subject.hrType) {
                            case 1: {
                                var users = page.approvlValue.selectValues(layero);
                                var chooseUsers = JSON.parse(users);
                                if (!chooseUsers || chooseUsers.length <= 0) {
                                    layer.msg('请选择指定人员');
                                    return false;
                                }
                                subject['users'] = chooseUsers;
                                break;
                            }
                            case 2: {
                                subject['orgType'] = parseInt(layero.find("select.org_type").val());
                                switch (subject.orgType) {
                                    case 2:
                                        var positions2 = page.approvlValue.selectValues(layero);
                                        var choosePositions = JSON.parse(positions2);
                                        if (!choosePositions || choosePositions.length <= 0) {
                                            layer.msg('请选择指定部门职位');
                                            return false;
                                        }
                                        subject['positions'] = choosePositions;
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            }
                            case 3: {
                                var positions3 = page.approvlValue.selectValues(layero);
                                subject['positions'] = JSON.parse(positions3);

                                if (!subject['positions'] || subject['positions'].length <= 0) {
                                    layer.msg('请选择指定职位');
                                    return false;
                                }
                                break;
                            }
                            case 5: {
                                subject['level'] = layero.find('input.ipt-organization-level').val();
                                subject['orgType'] = parseInt(layero.find("select.org_type").val());
                                switch (subject.orgType) {
                                    case 2:
                                        var positions5 = page.approvlValue.selectValues(layero);
                                        subject['positions'] = JSON.parse(positions5);
                                        if (!subject['positions'] || subject['positions'].length <= 0) {
                                            layer.msg('请选择指定部门级别的职位');
                                            return false;
                                        }
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            }
                            default:
                                break;
                        }
                        break;
                    case 2:
                        var pro_type = parseInt(layero.find("select.pro_type").val());
                        subject['project'] = {
                            type: pro_type,
                            field: ""
                        };
                        break;
                    case 3:
                        var cus_type = parseInt(layero.find("select.cus_type").val());
                        subject['customer'] = {
                            type: cus_type,
                            field: ""
                        };
                        break;
                    case 5:
                        var fieldDatas = layero.find('select.app_field').select2('data');
                        var fieldData = fieldDatas[0];
                        subject['field'] = {
                            widgetName: fieldData.id,
                            name: fieldData.text
                        };
                        break;
                    default:
                        break;
                }
                return subject;
            },
            getConditions: (lineConditions) => {
                var conditions = [];
                $.each(lineConditions, function (i, element) {
                    var data = {};
                    var conditionIndex = $(element).data('index');
                    var $conditionIndexPanel = $('#approver_condition_' + conditionIndex);
                    var type = $conditionIndexPanel.find('.con_type').val();
                    if (type) {
                        var intType = parseInt(type);
                        data['type'] = intType;
                        switch (intType) {
                            case 1:
                                var fieldDatas = $conditionIndexPanel.find('.con_field').select2('data');
                                var fieldData = fieldDatas[0];
                                data['field'] = {
                                    widgetName: fieldData.id,
                                    name: fieldData.text
                                };
                                var relatio = $conditionIndexPanel.find('.con_relatio').val();
                                data['relation'] = relatio;

                                var value = $conditionIndexPanel.find('input.ipt-value').val();
                                data['value'] = value;
                                break;
                            case 2: {
                                data['relation'] = $conditionIndexPanel.find('.con_relatio2').val();

                                var positions = $conditionIndexPanel.find('input.ipt-select-value').val();
                                data['positions'] = JSON.parse(positions);
                                break;
                            }
                            case 3:
                                data['relation'] = $conditionIndexPanel.find('.con_relatio2').val();

                                var organizations = $conditionIndexPanel.find('input.ipt-select-value').val();
                                data['organizations'] = JSON.parse(organizations);
                                break;
                            case 4:
                                data['relation'] = $conditionIndexPanel.find('.con_relatio2').val();

                                var users = $conditionIndexPanel.find('input.ipt-select-value').val();
                                data['users'] = JSON.parse(users);
                                break;
                            case 5:
                                data['relation'] = $conditionIndexPanel.find('.con_relatio2').val();

                                var projectTypes = $conditionIndexPanel.find('select.combo_value').select2('data');
                                if (projectTypes) {
                                    var p_types = [];
                                    var p_type5;
                                    var len = projectTypes.length;
                                    for (var j = 0; j < len; j++) {
                                        p_type5 = projectTypes[j];
                                        p_types.push({
                                            id: p_type5.id,
                                            name: p_type5.text
                                        })
                                    }
                                    data['projectTypes'] = p_types;
                                }
                                break;
                            case 6:
                                data['relation'] = $conditionIndexPanel.find('.con_relatio').val();
                                var comboValues = $conditionIndexPanel.find('select.combo_value').select2('data');
                                if (comboValues) {
                                    var p_values = [];
                                    var p_type;
                                    var clen = comboValues.length;
                                    for (var v = 0; v < clen; v++) {
                                        p_type = comboValues[v];
                                        p_values.push({
                                            id: p_type.id,
                                            name: p_type.text
                                        })
                                    }
                                    data['userProjects'] = p_values;
                                }
                                break;
                            default:
                                break
                        }
                        conditions.push(data);
                    }
                });
                return conditions;
            },
            getCountersign: (layero) => {
                var countersign = {};
                countersign['type'] = parseInt(layero.find("select.countersign").val());
                switch (countersign.type) {
                    case 3:
                    case 4:
                        countersign['count'] = layero.find('input.ipt-countersign-value').val();
                        break;
                }
                return countersign;
            },
            ok: (layero, index) => {
                // 返回信息
                // 获取数据 组装数据
                var lineConditions = layero.find('div.approver_condition');
                var conditions = page.getConditions(lineConditions);
                var subject = page.getSubject(layero);
                if (!subject) {
                    return false;
                }
                var countersign = page.getCountersign(layero);
                page.approverCondition.push({
                    weight: 1,
                    condition: conditions,
                    subject: subject,
                    countersign: countersign,
                    id: JTDC.guid()
                });
                console.log(page.approverCondition);
                $(page.el.val).val(JSON.stringify(page.approverCondition));
                page.renderTable();
                layer.close(index);

            },
            lcInitEvents: () => {
                $('#btn-create-approver').click(function (e) {
                    e.preventDefault();
                    var conditionIndex = 1;
                    layer.open({
                        type: 1,
                        isOutAnim: false,
                        closeBtn: false,
                        shade: 0.3,
                        area: ['750px', '80%'],
                        title: '审批人设置',
                        content: approver_panel_html,
                        success: function (layero, index) {
                            page.dialogOpenCall(layero, index, conditionIndex);
                        },
                        btn: ['确定', '取消'],
                        yes: function (index, layero) {
                            page.ok(layero, index);
                        }
                    });
                });
                $(page.el.conditionDt).on('click', 'button.act-remove', function (e) {
                    e.preventDefault();
                    var id = $(this).data('id');
                    page.approverCondition.forEach(function (val, index) {
                        if (val.id == id) {
                            page.approverCondition.splice(index, 1);
                        }
                    });
                    $(page.el.val).val(JSON.stringify(page.approverCondition));
                    $(page.el.conditionDt).find('#approver_table_' + id).remove();
                });
            }
        };
        page.dataInit();
        page.renderTable();
        // 绑定事件
        page.lcInitEvents();
    });