define(function(require, exports, module) {

    var Hamster = require('../lib/index');

    /**
     * 界面组件的基类组件, 项目中所有界面组件都应该继承该组件
     * */
    var BasePage = Class.create({

        //对象的静态属性和方法集合
        statics: {

            container: null,

            /**
             * 设置Page组件的容器, 创建的Page实例都会appendTo到该容器, 具体请看该类下的_beforeInit实例方法
             *
             * @container 容器(jQuery对象)
             * */
            setContainer: function (container) {
                this.container = $(container);
            },
            /**
             * 快捷创建Page组件的方法, 一般情况下开发者不需要直接调用该方法来创建Page, 系统在PageTabManager中提供了方法进行创建
             *
             * @url Page组件对象的js地址
             * @params 组件的配置参数对象
             * @callback 组件创建成功后的回调方法, 并且会将创建好的page实例通过callback传递给用户
             * */
            create: function (title, url, params, callback) {
                require([url], function (Page) {
                    var page = new Page({
                        title: title,
                        passParams: params
                    });
                    callback && callback(page);
                })
            }
        },

        extend: Component,

        hiddenCls: 'tab-panel-hidden',

        passParams: {},

        _beforeInit: function () {
            BasePage.superclass._beforeInit.apply(this);
            this.appendToEl = BasePage.container;
        },

        _getContentElement: function () {
            return $('<div/>')
        },

        getPassParam: function (name) {
            return this.passParams[name]
        },

        onPageBreadcrumbItemClick: function (data) {

        },

        beforeChangePage: function (title, url, options, breadcrumbs, callback) {
            return true
        }

    });

    return BasePage
});