define(function(require, exports, module) {
    var Widget = require('./widget');
    var Class = require('Class');
    var Foundation = require('Foundation');

    var ContextMenu = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply({}, {
                baseCls: 'x-contextmenu',
                contextEl: null,
                offsetX: 2,
                offsetY: 2,
                onBeforeShow: null,
                onAfterShow: null,
                onGetMenuItems: null,

            }, ContextMenu.superclass._defaultOptions.apply())
        },

        _beforeInit: function() {
            ContextMenu.superclass._beforeInit.apply(this);
            this.el.contextEl = this.options.contextEl;
        },

        _init: function() {
            ContextMenu.superclass._init.apply(this);
            this.el.list = $('<ul class="x-contextmenu-list"/>').appendTo(this.el.target);
        },

        _initEvents: function() {
            this._bindEvent(this.el.contextEl, 'contextmenu', '_onContextMenu');
            this._bindDelegateEvent(this.el.list, 'li', 'click', '_onContextMenuItemClick');
            this._bindEvent($(document.body), 'click.contextmenu_' + this.widgetName, '_onClickBodyToCloseMenu');
        },

        _onContextMenu: function(element, event) {
            event.preventDefault();

            var options = this.options;
            this.hide();
            this.appendTo('body');
            if (this._applyCallback(options.onBeforeShow, this, [element, event]) === false) {
                return
            }
            this._createMenuItems(event);

            this.el.target.show().css({
                left: event.clientX + options.offsetX,
                top: event.clientY + $(document).scrollTop() + options.offsetY
            });

            this._applyCallback(options.onAfterShow, this);
            return false;
        },

        _onClickBodyToCloseMenu: function() {
            this.hide();
        },

        _onContextMenuItemClick: function(element, event) {
            var item = element.data('item');
            if (Foundation.isFunction(item.fn)) {
                item.fn.apply(this, [item, element, this]);
            }
        },

        _createMenuItems: function(event) {
            var items = this._applyCallback(this.options.onGetMenuItems, this, [event]) || [];
            Foundation.Array.forEach(items, function(item, i) {
                var menuElement;
                if (item == '-') {
                    menuElement = $('<li class="x-contextmenu-separate" />');
                } else {
                    menuElement = $('<li class="x-contextmenu-item"><a href="javascript:">' + item.text + '</a></li>').data('item', item);
                    if (item.disabled) {
                        menuElement.addClass('x-contextmenu-item-disabled');
                    }
                }
                this.el.list.append(menuElement);
            }, this);
        },

        hide: function() {
            this.el.list.find('li').remove();
            this.el.target.hide();
        }

    });

    Widget.register('contextmenu', ContextMenu);

    return ContextMenu;
});