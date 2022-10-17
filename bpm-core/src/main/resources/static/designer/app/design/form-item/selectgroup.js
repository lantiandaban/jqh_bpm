define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormBaseWidget = require('./base');
    var contentTpl = Handlebars.compile(require('text!view/design/form-select-group.hbs'));

    var PhoneFormSelectGroupWidget = Class.create({
        extend: FormBaseWidget,

        _init: function() {
            PhoneFormSelectGroupWidget.superclass._init.apply(this);
            this.el.group = $('<div/>').addClass('dui-choose-group').appendTo(this.el.target);
        },

        _afterInit: function() {
            PhoneFormSelectGroupWidget.superclass._afterInit.apply(this);
            var options = this.options;
            this.setItems(options.items);
        },

        _loadItems: function(items) {
            var options = this.options;
            this.el.group.empty();
            var htmls = Foundation.Array.map(items, function(item, i) {
                var itemTypeCls = options.isRadio ? 'group-item-radio' : 'group-item-checkbox';
                var checkedCls = item.selected ? 'checked' : '';
                return Foundation.String.format('<div class="group-item {0} {1}"><i></i><span>{2}</span></div>', itemTypeCls, checkedCls, item.text);
            }, this);
            this.el.group.html(htmls.join(''));
        },

        setItems: function(items) {
            this.setSetting('items', items);
            this.options.items = items;
            this._loadItems(items);
        }

    });
    return PhoneFormSelectGroupWidget;
});