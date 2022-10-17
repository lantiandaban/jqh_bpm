define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var TriggerWidget = require('./trigger');
    var Foundation = require('Foundation');

    var ComboBoxWidget = Class.create({
        extend: TriggerWidget,
        _defaultOptions: function() {
            return Foundation.apply(ComboBoxWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fui_combo",
                triggerIcon: "icon-ui-combo",
                triggerListCls: "combo-list",
                height: 30,
                textField: "text",
                valueField: "value",
                items: [{
                    value: "选项1",
                    text: "选项1"
                }, {
                    value: "选项2",
                    text: "选项2"
                }, {
                    value: "选项3",
                    text: "选项3"
                }],
                async: null,
                asyncResultKey: "items",
                allowBlank: false,
                searchable: true,
                placeholder: null,
                onDataFilter: null,
                onItemCreate: null,
                onBeforeItemSelect: null,
                onAfterItemSelect: null,
                onAfterTriggerHide: null,
                limitData: 300,
                emptyTip: "没有数据"
            });
        },
        _init: function() {
            ComboBoxWidget.superclass._init.apply(this);
            var options = this.options;

            this._initStoreValue();

            if (!options.async || this._hasDefaultValue()) {
                this._createTriggerView()
            }

            // if (options.async && !this._hasDefaultValue()) {
            //     this._createTriggerView()
            // } else if (!Foundation.isEmpty(options.item) && Foundation.isEmpty(this.options.value)) {
            //     var firstItem = options.item[0];
            //     var text = firstItem[options.textField];
            //     var value = firstItem[options.valueField];
            //     Foundation.isEmpty(text) || (options.text = text);
            //     Foundation.isEmpty(value) || (options.value = value);
            // }
        },

        _initStoreValue: function() {
            this.text = null;
            this.value = null
        },

        _hasDefaultValue: function() {
            return !Foundation.isEmpty(this.options.value)
        },

        _onTriggerClick: function() {
            if (this.isEnabled()) {
                this._showTriggerView();
            }
        },

        _hideTriggerView: function() {
            var options = this.options;

            if (this.el.triggerView) {
                this._unbindEvent($(document), 'mousedown.trigger');
                this.el.triggerView.detach();
                this._applyCallback(this.options.onAfterTriggerHide, this, []);
                if (!this.changed) {
                    return;
                }
                this._applyCallback(this.options.onStopEdit, this, []);
            }
        },

        _showTriggerView: function() {
            if (!this.el.triggerView) {
                this._createTriggerView();
            }
            this.el.triggerView.appendTo('body').css(this._getTriggerViewPosition()).show();
            this.changed = false;

            this._bindEvent($(document), 'mousedown.trigger', function(target, event) {
                if (Foundation.isEmpty($(event.target).closest(this.el.triggerView))) {
                    this._hideTriggerView();
                }
            })
        },

        _createTriggerView: function() {
            this.el.triggerView = $('<div class="x-dropdown"/>');
            this.valueMap = {};
            if (this.options.searchable) {
                //TODO
            }
            this.el.listView = $('<div class="x-dropdown-list"/>').addClass(this.options.triggerListCls).appendTo(this.el.triggerView);
            this._loadTriggerViewItems();
            this._bindTriggerViewEvents();
        },

        _loadTriggerViewItems: function() {
            var options = this.options;
            if (options.async && options.async.url) {
                //TODO 远程加载
            } else if (options.items) {
                var items = options.items;
                if (Foundation.isFunction(options.items)) {
                    items = options.items.apply(this);
                }
                this._loadItems(items);
            }
        },

        _loadItems: function(items) {
            this.valueMap = {};
            this.el.listView.empty();
            this._onBeforeItemsLoaded();
            Foundation.Array.forEach(items, function(item, i) {
                this._createItemElement(item, i);
            }, this);
            this._onAfterItemsLoaded()
        },

        _onBeforeItemsLoaded: function() {
            if (this.options.allowBlank) {
                $('<a class="x-dropdown-item"/>').text("--请选择--").appendTo(this.el.listView)
            }
        },

        _onAfterItemsLoaded: function() {
            var options = this.options,
                itemEls = this.el.listView.children($(".x-dropdown-item")),
                count = options.allowBlank ? 1 : 0;

            if (options.emptyTip && itemEls.length <= count) {
                this.el.listView.empty().append($('<div class="empty-tip"/>').text(options.emptyTip));
            }
        },

        _createItemElement: function(item, index) {
            var options = this.options;
            if (this._applyCallback(options.onItemCreate, this, [item, index]) !== false) {
                var itemTemp = this._applyCallback(options.onDataFilter, this, [item, index]);
                if (itemTemp !== false && !Foundation.isEmpty(itemTemp)) {
                    item = itemTemp;
                }
                var text = item[options.textField],
                    value = item[options.valueField];
                this.valueMap[value] = text;

                var itemElement = $('<a class="x-dropdown-item"/>')
                    .data("item", item)
                    .attr("option", value)
                    .attr("title", text)
                    .text(text).appendTo(this.el.listView);

                if (item.selected || !Foundation.isEmpty(value) && this._isSelected(value)) {
                    $(".select", this.el.triggerView).removeClass("select");
                    itemElement.addClass("select");
                    this.value = value;
                    this.text = text;
                    this.el.input.val(text);
                }
            }
        },

        _isSelected: function(value) {
            return this.value == value
        },

        _bindTriggerViewEvents: function() {
            this._bindEvent(this.el.triggerView, 'click', function(triggerView, event) {
                var itemElement = $(event.target).closest("a.x-dropdown-item");
                if (!Foundation.isEmpty(itemElement)) {
                    var item = itemElement.data("item");
                    this._onItemClick(itemElement, item);
                    event.stopPropagation();
                }
            });
        },

        _onItemClick: function(itemElement, item) {
            var options = this.options;
            this._hideTriggerView();

            if (this._applyCallback(options.onBeforeItemSelect, this, [itemElement, item]) === false) {
                return
            }
            $(".select", this.el.triggerView).removeClass("select");
            if (item) {
                itemElement.addClass("select");
                this.value = item[options.valueField];
                this.text = item[options.textField];
            } else {
                this.value = null;
                this.text = null;
            }
            this.el.input.val(this.text);
            this._applyCallback(options.onAfterItemSelect, this, [itemElement, item]);
            this._applyCallback(options.onAfterEdit, this, [itemElement, item]);
            this.changed = true;
        },

        reload: function(items) {
            var options = this.options;
            if (Foundation.isNull(items)) {
                items = options.items;
            }
            if (Foundation.isFunction(items)) {
                items = items.apply(this);
            }
            items = items || [];
            this._loadItems(items);
        },

        setValue: function(value) {
            this.value = value;

            if (Foundation.isNull(value)) {
                this.text = null;
                this.el.input && this.el.input.val("");
                $("a.x-dropdown-item.select", this.el.listView).removeClass('select');
                return;
            }

            if (this.valueMap && this.valueMap[value]) {
                this.text = this.valueMap[value]
            } else {
                this.text = value
            }
            if (this.el.triggerView) {
                $(".select", this.el.triggerView).removeClass("select");
                if (!Foundation.isEmpty(value)) {
                    $("a.x-dropdown-item", this.el.listView).each(function(d, e) {
                        var itemElement = $(this);
                        var _value = itemElement.attr("option");
                        _value == value && itemElement.addClass('select');
                    })
                }
            }
            this.el.input && this.el.input.val(this.text);
        },

        setText: function(text) {
            this.text = text;
            this.el.input && this.el.input.val(text);
        },

        getValue: function() {
            return this.value
        },

        getText: function() {
            return this.text
        }
    });

    Widget.register('combo', ComboBoxWidget);

    return ComboBoxWidget;
});