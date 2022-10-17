define(function (require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var Widget = require('../../../component/widget');
    var components = require('../../../component/index');
    var constants = require('../../constants');

    var FlowOperationWidget = Class.create({
        extend: Widget,
        _defaultOptions: function () {
            return Foundation.apply(FlowOperationWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fx_flow_operation flow",
                items: [],
                value: {},
                onAfterEdit: null
            });
        },
        _init: function () {
            FlowOperationWidget.superclass._init.apply(this);
            var options = this.options;
            this._createHead();
            this._createFieldList()
        },

        _createHead: function () {
            this.el.header = $('<div class="head"><a class="opt">可见</a><a class="opt">可编辑</a></div>').appendTo(this.el.target);
        },

        _createFieldList: function () {
            var options = this.options;
            if (!Foundation.isEmpty(this.el.list)) {
                this.el.list.empty();
            } else {
                this.el.list = $("<ul/>").appendTo(this.el.target);
            }

            this._createSelectAllItemElement();
            Foundation.Array.forEach(options.items, function (item) {
                this._createItem(item)
            }, this);
        },


        _createSelectAllItemElement: function () {
            var self = this;
            var itemElement = $('<li class="select-all"/>').append($("<span />").text("全选")).appendTo(this.el.list);

            this.enableAllCheckbox = new components.CheckBox({
                renderEl: $('<a class="edit"/>').appendTo(itemElement),
                onStateChange: function (value) {
                    self.setSelectAll("enable", value)
                }
            });
            this.visibleAllCheckbox = new components.CheckBox({
                renderEl: $('<a class="view"/>').appendTo(itemElement),
                onStateChange: function (value) {
                    self.setSelectAll("visible", value)
                }
            });
        },

        _createItem: function (item) {
            var title = item.title;
            var widgetName = item.widgetName;

            var itemElement = $("<li />").append($("<span />").text(title)).appendTo(this.el.list);
            itemElement.data('widgetName', widgetName);

            var enableElement = $('<a class="x-check edit" data-type="enable"/>').append('<i class="x-iconfont">').appendTo(itemElement);
            var visibleElement = $('<a class="x-check view" data-type="visible"/>').append('<i class="x-iconfont">').appendTo(itemElement);

            this.el.item = this.el.item || {};
            this.el.item[widgetName] = itemElement;
            this.el.item[Foundation.String.format('{0}_{1}', widgetName, 'enable')] = enableElement;
            this.el.item[Foundation.String.format('{0}_{1}', widgetName, 'visible')] = visibleElement;
        },

        _initEvents: function () {
            this._bindDelegateEvent(this.el.list, 'li:not(.select-all) a.x-check', 'click', '_onItemCheckElementClick');
        },

        _onItemCheckElementClick: function (element, event) {
            var type = element.attr('data-type');
            var itemElement = element.closest('li');
            var widgetName = itemElement.data('widgetName');
            this._setItemValue(widgetName, type, 'toggle', false);
            this._applyCallback(this.options.onAfterEdit, this, [type]);
        },

        _isSelectAll: function (type) {
            var value = this.value || {};
            var flag = true;
            var liElements = this.el.list.find('li:not(.select-all)');
            if (Foundation.isEmpty(liElements)) {
                return false
            }
            liElements.each(function () {
                var widgetName = $(this).data('widgetName');
                if (widgetName) {
                    var itemValue = value[widgetName] || {};
                    if (!itemValue[type]) {
                        flag = false;
                        return false
                    }
                }
            });
            return flag;
        },

        setSelectAll: function (type, value) {
            var self = this;
            this.el.list.find('li:not(.select-all)').each(function () {
                var widgetName = $(this).data('widgetName');
                if (widgetName) {
                    self._setItemValue(widgetName, type, value, false);
                }
            });
            this._applyCallback(this.options.onAfterEdit, this, [type]);
        },

        _setItemValue: function (widgetName, type, value, setAllValue) {
            var _value = value;
            if (!setAllValue) {
                var _itemValue = this.value[widgetName];
                if (Foundation.isEmpty(_itemValue)) {
                    _itemValue = this.value[widgetName] = {};
                }
                if (value == 'toggle') {
                    _value = _itemValue[type] = !(!!_itemValue[type]);
                } else {
                    _value = _itemValue[type] = value;
                }
            }

            var checkboxElement = this.el.item[Foundation.String.format('{0}_{1}', widgetName, type)];
            if (Foundation.isEmpty(checkboxElement)) {
                return
            }
            checkboxElement.toggleClass('select', _value);

            if (!setAllValue) {
                this._checkAllCheckBoxValue(type);
            }
        },

        _checkAllCheckBoxValue: function (type) {
            var checkbox = type == 'enable' ? this.enableAllCheckbox : this.visibleAllCheckbox;
            checkbox.setValue(this._isSelectAll(type));
        },

        _formatItemValue: function (value) {
            var enable = false;
            var visible = false;

            if (value == 1) {
                enable = true;
                visible = false;
            } else if (value == 2) {
                enable = false;
                visible = true;
            } else if (value == 3) {
                enable = true;
                visible = true;
            }
            return {
                enable: enable,
                visible: visible
            }
        },

        _parseItemValue: function (itemValue) {
            var enable = itemValue.enable;
            var visible = itemValue.visible;
            if (enable && visible) {
                return 3
            } else if (enable && !visible) {
                return 1
            } else if (!enable && visible) {
                return 2
            } else {
                return 0
            }
        },

        setValue: function (value) {
            var self = this;

            this.value = {};
            Foundation.Object.each(value || {}, function (name, value) {
                this.value[name] = this._formatItemValue(value || 0);
            }, this);

            this.el.list.find('li:not(.select-all)').each(function () {
                var widgetName = $(this).data('widgetName');
                if (widgetName) {
                    var itemValue = self.value[widgetName] || {};
                    self._setItemValue(widgetName, 'enable', itemValue.enable || false, true);
                    self._setItemValue(widgetName, 'visible', itemValue.visible || false, true);
                }
            });
            this._checkAllCheckBoxValue("enable");
            this._checkAllCheckBoxValue("visible");
        },

        getValue: function () {
            var value = {};
            Foundation.Object.each(this.value || {}, function (name, itemValue) {
                value[name] = this._parseItemValue(itemValue);
            }, this);
            return value
        }

    });

    Widget.register('x-flow-operation', FlowOperationWidget);

    return FlowOperationWidget;
});