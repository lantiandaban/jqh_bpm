define(function(require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');
    var RelyImplement = require('../implements/rely');
    var FormulaImplement = require('../implements/formula');

    var TextPanel = Class.create({
        extend: FormWidgetSettingBasePanel,

        //混入，可以将其他对象的属性和方法混入到当前对象中成为当前对象的属性或方法
        //比如：A对象中有a方法，通过 implement 混入到B类中，那么B类就有用了a方法，在B类中的b方法中就可以通过 this.a() 来调用
        //例如：在当前类中的 __getInputWidgetValueTypeConfig 方法就是来自父类混入的 ConfigImplement 中的方法
        implement: [RelyImplement, FormulaImplement],

        _getFormWidgetSettingOptions: function(formItem) {
            var self = this;

            // var scan = formItem.getSettingByName('scan');
            // var scanEnabled = scan && scan.editable || false;

            //配置项数组， xtype为组件的别名(必须)，这些组件在app/component目录下
            //其他的属性则都为xtype对应的组件的配置属性

            return [{
                    xtype: 'title',
                    title: "标题"
                },
                this.__getTitleConfig(), '-', {
                    xtype: 'title',
                    title: "提示文字"
                },
                this.__getPlaceholderConfig(),
                '-', {
                    xtype: 'title',
                    title: "描述信息"
                },
                this.__getDescTextAreaConfig(), '-', {
                    xtype: 'title',
                    title: "格式"
                }, {
                    xtype: 'combo',
                    items: [{
                        value: "none",
                        text: "无",
                        selected: true
                    }, {
                        value: "mobile",
                        text: "手机号码"
                    }, {
                        value: "phone",
                        text: "电话号码"
                    }, {
                        value: "postal",
                        text: "邮政编码"
                    }, {
                        value: "card",
                        text: "身份证号码"
                    }, {
                        value: "email",
                        text: "邮箱"
                    }],
                    onDataFilter: function(item, index) {
                        item.selected = item.value == formItem.getSettingByName('format');
                        return item;
                    },
                    onAfterItemSelect: function(element, item) {
                        formItem.setSetting('format', item.value);
                    }
                }, '-', {
                    xtype: 'title',
                    title: "默认值"
                },
                this.__getInputWidgetValueTypeConfig(),
                this.__getInputDefualtValueConfig(),
                this.__getRelyBtnConfig(),
                this.__getFormulaBtnConfig(), '-'
                /*, {
                    xtype: 'title',
                    title: "扫码"
                }, {
                    xtype: 'checkbox',
                    text: '扫码输入',
                    value: scanEnabled,
                    onStateChange: function(selected) {
                        var scanEditableWidget = self.getWidgetByName("scanEditable");
                        var scanTypeWidget = self.getWidgetByName("scanType");
                        scanEditableWidget.setEnable(selected);
                        scanTypeWidget.setEnable(selected);
                        if (selected) {
                            scan = scan || {};
                            scan.editable = scanEditableWidget.getValue();
                            scan.type = scanTypeWidget.getValue();
                            formItem.setSetting('scan', scan);
                        } else {
                            formItem.setSetting('scan', scan = null);
                        }
                    }
                }, {
                    xtype: 'checkbox',
                    widgetName: "scanEditable",
                    text: '可修改扫码结果',
                    value: true,
                    enable: scanEnabled,
                    onStateChange: function(selected) {
                        scan.editable = self.getValue();
                        formItem.setSetting('scan', scan);
                    }
                }, {
                    xtype: 'combo',
                    widgetName: "scanType",
                    items: [{
                        value: 'barCode',
                        text: "扫描条形码",
                        selected: true
                    }, {
                        value: 'qrCode',
                        text: "扫描二维码"
                    }],
                    enable: scanEnabled,
                    onDataFilter: function(item) {
                        item.selected = scanEnabled && scan.type == item.value || 'barCode';
                        return item;
                    },
                    onAfterItemSelect: function(element, item) {
                        scan.type = self.getValue();
                        formItem.setSetting('scan', scan);
                    }
                }, '-'*/, {
                    xtype: 'title',
                    title: "校验"
                },
                this.__getVisibleConfig(),
                this.__getReadonlyConfig(),
                this.__getRequiredConfig()
            ]
        }
    });

    FormWidgetSettingBasePanel.register('text', TextPanel);

    return TextPanel;
});