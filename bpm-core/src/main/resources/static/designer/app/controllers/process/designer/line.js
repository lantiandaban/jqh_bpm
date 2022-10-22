/**
 *
 * @author sog
 * @version 1.0
 */
'use strict';
require(
    ['text!view/process/line_table_tbody.hbs',
        'text!view/process/line_condition.hbs'
        , 'modules/employee-dialog'
        , 'modules/organization-dialog'
        , 'modules/position-dialog'
    ],
    function (tbodyTxt, conditionTxt, personDialog, organizationDialog, positionDialog) {

        var lineCondition = [];
        var select2Fields = [];
        var UserProjectRelation = [
            {id: 'project_manager', text: '表单项目的项目经理'},
            {id: 'project_director', text: '表单项目的项目总监'},
            {id: 'project_presale_head', text: '表单项目的售前负责人'}
        ];
        var ProjectRoles = [
            {id: 1, text: '项目经理'},
            {id: 2, text: '项目总监'},
            {id: 3, text: '项目售前负责人'}
        ];

        var includeRelatios = [
            {id: 'include', text: '包含'}
            , {id: 'exclude', text: '不包含'}
        ];

        var existRelatios = [
            {id: 'exist', text: '存在'}
            , {id: 'nothingness', text: '不存在'}
        ];

        var yesRelations = [
            {id: 'is', text: '是'}
            , {id: 'not', text: '不是'}
        ];

        var tbodyTpl = Handlebars.compile(tbodyTxt);
        var lineCondtionTpl = Handlebars.compile(conditionTxt);
        var el = {
            val: '#condition_val',
            conditionDt: '#line_condtion_dt'
        };

        var dataInit = function () {
            var txtValue = $(el.val).val();
            if (txtValue) {
                lineCondition = JSON.parse(txtValue);
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
            var html = tbodyTpl(lineCondition);
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
                    $.each(lineCondition, function (coi, liCond) {
                        if (liCond.id == dataId) {
                            liCond.weight = newWeigth;
                        }
                    });
                    $(el.val).val(JSON.stringify(lineCondition));
                }
            })

        };

        var renderCondition = function (conditions) {
            var typeEventFunc = function (evt) {
                var type = this.value;
                var $selInclude = conditions.find('select.con_relatio2');
                var $formFieldSelect = conditions.find('select.con_field');
                var $comboValueSelect = conditions.find('select.combo_value');
                var $comboValue2Select = conditions.find('select.combo_value2');
                var $relationSelect = conditions.find('select.con_relatio');
                if (type === '1') {
                    if ($selInclude.hasClass("select2-hidden-accessible")) {
                        $selInclude.find('option').remove();
                        $selInclude.select2('destroy').hide();
                    }
                    if ($comboValueSelect.hasClass("select2-hidden-accessible")) {
                        $comboValueSelect.select2('destroy').html("").hide();
                    }
                    if ($comboValue2Select.hasClass("select2-hidden-accessible")) {
                        $comboValue2Select.select2('destroy').html("").hide();
                    }
                    $formFieldSelect.show().select2({
                        dropdownCssClass: 'increasedzindexclass',
                        language: 'zh-CN',
                        data: select2Fields,
                        multiple: false
                    });
                    $relationSelect.show().select2({
                        dropdownCssClass: 'increasedzindexclass',
                        language: 'zh-CN'
                    });
                    conditions.find('input.ipt-value').show()
                        .removeClass('w300')
                        .data('action', 0)
                        .prop('placeholder', '请输入条件值')
                        .prop('readonly', false);
                } else if (type === '5') {
                    if ($formFieldSelect.hasClass("select2-hidden-accessible")) {
                        $formFieldSelect.find('option').remove();
                        $formFieldSelect.select2('destroy').hide();
                    }
                    if ($relationSelect.hasClass("select2-hidden-accessible")) {
                        $relationSelect.select2('destroy').hide();
                    }
                    if ($comboValue2Select.hasClass("select2-hidden-accessible")) {
                        $comboValue2Select.select2('destroy').html("").hide();
                    }

                    if ($selInclude.hasClass("select2-hidden-accessible")) {
                        $selInclude.find('option').remove();
                    }
                    $selInclude.show().select2({
                        dropdownCssClass: 'increasedzindexclass',
                        language: 'zh-CN'
                        , data: includeRelatios
                    });

                    if ($comboValueSelect.hasClass("select2-hidden-accessible")) {
                        $comboValueSelect.find('option').remove();
                    }
                    $comboValueSelect.show().select2({
                        dropdownCssClass: 'increasedzindexclass',
                        language: 'zh-CN',
                        tags: true,
                        data: g.project_types,
                        multiple: true
                    });
                    conditions.find('input.ipt-value').hide();
                } else if (type === '6') {
                    if ($formFieldSelect.hasClass("select2-hidden-accessible")) {
                        $formFieldSelect.find('option').remove();
                        $formFieldSelect.select2('destroy').hide();
                    }
                    if ($comboValue2Select.hasClass("select2-hidden-accessible")) {
                        $comboValue2Select.select2('destroy').html("").hide();
                    }
                    if ($selInclude.hasClass("select2-hidden-accessible")) {
                        $selInclude.find('option').remove();
                        $selInclude.select2('destroy').hide();
                    }
                    $relationSelect.show().select2({
                        dropdownCssClass: 'increasedzindexclass',
                        language: 'zh-CN'
                    });

                    if ($comboValueSelect.hasClass("select2-hidden-accessible")) {
                        $comboValueSelect.find('option').remove();
                    }
                    $comboValueSelect.show().select2({
                        dropdownCssClass: 'increasedzindexclass',
                        language: 'zh-CN',
                        tags: true,
                        data: UserProjectRelation,
                        multiple: false
                    });
                    conditions.find('input.ipt-value').data('action', 0).hide();
                } else if (type === '7') {
                    // 项目申请人项目角色
                    conditions.find('input.ipt-value').data('action', 0).hide();
                    if ($relationSelect.hasClass("select2-hidden-accessible")) {
                        $relationSelect.select2('destroy').hide();
                    }
                    if ($formFieldSelect.hasClass("select2-hidden-accessible")) {
                        $formFieldSelect.select2('destroy').hide();
                    }
                    $comboValue2Select.show().select2({
                        dropdownCssClass: 'increasedzindexclass',
                        language: 'zh-CN',
                        data: g.project_types,
                        multiple: true,
                        placeholder: '请选择项目类型'
                    });
                    if ($selInclude.hasClass("select2-hidden-accessible")) {
                        $selInclude.find('option').remove();
                    }
                    $selInclude.show().select2({
                        dropdownCssClass: 'increasedzindexclass',
                        language: 'zh-CN'
                        , data: yesRelations
                    });
                    if ($comboValueSelect.hasClass("select2-hidden-accessible")) {
                        $comboValueSelect.find('option').remove();
                    }
                    $comboValueSelect.show()
                        .select2({
                            dropdownCssClass: 'increasedzindexclass',
                            language: 'zh-CN',
                            data: ProjectRoles,
                            multiple: true,
                            placeholder: '请选择项目角色'
                        });
                } else if (type === '8') {
                    // 表单项目
                    conditions.find('input.ipt-value').data('action', 0).hide();
                    if ($relationSelect.hasClass("select2-hidden-accessible")) {
                        $relationSelect.select2('destroy').hide();
                    }
                    if ($formFieldSelect.hasClass("select2-hidden-accessible")) {
                        $formFieldSelect.select2('destroy').hide();
                    }
                    if ($comboValue2Select.hasClass("select2-hidden-accessible")) {
                        $comboValue2Select.find('option').remove();
                        $comboValue2Select.select2('destroy').hide();
                    }
                    if ($comboValueSelect.hasClass("select2-hidden-accessible")) {
                        $comboValueSelect.find('option').remove();
                    }

                    if ($selInclude.hasClass("select2-hidden-accessible")) {
                        $selInclude.find('option').remove();
                    }
                    $selInclude.show().select2({
                        dropdownCssClass: 'increasedzindexclass',
                        language: 'zh-CN'
                        , data: existRelatios
                    });
                    $comboValueSelect.show()
                        .select2({
                            dropdownCssClass: 'increasedzindexclass',
                            language: 'zh-CN',
                            data: ProjectRoles,
                            multiple: true,
                            placeholder: '请选择项目信息'
                        });
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
                        $comboValueSelect.find('option').remove();
                        $comboValueSelect.select2('destroy').hide();
                    }
                    if ($comboValue2Select.hasClass("select2-hidden-accessible")) {
                        $comboValue2Select.find('option').remove();
                        $comboValue2Select.select2('destroy').hide();
                    }

                    if ($selInclude.hasClass("select2-hidden-accessible")) {
                        $selInclude.find('option').remove();
                    }
                    $selInclude.show().select2({
                        dropdownCssClass: 'increasedzindexclass',
                        language: 'zh-CN'
                        , data: includeRelatios
                    });
                    conditions.find('input.ipt-value').show()
                        .data('action', type)
                        .addClass('w300')
                        .prop('placeholder', tip)
                        .prop('readonly', true);
                }
            };
            conditions.find('select.con_type').select2({
                dropdownCssClass: 'increasedzindexclass',
                language: 'zh-CN'
            }).on("select2:select", typeEventFunc);
            conditions.find('select.con_relatio').select2({
                dropdownCssClass: 'increasedzindexclass',
                language: 'zh-CN'
            });
            conditions.find('select.con_field').select2({
                dropdownCssClass: 'increasedzindexclass',
                language: 'zh-CN',
                data: select2Fields
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
                        case 4:
                            personDialog.open({
                                choices: selectObj,
                                type: 1,
                                callback: function (choiceOrganizations) {
                                    if (choiceOrganizations) {
                                        var names = [];
                                        var userArray = [];
                                        $.each(choiceOrganizations, function (i, val) {
                                            names.push(val.name);
                                            val.orgId = val.orgId.replace("ORG", "");
                                            userArray.push(val)
                                        });
                                        iptSelect.val(JSON.stringify(userArray));
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

        var lcInitEvents = function () {
            $('#btn_create_condition').click(function (e) {
                e.preventDefault();
                var conditionIndex = 1;
                layer.open({
                    type: 1,
                    isOutAnim: false,
                    closeBtn: false,
                    shade: 0.3,
                    area: ['650px', '95%'],
                    title: '条件设置',
                    content: '<div class="p10" id="condition_panel"></div>',
                    success: function (layero, index) {
                        var $content = layero.find('.layui-layer-content');
                        $content.css('overflow', 'hidden');
                        // 初始化信息
                        var conditionHtml = lineCondtionTpl({index: conditionIndex, add: true});
                        var panel = layero.find('#condition_panel');
                        panel.html(conditionHtml);
                        var conditions = panel.find('#line_condition_1');
                        renderCondition(conditions);
                        conditionIndex++;
                        conditions.find('button.act_add_condition').click(function () {
                            var conditionHtml = lineCondtionTpl({
                                index: conditionIndex,
                                add: false
                            });
                            panel.append(conditionHtml);
                            var conditions = panel.find('#line_condition_' + conditionIndex);
                            renderCondition(conditions);
                            conditionIndex++
                        })
                    },
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {
                        // 返回信息
                        // 获取数据 组装数据
                        var lineConditions = layero.find('div.line_condition');
                        var conditions = [];
                        $.each(lineConditions, function (i, element) {
                            var data = {};
                            var conditionIndex = $(element).data('index');
                            var $conditionIndexPanel = $('#line_condition_' + conditionIndex);
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
                                            var p_type;
                                            var len = projectTypes.length;
                                            for (var j = 0; j < len; j++) {
                                                p_type = projectTypes[j];
                                                p_types.push({id: p_type.id, name: p_type.text})
                                            }
                                            data['projectTypes'] = p_types;
                                        }
                                        break;
                                    case 6:
                                        data['relation'] = $conditionIndexPanel.find('.con_relatio').val();

                                        var comboValues = $conditionIndexPanel.find('select.combo_value').select2('data');
                                        if (comboValues && comboValues.length > 0) {
                                            var userProjectSelect = comboValues[0];
                                            data['userProject'] = {
                                                id: userProjectSelect.id,
                                                name: userProjectSelect.text
                                            };
                                        }
                                        break;
                                    case 7:
                                        data['relation'] = $conditionIndexPanel.find('.con_relatio2').val();
                                        var projectTypes2 = $conditionIndexPanel.find('select.combo_value2').select2('data');
                                        if (projectTypes2) {
                                            var p_types2 = [];
                                            var p_type3;
                                            var clen3 = projectTypes2.length;
                                            for (var v3 = 0; v3 < clen3; v3++) {
                                                p_type3 = projectTypes2[v3];
                                                p_types2.push({id: p_type3.id, name: p_type3.text})
                                            }
                                            data['projectTypes'] = p_types2;
                                        }

                                        var projectRoles = $conditionIndexPanel.find('select.combo_value').select2('data');
                                        if (projectRoles) {
                                            var p_roles = [];
                                            var p_role;
                                            var roleSize = projectRoles.length;
                                            for (var r_index = 0; r_index < roleSize; r_index++) {
                                                p_role = projectRoles[r_index];
                                                p_roles.push({id: p_role.id, name: p_role.text})
                                            }
                                            data['projectRoles'] = p_roles;
                                        }
                                        break;
                                    case 8:
                                        data['relation'] = $conditionIndexPanel.find('.con_relatio2').val();
                                        var projectRole_8 = $conditionIndexPanel.find('select.combo_value').select2('data');
                                        if (projectRole_8) {
                                            var p_roles_8 = [];
                                            var p_role_8;
                                            var roleSize_8 = projectRole_8.length;
                                            for (var r_index_8 = 0; r_index_8 < roleSize_8; r_index_8++) {
                                                p_role_8 = projectRole_8[r_index_8];
                                                p_roles_8.push({
                                                    id: p_role_8.id,
                                                    name: p_role_8.text
                                                })
                                            }
                                            data['projectRoles'] = p_roles_8;
                                            console.log('p_roles_8', p_role_8);
                                        }
                                        break;
                                    default:
                                        break
                                }

                                conditions.push(data);
                            }
                        });
                        lineCondition.push({weight: 1, condition: conditions, id: JTDC.guid()});
                        renderTable();
                        layer.close(index);

                        $(el.val).val(JSON.stringify(lineCondition));
                    }
                });
            });

            $(el.conditionDt).on('click', 'button.act-remove', function (e) {
                e.preventDefault();
                var id = $(this).data('id');
                lineCondition.forEach(function (val, index) {
                    if (val.id == id) {
                        lineCondition.splice(index, 1);
                    }
                });
                $(el.val).val(JSON.stringify(lineCondition));
                $(el.conditionDt).find('#line_table_' + id).remove();
            });
        };

        dataInit();

        renderTable();

        // 绑定事件

        lcInitEvents();
    });