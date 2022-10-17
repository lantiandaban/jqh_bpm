define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormBaseWidget = require('./base');
    var components = require('../../component/index');

    var alignMap = ['left', 'right', 'center'];

    var FormLabelWidget = Class.create({
        extend: FormBaseWidget,
        xtype: FormBaseWidget.XTYPE.LABEL,
        settingPanelType: 'label',
        _init: function() {
            FormLabelWidget.superclass._init.apply(this);
            this.el.text = $('<div />').addClass('dui-label').appendTo(this.el.target);
        },
        _afterInit: function() {
            FormLabelWidget.superclass._afterInit.apply(this);
            var options = this.options;
            this.setTextAlign(options.align);
        },

        _defaultSetting: function() {
            return Foundation.apply(FormLabelWidget.superclass._defaultSetting.apply(this), {
                value: "文字标题",
                align: 1
            })
        },
        _setting2Options: function(setting) {
            return Foundation.apply(FormLabelWidget.superclass._setting2Options.apply(this, arguments), {
                text: setting.value,
                align: setting.align
            })
        },

        setValue: function(value) {
            this.el.text.text(value);
            this.options.text = value;
            this.setSetting('value', value);
        },

        setTextAlign: function(align) {
            this.el.text.css('text-align', alignMap[align]);
            this.options.align = align;
            this.setSetting('align', align);
        }
    });

    return FormLabelWidget
});