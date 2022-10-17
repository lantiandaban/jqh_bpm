define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var Foundation = require('Foundation');

    var LabelWidget = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(LabelWidget.superclass._defaultOptions.apply(this), {
                baseCls: "x-label",
                text: "",
                onClick: null
            });
        },
        _init: function() {
            LabelWidget.superclass._init.apply(this);
            this.el.label = $("<a/>").appendTo(this.el.target);
        },
        _initEvents: function() {
            this.options.onClick && this._bindEvent(this.el.label, 'click', '_onLabelClick');
        },
        _onLabelClick: function(label, event) {
            this._applyClass(this.options.onClick, this, [this.el.label]);
        },
        setText: function(text) {
            text = Foundation.isEmpty(text) ? "" : text;
            this.el.label.text(text)
        },
        setValue: function(text) {
            this.setText(text)
        }
    });

    Widget.register('label', LabelWidget);

    return LabelWidget;
});