define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var Widget = require('../../../component/widget');
    var components = require('../../../component/index');

    var BaseFieldSelectPanel = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(BaseFieldSelectPanel.superclass._defaultOptions.apply(this), {
                baseCls: "fx_field_select_pane",
                mode: "pop-right",
                fields: [],
                excludeFields: [],
                availableFields: [],
                onFieldSelect: null,
                onFieldFilter: null
            });
        },
        _init: function() {
            BaseFieldSelectPanel.superclass._init.apply(this);
            var options = this.options;
            switch (options.mode) {
                case "dialog":
                    this.el.target.addClass("dialog-menu");
                    break;
                case "pop-left":
                    this.el.target.addClass("pop-menu pop-left x-dropdown");
                    break;
                case "pop-right":
                default:
                    this.el.target.addClass("pop-menu pop-right x-dropdown")
            }
            this._createMenuList();
        },

        _createMenuList: function() {
            this.el.menuList = $('<ul class="menu-list"/>').appendTo(this.el.target)
        },

        _initEvents: function() {
            this._unbindEvent(this.el.menuList, 'click.field-select');
            this._bindEvent(this.el.menuList, 'click.field-select', '_onMenuListClick');
        },

        _onMenuListClick: function(element, event) {
            var options = this.options;
            if (!this.isEnabled()) {
                return;
            }
            var target = event.target;
            var eventType = event.type;
            var liElement = $(target).closest('li');

            if (!Foundation.isEmpty(liElement) && !liElement.hasClass('disabled') && eventType == 'click') {
                this._onMenuItemClick(liElement)
            }
        },

        _onMenuItemClick: function(liElement) {},

        _createFieldItem: function(item) {
            return $('<li class="field"/>')
                .attr("name", item.name)
                .data("field", item)
                .appendTo(this.el.menuList)
        },

        _isFieldTypeAllowed: function(field) {
            var options = this.options;
            return !options.availableFields || options.availableFields.indexOf(field.xtype) > -1
        },
        _isFieldExcluded: function(field) {
            var options = this.options;
            return options.excludeFields && options.excludeFields.indexOf(field.name) > -1 ||
                this._applyCallback(options.onFieldFilter, this, [field])
        },
        _findSelectedFieldIndex: function(field) {
            var options = this.options;
            var index = -1;
            Foundation.Array.each(options.fields, function(fieldItem, i) {
                if (fieldItem.name === field.name && field.id == fieldItem.id) {
                    index = i;
                    return false
                }
            }, this);
            return index
        },
        show: function() {
            if (options.mode !== 'dialog') {
                this.el.target.addClass('active');
            }
        },
        selectField: function(field) {

        },
        deselectField: function(field) {

        },
        setFields: function(fields) {
            this.options.fields = fields;
            this._refreshList()
        },
        _refreshList: function() {}

    });

    exports.BaseFieldSelectPanel = BaseFieldSelectPanel;

    var EntryFieldSelectPanel = Class.create({
        extend: BaseFieldSelectPanel,
        _defaultOptions: function() {
            return Foundation.apply(EntryFieldSelectPanel.superclass._defaultOptions.apply(this), {
                entryList: null,
                fields: [],
                excludeFields: [],
                allowMultiTable: !1,
                allowSameField: !1,
                onFieldSelect: null
            });
        },
        _init: function() {
            EntryFieldSelectPanel.superclass._init.apply(this);
        },

        _afterInit: function() {
            EntryFieldSelectPanel.superclass._afterInit.apply(this);
            if (!Foundation.isEmpty(this.options.entryList) && this.options.entryList.length == 1) {
                this.el.menuList.children().eq(0).click()
            }
        },

        _createMenuList: function() {
            EntryFieldSelectPanel.superclass._createMenuList.apply(this, arguments);
            var options = this.options;

            Foundation.Array.forEach(options.entryList, function(entryItem, i) {
                this._createEntryItem(entryItem);
            }, this);
        },

        _createEntryItem: function(entryItem) {
            var entryElement = $('<li class="entry"/>').data("entry", entryItem).appendTo(this.el.menuList);
            var iconCls = "icon-form";
            $('<a class="menu-item"/>')
                .append($("<i class=" + iconCls + "/>"))
                .append($("<span/>").text(entryItem.name))
                .appendTo(entryElement);
        },

        _onMenuItemClick: function(liElement) {
            var options = this.options;

            if (liElement.hasClass('entry')) {
                liElement.siblings().children(".field-list").slideUp("fast");
                var fieldList = liElement.children(".field-list");
                if (Foundation.isEmpty(fieldList)) {
                    var entryItem = liElement.data("entry");
                    fieldList = this._createEntryFieldList(entryItem).appendTo(liElement)
                }
                fieldList.slideToggle('fast');
            } else if (liElement.hasClass('field')) {
                var fieldItem = liElement.data("field");
                this._applyCallback(options.onFieldSelect, this, [fieldItem])
            }
        },

        _createEntryFieldList: function(entryItem) {
            var options = this.options;
            var fieldListElement = $('<ul class="field-list"/>').hide();
            var attributeFields = [].concat(options.attributeFields || []);

            Foundation.Array.forEach(entryItem.fields, function(fieldItem, i) {
                var _fieldItem = Foundation.apply({}, fieldItem, { id: entryItem.entryId });
                if (this._isFieldTypeAllowed(_fieldItem) && !this._isFieldExcluded(_fieldItem)) {
                    if (_fieldItem.xtype == 'subform') {
                        Foundation.Array.forEach(_fieldItem.items, function(subFormItem) {
                            var _subFormItem = Foundation.apply({}, subFormItem, {
                                id: entryItem.entryId,
                                name: _fieldItem.name + "." + subFormItem.name,
                                text: _fieldItem.text + "." + subFormItem.text,
                                subformText: _fieldItem.text,
                                subform: _fieldItem.name
                            });
                            this._createEntryFieldItem(entryItem, _subFormItem, fieldListElement)
                        }, this);
                    } else {
                        this._createEntryFieldItem(entryItem, _fieldItem, fieldListElement);
                    }
                }
            }, this);
            return fieldListElement
        },

        _createEntryFieldItem: function(entryItem, fieldItem, fieldListElement) {
            var fieldItemElement = $('<li class="field"/>').attr("name", fieldItem.name).data("field", fieldItem).appendTo(fieldListElement);
            $('<a class="menu-item"/>').append($("<span/>").text(fieldItem.text)).appendTo(fieldItemElement);
            if (this._filterFieldEnabled(entryItem, fieldItem) === false) {
                fieldItemElement.addClass("disabled");
            }
            return fieldItemElement
        },

        _filterFieldEnabled: function(entryItem, fieldItem) {
            return;
        }

    });

    exports.EntryFieldSelectPanel = EntryFieldSelectPanel;

    var LinkQueryFieldSelectPanel = Class.create({
        extend: BaseFieldSelectPanel,

        _defaultOptions: function() {
            return Foundation.apply(EntryFieldSelectPanel.superclass._defaultOptions.apply(this), {
                mode: "pop-left",
                items: [],
                fields: []
            });
        },

        _createMenuList: function() {
            LinkQueryFieldSelectPanel.superclass._createMenuList.apply(this, arguments);
            Foundation.Array.forEach(this.options.items, function(item, i) {
                if (this._isFieldTypeAllowed(item)) {
                    this._createFieldItem(item);
                }
            }, this);
        },
        _createFieldItem: function(item) {
            var itemElement = $('<li class="field"/>')
                .attr("name", item.name).data("field", item)
                .appendTo(this.el.menuList);

            $('<a class="menu-item"/>')
                .append($("<span/>").text(item.text))
                .appendTo(itemElement);

            if (this._filterFieldEnabled(item) === false) {
                itemElement.addClass("disabled");
            }
            return itemElement
        },
        _onMenuItemClick: function(liElement) {
            if (liElement.hasClass('field')) {
                var field = liElement.data('field');
                this._applyCallback(this.options.onFieldSelect, this, [field])
                liElement.addClass("disabled");
            }
        },
        // selectField: function(field) {
        //     this._refreshList()
        // },
        // deselectField: function(field) {
        //     var index = this._findSelectedFieldIndex(field);
        //     if (index > -1) {
        //         this.options.fields.splice(index, 1)
        //     }
        //     this._refreshList();
        // },
        _filterFieldEnabled: function(field) {
            var enabled = true;
            Foundation.Array.each(this.options.fields, function(_field) {
                if (field.name == _field.name) {
                    enabled = false;
                    return false
                }
            });
            return enabled
        },
        // 
        // _refreshList: function() {
        //     var b = this;
        //     this.$menuList.children().each(function() {
        //         var c = a(this),
        //             d = c.data("field");
        //         b._filterFieldEnabled(d) ? c.removeClass("disabled") : c.addClass("disabled")
        //     })
        // }

    });

    exports.LinkQueryFieldSelectPanel = LinkQueryFieldSelectPanel;
});