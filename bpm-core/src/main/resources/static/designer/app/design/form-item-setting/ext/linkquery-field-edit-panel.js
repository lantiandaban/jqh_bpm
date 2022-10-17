define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var constants = require('../../constants');
    var Widget = require('../../../component/widget');
    var components = require('../../../component/index');
    var selectFieldPanel = require('./select-field-panel');

    var LinkQueryFieldEditPanel = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(LinkQueryFieldEditPanel.superclass._defaultOptions.apply(this), {
                baseCls: "fx_field_edit_pane",
                allFields: [],
                fields: [],
                onAfterFieldAdd: null,
                onAfterFieldUpdate: null,
                onAfterFieldRemove: null,
                onAfterFieldSorted: null,
                onFinishAdd: null
            });
        },
        _init: function() {
            LinkQueryFieldEditPanel.superclass._init.apply(this);
            this._createFieldList();
            this._setFieldListSortable();
            this._createOperationBtn();
        },

        _createFieldList: function() {
            var options = this.options;
            var warpElement = $('<div/>').appendTo(this.el.target);
            this.el.fieldList = $('<ul class="field-list"/>').appendTo(warpElement);

            Foundation.Array.forEach(options.fields || [], function(field, i) {
                this._addFieldItem(field);
            }, this);
        },

        _addFieldItem: function(fieldItem) {
            var itemElement = $('<div class="field-label"/>')
                .append($('<div class="field-name" style="width: 215px"/>').text(fieldItem.text))
                .append($('<div class="edit-group"/>').append($('<i class="nav nav-edit icon-edit x-c-key hv"/>')).append($('<i class="nav nav-remove icon-field-remove"/>')));

            return $('<li class="field-item main-field"/>')
                .append(itemElement)
                .data("field", fieldItem)
                .appendTo(this.el.fieldList)
        },

        _appendFieldItem: function(fieldItem) {
            var options = this.options,
                field = this._getFieldAttr(fieldItem);
            options.fields.push(field);
            this._addFieldItem(field);
            this._applyCallback(this.options.onAfterFieldAdd, this, [field])
        },

        _getFieldAttr: function(field) {
            return {
                name: field.name,
                text: field.text,
                xtype: field.xtype
            }
        },

        _setFieldListSortable: function() {
            this._dragStartTop = 0;
            this._dragIndex = 0;
            this._dropIndex = 0;
            this.el.fieldList.sortable({
                handle: ".field-name",
                nested: false,
                itemSelector: "li.field-item.main-field",
                onDragStart: this._onItemDragStart.bind(this),
                onDrag: this._onItemDrag.bind(this),
                onDrop: this._onItemDrop.bind(this)
            });
        },

        _onItemDragStart: function($item, container, _super) {
            var offset = $item.offset();
            var g = container.rootGroup.pointer;
            this._dragStartTop = g.top - offset.top;
            this._dragIndex = $item.index();
            _super($item, container);
        },

        _onItemDrag: function($item, position, _super, event) {
            position.left = 0;
            position.top -= this._dragStartTop;
            _super($item, position);
        },

        _onItemDrop: function($item, container, _super) {
            if (container) {
                _super($item, container);
            }
            this._dropIndex = $item.index();
            if (this._dragIndex > -1 && this._dropIndex > -1 && this._dragIndex != this._dropIndex) {
                this.options.fields.splice(this._dropIndex, 0, this.options.fields.splice(this._dragIndex, 1)[0]);
                var field = $item.data('field');
                this._applyCallback(this.options.onAfterFieldUpdate, this, [field]);
                this._applyCallback(this.options.onAfterFieldSorted, this, [field]);
            }
        },

        _createOperationBtn: function() {
            new components.Button({
                width: 100,
                renderEl: $("<div/>").appendTo(this.el.target),
                extClses: ["item-subwidget-add"],
                style: "none",
                iconCls: "icon-add",
                text: "添加字段",
                onClick: this._onAddFieldBtnClick.bind(this)
            })
        },

        _onAddFieldBtnClick: function() {
            this.el.fieldSelectPanel = this._createFieldSelect();
            this.el.fieldSelectPanel.addClass('active');
            this._bindEvent($(document), 'mousedown.field-menu', function(element, event) {
                var target = event.target;
                if (Foundation.isEmpty($(target).closest('.fx_field_select_pane'))) {
                    this._applyCallback(this.options.onFinishAdd, this);
                    this.el.fieldSelectPanel.remove();
                    this._unbindEvent($(document), 'mousedown.field-menu');
                }
                return false;
            });
        },

        _createFieldSelect: function() {
            var self = this;
            var fieldSelectPanelElement = $('<div class="field-select"/>').appendTo(this.el.target);
            new selectFieldPanel.LinkQueryFieldSelectPanel({
                renderEl: fieldSelectPanelElement,
                items: this.options.allFields,
                fields: this.options.fields,
                availableFields: constants.LINK_QUERY_AVAILABLE_FIELDS,
                onFieldSelect: function(field) {
                    self._appendFieldItem(field);
                }
            });
            return fieldSelectPanelElement
        },

        _initEvents: function() {
            this._bindDelegateEvent(this.el.fieldList, 'i.nav-edit', 'click', '_onFieldItemEditClick');
            this._bindDelegateEvent(this.el.fieldList, 'i.nav-remove', 'click', '_onFieldItemRemoveClick');
        },

        _onFieldItemEditClick: function(element, event) {
            var self = this;
            var fieldItemElement = element.closest('li.field-item');
            var labelElement = fieldItemElement.find('.field-label');
            var fieldItem = fieldItemElement.data('field');

            this.fieldItemPanel = new components.TableContainer({
                rowSize: [30],
                colSize: [70, 160],
                hgap: 10,
                vgap: 8,
                items: [
                    [{
                        xtype: "label",
                        text: "显示名"
                    }, {
                        widgetName: "fieldTextEditor",
                        xtype: "input",
                        value: fieldItem.text,
                        placeholder: "输入字段名"
                    }]
                ]
            });

            components.Msg.bubble({
                anchor: $(event.target),
                contentHTML: this.fieldItemPanel.el.target,
                dockPosition: "right",
                edge: 350,
                onOk: function() {
                    var fieldTextInput = self.fieldItemPanel.getWidgetByName('fieldTextEditor');
                    var value = fieldTextInput.getValue();
                    fieldItem.text = value;
                    labelElement.find('.field-name').text(value);
                    self._applyCallback(self.options.onAfterFieldUpdate, self, [fieldItem]);
                },
                onShow: function() {
                    labelElement.addClass('selected');
                },
                onClose: function() {
                    labelElement.removeClass('selected');
                }
            });
        },

        _onFieldItemRemoveClick: function(element, event) {
            var fieldItemElement = element.closest('li.field-item');
            if (!Foundation.isEmpty(fieldItemElement)) {
                this._removeField(fieldItemElement)
            }
        },

        _removeField: function(fieldItemElement) {
            var options = this.options;
            var field = fieldItemElement.data('field');
            var index = this._findFieldIndex(field);

            if (index > -1) {
                options.fields.splice(index, 1);
            }
            this._applyCallback(this.options.onAfterFieldRemove, this, [field, index]);
            fieldItemElement.remove();
        },

        _findFieldIndex: function(field) {
            var index = -1;
            Foundation.Array.each(this.options.fields, function(_field, i) {
                if (_field.name == field.name && _field.id == field.id) {
                    index = i;
                    return false
                }
            }, this);
            return index
        },

        clear: function() {
            this.options.fields = [];
            this.el.fieldList.empty();
        },

        getResult: function() {
            return {
                fields: this.options.fields
            }
        }

    });

    Widget.register('x-linkquery-field-edit-panel', LinkQueryFieldEditPanel);

    return LinkQueryFieldEditPanel;
});