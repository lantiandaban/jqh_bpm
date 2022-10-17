define(function (require, exports, module) {

    var Class = require('../../class');
    var Component = require('../component');
    var Foundation = require('../../foundation');

    var TabPanel = Class.create({

        statics: {

        },

        extend: Component,

        baseCls: 'ui-tabs-panel',

        autoRender: false,

        name: '',

        title: '',

        closeable: false,

        disable: false,

        contentHtml: null,

        contentEl: null,

        _beforeInit: function () {
            TabPanel.superclass._beforeInit.apply(this);
            this.autoRender = false;
            this.name = this.name || this.getWidgetName();
        },

        _init: function () {
            TabPanel.superclass._init.apply(this);
            this.renderContent();
        },

        renderContent: function () {
            var contentElement = this.getContentElement();
            if (!Foundation.isEmpty(contentElement)) {
                contentElement.appendTo(this.el.target)
            }
            this.el.content = Foundation.isEmpty(contentElement) ? this.el.target : contentElement;
        },

        getContentElement: function () {
            return $(this.contentHtml || this.contentEl);
        },

        setActive: function (active) {
            if (!this.rendered) {
                this.render();
            }
            this.active = active;
            this.toggleClass('ui-tabs-panel-active', active);
            this.fireEvent(active ? 'active' : 'inactive', this.el.content, this);
        },

        destroy: function (empty) {
            TabPanel.superclass.destroy.apply(this, arguments);
        }
    });

    return TabPanel
});

