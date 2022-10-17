define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var Widget = require('../../../component/widget');
    var components = require('../../../component/index');

    var OptionLinkSettingPanel = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(OptionLinkSettingPanel.superclass._defaultOptions.apply(this), {
                baseCls: "fx_item_link",
                optionItems: [],
                linkFieldItems: [],
                onBeforeEdit: null,
                onAfterEdit: null
            });
        },
        _init: function() {
            OptionLinkSettingPanel.superclass._init.apply(this);

            this.idx = 0;
            this.valueMap = {};
            this._initLinkFieldsMap();
            this._createOptionItemsPanel();
            this._createLinkFieldItemsPanel();
        },

        _defaultRoot: function() {
            return $(relySettingPanelTpl())
        },

        _initLinkFieldsMap: function() {
            var options = this.options;
            this.linkFieldsMap = {};
            Foundation.Array.forEach(options.linkFieldItems, function(field) {
                this.linkFieldsMap[field.value] = true
            }, this);
        },

        _createOptionItemsPanel: function() {
            this.el.optionItemsPanel = $('<div class="item-pane"><span class="title">选项</span></div>').appendTo(this.el.target);
            this._createOptionItemsList()
        },

        _createOptionItemsList: function() {
            var options = this.options;
            this.el.optionList = $('<ul class="item-list"/>').appendTo(this.el.optionItemsPanel);

            // "widgetName": "", //关联字段组件名称
            // "hidden": false, //是否隐藏
            // "required": true //是否必填

            Foundation.Array.forEach(options.optionItems, function(item, i) {
                var relies = [];
                Foundation.Array.forEach(item.relies, function(rely, j) {
                    if (this.linkFieldsMap[rely.widgetName]) {
                        relies.push(rely);
                    }
                }, this);
                this.valueMap[i] = relies;
                this._createOptionItem(item, i);
            }, this);
        },

        _createOptionItem: function(item, index) {
            var liElement = $('<li class="item"/>').append($("<span/>").text(item.text)).data("idx", index).appendTo(this.el.optionList);
            if (index === this.idx) {
                liElement.addClass("current-select")
            }
        },

        _createLinkFieldItemsPanel: function() {
            this.el.linkFieldItemsPanel = $('<div class="widget-pane"><span class="title">关联控件</span></div>').appendTo(this.el.target);

            var htmls = [];
            htmls.push('<div class="widget-list">');
            htmls.push('<table class="x-table" cellpadding="0" cellspacing="0">');
            htmls.push('<thead><tr><th width="200">控件字段</th><th class="center">隐藏</th><th class="center">必填</th></tr></thead>');
            htmls.push('<tbody></tbody>');
            htmls.push('</table>');
            htmls.push('</div>');
            this.el.linkFieldItemsPanel.append($(htmls.join('')));

            this._createLinkFieldItemsList()
        },

        _createLinkFieldItemsList: function() {
            var options = this.options;
            this.el.linkFieldItemsList = this.el.linkFieldItemsPanel.find('tbody');
            this.el.linkFieldItemsList.empty();
            Foundation.Array.forEach(options.linkFieldItems, function(item) {
                this._createLinkFieldItem(item);
            }, this);
        },

        _createLinkFieldItem: function(item) {
            var relies = this.valueMap[this.idx],
                relyItem;
            Foundation.Array.each(relies, function(rely, i) {
                if (rely.widgetName == item.value) {
                    relyItem = rely;
                    return false;
                }
            }, this);

            var hidden = relyItem && relyItem.hidden,
                required = relyItem && relyItem.required;

            var itemElement = $('<tr class="widget"/>')
                .append('<td>' + item.text + '</td>')
                .append('<td class="center"><div class="select-btn x-check ' + (hidden && 'select') + '"><i class="icon-blank"/></div></td>')
                .append('<td class="center"><div class="select-btn x-check ' + (required && 'select') + '"><i class="icon-blank"/></div></td>')
                .appendTo(this.el.linkFieldItemsList)
                .data("name", item.value);
        },

        _initEvents: function() {
            this._bindDelegateEvent(this.el.optionList, 'li.item', 'click', '_onOptionItemClick');
            this._bindDelegateEvent(this.el.linkFieldItemsList, '.select-btn', 'click', '_onLinkFieldSelectBtnClick');
        },

        _onOptionItemClick: function(itemElement) {
            itemElement.addClass("current-select").siblings().removeClass("current-select");
            this.idx = itemElement.data("idx");
            this._createLinkFieldItemsList()
        },

        _onLinkFieldSelectBtnClick: function(selectBtn, event) {
            selectBtn.toggleClass('select');
            if (selectBtn.hasClass('select')) {
                selectBtn.parent().siblings().find('.select-btn').removeClass('select')
            }
            this.updateValue();
        },

        updateValue: function() {
            var self = this;
            var telies = [];

            this.el.linkFieldItemsList.find('tr.widget').each(function() {
                var trElement = $(this);
                var name = trElement.data('name');
                if (!name) {
                    return
                }
                var selectBtns = trElement.find('.select-btn'),
                    hideSelectBtn = selectBtns.eq(0),
                    requiredSelectBtn = selectBtns.eq(1),
                    hidden = hideSelectBtn.hasClass('select'),
                    required = requiredSelectBtn.hasClass('select');

                //if (hidden || required) {
                    telies.push({
                        widgetName: name,
                        hidden: hidden,
                        required: required
                    });
                //}
            });
            console.log(telies);
            this.valueMap[this.idx] = telies;
        },

        getValue: function() {
            return this.valueMap
        }
    });

    Widget.register('x-option-link-setting-panel', OptionLinkSettingPanel);

    return OptionLinkSettingPanel;
});