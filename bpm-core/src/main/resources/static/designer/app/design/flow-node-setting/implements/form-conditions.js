define(function(require, exports, module) {

    var Class = require('Class');
    var Foundation = require('Foundation');
    var components = require('../../../component/index');
    var constants = require('../../constants');
    var FormConditionsPanel = require('../ext/form-conditions-panel');

    var FormConditionsImplement = {

        openFormConditionsDialog: function() {
            var self = this;
            this._formConditionsDialog = new components.ConfirmDialog({
                title: "表单条件设置",
                width: 1200,
                height: 550,
                onContentCreate: function (content) {
                    self._createFormConditionsPanel(content, self._getFormItemsComboData());
                    return false;
                },
                onOk: this._onFormConditionsDialogConfirm.bind(this),
                onClose: this._onFormConditionsDialogClose.bind(this)
            });
            this._formConditionsDialog.open();
        },

        _onFormConditionsDialogConfirm: function () {
            var conditionsItems = this._formConditionsPanel.getConditionsItems();
            this.setNodeSetting('conditionsItems', conditionsItems);
        },

        _onFormConditionsDialogClose: function () {
            this._formConditionsPanel.destroy();
        },

        _createFormConditionsPanel: function (content, formItems) {
            this._formConditionsPanel = new FormConditionsPanel({
                formItems: formItems,
                conditionsItems: this.getNodeSettingByName('conditionsItems')
            });
            this._formConditionsPanel.el.target.appendTo(content)
        }

    };

    return FormConditionsImplement
});