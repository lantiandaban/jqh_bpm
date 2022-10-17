define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormBaseWidget = require('./base');
    var formWidgetManager = require('./manager');

    var FormDetailGroupWidget = Class.create({
        extend: FormBaseWidget,
        xtype: FormBaseWidget.XTYPE.DETAIL_GROUP,
        settingPanelType: 'detailgroup',
        _init: function() {
            FormDetailGroupWidget.superclass._init.apply(this);

            this.el.body = $('<div class="dui-detailgroup"/>').appendTo(this.el.target);
            this.el.title = $('<div class="title"/>').appendTo(this.el.body);
            this.el.main = $('<div class="main"/>').appendTo(this.el.body);
            this.el.table = $('<table class="detail-table"><colgroup></colgroup><thead><tr></tr></thead><tbody><tr></tr></tbody></table>').appendTo(this.el.main);

            this.subWidgetsMap = {};

            this._loadFieldItems();
        },

        _afterInit: function() {
            FormDetailGroupWidget.superclass._afterInit.apply(this);
            this.setTitle(this.options.title);
        },

        _defaultOptions: function() {
            return Foundation.apply(FormDetailGroupWidget.superclass._defaultOptions.apply(this), {
                title: "明细列表",
                items: []
            });
        },

        _defaultSetting: function() {
            return Foundation.apply(FormDetailGroupWidget.superclass._defaultSetting.apply(this), {
                title: "明细列表",
                items: []
            })
        },
        _setting2Options: function(setting) {
            return Foundation.apply(FormDetailGroupWidget.superclass._setting2Options.apply(this, arguments), {
                title: setting.title,
                items: Foundation.clone(setting.items)
            })
        },

        _loadFieldItems: function() {
            var options = this.options;
            this.el.table.width(options.items.length * 150);
            Foundation.Array.forEach(options.items, function(item) {
                this._createFieldItem(item);
            }, this);
        },

        _createFieldItem: function(item) {
            var _item = Foundation.clone(item);
            var formItemWidget = formWidgetManager.create(_item.xtype, {}, _item);
            if (formItemWidget) {
                var titleTdElement = $('<th/>').appendTo(this.el.table.find('thead tr'));
                var widgetTdElement = $('<td class="table-layout-column"/>').appendTo(this.el.table.find('tbody tr'));
                this.el.table.find('colgroup').append('<col style="width: 150px;">');

                formItemWidget.el.target.appendTo(widgetTdElement);
                widgetTdElement.data('widget', formItemWidget).addClass('has-widgeted');

                var titleWidget = formWidgetManager.create('label', {}, {
                    value: formItemWidget.getTitle(),
                    align: 0
                });
                titleWidget.el.target.appendTo(titleTdElement);
                titleTdElement.data('widget', titleWidget);
                formItemWidget.options.relationTitleWidget = titleWidget;
                this.subWidgetsMap[formItemWidget.getWidgetName()] = formItemWidget;
            }
        },

        addFieldItem: function(item) {
            this._createFieldItem(item);
            this.options.items = this.getFieldSettings();
            this.setSetting('items', this.getFieldSettings());
        },

        removeFieldItemByIndex: function(index) {
            var widgetTdElement = this.el.table.find('tbody td').eq(index);
            this.el.table.find('thead th').eq(index).remove();
            widgetTdElement.remove();
            this.el.table.find('colgroup col').eq(index).remove();
            this.el.table.width(this.el.table.find('thead th').length * 150);

            var widget = widgetTdElement.data('widget');
            delete this.subWidgetsMap[widget.getWidgetName()];
            widget.destroy();

            this.options.items = this.getFieldSettings();
            this.setSetting('items', this.getFieldSettings());
        },

        _reloadFieldItems: function() {
            this._loadFieldItems();
        },

        getFieldSettings: function() {
            var settings = [];
            this.el.table.find('tbody td').each(function() {
                settings.push($(this).data('widget').getSetting());
            });
            return settings
        },

        getSubWidgets: function () {
            var widgets = [];
            Foundation.Object.each(this.subWidgetsMap, function (widgetName, widget) {
                widgets.push(widget);
            });
            return widgets
        },

        setTitle: function(title) {
            this.el.title.text(title);
            FormDetailGroupWidget.superclass.setTitle.apply(this, arguments);
        },

        getSetting: function() {
            this.setSetting('items', this.getFieldSettings());
            return Foundation.apply({}, this._setting, {
                widgetName: this.getWidgetName()
            });
        }
    });

    return FormDetailGroupWidget
});