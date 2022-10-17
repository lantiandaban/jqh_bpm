  

/**
 * 部门选择器
 * @author sog
 * @version 1.0
 */
define(
    function (require, exports, module) {

        var self = this;

        /**
         * 默认配置
         */
        var default_options = {
            // 多选配置
            multiple: true,
            choices: []
        };
        var orgChoiceTree;

        var org_tree_setting = {
            check: {
                chkboxType: {"Y": "s", "N": "s"},
                enable: true, //单选
                radioType: "all" // 对所有节点设置单选
            },
            view: {
                showLine: true
            },
            dataLoad: function (orgainzationDataRes) {
                // 重新对获取的数据进行选中处理
                var choices = self.options.choices;
                if (choices && choices.length > 0
                    && orgainzationDataRes && orgainzationDataRes.length > 0) {
                    var datas = [];
                    var len = orgainzationDataRes.length;
                    for (var i = 0; i < len; i++) {
                        var dataRes = orgainzationDataRes[i];
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
                return orgainzationDataRes;
            },
            callback: {a:()=>{}}
        };

        var _initOrganizationTree = function ($treeDom) {

            if (!self.options.multiple) {
                org_tree_setting.check.chkStyle = 'radio';
            }

            orgChoiceTree = $treeDom.initZtree({
                service: g.ctx + 'process/tree/rest/organization',params:{pid:0}
            }, org_tree_setting);
        };

        var _openDialog = function () {
            var callbackFunc = self.options.callback;

            layer.open({
                type: 1,
                isOutAnim: false,
                shade: 0.3,
                closeBtn: false,
                area: ['350px', '500px'],
                title: '组织机构树',
                content: '<ul class="ztree br-a" id="toa_choice_dialog_orgainzation" style="height:400px;overflow:auto;"></ul>',
                success: function (layero, index) {

                    var treeDom = layero.find('#toa_choice_dialog_orgainzation');

                    _initOrganizationTree(treeDom);
                },
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var nodes = orgChoiceTree.getCheckedNodes(true);

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
    }
);