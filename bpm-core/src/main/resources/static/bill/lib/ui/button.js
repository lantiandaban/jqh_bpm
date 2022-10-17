define(function (require, exports, module) {
    var Class = require('../class');
    var Component = require('./component');
    var Foundation = require('../foundation');

    var Button = Class.create({

        extend: Component,

        baseCls: 'ui-btn',

        disableCls: 'ui-btn-disable',

        style: null,

        circle: false,

        icon: null,

        title: null,

        enable: true,

        handler: null,

        onClick: null,

        submit: false,

        _beforeInit: function () {
            Button.superclass._beforeInit.apply(this);

            this._hasIcon = !Foundation.isEmpty(this.icon);
            this._hasTitle = !Foundation.isEmpty(this.title);
        },

        getExtClasses: function () {
            var clses = [];
            if (this.circle) {
                clses.push('ui-btn-circle');
            }
            if (this._hasIcon && !this._hasTitle) {
                clses.push('ui-btn-icon-only');
            }
            if (!Foundation.isEmpty(this.style)) {
                clses.push('ui-btn-' + this.style)
            }
            return Foundation.Array.merge([], this.extClsList, clses)
        },

        _init: function () {
            Button.superclass._init.apply(this);

            if (this._hasIcon) {
                this.el.icon = $('<i class="ui-icon"></i>').addClass(this.icon).appendTo(this.el.target);
            }
            if (this._hasTitle) {
                this.el.title = $('<span/>').text(this.title).appendTo(this.el.target);
            }
        },

        _getContentElement: function () {
            if (this.submit) {
                return $('<input type="submit"/>');
            }
            return $('<div/>')
        },

        _initEvents: function () {
            this._bindEvent(this.el.target, 'click', '_onButtonClick');
        },

        _onButtonClick: function () {
            this.fireEvent('click', this);
            this._applyCallback(this.handler, this, [this]);
            this._applyCallback(this.onClick, this, [this]);
        },

        setEnable: function (enable) {
            Button.superclass.setEnable.apply(this, arguments);
            this.el.target.prop('disabled', !this.enable)
        },

        setIcon: function (icon) {
            if (!this._hasIcon || Foundation.isEmpty(icon)) {
                return
            }
            this.el.icon.removeClass(this.icon);
            this.el.icon.addClass(this.icon = icon);
        },

        getIcon: function () {
            return this.icon
        },

        setTitle: function (title) {
            if (!this._hasTitle || Foundation.isEmpty(title)) {
                return
            }
            this.el.title.text(this.title = title);
        },

        getTitle: function () {
            return this.title
        }

    });

    return Button
});

