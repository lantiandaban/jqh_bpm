define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');

    var Widget = Class.create({

        statics: {
            _widgets: {},
            register: function(xtype, widget) {
                this._widgets[xtype] = widget;
                Foundation.apply(widget.prototype, {
                    xtype: xtype
                });
            },
            create: function(option) {
                var xtype = option.xtype.toLowerCase();
                var widget = this._widgets[xtype];
                if (widget) {
                    return new widget(option);
                }
                return function() {}
            },
            zIndex: 8000,
            widgetNameID: 0,
            createWidgetName: function() {
                return '_widget_name_' + +new Date
            }
        },

        _applyCallback: function(callback, scope, args) {
            if (Foundation.isFunction(callback)) {
                return callback.apply(scope, args || []);
            } else {
                return callback
            }
        },

        _defaultOptions: function() {
            return {
                baseCls: '',
                extClses: [],
                disableCls: 'x-ui-disable',
                hiddenCls: 'x-ui-hidden',
                enable: true,
                visible: true,
                renderEl: null,
                subWidgets: {},
                onBeforeEdit: null,
                onAfterEdit: null,
                onStopEdit: null,
                onBeforeInit: null,
                onInit: null,
                onAfterInit: null
            }
        },

        initialize: function(options) {
            this.options = Foundation.apply({}, options, this._defaultOptions());
            if (this._applyCallback(this.options.onBeforeInit, this, []) !== false) {
                this._beforeInit();
                this._init();
                this._afterInit();
            }
        },

        _beforeInit: function() {
            this.el = {};
        },

        _init: function() {
            this._initRoot();
            this._initWidgetName();
            this._applyCallback(this.options.onInit, this, [])
        },

        _afterInit: function() {
            this._initElementSize();
            this._initVisual();
            this._initDefaultValue();
            this._initEvents();
            this._applyCallback(this.options.onAfterInit, this, [])
        },

        _initRoot: function() {
            var options = this.options;
            if (options.renderEl) {
                this.el.target = $(options.renderEl);
            } else {
                this.el.target = this._defaultRoot();
            }
            if (!Foundation.isEmpty(options.baseCls)) {
                this.el.target.addClass(options.baseCls);
            }
            if (!Foundation.isEmpty(options.extClses)) {
                this.el.target.addClass(options.extClses.join(' '));
            }
        },

        _initEvents: Foundation.EMPTY_FUNCTION,

        _bindEvent: function(el, eventType, fn) {
            var self = this;
            el.bind(eventType, function(e) {
                var $element = $(this);
                if (Foundation.isString(fn)) {
                    fn = self[fn];
                }
                if (Foundation.isFunction(fn)) {
                    fn.apply(self, [$element, e]);
                }
            });
        },

        _bindDelegateEvent: function(el, selector, eventType, fn) {
            var self = this;
            el.delegate(selector, eventType, function(e) {
                var $element = $(this);
                if (Foundation.isString(fn)) {
                    fn = self[fn];
                }
                if (Foundation.isFunction(fn)) {
                    fn.apply(self, [$element, e]);
                }
            });
        },

        _unbindEvent: function(el, eventType, fn) {
            if (!eventType) {
                el.unbind();
                return;
            }
            if (fn) {
                el.unbind(eventType, fn);
            } else {
                el.unbind(eventType);
            }
        },

        _initWidgetName: function() {
            var options = this.options;
            if (Foundation.isEmpty(options.widgetName)) {
                options.widgetName = Widget.createWidgetName()
            }
            this.el.target.attr('data-widget-name', this.options.widgetName);
        },

        _initElementSize: function() {
            this.resize();
        },

        _initVisual: function() {
            this.setEnable(this.options.enable);
            this.setVisible(this.options.visible);
        },

        _initDefaultValue: function() {
            var options = this.options;
            if (!Foundation.isEmpty(options.value)) {
                this.setValue(options.value);
            }
            if (!Foundation.isEmpty(options.text)) {
                this.setText(options.text);
            }
        },

        _defaultRoot: function() {
            return $("<div/>")
        },

        resize: function(size) {
            var options = this.options;
            if (size) {
                options.width = size.width;
                options.height = size.height;
            }
            if (!Foundation.isEmpty(options.width)) {
                this.el.target.width(options.width);
            }
            if (!Foundation.isEmpty(options.height)) {
                this.el.target.height(options.height);
            }
        },

        isEnabled: function() {
            return this.options.enable
        },
        setEnable: function(enable) {
            this.options.enable = !!enable;
            if (this.options.enable) {
                this.el.target.removeClass(this.options.disableCls)
            } else {
                this.el.target.addClass(this.options.disableCls)
            }
        },
        isVisible: function() {
            return this.options.visible
        },
        setVisible: function(visible) {
            this.options.visible = !!visible;
            if (this.options.visible) {
                this.el.target.removeClass(this.options.hiddenCls)
            } else {
                this.el.target.addClass(this.options.hiddenCls)
            }
        },

        setValue: function(value) {
            this.options.value = value;
        },
        getValue: function() {
            return this.options.value
        },
        setText: function(text) {
            this.options.text = text;
        },
        getText: function() {
            return this.options.text
        },

        getWidgetName: function() {
            return this.options.widgetName;
        },
        getWidgetByName: function(name) {
            return this.options.subWidgets ? this.options.subWidgets[name] : null;
        },

        reRender: function() {
            this.options.renderEl = this.el.target;
            this.el.target.empty();
            this._beforeInit();
            this._init();
            this._afterInit()
        },

        appendTo: function(parentElement) {
            if (!Foundation.isEmpty(parentElement)) {
                this.el._parent = parentElement = $(parentElement);
            }
            this.el._parent.append(this.el.target);
        },

        destroy: function(remove) {
            if (remove) {
                this.el.target.remove()
            } else {
                this.el.target.empty()
            }
        }
    });

    return Widget;
});