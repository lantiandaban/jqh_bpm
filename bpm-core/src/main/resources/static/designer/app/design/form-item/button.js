define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormBaseWidget = require('./base');

    var FormButtonWidget = Class.create({
        extend: FormBaseWidget,

        _init: function() {
            FormButtonWidget.superclass._init.apply(this);
            var options = this.options;
            var buttonHtml = Foundation.String.format('<div class="dui-button {0}"><i></i><span>{1}</span></div>',
                options.buttonCls, options.buttonTitle);
            this.el.button = $(buttonHtml).appendTo(this.el.target);
        },

        _afterInit: function() {
            FormButtonWidget.superclass._afterInit.apply(this);
            var options = this.options;
            this.setButtonTitle(options.buttonTitle);
        },

        setButtonTitle: function(title) {
            this.options.buttonTitle = title;
            this.setSetting('buttonTitle', title);
            this.el.button.find('span').text(title);
        }
    });

    return FormButtonWidget
});