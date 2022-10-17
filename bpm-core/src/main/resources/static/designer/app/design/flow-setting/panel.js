define(function(require, exports, module) {

    var Class = require('Class');
    var components = require('../../component/index');
    var Foundation = require('Foundation');

    var FlowSettingPanel = Class.create({
        extend: components.SettingPanel,

        _defaultOptions: function() {
            return Foundation.apply(FlowSettingPanel.superclass._defaultOptions.apply(this), {
                setting: {},
                onCloseFlow: null
            });
        },

        _beforeInit: function() {
            FlowSettingPanel.superclass._beforeInit.apply(this);
            this.options.items = Foundation.Array.merge(this.options.items, this._getFormSettingOptions());
        },

        setSetting: function (name, value) {
            this.options.setting[name] = value;
            this._applyCallback(this.options.onSettingChange, this, [name, value]);
        },

        getSettingByName: function (name, def) {
            return this.options.setting[name] || def
        },

        _getFormSettingOptions: function() {
            var self = this;
            var options = this.options;

            return [{
                xtype: 'title',
                title: "设置"
            }, {
                xtype: "tablecontainer",
                rowSize: [20],
                colSize: ["auto", 20],
                items: [
                    [{
                        xtype: 'checkbox',
                        text: '流程发起后允许撤回',
                        value: this.getSettingByName('allowRevoke'),
                        onStateChange: function(selected) {
                            self.setSetting('allowRevoke', selected)
                        }
                    }, {
                        xtype: "tooltip",
                        style: "tip",
                        text: "流程发起后允许自由撤回"
                    }]
                ]
            }, "-", {
                xtype: 'button',
                style: 'red',
                text: "关闭流程",
                onClick: function() {
                    self._applyCallback(options.onCloseFlow, this);
                }
            }]
        }
    });
    return FlowSettingPanel;
});