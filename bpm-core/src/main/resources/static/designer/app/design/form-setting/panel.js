define(function(require, exports, module) {
    require('./icon-select-panel');
    require('./column-width-edit-panel');

    var Class = require('Class');
    var components = require('../../component/index');
    var Foundation = require('Foundation');

    var FormSettingPanel = Class.create({
        extend: components.SettingPanel,
        _beforeInit: function() {
            FormSettingPanel.superclass._beforeInit.apply(this);
            var form = this.options.form;
            this.__formLayoutCache = Foundation.clone(form.config.attr.layout);
            this.options.items = Foundation.Array.merge(this.options.items, this._getFormSettingOptions(this.options.formItem));
        },

        _changeColgroupByCount: function(count) {
            var colgroup = this.__formLayoutCache.colgroup;
            var diff = count - colgroup.length;
            if (diff == 0) {
                return;
            }
            if (diff > 0) {
                Foundation.Array.eachCount(diff, function() {
                    this.__formLayoutCache.colgroup.push({ value: 1, type: "flex" });
                }, this);
            } else {
                this.__formLayoutCache.colgroup = Foundation.Array.subArray(Foundation.clone(colgroup), 0, count);
            }
            this._resetFormLayout();
        },

        //重新设置表单的布局，整体宽度，每列的宽度等
        _resetFormLayout: function() {
            this.options.form.setFormAttrLayout(this.__formLayoutCache);
        },

        //处理是否自定义表单宽度值发生变化
        _onAutoWidthStatusChanged: function(selected) {
            var customWidthInput = this.getWidgetByName("customWidthInput");
            var widthValue = customWidthInput.getValue();
            customWidthInput.setEnable(selected);
            this.__formLayoutCache.width = selected ? widthValue : "auto";
            this._resetFormLayout();
        },

        //自定义表格宽度值发生变化后
        _onCustomWidthInputEditEnd: function(event, value) {
            this.__formLayoutCache.width = value;
            this._resetFormLayout();
        },

        //处理是否显示表格的边框变化
        _onStyleBorderStatusChanged: function(selected) {
            this.form.setFormStyleBorder(selected);
        },

        //打开设置表格列宽弹出框
        _openSetTableColumnWidthDialog: function() {
            var self = this;
            var form = this.options.form;
            var layout = form.getFormAttrByName('layout');

            this._columnWidthSetDialog = new components.ConfirmDialog({
                title: "列宽宽度设置",
                width: 450,
                height: 400,
                contentWidget: {
                    rowSize: [290],
                    colSize: [420],
                    padding: 15,
                    items: [
                        [{
                            xtype: "x-column-width-edit-panel",
                            widgetName: "columnWidthEditPanel",
                            items: layout.colgroup
                        }]
                    ]
                },
                onOk: function() {
                    var columnWidthEditPanel = self._columnWidthSetDialog.getWidgetByName('columnWidthEditPanel');
                    self.__formLayoutCache.colgroup = columnWidthEditPanel.getValue();
                    self._resetFormLayout();
                }
            });
            this._columnWidthSetDialog.open();
        },

        _getFormSettingOptions: function() {
            var self = this;
            var form = this.options.form;
            var style = form.getFormAttrByName('style');
            var layout = form.getFormAttrByName('layout');

            return [{
                xtype: 'title',
                title: "表单名称"
            }, {
                xtype: 'input',
                value: form.getFormAttrByName('name'),
                onAfterEdit: function(event, value) {
                    form.setTitle(value);
                }
            }, '-', {
                xtype: 'title',
                title: "表单布局"
            }, {
                xtype: 'combo',
                placeholder: "列数",
                items: [{
                    value: 2,
                    text: "两列"
                }, {
                    value: 4,
                    text: "四列"
                }, {
                    value: 6,
                    text: "六列",
                    selected: true
                }, {
                    value: 8,
                    text: "八列"
                }],
                onDataFilter: function(item, index) {
                    item.selected = layout.colgroup.length == item.value;
                    return item;
                },
                onBeforeItemSelect: function(element, item) {
                    if (layout.colgroup.length > item.value) {
                        this.setValue(item.value);
                        self._changeColgroupByCount(item.value);
                        return false
                    }
                },
                onAfterItemSelect: function(element, item) {
                    self._changeColgroupByCount(item.value)
                }
            }, {
                xtype: "tablecontainer",
                rowSize: [20],
                colSize: ["auto", 20],
                items: [
                    [{
                        xtype: 'checkbox',
                        text: '是否自定义表单宽度',
                        value: layout.width != 'auto',
                        onStateChange: this._onAutoWidthStatusChanged.bind(this)
                    }, {
                        xtype: "tooltip",
                        style: "tip",
                        text: "表单宽度默认为自适应，如果选择自定义宽度，表单将按照您设置的宽度显示"
                    }]
                ]
            }, {
                xtype: 'input',
                widgetName: 'customWidthInput',
                placeholder: "自定义表单宽度",
                value: layout.width == 'auto' ? '1200' : layout.width,
                enable: layout.width != 'auto',
                onStopEdit: this._onCustomWidthInputEditEnd.bind(this)
            }, {
                xtype: 'label',
                extClses: ['submit-rules-tip'],
                text: '您可以单独设置每列的宽度或占比'
            }, {
                xtype: 'button',
                style: 'white',
                text: "设置列宽",
                onClick: function() {
                    self._openSetTableColumnWidthDialog()
                }
            }, '-', {
                xtype: 'title',
                title: "表单样式"
            }, {
                xtype: 'checkbox',
                text: '是否显示表格边框',
                value: style.border,
                onStateChange: this._onStyleBorderStatusChanged.bind(this)
            }, '-', {
                xtype: 'title',
                title: "表单图标"
            }, {
                xtype: 'x-form-icon-select-panel',
                widgetName: 'iconSelect',
                icons: window.g.icons || [],
                selectedIconId: form.getFormAttrByName('icon'),
                onSelected: function (iconItem) {
                    console.log(iconItem);
                    form.setFormAttr('icon', iconItem.id);
                }
            }]
        }
    });
    return FormSettingPanel;
});