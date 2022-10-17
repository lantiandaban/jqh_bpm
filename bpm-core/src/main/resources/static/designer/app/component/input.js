define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var Foundation = require('Foundation');

    var InputWidget = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(InputWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fui_text",
                inputCls: "x-input",
                inputFocusCls: 'x-input-focus',
                height: 30,
                placeholder: '',
                enable: true,
                onBeforeEdit: null,
                onAfterEdit: null,
                onStopEdit: null
            });
        },
        _init: function() {
            InputWidget.superclass._init.apply(this);
            this._initEditElement();
            if (!Foundation.isEmpty(this.options.placeholder)) {
                this.el.input.attr('placeholder', this.options.placeholder);
            }
        },
        _initEditElement: function() {
            var input = $('<input type="text"/>');
            input.addClass(this.options.inputCls);
            this.el.target.append(this.el.input = input);
        },
        _initEvents: function() {
            this._bindEvent(this.el.input, 'focus', '_onInputFocus');
            this._bindEvent(this.el.input, 'blur', '_onInputBlur');
            this._bindEvent(this.el.input, 'keyup', '_onInputKeyup');
        },
        _onInputFocus: function(input, event) {
            if (!this.isEnabled()) {
                return;
            }
            this.el.input.addClass(this.options.inputFocusCls);
            this._applyCallback(this.options.onBeforeEdit, this, [event, this.getValue()]);
        },
        _onInputBlur: function(input, event) {
            if (!this.isEnabled()) {
                return;
            }
            this.el.input.removeClass(this.options.inputFocusCls);
            this._applyCallback(this.options.onStopEdit, this, [event, this.getValue()]);
        },
        _onInputKeyup: function(input, event) {
            if (!this.isEnabled()) {
                return;
            }
            this._applyCallback(this.options.onAfterEdit, this, [event, this.getValue()]);
        },

        setEnable: function(enable) {
            InputWidget.superclass.setEnable.apply(this, [enable]);
            enable ? this.el.input.removeProp("readOnly") : this.el.input.prop("readOnly", true)
        },
        setValue: function(a) {
            this.el.input.val(a)
        },
        getValue: function() {
            return this.el.input.val().trim()
        },
        setPlaceholder: function(placeholder) {
            this.options.placeholder = placeholder;
            this.el.input.attr('placeholder', placeholder);
        },
        select: function() {
            this.el.input && (this.el.input.select(), this.el.input.focus())
        }
    });

    Widget.register('input', InputWidget);

    return InputWidget;
});