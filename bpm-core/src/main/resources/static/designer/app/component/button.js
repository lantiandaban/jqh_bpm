define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var Foundation = require('Foundation');

    var ButtonWidget = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(ButtonWidget.superclass._defaultOptions.apply(this), {
                baseCls: "x-btn",
                iconCls: null,
                style: "blue",
                height: 30
            });
        },
        _init: function() {
            ButtonWidget.superclass._init.apply(this);
            var options = this.options;
            if (options.iconCls) {
                $("<i/>").addClass(options.iconCls).appendTo(this.el.target);
            }
            this.el.text = $("<span/>").appendTo(this.el.target);
            if (options.style) {
                this.el.target.addClass("style-" + options.style);
            }
        },

        _initEvents: function() {
            var self = this;
            var options = this.options;
            if (options.hoverCls) {
                this.el.target.hover(function() {
                    self.isEnabled() && $(this).addClass(options.hoverCls)
                }, function() {
                    self.isEnabled() && $(this).removeClass(options.hoverCls)
                });
            }
            this._bindEvent(this.el.target, 'click', function(target, event) {
                this.isEnabled() && this._applyCallback(options.onClick, this, [event]);
            });
        },
        resize: function(size) {
            ButtonWidget.superclass.resize.apply(this, arguments);
            var options = this.options;
            if (!Foundation.isEmpty(options.height)) {
                this.el.target.css("line-height", options.height + "px")
            }
        },
        setValue: function(value) {
            ButtonWidget.superclass.setValue.apply(this, arguments);
            if (Foundation.isEmpty(value)) {
                value = "";
            }
            this.el.text.text(value)
        },
        setText: function(text) {
            ButtonWidget.superclass.setText.apply(this, arguments);
            this.setValue(text);
        }
    });

    Widget.register('button', ButtonWidget);

    return ButtonWidget;
});