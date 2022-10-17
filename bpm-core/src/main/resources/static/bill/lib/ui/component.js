define(function (require, exports, module) {
    var Class = require('../class');
    var Event = require('../event');
    var Foundation = require('../foundation');

    /**
     * 组件类的基类, 所有组件都应该继承该类
     * */
    var Component = Class.create({

        statics: {
            createWidgetName: function () {
                return '_component_name_' + +new Date
            }
        },

        isComponent: true,

        implement: [Event],

        isDestroyed: false,

        //组件的基础样式, 如果设置, 在创建主键后, 会自动添加该样式class到组件中
        baseCls: null,

        //扩展组件样式集合,开发者可以根据业务逻辑来动态设置组件的样式
        //可以在实例化时设置该值, 也可以在_beforeInit实例方法中动态赋值
        extClsList: [],

        //禁用组件的样式, 通过setEnable方法可设置组件的启用和禁用状态
        disableCls: 'ui-disable',

        //隐藏组件的样式, 通过setVisible方法可设置组件的显示和隐藏状态(不要用css的display来修改组件的显示和隐藏,必须通过该方法来设置)
        hiddenCls: 'ui-hidden',

        //组件的宽度, 如果不设置该参数, 那么不设置组件宽度, 任由自身的css样式来控制
        width: null,

        //组件的高度, 如果不设置该参数, 那么不设置组件高度, 任由自身的css样式来控制
        height: null,

        //是否自动渲染
        autoRender: true,

        //监听事件集合
        listeners: [],

        enable: true,
        visible: true,

        //设置组件的内容jQuery对象
        targetEl: null,

        //设置组件内容添加到的容器jQuery对象
        appendToEl: null,

        //初始化之前的事件方法
        onBeforeInit: null,

        //初始化中的事件方法
        onInit: null,

        //初始化后的事件方法
        onAfterInit: null,

        /**
         * 组件对象的构造方法, 用过new关键字创建的都会调用该方法
         *
         * @options 组件的配置属性对象, 在组件中可以通过this.options来访问
         * */
        initialize: function (options) {

            this.listeners = [];

            this._original_options = Foundation.clone(options);
            Foundation.apply(this, options || {});

            this.initListeners.apply(this);

            if (Foundation.isEmpty(this.widgetName)) {
                this.widgetName = Component.createWidgetName()
            }

            //初始化组件中的jQuery对象缓存对象, 建议开发者在开发组件中使用缓存jQuery对象
            this.el = {};

            if (this.autoRender) {
                this.render();
            }
        },

        /**
         * 处理渲染
         * */
        render: function () {
            if (this.rendered) {
                return
            }
            if (this.fireEvent('before-init', this) !== false) {
                this._beforeInit();
                this._init();
                this._afterInit();
                this.rendered = true
            }
        },

        /**
         * 根据名称获取配置
         * */
        getOption: function (name) {
            return this[name]
        },

        /**
         * 初始化前的钩子方法, 在这个方法中,开发者可处理配置参数的修改或者其他的参数属性初始化操作
         * */
        _beforeInit: Foundation.EMPTY_FUNCTION,

        /**
         * 初始化中的钩子方法, 在这个方法中,开发者可对组件内容进行处理
         * */
        _init: function () {
            if (this.targetEl) {
                this.el.target = $(this.targetEl);
            } else {
                var rootElement;
                if (Foundation.isFunction(this.getRootElement)) {
                    rootElement = this.getRootElement();
                }
                this.el.target = $(rootElement || this._getContentElement());
            }
            if (!Foundation.isEmpty(this.baseCls)) {
                this.el.target.addClass(this.baseCls);
            }

            var extClasses = this.getExtClasses();
            if (!Foundation.isEmpty(extClasses)) {
                this.el.target.addClass(extClasses.join(' '));
            }

            if (!Foundation.isEmpty(this.appendToEl = $(this.appendToEl))) {
                this.appendTo(this.appendToEl)
            }

            //初始化组件的组件名(唯一)
            this.el.target.attr('data-widget-name', this.widgetName);
            this.fireEvent('init', this);
        },

        getExtClasses: function () {
            return this.extClsList
        },

        /**
         * 初始化后的钩子方法
         * */
        _afterInit: function () {
            //设置组件的尺寸大小
            this._initElementSize();
            //设置组件的显示和隐藏
            this._initVisual();
            //初始化组件的事件
            this._initEvents();
            this.fireEvent('after-init', this);
        },

        /**
         * 初始化事件的钩子方法, 开发者在子类中覆盖该方法进行事件绑定处理
         * */
        _initEvents: Foundation.EMPTY_FUNCTION,

        /**
         * 绑定事件方法
         *
         * @el 需要绑定事件的jQuery对象, 建议都使用this.el中的属性
         * @eventType 事件类型,比如click
         * @fn 事件的执行方法, 可以一个Function或一个字符串, 当为字符串时, 会对应到对象中同名的实例方法
         * */
        _bindEvent: function (el, eventType, fn) {
            var self = this;
            el.bind(eventType, function (e) {
                var $element = $(this);
                if (Foundation.isString(fn)) {
                    fn = self[fn];
                }
                if (Foundation.isFunction(fn)) {
                    var result = fn.apply(self, [$element, e]);
                    if (result === false) {
                        return false
                    }
                }
            });
        },

        /**
         * 事件代理方法
         *
         * @el 需要代理事件的jQuery对象, 建议都使用this.el中的属性
         * @selector 代理的jQuery选择器字符串
         * @eventType 事件类型,比如click
         * @fn 事件的执行方法, 可以一个Function或一个字符串, 当为字符串时, 会对应到对象中同名的实例方法
         * */
        _bindDelegateEvent: function (el, selector, eventType, fn) {
            var self = this;
            el.delegate(selector, eventType, function (e) {
                var $element = $(this);
                if (Foundation.isString(fn)) {
                    fn = self[fn];
                }
                if (Foundation.isFunction(fn)) {
                    fn.apply(self, [$element, e]);
                }
            });
        },

        _bindHoverEvent: function (el, inFn, outFn) {
            var self = this;
            el.hover(function (e) {
                var $element = $(this);
                if (Foundation.isString(inFn)) {
                    inFn = self[inFn];
                }
                if (Foundation.isFunction(inFn)) {
                    inFn.apply(self, [$element, e]);
                }
            }, function (e) {
                var $element = $(this);
                if (Foundation.isString(outFn)) {
                    outFn = self[outFn];
                }
                if (Foundation.isFunction(inFn)) {
                    outFn.apply(self, [$element, e]);
                }
            });
        },

        /**
         * 解除事件绑定
         *
         * @el 解除事件对应的jQuery对象
         * @eventType 解除事件的类型
         * @fn 事件的执行方法
         * */
        _unbindEvent: function (el, eventType, fn) {
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

        /**
         * 执行函数方法, 可设置方法的执行作用域和参数
         *
         * @callback 待执行的函数
         * @scope 执行函数的作用域
         * @args 执行函数的参数集合
         * */
        _applyCallback: function (callback, scope, args) {
            if (Foundation.isFunction(callback)) {
                return callback.apply(scope, args || []);
            } else {
                return callback
            }
        },

        _initElementSize: function () {
            this.resize();
        },

        _initVisual: function () {
            this.setEnable(this.enable);
            this.setVisible(this.visible);
        },

        /**
         * 获取组件内容的钩子方法, 开发者在子类中可覆盖该方法来实现组件内容的自定义
         * */
        _getContentElement: function () {
            return $("<div/>")
        },

        getRootElement: Foundation.EMPTY_FUNCTION,

        resize: function (size) {
            if (size) {
                this.width = size.width;
                this.height = size.height;
            }
            this.setWidth(this.width);
            this.setHeight(this.height)
        },

        setWidth: function (width) {
            if (Foundation.isNumber(width)) {
                this.width = width;
                if (this.el.target) {
                    this.el.target.width(this.width);
                }
            }
        },

        setHeight: function (height) {
            if (Foundation.isNumber(height)) {
                this.height = height;
                if (this.el.target) {
                    this.el.target.height(this.height);
                }
            }
        },

        isEnabled: function () {
            return this.enable
        },

        setEnable: function (enable) {
            this.enable = !!enable;
            if (this.enable) {
                this.onEnable()
            } else {
                this.onDisable()
            }
        },

        onEnable: function () {
            this.enable = true;
            this.el.target.removeClass(this.disableCls)
        },

        onDisable: function () {
            this.enable = false;
            this.el.target.addClass(this.disableCls)
        },

        isVisible: function () {
            return this.visible
        },

        setVisible: function (visible) {
            this.visible = !!visible;
            this.el.target.toggleClass(this.hiddenCls, !this.visible);
        },

        getWidgetName: function () {
            return this.widgetName;
        },

        getTargetElement: function () {
            return this.el.target
        },

        appendTo: function (element) {
            this.el.appendToEl = $(element);
            this.appendToEl = element;
            this.el.target.appendTo(this.el.appendToEl);
        },

        addClass: function (el, className) {
            if (Foundation.isString(el)) {
                className = el;
                el = this.el.target;
            }
            el.addClass(className);
        },

        removeClass: function (el, className) {
            if (Foundation.isString(el)) {
                className = el;
                el = this.el.target;
            }
            el.removeClass(className);
        },

        toggleClass: function (el, className, add) {
            if (Foundation.isString(el)) {
                add = className;
                className = el;
                el = this.el.target;
            }
            el.toggleClass(className, add);
        },

        /**
         * 组件销毁事件
         * */
        destroy: function (empty) {
            this.extClsList = [];
            this.listeners = [];

            if (this.rendered) {
                if (empty) {
                    this.el.target.empty()
                } else {
                    this.el.target.remove()
                }
            }
            this.fireEvent('destroy', this);
            this.isDestroyed = true;
        }
    });

    return Component;
});