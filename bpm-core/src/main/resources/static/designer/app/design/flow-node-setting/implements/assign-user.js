define(function(require, exports, module) {

    var Class = require('Class');
    var Foundation = require('Foundation');
    var components = require('../../../component/index');
    var constants = require('../../constants');
    var AssignUserChoosePanel = require('../ext/assign-user-choose-panel');

    var AssignUserImplement = {

        openAssignUserDialog: function(callback) {
            var self = this;
            this._callbackFn = callback;
            this._assignUserDialog = new components.ConfirmDialog({
                title: "选择审批人员",
                width: 500,
                height: 550,
                onContentCreate: function (content) {
                    self._createAssignUserChoosePanel(content);
                    return false;
                },
                onOk: this._onAssignUserDialogConfirm.bind(this),
                onClose: this._onAssignUserDialogClose.bind(this)
            });
            this._assignUserDialog.open();
        },

        _onAssignUserDialogConfirm: function () {
            var value = this._assignUserChoosePanel.getValue();
            this.setNodeSetting('assignUsers', value);
            this._callbackFn && this._callbackFn.call(this, value);
        },

        _onAssignUserDialogClose: function () {
            this._assignUserChoosePanel.destroy();
        },

        _createAssignUserChoosePanel: function (content) {
            this._assignUserChoosePanel = new AssignUserChoosePanel({
                userIdKey: 'id',
                userNameKey: 'name',
                value: this.getNodeSettingByName('assignUsers')
            });
            this._assignUserChoosePanel.el.target.appendTo(content)
        }
    };

    return AssignUserImplement
});