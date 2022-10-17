define(function (require, exports, module) {

    var Class = require('Class');
    var Foundation = require('Foundation');
    var Widget = require('../../../component/widget');
    var constants = require('../../constants');

    var AssignUserBoxPanelWidget = Class.create({
        extend: Widget,
        _defaultOptions: function () {
            return Foundation.apply(AssignUserBoxPanelWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fx_assign_user_box",
                emptyTitle: '点击设置负责人',
                items: [],
                onClick: null
            });
        },
        _init: function () {
            AssignUserBoxPanelWidget.superclass._init.apply(this);
            this.el.userList = $('<ul class="user-list" />').appendTo(this.el.target);
        },

        _initDefaultValue: function() {
            this.setItems(this.options.items);
        },

        _initEvents: function () {
            this._bindEvent(this.el.target, 'click', '_onTargetClick')
        },

        _onTargetClick: function () {
            this._applyCallback(this.options.onClick, this)
        },

        setItems: function (items) {
            this.el.userList.empty();
            if (Foundation.isEmpty(items)) {
                var emptyHtml = Foundation.String.format('<div class="empty"><span>{0}</span></div>', this.options.emptyTitle);
                $(emptyHtml).appendTo(this.el.userList);
                return;
            }

            Foundation.Array.forEach(items, function (user) {
                this._createItem(user)
            }, this);
        },

        _createItem: function (item) {
            var itemHtml = Foundation.String.format('<li class="item"><i class="select-icon icon-member-normal"></i><span>{0}</span></li>', item.name);
            $(itemHtml).appendTo(this.el.userList)
        }

    });

    Widget.register('x-flow-assign-user-box', AssignUserBoxPanelWidget);

    return AssignUserBoxPanelWidget;
});