define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var Widget = require('../../../component/widget');
    var components = require('../../../component/index');
    var constants = require('../../constants');

    var DetailGroupFieldPanelWidget = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(DetailGroupFieldPanelWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fx_subform_pane",
                availableFields: [{
                    type: constants.WIDGET_XTYPE.TEXT,
                    name: "单行文本"
                }, {
                    type: constants.WIDGET_XTYPE.NUMBER,
                    name: "数字"
                }, {
                    type: constants.WIDGET_XTYPE.MONEY,
                    name: "金额"
                }, {
                    type: constants.WIDGET_XTYPE.TEXTAREA,
                    name: "多行文本"
                }, {
                    type: constants.WIDGET_XTYPE.DATETIME,
                    name: "日期时间"
                }, {
                    type: constants.WIDGET_XTYPE.SELECT,
                    name: "下拉选择"
                }, {
                    type: constants.WIDGET_XTYPE.MULTI_SELECT,
                    name: "下拉复选"
                }, {
                    type: constants.WIDGET_XTYPE.TRIGGER_SELECT,
                    name: "弹出选择"
                }, {
                    type: constants.WIDGET_XTYPE.DETAIL_CALCULATE,
                    name: "逻辑计算控件"
                }],
                items: [],
                onAfterItemAdd: null,
                onAfterItemRemove: null,
                onAfterItemSelect: null
            });
        },
        _init: function() {
            DetailGroupFieldPanelWidget.superclass._init.apply(this);
            this._initItemListElements();
            this._createSelectFieldBox();
            this._createOperationBtn();
        },

        _createSelectFieldBox: function() {
            this.el.selectBox = $('<ul class="x-dropdown x-dropdown-list"/>').css({
                top: "100%",
                left: 0
            }).appendTo(this.el.target);
            Foundation.Array.forEach(this.options.availableFields, function(item, i) {
                $('<li class="x-dropdown-item"/>').attr("xtype", item.type).text(item.name).appendTo(this.el.selectBox);
            }, this);
        },

        _initItemListElements: function() {
            this.el.fieldList = $('<ul class="fx_selection_pane"/>').appendTo(this.el.target);
            Foundation.Array.forEach(this.options.items, function(item, i) {
                this._createFieldItem(item, false)
            }, this)
        },

        _createFieldItem: function(item, newAdd) {
            var options = this.options;

            var itemElement = $('<li/>').hide().data('item', item).appendTo(this.el.fieldList);
            var buttonElement = $('<a class="x-btn style-white item-subwidget"/>').appendTo(itemElement);

            $("<i/>").addClass("icon-widget-" + item.xtype).appendTo(buttonElement);
            $("<span/>").text(item.title).appendTo(buttonElement);
            $('<i class="icon-remove"/><i class="icon-drag"/>').appendTo(itemElement);

            if (newAdd) {
                itemElement.slideDown(200);
                this._applyCallback(this.options.onAfterItemAdd, this, [item]);
            } else {
                itemElement.show();
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
            var self = this;
            this.el.selectBox.show();
            $(document).bind("mousedown.dropdown", function(event) {
                var target = $(event.target);
                if (Foundation.isEmpty(target.closest(self.el.selectBox))) {
                    self.el.selectBox.hide();
                    $(document).unbind("mousedown.dropdown")
                }
            })
        },

        _initEvents: function() {
            this._bindDelegateEvent(this.el.selectBox, 'li.x-dropdown-item', 'click', '_onSelectListItemClick');
            this._bindDelegateEvent(this.el.fieldList, 'li', 'click', '_onFieldItemElementClick');
        },

        _onSelectListItemClick: function(element, event) {
            var xtype = element.attr('xtype');
            this._createFieldItem({
                title: element.text(),
                widgetName: Widget.createWidgetName(),
                xtype: xtype
            }, true);
            this.el.selectBox.hide();
            $(document).unbind("mousedown.dropdown")
        },

        _onFieldItemElementClick: function(element, event) {
            var self = this;
            var target = $(event.target);
            var itemElement = target.closest("li");
            var index = itemElement.index();

            if (!Foundation.isEmpty(target.closest(".item-subwidget"))) {
                this._applyCallback(this.options.onAfterItemSelect, this, [index]);
            } else if (target.hasClass('icon-remove')) {
                itemElement.slideUp(200, function() {
                    self._applyCallback(self.options.onAfterItemRemove, self, [index]);
                    itemElement.remove()
                })
            }
        },

        getItems: function() {
            var items = [];
            this.el.fieldList.find('li').each(function() {
                items.push($(this).data('item'))
            });
            return items
        }

    });

    Widget.register('x-detailgroup-field-panel', DetailGroupFieldPanelWidget);

    return DetailGroupFieldPanelWidget;
});