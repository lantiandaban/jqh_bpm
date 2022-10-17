define(function (require, exports, module) {

    var Class = require('../../class');
    var Component = require('../component');
    var TabPanel = require('./panel');
    var Foundation = require('../../foundation');

    var Tabs = Class.create({

        statics: {

        },

        extend: Component,

        baseCls: 'ui-tabs',

        items: [],

        _beforeInit: function () {
            Tabs.superclass._beforeInit.apply(this);
            this.itemMap = {};
        },

        _init: function () {
            Tabs.superclass._init.apply(this);

            this.renderTabBar();
            this.renderTabPanelContainer();

            Foundation.Array.forEach(this.items, function (item) {
                this.add(item)
            }, this);
        },

        renderTabBar: function () {
            this.el.bar = $('<div class="ui-tabs-bar"/>').appendTo(this.el.target);
        },

        renderTabPanelContainer: function () {
            this.el.panelContainer = $('<div class="ui-tabs-content"/>').appendTo(this.el.target);
        },

        _afterInit: function () {
            Tabs.superclass._afterInit.apply(this);

        },

        _initEvents: function () {
            this._bindDelegateEvent(this.el.bar, '.ui-tabs-tab', 'click', 'onTabItemClick');
        },

        onTabItemClick: function (tabItemElement) {
            this.active(tabItemElement.data('name'));
        },

        createTabItem: function (panel) {
            var tabItemElement = $('<div class="ui-tabs-tab"/>')
                .data('name', panel.name)
                .appendTo(this.el.bar);

            if (this.type == 'line') {
                tabItemElement.text(panel.title);
            } else {
                tabItemElement.text(panel.title);
            }
            return tabItemElement
        },

        active: function (name) {
            var item = this.itemMap[name];
            if (this.activePanel == item.panel) {
                return
            }

            item.tabElement.addClass('ui-tabs-tab-active')
                .siblings()
                .removeClass('ui-tabs-tab-active');

            if (this.activePanel) {
                this.activePanel.setActive(false);
            }
            item.panel.setActive(true);
            this.activePanel = item.panel;
        },

        add: function (item) {
            if (Foundation.isEmpty(item)) {
                return
            }
            item.listeners = {
                'active': this.onTabActive.bind(this),
                'inactive': this.onTabInActive.bind(this),
                'after-init': this.onTabPanelInited.bind(this)
            };
            var panel = new TabPanel(item);
            var itemTabElement = this.createTabItem(panel);
            panel.appendToEl = this.el.panelContainer;

            this.itemMap[panel.name] = {
                tabElement: itemTabElement,
                panel: panel
            };
            this.fireEvent('add', panel, this);
        },

        remove: function () {

        },

        onTabActive: function (content, panel) {
            this.fireEvent('active', panel.name, content, panel);
        },

        onTabInActive: function (content, panel) {
            this.fireEvent('inactive', panel.name, content, panel);
        },

        onTabPanelInited: function (panel) {
            this.fireEvent('panel-rendered', panel.name, panel.el.content, panel);
        },

        setHeight: function (height) {
            Tabs.superclass.setHeight.apply(this, arguments);
            if (Foundation.isNumber(height)) {
                this.el.panelContainer.height(height - this.el.bar.height());
            }
        },

        destroy: function (empty) {
            Foundation.Object.each(this.itemMap, function (name, item) {
                item.panel && item.panel.destroy();
            }, this);
            Tabs.superclass.destroy.apply(this, arguments);
        }
    });

    return Tabs
});

