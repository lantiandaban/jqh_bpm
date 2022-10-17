define(function(require, exports, module) {
    var Class = require('Class');
    var components = require('../../../component/index');
    var Foundation = require('Foundation');
    var ConfigImplement = require('../implements/config');

    var FormWidgetSettingBasePanel = Class.create({
        statics: {
            _panels: {},
            //注册表单组件设置面板组件，通过该方法注册的组件，可以通过FormWidgetSettingBasePanel.create方法快速创建对应的设置面板组件
            //具体用法请看由该组件派生出的子类，例如：同目录下的text.js里最地下的代码（FormWidgetSettingBasePanel.register('text', TextPanel)）
            //xtype: 设置面板组件注册的别名
            //panel: 注册的设置面板组件对象
            register: function(xtype, panel) {
                this._panels[xtype] = panel;
            },
            //通过注册的面板别名来快速创建设置面板组件
            //xtype: 设置面板组件的别名
            //option: 面板的配置
            create: function(xtype, option) {
                xtype = xtype.toLowerCase();
                var Panel = this._panels[xtype];
                if (Panel) {
                    return new Panel(option);
                }
                return null
            }
        },
        extend: components.SettingPanel,
        implement: [ConfigImplement],
        _defaultOptions: function() {
            return Foundation.apply(FormWidgetSettingBasePanel.superclass._defaultOptions.apply(this), {
                items: [],
                form: null,
                formItem: null
            });
        },
        _beforeInit: function() {
            FormWidgetSettingBasePanel.superclass._beforeInit.apply(this);
            //在初始化之前，获取到当前面板的设置配置项
            this.options.items = Foundation.Array.merge(this.options.items, this._getFormWidgetSettingOptions(this.options.formItem));
        },
        _init: function () {
            FormWidgetSettingBasePanel.superclass._init.apply(this);
            this.el.target.removeClass('empty');
        },
        //获取面板中的设置项配置，提供给子类覆盖，具体用法请移步到同目录下的text.js中的同名方法
        _getFormWidgetSettingOptions: function() {
            return []
        },

        destroy: function(remove) {
            this.el.target.addClass('empty');
            FormWidgetSettingBasePanel.superclass.destroy.apply(this, arguments);
        }
    });

    return FormWidgetSettingBasePanel;

});