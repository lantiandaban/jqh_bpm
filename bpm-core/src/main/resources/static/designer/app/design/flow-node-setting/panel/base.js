define(function(require, exports, module) {
    var Class = require('Class');
    var components = require('../../../component/index');
    var Foundation = require('Foundation');
    var ConfigImplement = require('../implements/config');
    var constants = require('../../constants');

    var FlowItemSettingBasePanel = Class.create({
        statics: {
            _panels: {},
            register: function(xtype, panel) {
                this._panels[xtype] = panel;
            },
            create: function(xtype, option) {
                xtype = xtype.toLowerCase();
                var Panel = this._panels[xtype];
                if (Panel) {
                    return new Panel(option);
                }
                return null
            }
        },
        extend: components.SettingPanel,
        implement: [ConfigImplement],
        _defaultOptions: function() {
            return Foundation.apply(FlowItemSettingBasePanel.superclass._defaultOptions.apply(this), {
                formItemWidgets: [],
                linkFlowNodeElement: null,
                setting: {},
                onSettingChange: null
            });
        },
        _beforeInit: function() {
            FlowItemSettingBasePanel.superclass._beforeInit.apply(this);
            this.options.setting = Foundation.apply(this._getDefaultSetting(), this.options.setting);
            this.options.items = Foundation.Array.merge(this.options.items, this._getFlowItemSettingOptions(this.options.formItem));

            if (!Foundation.isEmpty(this.options.linkFlowNodeElement)) {
                var classString = this.options.linkFlowNodeElement.attr('class') || "";
                var classes = classString.split(' ');
                classes.push('actived');
                this.options.linkFlowNodeElement.attr('class', classes.join(' '));
            }
        },

        _init: function () {
            FlowItemSettingBasePanel.superclass._init.apply(this);
            this.el.target.removeClass('empty');
        },


        _getDefaultSetting: function () {
            return {}
        },

        _getFlowItemSettingOptions: function() {
            return []
        },

        setTitleWidgetValue: function (title) {
            this.options.setting.title = title;
            var titleInput = this.getWidgetByName('titleInput');
            titleInput.setValue(title);
        },

        setNodeSetting: function (name, value) {
            this.options.setting[name] = value;
            this._applyCallback(this.options.onSettingChange, this, [name, value]);
        },

        getNodeSettingByName: function (name, def) {
            return this.options.setting[name] || def
        },

        destroy: function(remove) {
            if (!Foundation.isEmpty(this.options.linkFlowNodeElement)) {
                var classString = this.options.linkFlowNodeElement.attr('class') || "";
                var classes = classString.split(' ');
                classes = Foundation.Array.remove(classes, 'actived');
                this.options.linkFlowNodeElement.attr('class', classes.join(' '));
            }
            this.el.target.addClass('empty');
            FlowItemSettingBasePanel.superclass.destroy.apply(this, arguments);
        }

    });

    return FlowItemSettingBasePanel;

});