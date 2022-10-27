  

/**
 * 员工选择器
 * @author sog
 * @version 1.0
 */
define(function (require, exports, module) {
    var self = this;

    /**
     * 默认配置
     */
    var default_options = {
        // 多选配置
        multiple: true,
        choices: []
    };
    var employeeChoiceTree;

    var org_tree_setting = {
        check: {
            enable: true //单选
        },
        view: {
            showLine: true
        },
        dataLoad: function (employeeDataRes) {
            // 重新对获取的数据进行选中处理
            var choices = self.options.choices;
            if (choices && choices.length > 0
                && employeeDataRes && employeeDataRes.length > 0) {
                var datas = [];
                var len = employeeDataRes.length;
                for (var i = 0; i < len; i++) {
                    var dataRes = employeeDataRes[i];
                    $.each(choices, function (coi, choiceData) {
                        if (dataRes.id == '00' + choiceData.id) {
                            dataRes.checked = true;
                            dataRes.open = true;

                        }
                    });
                    datas.push(dataRes);
                }
                return datas;
            }
            return employeeDataRes;
        },
        callback: {}
    };

    var _initOrganizationTree = function ($treeDom) {

        if (!self.options.multiple) {
            org_tree_setting.check.chkStyle = 'radio';
        }

        employeeChoiceTree = $treeDom.initZtree({
            service: g.ctx + 'process/tree/rest/organization/user?onlyChoiceUser=1&state=Y'
        }, org_tree_setting);
    };
    /**
     * 树 查询事件
     */
    var _searchTree = function () {
        var keyword = $('#org_search_name').val();
        // var self = this;
        if (!keyword) {
            return;
        }
        var nodeList = employeeChoiceTree.getNodesByParamFuzzy("name", keyword);
        if (nodeList.length) {
            var flag = true;
            for (var i = 0; i < nodeList.length; i++) {
                if (nodeList[i].checked) {
                    if (i < nodeList.length - 1) {
                        flag = false;
                        nodeList[i++].checked = false;
                        nodeList[i].checked = true;
                        employeeChoiceTree.selectNode(nodeList[i]);
                    }
                }
            }
            if (flag) {
                nodeList[0].checked = true;
                employeeChoiceTree.selectNode(nodeList[0]);
            }
        }
    };

    var _openDialog = function () {
        var callbackFunc = self.options.callback;

        layer.open({
            type: 1,
            isOutAnim: false,
            shade: 0.3,
            closeBtn: false,
            area: ['350px', '500px'],
            title: '员工选择器',
            content: ' <div class="panel-menu br-t-n br-l-n">'+
            '<div class="input-group ">'+
            '<input type="text" id="org_search_name" class="form-control"'+
            'placeholder="输入员工名称搜索">'+
            '<a href="#" class="input-group-addon button pn" id="search_org_by_name">'+
            '<i class="fa fa-search"></i>'+
            '</a>'+
            '</div>'+
            '</div>'+
            '<ul class="ztree br-a" id="toa_choice_dialog_employee" style="height:340px;overflow:auto;"></ul>',
            success: function (layero, index) {

                var treeDom = layero.find('#toa_choice_dialog_employee');

                _initOrganizationTree(treeDom);
                $('#search_org_by_name').on('click',_searchTree);

            },
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var nodes = employeeChoiceTree.getCheckedNodes(true);

                var chooseDatas = [];

                $.each(nodes, function (i, node) {
                    chooseDatas.push(node.data);
                });
                callbackFunc && callbackFunc(chooseDatas);
                layer.close(index);
            }
        });


    };

    exports.open = function (options) {
        self.options = $.extend({}, default_options, options);

        _openDialog();


    };


});