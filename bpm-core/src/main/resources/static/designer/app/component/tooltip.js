define(function(require, exports, module) {
    var Widget = require('./widget');
    var Class = require('Class');
    var Popover = require('./popover');
    var Foundation = require('Foundation');

    var TooltipWidget = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply({}, {
                baseCls: "fx_tooltip_pane",
                style: "info",
                text: "",
                tipWidth: 200,
                animation: true
            }, TooltipWidget.superclass._defaultOptions.apply())
        },
        _init: function() {
            var options = this.options;
            TooltipWidget.superclass._init.apply(this);

            var iconCls = 'icon-help';
            switch (options.style) {
                case "info":
                    iconCls = "icon-help";
                    break;
                case "warning":
                    iconCls = "icon-tip-warning";
                    break;
                case "tip":
                    iconCls = "icon-tip-warning"
            }
            this.el.tip = $('<i class="tip-icon ' + iconCls + '"/>').appendTo(this.el.target);
        },

        _initEvents: function() {
            var self = this;
            var options = this.options;
            this.el.tip.hover(function() {
                Popover.show({
                    position: options.position,
                    anchor: self.el.tip,
                    maxWidth: options.tipWidth,
                    animation: options.animation,
                    content: $("<span/>").text(options.text)
                });
            }, function() {
                Popover.close();
            });
        }
    });

    Widget.register('tooltip', TooltipWidget);

    return TooltipWidget;
});