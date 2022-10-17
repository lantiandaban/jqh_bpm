define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var constants = require('../../constants');
    var Widget = require('../../../component/widget');
    var components = require('../../../component/index');

    var LinkQueryFieldConditionPanel = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(LinkQueryFieldConditionPanel.superclass._defaultOptions.apply(this), {
                baseCls: "fx_link_filter",
                items: [],
                relyWidgets: [],
                linkWidgets: []
            });
        },
        _init: function() {
            LinkQueryFieldConditionPanel.superclass._init.apply(this);
            this._createConditionList()
        },

        _createConditionList: function() {
            var options = this.options;

            this.el.target.append($('<span class="filter-label"/>').text("设置多个关联条件限定关联数据"));
            this._createAddBtn();
            this.el.conditionList = $('<ul class="filter-list"/>').appendTo(this.el.target);

            this.widgetsMap = {};
            Foundation.Array.forEach(options.relyWidgets, function(widget) {
                this.widgetsMap[widget.name] = widget
            }, this);
            Foundation.Array.forEach(options.items, function(item, i) {
                this._createConditionItem(item);
            }, this);
        },

        _createAddBtn: function() {
            this.el.addBtn = $('<span class="add-btn"/>').append($('<i class="icon-add"/>'))
                .append($("<span/>").text(" 添加关联条件")).appendTo(this.el.target)
        },

        _createConditionItem: function(item) {
            var self = this;
            var options = this.options;
            var itemElement = $('<li class="filter-item"/>').appendTo(this.el.conditionList);

            var relyComboBox = new components.ComboBox({
                renderEl: $('<div class="filter-combo"/>').appendTo(itemElement),
                placeholder: "当前表单字段",
                width: 180,
                valueField: "name",
                value: item && item.widget,
                allowBlank: false,
                searchable: false,
                items: options.relyWidgets,
                onAfterItemSelect: function(itemElement, _item) {
                    linkComboBox.options.items = self._getLinkWidgets(_item);
                    linkComboBox.reload();
                }
            });
            itemElement.append("<span>值等于</span>");

            var linkComboBox = new components.ComboBox({
                renderEl: $('<div class="filter-combo"/>').appendTo(itemElement),
                placeholder: "关联数据源字段",
                width: 180,
                valueField: "name",
                value: item && item.field,
                allowBlank: false,
                searchable: false,
                items: item ? this._getLinkWidgets(this.widgetsMap[item.widget]) : []
            });

            $('<span class="remove-btn"/>').append($('<i class="icon-trasho"/>')).click(function() {
                itemElement.remove()
            }).appendTo(itemElement);
            itemElement.data({
                rely: relyComboBox,
                link: linkComboBox
            })
        },

        _getLinkWidgets: function(item) {
            if (!item) {
                return []
            }
            var options = this.options;
            return options.linkWidgets;
        },

        _initEvents: function() {
            this._bindEvent(this.el.addBtn, 'click', '_onAddBtnClick');
        },

        _onAddBtnClick: function(element, event) {
            this._createConditionItem();
        },

        getValue: function() {
            var conditions = [];
            $(".filter-item", this.el.target).each(function() {
                var itemElement = $(this);
                var rely = itemElement.data('rely').getValue();
                var link = itemElement.data('link').getValue();
                if (!Foundation.isEmpty(rely) && !Foundation.isEmpty(link)) {
                    conditions.push({
                        rely: rely,
                        link: link
                    })
                }
            });
            return conditions
        }

    });

    Widget.register('x-linkquery-field-condition-panel', LinkQueryFieldConditionPanel);

    return LinkQueryFieldConditionPanel;
});