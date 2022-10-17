define(function(require, exports, module) {
    require('./option-link-setting-panel');

    var Class = require('Class');
    var Foundation = require('Foundation');
    var Widget = require('../../../component/widget');
    var components = require('../../../component/index');

    var SelectSettingGroupWidget = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(SelectSettingGroupWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fx_selection_pane",
                multi: false,
                multiEdit: true,
                onAfterDrop: null,
                onAfterItemSelect: null,
                onAfterItemRemove: null,
                onAfterItemAdd: null,
                onAfterItemEdit: null,
                onAfterItemReliesEdit: null,
                form: null,
                items: [],
                widgetView: null
            });
        },
        _init: function() {
            SelectSettingGroupWidget.superclass._init.apply(this);

            var options = this.options;
            var listElement = this.el.listElement = $('<ul/>').appendTo(this.el.target);
            this._loadItems();
            this._initListDragDrop();

            this.el.btnList = $('<div class="add_btn_group"/>').appendTo(this.el.target);
            this.el.addItemButton = $('<div class="add_item"/>').text("添加选项").appendTo(this.el.btnList);
            if (options.multiEdit) {
                this.el.multiEditButton = $('<div class="add_item multi-edit"/>').text("批量编辑").appendTo(this.el.btnList)
            }
            if (!options.multi) {
                $('<div class="contact_option_hr"/>').appendTo(this.el.target);
                new components.Button({
                    renderEl: $('<div class="contact_option"/>').appendTo(this.el.target),
                    text: "选项关联控件设置",
                    height: 30,
                    style: "white",
                    onClick: this._onItemRelySettingBtnClick.bind(this)
                })
            }
        },

        _loadItems: function(items) {
            var options = this.options;
            if (!Foundation.isEmpty(items) && Foundation.isArray(items)) {
                this.options.items = items
            }
            if (!Foundation.isEmpty(options.items)) {
                this.el.listElement.empty();
                Foundation.Array.forEach(options.items, function(item, i) {
                    var itemElement = this._createItem(item);
                    if (!Foundation.isEmpty(itemElement)) {
                        itemElement.appendTo(this.el.listElement);
                    }
                }, this);
            }
        },

        _createItem: function(item) {
            var self = this;
            var options = this.options;
            var itemElement = $('<li class="sel_item"/>');
            var selectIconElement = $('<i class="select_icon"/>').appendTo(itemElement);

            if (item.selected) {
                selectIconElement.addClass('select');
            }
            if (options.multi) {
                selectIconElement.addClass("icon-sel-multi");
            } else {
                selectIconElement.addClass("icon-sel-single");
            }

            var inputWidget = Widget.create({
                xtype: "input",
                renderEl: $("<a/>").appendTo(itemElement),
                width: 205,
                enable: true,
                value: item.text,
                onAfterEdit: function() {
                    self._applyCallback(options.onAfterItemEdit, self);
                }
            });
            itemElement.data('inputWidget', inputWidget);
            if (!Foundation.isEmpty(item.relies)) {
                itemElement.data("relies", item.relies)
            }

            $('<i class="icon-remove"/>').appendTo(itemElement);
            $('<i class="icon-drag"/>').appendTo(itemElement);

            return itemElement;
        },

        _initEvents: function() {
            this._bindEvent(this.el.addItemButton, 'click', '_onAddItemButtonClick');
            this._bindEvent(this.el.multiEditButton, 'click', '_onMultiEditButtonClick');
            this._bindDelegateEvent(this.el.target, 'i.select_icon', 'click', '_onSelectItemIconClick');
            this._bindDelegateEvent(this.el.target, 'i.icon-remove', 'click', '_onSelectItemDelClick');
        },

        _onSelectItemIconClick: function(element, event) {
            var options = this.options;
            if (options.multi) {
                element.toggleClass("select");
                this._applyCallback(options.onAfterItemSelect, this);
                return;
            }
            if (element.hasClass("select")) {
                element.removeClass("select")
            } else {
                $(".icon-sel-single", this.el.target).removeClass("select");
                element.addClass("select")
            }
            this._applyCallback(options.onAfterItemSelect, this);
        },

        _onSelectItemDelClick: function(delElement, event) {
            var self = this;
            var itemElement = delElement.closest('li.sel_item');
            itemElement.slideUp(200, function() {
                itemElement.remove();
                self._applyCallback(self.options.onAfterItemRemove, self);
            })
        },

        _onAddItemButtonClick: function(element, event) {
            var itemElement = this._createItem({ text: "选项" }).hide();
            itemElement.appendTo(this.el.listElement).slideDown(200);
            if (itemElement.data('inputWidget')) {
                itemElement.data("inputWidget").select()
            }
            this._applyCallback(this.options.onAfterItemAdd, this);
        },

        _onItemRelySettingBtnClick: function() {
            var options = this.options;
            var nextWidgets = options.form.getNextFormItemWidgets(options.widgetView);
            var linkFieldItems = Foundation.Array.map(nextWidgets, function(widget, i) {
                var title = widget.getTitle();
                return {
                    value: widget.getWidgetName(),
                    text: title
                }
            }, this);

            this.linkSettingDialog = new components.ConfirmDialog({
                title: "选项关联控件",
                width: 570,
                height: 510,
                contentWidget: {
                    xtype: 'x-option-link-setting-panel',
                    width: 570,
                    height: 400,
                    optionItems: this.getResults().items,
                    linkFieldItems: linkFieldItems
                },
                onOk: this._onSaveRelySetting.bind(this)
            });
            this.linkSettingDialog.open();
        },

        _onSaveRelySetting: function() {
            this._setRelies(this.linkSettingDialog.container.getValue());
        },

        _onMultiEditButtonClick: function(element, event) {
            var self = this;
            var itemTexts = Foundation.Array.map(this.getResults().items, function(item) {
                return item.text
            }, this);
            var defPlaceholder = ["选项1", "选项2", "选项3"].join("\n");

            this.multiEditDialog = new components.ConfirmDialog({
                title: "批量编辑",
                width: 530,
                height: 450,
                contentWidget: {
                    rowSize: [30, 300],
                    colSize: [500],
                    hgap: 0,
                    vgap: 0,
                    padding: 15,
                    items: [
                        [$("<span />").text("每行对应一个选项")],
                        [{
                            xtype: "textarea",
                            widgetName: "itemMultiEdit",
                            placeholder: defPlaceholder,
                            value: itemTexts.join('\n')
                        }]
                    ]
                },
                onOk: this._onSaveMultiEdit.bind(this)
            });

            this.multiEditDialog.open();
        },

        _onSaveMultiEdit: function() {
            var items = [];
            var itemRelies = {};
            Foundation.Array.forEach(this.options.items, function(item, i) {
                itemRelies[item.value] = item.relies;
            }, this);

            var multiEditValue = this.multiEditDialog.getWidgetByName("itemMultiEdit").getValue();
            Foundation.Array.forEach(multiEditValue.split('\n'), function(text) {
                text = text.trim();
                if (Foundation.isEmpty(text)) {
                    return
                }
                var item = { text: text, value: text };
                if (!Foundation.isNull(itemRelies[text])) {
                    item.relies = itemRelies[text]
                }
                items.push(item);
            }, this);

            this._loadItems(items);
            this._applyCallback(this.options.onAfterItemEdit, this);
        },

        _initListDragDrop: function() {
            this._dragStartTop = 0;
            this.el.listElement.sortable({
                handle: "i.icon-drag",
                itemSelector: "li.sel_item",
                onDragStart: this._onItemDragStart.bind(this),
                onDrag: this._onItemDrag.bind(this),
                onDrop: this._onItemDrop.bind(this)
            });
        },

        _onItemDragStart: function($item, container, _super) {
            var offset = $item.offset();
            var g = container.rootGroup.pointer;
            this._dragStartTop = g.top - offset.top;
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
            this._applyCallback(this.options.onAfterDrop, this);
        },

        _setRelies: function(reliesMap) {
            var options = this.options;
            var itemElements = $("li.sel_item", this.el.target);
            Foundation.Array.eachCount(itemElements.length, function(i) {
                var itemElement = itemElements.eq(i);
                var relies = reliesMap[i];
                if (!Foundation.isEmpty(relies)) {
                    itemElement.data('relies', relies);
                    if (options.items && options.items[i]) {
                        options.items[i].relies = relies
                    }
                }
            }, this);
            this._applyCallback(options.onAfterItemReliesEdit, this)
        },

        getResults: function() {
            var itemElements = $("li.sel_item", this.el.target);
            var selectedIndexs = [],
                selectedValues = [];
            var items = Foundation.Array.mapCount(itemElements.length, function(i) {
                var itemElement = itemElements.eq(i);
                var inputWidget = itemElement.data('inputWidget');
                var inputValue = inputWidget.getValue();
                var opt = {
                    text: inputValue,
                    value: inputValue
                }
                if (itemElement.data('relies')) {
                    opt.relies = itemElement.data("relies");
                }
                if (itemElement.find(".select_icon").hasClass("select")) {
                    opt.selected = true;
                    selectedIndexs.push(i);
                    selectedValues.push(opt.value);
                }
                return opt;
            });

            if (!this.options.multi) {
                selectedIndexs = selectedIndexs.join('')
            }
            return {
                items: items,
                value: selectedIndexs,
                text: selectedValues.join(",")
            }
        }

    });

    Widget.register('x-option-group', SelectSettingGroupWidget);

    return SelectSettingGroupWidget;
});