define(function (require, exports, module) {
    require('../ext/detailgroup-field-panel');
    require('../ext/linkquery-field-condition');
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');
    var components = require('../../../component/index');

    var TriggerSelectPanel = Class.create({
        extend: FormWidgetSettingBasePanel,
        _getFormWidgetSettingOptions: function (formItem) {
            var self = this;
            var options = this.options;
            var form = options.form;
            var dataSources = form.getDataSources();
            var formFieldsMap = {};
            Foundation.Array.map(dataSources, function (entry) {
                formFieldsMap[entry.table] = Foundation.Array.map(entry.fields, function (field) {
                    return {
                        text: field.name,
                        name: field.field,
                        xtype: field.vtype
                    }
                }, this);
                return {
                    text: entry.name,
                    value: entry.table,
                    entry: entry
                }
            }, this);
            return [{
                xtype: 'title',
                title: "标题"
            },
                this.__getTitleConfig(), '-', {
                    xtype: 'title',
                    title: "提示文字"
                },
                this.__getPlaceholderConfig(), '-', {
                    xtype: 'title',
                    title: "描述信息"
                },
                this.__getDescTextAreaConfig(), '-', {
                    xtype: 'title',
                    title: "执行代码"
                },
                this.__getPerformCodeBlockComboConfig(),
                this.__getDataSourcesCommboFormItemWidgetConfig(),
                {
                    xtype: 'title',
                    title: "显示值字段"
                },
                this.__getDisplayFiledWidgetConfig(),
                {
                    xtype: 'title',
                    title: "存储值字段"
                },
                this.__getValueFiledWidgetConfig(),
                '-', {
                    xtype: 'title',
                    title: "规则"
                },
                {
                    xtype: "tablecontainer",
                    widgetName: "linkDataQueryLoad",
                    rowSize: [20],
                    colSize: ["auto", 20],
                    items: [
                        [{
                            xtype: 'checkbox',
                            text: '是否开启多选',
                            value: formItem.getSettingByName('multiSelect'),
                            onStateChange: function (selected) {
                                formItem.setSetting('multiSelect', selected)
                            }
                        }, {
                            xtype: "tooltip",
                            style: "tip",
                            text: "开启多选后，您可以选择多条数据项，值将会使用’,‘隔开"
                        }]
                    ]
                },
                '-', {
                    xtype: 'title',
                    title: "校验"
                },
                this.__getVisibleConfig(),
                this.__getReadonlyConfig(),
                this.__getRequiredConfig()
            ]
        },

        __getPerformCodeBlockComboConfig: function () {
            var self = this;
            var formItem = this.options.formItem;

            return {
                xtype: 'combo',
                items: [
                    //     {
                    //     value: "custom",
                    //     text: "自定义输入"
                    // },
                    {
                        value: "table",
                        text: "表单数据源选择",
                        selected: true
                    }],
                placeholder: "请选择执行代码段",
                onDataFilter: function (item) {
                    var dataSourceSetting = formItem.getSettingByName('datasource');
                    item.selected = dataSourceSetting.type == item.value;
                    return item;
                },
                onAfterItemSelect: function () {
                    var dataSourceSetting = formItem.getSettingByName('datasource');

                    var dsType = this.getValue();
                    dataSourceSetting.type = dsType;
                    formItem.setSetting('datasource', dataSourceSetting);
                    var datasourceCommbo = self.getWidgetByName("datasourceCommboWidget");
                    switch (dsType) {
                        case 'table':
                            datasourceCommbo.setVisible(true);
                            break;
                        default:
                            datasourceCommbo.setVisible(false);
                            break;
                    }
                }
            }
        },

        __getDisplayFiledWidgetConfig: function () {
            var options = this.options;
            var formItem = options.formItem;
            var form = options.form;
            var datasource = formItem.getSettingByName('datasource');
            var datasourceType = 'custom';
            var value = null;
            if (!Foundation.isEmpty(datasource)) {
                var dsTable = datasource.table;
                if (!Foundation.isEmpty(dsTable)) {
                    value = dsTable.name;
                }
                datasourceType = datasource.type;
            }
            var filedItems = [];
            if (value) {
                var dataSources = form.getDataSources();
                Foundation.Array.forEach(dataSources, function (item, i) {

                    var table = item.table;
                    if (table == value) {
                        var fields = item.fields;
                        fields.forEach(function (_item) {
                            filedItems.push({
                                value: _item.field,
                                text: _item.name,
                                selected: false
                            })
                        });
                        return false;
                    }
                }, this);
            }

            return {
                xtype: 'combo',
                widgetName: 'xtype_ds_display_field',
                placeholder: "显示字段名",
                items: filedItems,
                onDataFilter: function (item) {
                    var displayField = formItem.getSettingByName('displayField');
                    item.selected = displayField == item.value;
                    return item;
                },
                onAfterItemSelect: function (event, value) {
                    formItem.setSetting('displayField', value.value);
                },
                visible: datasourceType == 'table'
            }
        },

        __getValueFiledWidgetConfig: function () {
            var options = this.options;
            var formItem = options.formItem;
            var form = options.form;
            var datasource = formItem.getSettingByName('datasource');
            var datasourceType = 'custom';
            var value = null;
            if (!Foundation.isEmpty(datasource)) {
                var dsTable = datasource.table;
                if (!Foundation.isEmpty(dsTable)) {
                    value = dsTable.name;
                }
                datasourceType = datasource.type;
            }
            var filedItems = [];
            if (value) {
                var dataSources = form.getDataSources();
                Foundation.Array.forEach(dataSources, function (item, i) {

                    var table = item.table;
                    if (table == value) {
                        var fields = item.fields;
                        fields.forEach(function (_item) {
                            filedItems.push({
                                value: _item.field,
                                text: _item.name,
                                selected: false
                            })
                        });
                        return false;
                    }
                }, this);
            }

            return {
                xtype: 'combo',
                placeholder: "存储值字段名",
                widgetName: 'xtype_ds_value_field',
                items: filedItems,
                onDataFilter: function (item) {
                    var displayField = formItem.getSettingByName('valueField');
                    item.selected = displayField == item.value;
                    return item;
                },
                onAfterItemSelect: function (event, value) {
                    formItem.setSetting('valueField', value.value);
                },
                visible: datasourceType == 'table'
            }
        }

    });

    FormWidgetSettingBasePanel.register('triggerselect', TriggerSelectPanel);

    return TriggerSelectPanel;
});