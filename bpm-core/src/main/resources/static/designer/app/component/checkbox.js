define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var Foundation = require('Foundation');

    var CheckBoxWidget = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(CheckBoxWidget.superclass._defaultOptions.apply(this), {
                baseCls: "x-check",
                isSelected: false,
                onStateChange: null
            });
        },
        _init: function() {
            CheckBoxWidget.superclass._init.apply(this);
            $('<i class="icon-blank"/>').appendTo(this.el.target);
            this.el.text = $("<span/>").appendTo(this.el.target);
        },
        _initEvents: function() {
            this._bindEvent(this.el.target, 'click', function(element, event) {
                var options = this.options;
                if (!this.isEnabled()) {
                    return
                }
                this.setSelected(!options.isSelected);
                this._applyCallback(options.onStateChange, this, [options.isSelected])
            });
        },
        _initDefaultValue: function() {
            var options = this.options;
            if (!Foundation.isEmpty(options.text)) {
                this.setText(options.text);
            }
            if (!Foundation.isEmpty(options.value)) {
                this.setValue(options.value)
            }
        },
        setSelected: function(selected) {
            if (this.options.isSelected !== selected) {
                if (this.options.isSelected = selected) {
                    this.el.target.addClass("select")
                } else {
                    this.el.target.removeClass("select")
                }
            }
        },
        isSelected: function() {
            return this.options.isSelected
        },
        setValue: function(value) {
            value ? this.setSelected(true) : this.setSelected(false)
        },
        getValue: function() {
            return this.isSelected()
        },
        setText: function(text) {
            this.el.text.text(text)
        },
        getText: function() {
            return this.el.text.text()
        }
    });

    Widget.register('checkbox', CheckBoxWidget);

    return CheckBoxWidget;
});