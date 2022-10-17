define(function (require, exports, module) {

    var Class = require('../class');
    var Component = require('./component');
    var Foundation = require('../foundation');

    var Message = Class.create({

        statics: {

            transitions: {
                webkitTransition: "webkitTransitionEnd",
                mozTransition: "mozTransitionEnd",
                oTransition: "oTransitionEnd",
                transition: "transitionend"
            },

            pool: [],

            getMessageContainer: function () {
                if (!this.container) {
                    this.container = $('<div class="ui-messages-container"/>')
                        .appendTo(document.body);
                }
                return this.container
            },

            notice: function (content, duration) {
                new Message({type: 'notice', content: content, duration: duration});
            },

            success: function (content, duration) {
                new Message({type: 'success', content: content, duration: duration});
            },

            error: function (content, duration) {
                new Message({type: 'error', content: content, duration: duration});
            },

            warning: function (content, duration) {
                new Message({type: 'warning', content: content, duration: duration});
            },

            clear: function () {
                Foundation.Array.forEach(this.pool, function (message) {
                    message.destroy();
                });
                this.pool = [];
            }

        },

        extend: Component,

        baseCls: 'ui-message',

        content: '',

        type: 'notice',

        duration: 3000,

        _beforeInit: function () {
            Message.superclass._beforeInit.apply(this);
            // 先检查队列中的消息提示,主要避免同一内容重复提示
            var self = this;
            Foundation.Array.forEach(Message.pool, function (messager) {
                var mContent = messager.content;
                var mType = messager.type;
                if (mContent == self.content && mType == self.type) {
                    // 销毁老的提示控件
                    messager.destroy();
                }
            });

            // SogYF End

            Message.pool.push(this);
            this.appendToEl = Message.getMessageContainer();
            var extClass = Foundation.String.format('{0}-{1}', this.baseCls, this.type);

            this.extClsList.push(extClass);
        },

        _init: function () {
            Message.superclass._init.apply(this);
            this.el.content = this.el.target.find('.ui-message-content');
            this.setContent(this.content);
        },

        _afterInit: function () {
            Message.superclass._afterInit.apply(this);
            Foundation.Function.defer(this.disappear, this.duration, this);
        },

        disappear: function () {
            if (this.isDestroyed) {
                return
            }
            this.addClass('ui-message-disappear');
            Foundation.Function.defer(this.destroy, 300, this);
        },

        getRootElement: function () {
            return $('<div class="ui-message"><div class="ui-message-body">' +
                '<i class="ui-message-icon"></i>' +
                '<span class="ui-message-content"></span>' +
                '</div></div>')
        },

        setContent: function (content) {
            this.content = content;
            this.el.content.text(content);
        },

        destroy: function (empty) {
            if (this.isDestroyed) {
                return
            }
            Foundation.Array.remove(Message.pool, this);
            // Fixed: 修复扩展类导致的提示图标问题
            var extClass = Foundation.String.format('{0}-{1}', this.baseCls, this.type);
            Foundation.Array.remove(this.extClsList, extClass);
            Message.superclass.destroy.apply(this, arguments);
        }
    });

    return Message
});

