define(function (require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var constants = require('../constants');
    var Widget = require('../../component/widget');

    var FormIconSelectPanel = Class.create({
        extend: Widget,

        _defaultOptions: function () {
            return Foundation.apply(FormIconSelectPanel.superclass._defaultOptions.apply(this), {
                baseCls: "dui-form-icon-box",
                icons: [],
                selectedIconId: null,
                onSelected: null
            });
        },

        _init: function () {
            FormIconSelectPanel.superclass._init.apply(this);
            this.el.list = $('<ul class="form-icon-list clearfix"/>').appendTo(this.el.target);
            this._initIconsList();
        },

        _initDefaultValue: function() {
            var options = this.options;
            if (!Foundation.isEmpty(options.selectedIconId)) {
                this.selectIcon(options.selectedIconId, true);
            }
        },

        _initEvents: function () {
            this._bindDelegateEvent(this.el.list, 'li', 'click', '_onIconItemClick')
        },

        _initIconsList: function () {
            this._icon_map = {};
            Foundation.Array.forEach(this.options.icons, function (iconItem) {
                this._icon_map[iconItem.id] = {
                    element: this._createIconItem(iconItem),
                    data: iconItem
                }
            }, this);
        },

        _createIconItem: function (iconItem) {
            var html = Foundation.String.format('<li data-id="{0}" class="icon-item"><img src="{1}" title="{2}" /></li>',
                iconItem.id, iconItem.url, iconItem.name);
            return $(html).appendTo(this.el.list);
        },

        _onIconItemClick: function (element) {
            this.selectIcon(element.attr('data-id'));
        },

        selectIcon: function (iconId, init) {
            var iconData = this._icon_map[iconId];
            if (Foundation.isEmpty(iconData)) {
                return
            }
            if (this._selectedElement) {
                this._selectedElement.removeClass('selected')
            }
            this._selectedElement = iconData.element.addClass('selected');
            init || this._applyCallback(this.options.onSelected, this, [iconData.data])
        }

    });

    Widget.register('x-form-icon-select-panel', FormIconSelectPanel);

    return FormIconSelectPanel;
});