define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormBaseWidget = require('./base');

    var FormInputWidget = Class.create({
        extend: FormBaseWidget,

        _init: function() {
            FormInputWidget.superclass._init.apply(this);
            var options = this.options;
            var input;
            if (options.isTextArea) {
                input = $('<textarea class="dui-textarea"></textarea>');
            } else {
                input = $('<input class="dui-input"/>');
            }
            this.el.input = input.appendTo(this.el.target);
        },

        _afterInit: function() {
            FormInputWidget.superclass._afterInit.apply(this);
            var options = this.options;
            this.setPlaceholder(options.placeholder);
        },

        setValue: function(value) {
            this.el.input.val(value);
            this.options.value = value;
            this.setSetting('value', value);
        },

        getValue: function() {
            return this.el.input.val()
        },

        setPlaceholder: function(placeholder) {
            this.el.input.attr('placeholder', placeholder);
            this.options.placeholder = placeholder;
            this.setSetting('placeholder', placeholder);
        },

        getPlaceholder: function() {
            return this.el.input.attr('placeholder')
        }
    });

    return FormInputWidget
});