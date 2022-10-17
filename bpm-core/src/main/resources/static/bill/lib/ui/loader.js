define(function (require, exports, module) {
    var Class = require('../class');
    var Component = require('./component');
    var Foundation = require('../foundation');

    var Loader = Class.create({

        extend: Component,

        baseCls: 'ui-loader',

        text: '数据加载中...',

        vertical: false,

        onlyText: false,

        onlyDot: false,

        container: null,

        _beforeInit: function () {
            Loader.superclass._beforeInit.apply(this);

            this.el.container = $(this.container);

            if (this.vertical){
                this.extClsList.push('ui-loader-vertical')
            }
            if (this.onlyText) {
                this.extClsList.push('ui-loader-text-only');
            }
            if (this.onlyDot) {
                this.extClsList.push('ui-loader-dot-only');
            }
        },

        _init: function () {
            Loader.superclass._init.apply(this);

            this.el.body = $('<div class="ui-loader-body"/>').appendTo(this.el.target);
            this.el.inner = $('<div class="ui-loader-inner"/>').appendTo(this.el.body);
            this._initDotElement();
            this._initLoadTextElement();
        },

        _initDotElement: function () {
            this.el.dot = $('<div class="ui-loader-dot"/>').appendTo(this.el.inner);
            Foundation.Array.eachCount(4, function () {
                $('<i/>').appendTo(this.el.dot)
            }, this);
        },

        _initLoadTextElement: function () {
            this.el.text = $(Foundation.String.format('<span class="ui-loader-text">{0}</span>', this.text))
                .appendTo(this.el.inner)
        },

        _initEvents: function () {
            this._bindEvent(this.el.container, 'resize', '_onContainerResize');
        },

        _onContainerResize: function () {
            if (this.__container_resize_timeout) {
                clearTimeout(this.__container_resize_timeout);
                this.__container_resize_timeout = null;
            }
            var self = this;
            this.__container_resize_timeout = setTimeout(function () {
                self._position()
            }, 100);
        },

        start: function () {
            this.el.container.addClass('ui-loader-blur ui-loader-container');
            this.el.target.addClass('loading').appendTo(document.body);
            this._position();
            this.fireEvent('start', this);
        },

        stop: function () {
            this.el.container.removeClass('ui-loader-blur ui-loader-container');
            this.el.target.removeClass('loading').detach();
            this.fireEvent('stop', this);
        },

        _position: function () {
            var offset = this.el.container.offset();
            var width = this.el.container.outerWidth();
            var height = this.el.container.outerHeight();

            this.el.target.css({
                left: offset.left,
                top: offset.top,
                width: width,
                height: height
            })
        },

        setText: function (text) {
            this.text = text;
            this.el.text.text(text)
        },

        getText: function () {
            return this.text
        },

        destroy: function (empty) {
            this.el.container.removeClass('ui-loader-blur ui-loader-container');
            Loader.superclass.destroy.apply(this, arguments);
        }
    });

    return Loader
});

