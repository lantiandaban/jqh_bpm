define(function(require, exports, module) {
    var Widget = require('./widget');
    var Class = require('Class');
    var Foundation = require('Foundation');

    var Container = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply({}, {
                subWidgets: {}
            }, Container.superclass._defaultOptions.apply())
        },
        addWidget: function(widgetOption) {
            var options = this.options;
            var widget = Widget.create(widgetOption);
            options.subWidgets[widget.getWidgetName()] = widget;
            if (widget.options.subWidgets) {
                Foundation.apply(options.subWidgets, widget.options.subWidgets)
            }
            return widget;
        }
    });

    Widget.register('container', Container);

    return Container;
});