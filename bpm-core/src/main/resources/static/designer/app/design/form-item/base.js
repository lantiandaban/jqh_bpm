define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var components = require('../../component/index');
    var constants = require('../constants');
    // var selectGroupCellContentTpl = Handlebars.compile(require('text!view/design/form-select-group.hbs'));

    function elements(content, targetObj, selectors) {
        for (var name in selectors) {
            targetObj[name] = content.find(selectors[name])
        }
    }

    var FormBaseWidget = Class.create({
        statics: {
            XTYPE: constants.WIDGET_XTYPE
        },
        extend: components.Widget,
        settingPanelType: null,
        _defaultOptions: function() {
            return Foundation.apply({}, {
                baseCls: 'design-form-item',
                relationTitleWidget: null,
                title: "",
                desc: "",
                value: null,
                required: false,
                visible: true
            }, FormBaseWidget.superclass._defaultOptions.apply(this));
        },

        _defaultSetting: function() {
            return {
                title: null,
                required: false,
                visible: true,
                readonly: false
            }
        },

        _setting2Options: function(setting) {
            return {
                xtype: setting.xtype || setting.widgetType || setting.type,
                title: setting.title,
                value: setting.value,
                placeholder: setting.placeholder,
                required: setting.required,
                visible: setting.visible,
                widgetName: setting.widgetName
            }
        },

        initialize: function(options, setting) {
            this._setting = Foundation.apply({}, setting || {}, this._defaultSetting());
            Foundation.apply(options, this._setting2Options(this._setting));
            FormBaseWidget.superclass.initialize.apply(this, [options]);
        },

        getSettingByName: function(name) {
            return this._setting[name]
        },

        getSetting: function() {
            return Foundation.apply({}, this._setting, {
                widgetName: this.getWidgetName()
            });
        },

        setSetting: function(key, value) {
            if (Foundation.isString(key)) {
                this._setting[key] = value;
            } else {
                Foundation.apply(this._setting, key)
            }
        },

        _init: function() {
            FormBaseWidget.superclass._init.apply(this);
        },

        _afterInit: function() {
            FormBaseWidget.superclass._afterInit.apply(this);
            this.el.target.data('widget', this);
        },

        getTitle: function() {
            return this.options.title
        },

        setTitle: function(title) {
            if (this.options.relationTitleWidget) {
                this.options.relationTitleWidget.setValue(title);
            }
            this.options.title = title;
            this.setSetting('title', title);
        },

        setDesc: function (desc) {
            this.options.desc = desc;
            this.setSetting('desc', desc);
        },

        getValue: function() {
            return this.options.value
        },

        setValue: function(value) {
            this.options.value = value;
            this.setSetting('value', value);
        },

        setRequired: function(required) {
            this.options.required = required;
            this.setSetting('required', required);
        },

        renderToPhoneForm: function($insertAfterItem) {
            this.el.target.hide().insertAfter($insertAfterItem).fadeIn();
        },

        destroy: function(remove) {
            this.el.target.remove();
        }

    });

    return FormBaseWidget
});