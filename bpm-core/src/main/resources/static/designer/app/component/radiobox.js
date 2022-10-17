define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var Foundation = require('Foundation');

    var RadioBoxWidget = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(RadioBoxWidget.superclass._defaultOptions.apply(this), {

            });
        },
        _init: function() {
            RadioBoxWidget.superclass._init.apply(this);

        },
        _initEvents: function() {

        }
    });

    Widget.register('radiobox', RadioBoxWidget);

    return RadioBoxWidget;
});