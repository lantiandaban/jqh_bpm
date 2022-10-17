define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var Foundation = require('Foundation');

    var DialogWidget = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(DialogWidget.superclass._defaultOptions.apply(this), {
                renderEl: $("<div/>").appendTo("body"),
                baseCls: "x-dialog",
                title: "",
                animation: 300,
                style4Header: null,
                hasCloseBtn: !0,
                contentWidget: {},
                autoClose: !0,
                onAfterHeaderCreate: null,
                onContentCreate: null,
                onOpen: null,
                onClose: null
            });
        },
        _init: function() {
            DialogWidget.superclass._init.apply(this);

            this._initMaskElement();
            this._initHeaderElement();
            this._initContentElement();
            this.appendTo(this.el.mask);
        },

        _initMaskElement: function() {
            this.el.mask = $('<div class="x-window-mask light modal fadeout scrollable"/>').css({
                "z-index": Widget.zIndex++
            }).appendTo('body');
        },

        _initHeaderElement: function() {
            var options = this.options;
            this.el.header = $('<div class="dialog-header"/>')
                .append($('<span class="title"/>').text(options.title))
                .appendTo(this.el.target);

            if (options.style4Header) {
                this.el.header.addClass(options.style4Header);
            }
            if (options.hasCloseBtn) {
                this.el.close = $('<i class="icon-close-large"/>').appendTo(this.el.header);
            }
            this._applyCallback(options.onAfterHeaderCreate, this, [this.el.header])
        },

        _initContentElement: function() {
            this.el.content = $('<div class="dialog-body"/>').appendTo(this.el.target);
            var options = this.options;

            if (this._applyCallback(options.onContentCreate, this, [this.el.content]) !== false) {
                this.container = Widget.create(Foundation.apply({
                    xtype: "tablecontainer",
                    renderEl: $("<div/>").appendTo(this.el.content)
                }, options.contentWidget));
            }
        },

        _initEvents: function() {
            var options = this.options;
            if (options.autoClose) {
                this.el.mask && this._bindEvent(this.el.mask, 'click', '_onDialogMaskClick');
            }
            if (options.hasCloseBtn) {
                this.el.close && this._bindEvent(this.el.close, 'click', '_onDialogCloseBtnClick');
            }
        },

        _onDialogMaskClick: function(mask, event) {
            $(event.target).hasClass("x-window-mask") && this.close();
        },

        _onDialogCloseBtnClick: function(mask, event) {
            this.close();
        },

        getWidgetByName: function(name) {
            return this.container ? this.container.getWidgetByName(name) : null
        },

        open: function() {
            var self = this;
            setTimeout(function() {
                self.el.mask.addClass("fadein").removeClass("fadeout");
                self._applyCallback(self.options.onOpen, this)
            }, 0)
        },

        close: function() {
            var options = this.options,
                self = this;
            this.el.mask.addClass("fadeout").removeClass("fadein");
            setTimeout(function() {
                self._applyCallback(options.onClose, this)
                self.el.target.remove();
                self.el.mask.remove();
            }, self.animation)
        }

    });

    Widget.register('dialog', DialogWidget);

    return DialogWidget;
});