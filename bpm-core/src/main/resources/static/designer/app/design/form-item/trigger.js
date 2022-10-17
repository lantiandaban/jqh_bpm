define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormBaseWidget = require('./base');

    var FormTriggerWidget = Class.create({
        extend: FormBaseWidget,

        _init: function() {
            FormTriggerWidget.superclass._init.apply(this);
            var triggerHtml = Foundation.String.format('<div class="{0} dui-trigger"><input class="trigger-input" /><i class="trigger-btn"></i></div>',
                this.options.triggerExtCls || '');
            this.el.trigger = this.el.target.html(triggerHtml);
            this.el.input = this.el.trigger.find('input');
            this.el.btn = this.el.trigger.find('i');
        },

        _afterInit: function() {
            FormTriggerWidget.superclass._afterInit.apply(this);
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
    return FormTriggerWidget
});