/**
 *
 * @author yishin
 * @version 1.0
 */
'use strict';
require(['text!view/process/cc_table_tbody.hbs',
        'text!view/process/cc_condition.hbs',
        'text!view/process/cc.hbs'
        , 'modules/employee-dialog'
        , 'modules/organization-dialog'
    ],
    function (tbodyTxt, conditionTxt, ccTxt, personDialog, organizationDialog) {

        var ccCondition = [];
        var select2Fields = [];
        var tbodyTpl = Handlebars.compile(tbodyTxt);
        var ccCondtionTpl = Handlebars.compile(conditionTxt);
        var ccTpl = Handlebars.compile(ccTxt);

        var el = {
            val: '#cc_val',
            conditionDt: '#cc-condition-dt'
        };

        var dataInit = function () {
            var txtValue = $(el.val).val();
            if (txtValue) {
                ccCondition = JSON.parse(txtValue);
            }
            var fieldVal = $('#fields_val').val();
            if (fieldVal) {
                var formFields = JSON.parse(fieldVal);
                $.each(formFields, function (i, element) {
                    var fieldData = {
                        'id': element.options.widgetName,
                        'text': element.options.title
                    };
                    select2Fields.push(fieldData);
                })
            }
        };

        var renderTable = function () {
            var html = tbodyTpl(ccCondition);
            var $DT = $(el.conditionDt);
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
                    $.each(ccCondition, function (coi, liCond) {
                        if (liCond.id == dataId) {
                            liCond.weight = newWeigth;
                        }
                    });
                    $(el.val).val(JSON.stringify(ccCondition));
                }
            })
        };

        var renderCc = function (ccPanel) {
            ccPanel.find("#type_1").on("click", function () {
                if (this.checked) {
                    ccPanel.find('input.ipt-cc-value')
                        .css("display", "inline");
                } else {
                    ccPanel.find('input.ipt-cc-value')
                        .css("display", "none");
                }
            });

            ccPanel.on('click', 'input.ipt-cc-value', function (e) {
                e.preventDefault();
                var iptSelect = ccPanel.find('input#ipt-cc-select-value');
                var iptValue = ccPanel.find('input.ipt-cc-value');
                var iptSelectValue = iptSelect.val();
                var selectObj = JSON.parse(iptSelectValue);
                personDialog.open({
                    choices: selectObj,
                    multiple: true,
                    type: 1,
                    callback: function (choiceOrganizations) {
                        if (choiceOrganizations) {
                            var names = [];
                            var userArray=[];
                            $.each(choiceOrganizations, function (i, val) {
                                names.push(val.name);
                                val.orgId=val.orgId.replace("ORG","");
                                userArray.push(val);
                            });
                            iptSelect.val(JSON.stringify(userArray));
                            iptValue.val(names.join(','));
                        }
                    }
                });
            })
        };
        var renderCondition = function (conditions) {
            conditions.find('select.con_type').select2({
                dropdownCssClass: 'increasedzindexclass',
                language: 'zh-CN'
            }).on("select2:select", function () {
                var type = this.value;
                var $selInclude = conditions.find('select.con_relatio2');
                if (type === '1') {
                    conditions.find('select.con_field').show().select2({
                        dropdownCssClass: 'increasedzindexclass',
                        language: 'zh-CN',
                        data: select2Fields
                    });
                    conditions.find('select.con_relatio').show().select2({
                        dropdownCssClass: 'increasedzindexclass',
                        language: 'zh-CN'
                    });
                    if ($selInclude.hasClass("select2-hidden-accessible")) {
                        $selInclude.select2('destroy').hide();
                    }
                    conditions.find('input.ipt-value').show()
                        .removeClass('w300')
                        .data('action', '-1')
                        .prop('placeholder', '请输入条件值')
                        .css('display', 'inline')
                        .prop('readonly', false)
                        .val('');
                } else if (type === '7') {
                    // 无条件
                    var $selectRF = conditions.find('select.con_relatio,select.con_field');
                    if ($selectRF.hasClass("select2-hidden-accessible")) {
                        $selectRF.select2('destroy').hide();
                    }
                    if ($selInclude.hasClass("select2-hidden-accessible")) {
                        $selInclude.select2('destroy').hide();
                    }
                    conditions.find('input.ipt-value').hide();
                } else {
                    var tip = '请点击选择部门';
                    var $conRelatioAndField = conditions.find('select.con_relatio,select.con_field');
                    if ($conRelatioAndField.hasClass("select2-hidden-accessible")) {
                        $conRelatioAndField.select2('destroy').hide();
                    }
                    $selInclude.show().select2({
                        dropdownCssClass: 'increasedzindexclass',
                        language: 'zh-CN'
                    });
                    conditions.find('input.ipt-value').show()
                        .data('action', type)
                        .addClass('w300')
                        .prop('placeholder', tip)
                        .css('display', 'inline')
                        .prop('readonly', true)
                        .val('');
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
                        case 3:
                            organizationDialog.open({
                                choices: selectObj,
                                callback: function (choiceOrganizations) {
                                    if (choiceOrganizations) {
                                        var names = [];
                                        var orgArray = [];
                                        $.each(choiceOrganizations, function (i, val) {
                                            names.push(val.name);
                                            val.id = val.id.replace("ORG", "");
                                            val.pid = val.pid.replace("ORG", "");
                                            orgArray.push(val);
                                        });
                                        iptSelect.val(JSON.stringify(orgArray));
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
        };

        var cc_panel_html = '<div class="row mln mrn" style="width:670px;"><div' +
            ' class="col-md-12 pln prn">' +
            '<div class="panel panel-primary panel-border top"><div class="panel-heading">' +
            '<span class="panel-title">条件</span></div><div class="panel-body pln prn"' +
            ' id="condition_panel"></div></div> </div> <div class="col-md-12 pln prn">' +
            '<div class="panel panel-info panel-border top"><div class="panel-heading">' +
            '<span class="panel-title">抄送人</span> </div> <div class="panel-body pln prn" id="cc_panel">' +
            '</div></div></div></div>';

        var lcInitEvents = function () {
            $('#btn-cc-create').click(function (e) {
                e.preventDefault();
                var conditionIndex = 1;
                layer.open({
                    type: 1,
                    isOutAnim: false,
                    closeBtn: false,
                    shade: 0.3,
                    area: ['670px', '95%'],
                    title: '抄送人设置',
                    content: cc_panel_html,
                    success: function (layero, index) {
                        var $content = layero.find('.layui-layer-content');
                        $content.css('overflow', 'hidden');
                        // 初始化信息
                        var conditionHtml = ccCondtionTpl({index: conditionIndex, add: true});
                        var ccHtml = ccTpl();
                        var conditionPanel = layero.find('#condition_panel');
                        var ccPanel = layero.find('#cc_panel');
                        conditionPanel.html(conditionHtml);
                        ccPanel.html(ccHtml);
                        var conditions = conditionPanel.find('#cc_condition_1');
                        renderCondition(conditions);
                        renderCc(ccPanel);
                        conditionIndex++;
                        conditions.find('button.act_add_condition').click(function () {
                            var conditionHtml = ccCondtionTpl({
                                index: conditionIndex,
                                add: false
                            });
                            conditionPanel.append(conditionHtml);
                            var conditions = conditionPanel.find('#cc_condition_' + conditionIndex);
                            renderCondition(conditions);
                            conditionIndex++
                        })
                    },
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {
                        // 返回信息
                        // 获取数据 组装数据
                        var ccConditions = layero.find('div.cc_condition');
                        var conditions = [];

                        var conditionLen = ccConditions.length;
                        for (var i = 0; i < conditionLen; i++) {
                            var element = ccConditions[i];
                            var data = {};
                            var conditionIndex = $(element).data('index');
                            var $conditionIndexPanel = $('#cc_condition_' + conditionIndex);
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
                                    case 3:
                                        data['relation'] = $conditionIndexPanel.find('.con_relatio2').val();

                                        var organizations = $conditionIndexPanel.find('input.ipt-select-value').val();
                                        data['organizations'] = JSON.parse(organizations);
                                        break;
                                    default:
                                        break
                                }

                                conditions.push(data);
                            }
                        }

                        var subjects = [];
                        var $typeCheckeds = layero.find("input[name='type']:checked");
                        var len = $typeCheckeds.length;
                        for (var idex = 0; idex < len; idex++) {
                            var ele = $typeCheckeds[idex];
                            var subject = {};
                            subject['type'] = parseInt($(ele).val());
                            if (subject.type == 1) {
                                var users = layero.find('input#ipt-cc-select-value').val();
                                subject['users'] = JSON.parse(users);
                                if (!subject['users'] || subject['users'].length <= 0) {
                                    layer.msg('请选择指定人员');
                                    return;
                                }
                            }
                            subjects.push(subject);
                        }

                        if (subjects.length <= 0) {
                            layer.msg('请选择抄送人');
                            return;
                        }

                        ccCondition.push({
                            weight: 1,
                            condition: conditions,
                            subject: subjects,
                            id: JTDC.guid()
                        });
                        console.log(ccCondition);
                        $(el.val).val(JSON.stringify(ccCondition));
                        renderTable();
                        layer.close(index);
                    }
                });
            });
            $(el.conditionDt).on('click', 'button.act-remove', function (e) {
                e.preventDefault();
                var id = $(this).data('id');
                ccCondition.forEach(function (val, index) {
                    if (val.id == id) {
                        ccCondition.splice(index, 1);
                    }
                });
                $(el.val).val(JSON.stringify(ccCondition));
                $(el.conditionDt).find('#line_table_' + id).remove();
            });
        };

        dataInit();

        renderTable();

        // 绑定事件

        lcInitEvents();
    });