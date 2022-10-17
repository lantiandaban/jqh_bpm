define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var Foundation = require('Foundation');

    var TriggerWidget = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(TriggerWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fui_trigger",
                height: 30,
                btnWidth: 30,
                placeholder: null,
                triggerIcon: "",
                edge: { width: 280, height: 200 }
            });
        },
        _init: function() {
            TriggerWidget.superclass._init.apply(this);
            var options = this.options;
            this.el.input = this._createInputElement();
            this.el.trigger = this._createTriggerButtonElement();
            if (!Foundation.isEmpty(options.placeholder)) {
                this.el.input.attr('placeholder', options.placeholder);
            }
        },

        _createInputElement: function() {
            return $('<input class="fui_trigger-input" onfocus="this.blur();"/>')
                .prop("readOnly", true)
                .attr("UNSELECTABLE", "on")
                .appendTo(this.el.target);
        },

        _createTriggerButtonElement: function() {
            return $('<i class="fui_trigger-btn"/>')
                .addClass(this.options.triggerIcon)
                .appendTo(this.el.target)
        },

        _initEvents: function() {
            this._unbindEvent(this.el.target, 'click.trigger');
            this._bindEvent(this.el.target, 'click.trigger', '_onTargetElementClick');
        },

        _onTargetElementClick: function(target, event) {
            var element = $(event.target);
            console.log(element);
            if (!Foundation.isEmpty(element.closest('.fui_trigger-input')) || !Foundation.isEmpty(element.closest('.fui_trigger-btn'))) {
                this._onTriggerClick();
            }
        },

        _onTriggerClick: Foundation.EMPTY_FUNCTION,

        _getTriggerViewPosition: function() {
            var options = this.options;
            var styles = { "z-Index": Widget.zIndex++, 'position': 'absolute' },
                targetOffset = this.el.target.offset(),
                edge = options.edge,
                rightDistance = document.body.clientWidth - targetOffset.left,
                topDistance = targetOffset.top - $("body").offset().top;

            if (rightDistance < edge.width) {
                styles.right = rightDistance - this.el.target.outerWidth();
                styles.left = 'auto';
            } else {
                styles.right = 'auto';
                styles.left = targetOffset.left;
            }

            var _topDistance = document.body.clientHeight + document.body.scrollTop - topDistance - this.el.target.outerHeight();
            if (_topDistance < edge.height) {
                styles.top = 'auto';
                styles.bottom = document.body.clientHeight - topDistance;
            } else {
                styles.top = topDistance + this.el.target.outerHeight();
                styles.bottom = 'auto';
            }
            return styles;
        },

        setValue: function(value) {
            this.setText(value)
        },
        setText: function(text) {
            this.el.input.val(text)
        },
        getValue: function() {
            return this.getText()
        },
        getText: function() {
            return this.el.input.val()
        }

    });

    Widget.register('trigger', TriggerWidget);

    return TriggerWidget;
});