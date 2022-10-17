  

/**
 *
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
    var positionChoiceTree;

    var tree_setting = {
        check: {
            chkboxType: {"Y": "", "N": ""},
            enable: false //单选，

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
                        if (dataRes.id == '0000' + choiceData.id) {
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
        callback: {}
    };

    var _initPositionTree = function ($treeDom) {

        if (self.options.multiple) {
            tree_setting.check.enable = true
        }

        positionChoiceTree = $treeDom.initZtree({
            service: g.ctx + 'process/tree/rest/position'
        }, tree_setting);
    };

    var _openDialog = function () {
        var callbackFunc = self.options.callback;

        layer.open({
            type: 1,
            isOutAnim: false,
            shade: 0.3,
            closeBtn: false,
            area: ['350px', '500px'],
            title: '职位树',
            content: '<ul class="ztree" id="toa_choice_dialog_position" ' +
            ' style="height:400px;overflow:auto;"></ul>',
            success: function (layero, index) {

                var treeDom = layero.find('#toa_choice_dialog_position');

                _initPositionTree(treeDom);
            },
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var nodes = positionChoiceTree.getCheckedNodes(true);

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