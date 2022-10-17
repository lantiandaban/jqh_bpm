define(function (require, exports, module) {
    var Class = require('../class');
    var Component = require('./component');
    var Foundation = require('../foundation');
    var Button = require('./button');

    /**
     * 弹出层组件
     * */
    var Dialog = Class.create({

        statics: {
            DIALOG_Z_INDEX: 1000000
        },

        extend: Component,

        baseCls: 'ui-dialog',

        title: "弹出框标题",

        autoClose: false,

        showClose: true,

        width: 400,

        height: 500,

        contentPadding: 0,

        //内容DOM对象,可以是jquery对象或者DOM对象
        contentElement: null,

        //内容的HTML字符串
        contentHtml: null,

        //内容的组件
        contentComp: null,

        //内容的组件的配置
        contentCompOptions: {},

        //btnItems下的字段: name, icon, title, disabled, handler
        btnItems: [],

        opened: false,

        _beforeInit: function () {
            Dialog.superclass._beforeInit.apply(this);

            this.opened = false;
            this._action_btn_map = {};
            this.appendToEl = $(document.body);
        },

        getExtClasses: function () {
            var extClsList = [];
            if (!(this.__hasFooter = !Foundation.isEmpty(this.btnItems))) {
                extClsList.push('ui-dialog-nofooter')
            }
            return Foundation.Array.merge([], this.extClsList, extClsList)
        },

        _init: function () {
            Dialog.superclass._init.apply(this);

            this._initHeader();
            this._initContent();
            this._initFooter();
        },

        _initHeader: function () {
            var headerHtml = Foundation.String.format('<div class="ui-dialog-header"><div class="title">{0}</div>{1}</div>',
                this.title, this.showClose ? '<i class="close"></i>' : '');

            this.el._dialog_header = $(headerHtml).appendTo(this.el.target);
            this.el._dialog_title = this.el._dialog_header.find('.title');
            this.el._dialog_close_btn = this.el._dialog_header.find('i.close');
        },

        _initContent: function () {
            this.beforeRenderContent();
            this.onRenderContent(this.el._dialog_content);
            this.afterRenderContent();
        },

        beforeRenderContent: function () {
            this.el._dialog_content = $('<div class="ui-dialog-content"/>').appendTo(this.el.target);
            if (this.contentPadding) {
                this.el._dialog_content.css('padding', this.contentPadding);
            }
        },

        onRenderContent: function () {
            if (!Foundation.isEmpty(this.contentHtml)) {
                this.el._dialog_content.html(this.contentHtml)
            }
            else if (!Foundation.isEmpty(this.contentElement)) {
                this.el._dialog_content.append(this.contentElement)
            }
            else if (!Foundation.isEmpty(this.contentComp)) {
                this.setContentComp(this.contentComp, this.contentCompOptions);
            }
        },

        afterRenderContent: function () {
            this.onAfterRenderContent();
            this.fireEvent('after-content-rendered', this, this.el._dialog_content);
        },

        onAfterRenderContent: Foundation.EMPTY_FUNCTION,

        _initFooter: function () {
            if (!this.__hasFooter) {
                return
            }
            this.el._dialog_footer = $('<div class="ui-dialog-footer" />').appendTo(this.el.target);
            Foundation.Array.forEach(this.btnItems, function (btnItem) {
                this._createFooterActionBtn(btnItem);
            }, this);
        },

        _createFooterActionBtn: function (btnItem) {
            var self = this;
            var button = new Button({
                appendToEl: this.el._dialog_footer,
                circle: false,
                style: btnItem.style,
                icon: btnItem.icon,
                title: btnItem.title,
                enable: !btnItem.disabled,
                handler: function () {
                    btnItem.handler.call(self, [self, btnItem.name, button])
                }
            });
            if (!Foundation.isEmpty(btnItem.name)) {
                this._action_btn_map[btnItem.name] = button;
            }
        },

        _initEvents: function () {
            this._bindEvent(this.el._dialog_close_btn, 'click', function () {
                this.close()
            });
        },

        getButton: function (name) {
            return this._action_btn_map[name]
        },

        setButtonIcon: function (name, icon) {
            var button = this.getButton(name);
            if (Foundation.isEmpty(button)) {
                return
            }
            button.setIcon(icon);
        },

        setButtonTitle: function (name, title) {
            var button = this.getButton(name);
            if (Foundation.isEmpty(button)) {
                return
            }
            button.setTitle(title);
        },

        getContentComp: function () {
            return this._contentCompWidget
        },

        getContentWidget: function () {
            return this._contentCompWidget;
        },

        setContentComp: function (Comp, options) {
            if (this._contentCompWidget) {
                this._contentCompWidget.destroy();
                this._contentCompWidget = null;
            }
            this.contentComp = Comp;
            this.contentCompOptions = options;

            this._contentCompWidget = new this.contentComp(Foundation.apply(Foundation.clone(options), {
                autoRender: false,
                appendToEl: this.el._dialog_content
            }));
            this.fireEvent('content-widget-inited', this._contentCompWidget);
            this.onContentWidgetInited(this._contentCompWidget);

            if (this.opened && !this._contentCompWidget.rendered) {
                this._contentCompWidget.render();
            }
        },

        onContentWidgetInited: Foundation.EMPTY_FUNCTION,

        isOpened: function () {
            return this.opened;
        },

        open: function () {
            if (this.opened) {
                return
            }
            if (this.fireEvent('before-open', this) === false) {
                return
            }
            this.__showMask();
            this._position();
            this.el.target.addClass('open');
            if (this._contentCompWidget && !this._contentCompWidget.rendered) {
                this._contentCompWidget.render();
            }
            this.fireEvent('open', this);
            this.opened = true;
        },

        close: function (ignoreBeforeClose) {
            if (!ignoreBeforeClose && this.fireEvent('before-close', this) === false) {
                return
            }
            Foundation.isEmpty(this.el.mask) || this.el.mask.remove();
            this.el.target.removeClass('open');
            this.fireEvent('close', this);
            this.opened = false;
        },

        setTitle: function (title) {
            this.title = title;
            this.el._dialog_title.text(title);
        },

        __getZIndex: function () {
            return ++Dialog.DIALOG_Z_INDEX;
        },

        __showMask: function () {
            this.el.mask = $('<div class="ui-dialog-mask"></div>')
                .css({zIndex: this.__getZIndex()})
                .appendTo(this.appendToEl);

            if (this.autoClose) {
                this._bindEvent(this.el.mask, 'click', function () {
                    this.close()
                });
            }
        },

        _position: function () {
            var $window = $(window);
            var windowSize = {
                width: $window.width(),
                height: $window.height()
            };

            var left = (windowSize.width - this.width) / 2;
            var top = (windowSize.height - this.height) / 2;
            this.el.target.css({
                left: left,
                top: top,
                zIndex: this.__getZIndex()
            })
        },

        getBodyElement: function () {
            return this.el._dialog_content;
        },

        getBodySize: function () {
            return {
                width: this.width - this.contentPadding * 2,
                height: this.height - 42 - (this.__hasFooter ? 46 : 0) - this.contentPadding * 2
            }
        },

        destroy: function (empty) {
            this.btnItems = [];
            Dialog.superclass.destroy.apply(this, arguments);

            if (!Foundation.isEmpty(this.el.mask)) {
                this.el.mask.remove()
            }
        }

    });

    return Dialog
});

