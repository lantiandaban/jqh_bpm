define(function (require, exports, module) {

    var Hamster = require('lib/index');
    var importDetailHtml = require('text!view/approval/form/reimbursing-import-detail.hbs');

    /**
     * 费用报销导入弹出框
     * */
    var ReimbursingImportDialog = Class.create({

        statics: {},

        extend: Hamster.ui.Dialog,

        title: '记账导入',

        width: 610,

        height: 460,

        processId: null,

        valueMap: null,

        contentHtml: importDetailHtml,

        contentPadding: 10,

        _beforeInit: function () {
            this.btnItems = [
                {
                    name: 'confirm',
                    icon: 'ui-icon-check',
                    title: "确定",
                    handler: this.onConfirm.bind(this)
                }
            ];
            ReimbursingImportDialog.superclass._beforeInit.apply(this);
        },

        _init: function () {
            ReimbursingImportDialog.superclass._init.apply(this);
            var self = this;

            this._loader = this._loader || new Hamster.ui.Loader({
                    text: '数据加载中...',
                    container: this.getBodyElement()
                });

            this._loader.start();
            var dataHttpAjax = new HttpAjax({
                url: 'api/bill/import/item/select',
                type: 'GET',
                params: {}
            });
            dataHttpAjax.successHandler(function (result) {
                self.valueMap = {};
                self.valueMap.project = result.shouqian || [];
                self.valueMap.customer = result.shishi || [];
                self._loader.stop();
            });
            dataHttpAjax.failureHandler(function (result) {
                self._loader.stop();
            });
            dataHttpAjax.send();
        },

        onRenderContent: function () {
            ReimbursingImportDialog.superclass.onRenderContent.apply(this);

            this.monthDateTimeInput = new Hamster.ui.FormDateTime({
                targetEl: $('#reimbursing-import-month'),
                placeholder: "请选择月份",
                chooseType: "month",
                format: 'yyyy-MM'
            });

            this.typeCombox = new Hamster.ui.ComboBox({
                targetEl: $('#reimbursing-import-type'),
                placeholder: "请选择类型",
                items: [
                    {
                        text: '售前',
                        value: 1
                    }, {
                        text: '实施',
                        value: 2
                    }
                ]
            });
            this.typeCombox.on('change', this.onTypeComboxChange, this);

            this.valueCombox = new Hamster.ui.ComboBox({
                targetEl: $('#reimbursing-import-value'),
                placeholder: "请选择",
                items: [],
                valueField: 'id',
                displayField: 'name'
            });
            this.valueCombox.on('expand', this.onValueComboxExpand, this);
        },

        onTypeComboxChange: function (value) {
            this.valueCombox.setValue(null);
            if (Hamster.isEmpty(this.valueMap)) {
                return
            }
            if (value == 1) {
                this.valueCombox.setPlaceholder('请选择客户')
            } else {
                this.valueCombox.setPlaceholder('请选择项目')
            }
            var data = (value == 1 ? this.valueMap.project : this.valueMap.customer) || [];
            this.valueCombox.setData(data)
        },

        onValueComboxExpand: function () {
            var typeValue = this.typeCombox.getValue();
            if (!typeValue) {
                return;
            }
            var data = this.valueCombox.getData();
            if (Hamster.isEmpty(data)) {
                layer.open({
                    title: '温馨提示',
                    content: typeValue == 1 ? "你还没有记账客户,请在星云手机端进行记账" : "你还没有记账项目,请在星云手机端进行记账",
                    icon: 2
                });
            }
        },

        onConfirm: function () {
            var self = this;

            var month = this.monthDateTimeInput.getValue();
            var type = this.typeCombox.getValue();
            var value = this.valueCombox.getValue();

            if (Hamster.isEmpty(month) || Hamster.isEmpty(type) || Hamster.isEmpty(value)) {
                Hamster.ui.Message.warning('信息填写不完整!');
                return;
            }

            this._loader.start();

            var dataHttpAjax = new HttpAjax({
                url: 'api/bill/import/item/tally',
                type: 'GET',
                params: {
                    processId: this.processId,
                    date: month.substring(0, 7),
                    type: type,
                    subjectId: value
                }
            });
            dataHttpAjax.successHandler(function (result) {
                self.fireEvent('success', result);
                self._loader.stop();
                self.close();
            });
            dataHttpAjax.failureHandler(function (result) {
                self._loader.stop();
            });
            dataHttpAjax.send();
        },

        destroy: function () {
            this._loader.destroy();
            ReimbursingImportDialog.superclass.destroy.apply(this, arguments);
        }

    });

    return ReimbursingImportDialog;
});