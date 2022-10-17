define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var InputWidget = require('./input');
    var Foundation = require('Foundation');

    var TextAreaWidget = Class.create({
        extend: InputWidget,
        _defaultOptions: function() {
            return Foundation.apply(TextAreaWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fui_textarea",
                inputCls: "x-textarea",
                height: 100
            });
        },
        _initEditElement: function() {
            var input = $('<textarea/>');
            input.addClass(this.options.inputCls);
            this.el.target.append(this.el.input = input);
        }
    });

    Widget.register('textarea', TextAreaWidget);

    return TextAreaWidget;
});