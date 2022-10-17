define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var constants = require('../constants');
    var Widget = require('../../component/widget');
    var components = require('../../component/index');

    var editItems = [{
            text: '自定义',
            value: 'px'
        },
        {
            text: '比例',
            value: 'flex',
            selected: true
        }
    ];

    var ColumnWidthEditPanel = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(ColumnWidthEditPanel.superclass._defaultOptions.apply(this), {
                baseCls: "m-table-column-edit-body",
                items: []
            });
        },
        _init: function() {
            ColumnWidthEditPanel.superclass._init.apply(this);
            Foundation.Array.forEach(this.options.items, function(item, i) {
                this._createColumnItemElement(item, i);
            }, this);
        },

        _createColumnItemElement: function(item, i) {
            var rowElement = $('<div />').addClass('row');
            rowElement.append("<span>第" + (i + 1) + "列</span>");
            var typeWidget = new components.ComboBox({
                renderEl: $('<div/>').appendTo(rowElement),
                placeholder: "宽度类型",
                width: 170,
                value: item.type,
                items: Foundation.Array.clone(editItems),
                onAfterItemSelect: function(itemElement, _item) {
                    var valueWidget = rowElement.data('value');
                    if (_item.value == 'px') {
                        valueWidget.setValue(100);
                    } else {
                        valueWidget.setValue(1)
                    }
                }
            });
            var valueWidget = new components.Input({
                renderEl: $('<div/>').appendTo(rowElement),
                placeholder: "宽度",
                width: 167,
                value: item.value
            });
            rowElement.data({
                type: typeWidget,
                value: valueWidget
            }).appendTo(this.el.target);
        },

        getValue: function() {
            var self = this;
            var items = [];
            this.el.target.find('.row').each(function() {
                var rowElement = $(this);
                var typeWidget = rowElement.data('type');
                var valueWidget = rowElement.data('value');
                items.push({
                    type: typeWidget.getValue(),
                    value: valueWidget.getValue()
                });
            });
            return items
        }

    });

    Widget.register('x-column-width-edit-panel', ColumnWidthEditPanel);

    return ColumnWidthEditPanel;
});