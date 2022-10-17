/**
 *
 * @author BOGON
 * @version 1.0
 */

define(function (require, exports, module) {

    var choiceTxt = '{{#each this}}<li class="task-item info br-b ui-sortable-handle"' +
        ' id="pduser-{{id}}">' +
        '<div class="task-handle"> <div class="checkbox-custom"><i class="fa {{icon}}"></i>' +
        '</div></div><div class="task-desc">{{name}}</div>' +
        '<div class="task-menu act-remove" data-id="{{id}}" data-type="{{type}}"></div>' +
        '</li>{{/each}}';

    var choiceFunc = Handlebars.compile(choiceTxt);

    var dailogFunc = Handlebars.compile(require('text!view/dialog/person-dialog.hbs'));

    var constonts = {
        USER: 1,
        USER_AND_ORG: 2
    };

    var _data = {
        multiple: true,    // 单选多选设置:true:多选;false:单选
        type: constonts.USER_AND_ORG,            // 选择类型:1.单独选择员工;2.选择员工和部门
        choices: {
            organizations: [],
            users: []
        }         // 已选中的数据
    };

    /**
     * 树的请求数据源地址
     */
    var service_urls = {
        '1': g.ctx + 'uc/tree/rest/organization/employee',
        '2': g.ctx + 'uc/tree/rest/position/employee'
    };

    var el = {
        orgTree: '#person-dialog-org-tree'
    };

    // 初始化分成以下几个步骤
    // 1. 构建左侧的树信息，需要根据参数进行判断是否是员工或者组织机构树
    // 2. 绑定树的事件信息，点击选中等事件
    // 3. 处理选中的事情

    var deptTree;

    var renderPeanel = function (datas) {
        // 渲染数据
        var chioceHtml = choiceFunc(datas);
        $("#person-dialog-exist-box").append(chioceHtml);
    };

    var nodeData = function (node) {
        var icon = _data.type === 1 ? 'fa-user' : 'fa-group';
        var _nodes = [node.name];
        var pNode = node.getParentNode();
        if (!!pNode) {
            _nodes.push(pNode.name);
        }
        while (!!pNode) {
            pNode = pNode.getParentNode();
            if (pNode) {
                _nodes.push(pNode.name);
            }
        }
        var reverseNodes = _nodes.reverse();// 名称数组反转
        var name = reverseNodes.join('-');

        var length = JTDC.plusLength(name);
        if (length > 30) {
            var subStr1 = name.substr(0, 10);
            var subStr2 = name.substr(name.length - 5, 10);
            name = subStr1 + "..." + subStr2;
        }
        return {id: node.id, name: name, type: _data.type, icon: icon};
    };

    var renderRightPanel = function () {
        // 取得所有已勾选的数据
        var nodes = deptTree.getCheckedNodes(true);
        if (!nodes) {
            return;
        }
        var renderDatas = [];
        $.each(nodes, function (i, node) {
            renderDatas.push(nodeData(node))
        });
        renderPeanel(renderDatas);
    };

    var removePanel = function (nodeId) {
        var node = deptTree.getNodeByParam("id", nodeId, null);
        deptTree.checkNode(node, false, false);
        $('#person-dialog-exist-box').find('#pduser-' + nodeId).remove();
        onCheckPanel();
    };

    var onCheckPanel = function () {
        // 取得所有已勾选的数据
        var checkedNodes = deptTree.getCheckedNodes(true);
        console.info(checkedNodes);
        $('#person-dialog-exist-box').empty();
        _data.choices = {organizations: [], users: []};
        for (var i = 0; i < checkedNodes.length; i++) {
            if (checkedNodes[i].data.code == undefined
                && checkedNodes[i].id != 0) {
                renderPeanel([nodeData(checkedNodes[i])]);
                _data.choices.users.push(checkedNodes[i].data);
            } else if (checkedNodes[i].data.orgId == undefined
                && checkedNodes[i].id != 0) {
                renderPeanel([nodeData(checkedNodes[i])]);
                _data.choices.organizations.push(checkedNodes[i].data);
            }
        }
    }

    var renderLeftTree = function (type) {
        var check = {chkboxType: {"Y": "", "N": ""}, enable: true};
        if (!_data.multiple) {
            check['chkStyle'] = 'radio';
            check['radioType'] = 'all';
        }
        var choices = _data.choices;// 已勾选的数据
        var treeSettings = {
            check: check,
            view: {
                showLine: true
            },
            dataLoad: function (data) {
                // 加载数据成功后，选中效果处理
                if (data && choices) {
                    // choices 的格式为 {"organizations":[], "users":[]} organziation的树里面的数据以 00开头
                    var org = choices.organizations;
                    if (org) {
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < org.length; j++) {
                                // 如果正好是已勾选的数据，设置其勾选并打开状态
                                if (data[i].id == '00' + org[j].id) {
                                    data[i].checked = true;
                                    data[i].open = true;
                                    break;
                                }
                            }
                        }
                    }
                    var emp = choices.users;
                    if (emp) {
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < emp.length; j++) {
                                // 如果正好是已勾选的数据，设置其勾选并打开状态
                                if (emp[j].id == data[i].id) {
                                    data[i].checked = true;
                                    data[i].open = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                return data;
            },
            dataRead: function () {
                // 数据加载成功，开始渲染右侧已勾选的数据
                if (choices) {
                    renderRightPanel();
                }
            },
            callback: {
                onCheck: function (event, treeId, _treeNode) {
                    onCheckPanel();
                }
            }
        };
        var service_url = service_urls[type];
        if (_data.type === constonts.USER) {
            service_url = service_url + '?onlyChoiceUser=1'
        }
        // 树的初始化
        deptTree = $(el.orgTree).initZtree({
            service: service_url, async: false
        }, treeSettings);

    };

    var deleteChoice = function (target) {
        var delId = $(target.currentTarget).data("id");
        removePanel(delId);

    };
    var loadEmployee = function (name, process) {
        $.ajax({
            url: g.ctx + 'uc/employee/rest/search',
            data: {name: name},
            type: 'GET',
            timeout: 30000,
            showLoadingTip: false
        }).done(function (data) {
            process(data);
        }).fail(function (data) {
        }).always(function () {
        });
    };
    var _openAndInit = function (_options) {
        _data = $.extend({}, _data, _options);
        if (!_data.type) {
            _data.type = constonts.USER_AND_ORG;
        }
        var title = '部门员工选择';
        if (_data.type === constonts.USER) {
            title = '员工选择';
        }
        layer.open({
            type: 1,
            isOutAnim: false,
            closeBtn: false,
            title: title,
            area: ['600px'],
            shadeClose: true, //开启遮罩关闭
            content: dailogFunc({onlyUser: _data.type === constonts.USER}),
            btn: ['保存', '取消'],
            yes: function (index, layero) {
                _options.callback && _options.callback(_data.choices);
                layer.close(index);
            },
            success: function (layero, index) {
                layer.setTop(layero);

                renderLeftTree(1);

                layero.on('click', '.act-remove', deleteChoice); // 绑定删除事件

                layero.find('.typeahead').typeahead({
                    hint: true,
                    highlight: true,
                    minLength: 1
                }, {
                    name: 'id',
                    displayKey: 'userName',
                    source: loadEmployee
                }).bind('typeahead:selected', function ($e, datum) {
                    var _employee = {};
                    _employee.id = datum.id;
                    _employee.name = datum.name;
                    var node = deptTree.getNodeByParam("id", "" + _employee.id, null);
                    if (node) {
                        deptTree.checkNode(node, true, false);
                        //renderPeanel([nodeData(node)]);
                        deptTree.expandNode(node, true, false, true);
                        onCheckPanel();
                    }
                    layero.find('#keyword').val('');
                });
                layero.find(".tab-select").on('click', function (target) {
                    var tabType = $(target.currentTarget).data("name");
                    if (tabType === 'org') {
                        renderLeftTree(1);
                    } else {
                        renderLeftTree(2);
                    }
                });

            }
        })
    };

    return {
        open: _openAndInit
    };
});