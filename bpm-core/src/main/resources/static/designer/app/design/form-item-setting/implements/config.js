define(function (require, exports, module) {
    require('../ext/option-group-panel');
    require('../ext/location-scope');
    require('../ext/linkquery-field-edit-panel');

    var Class = require('Class');
    var Foundation = require('Foundation');
    var constants = require('../../constants');
    var components = require('../../../component/index');

    var DefaultsImplement = {

        __getTitleConfig: function () {
            var options = this.options;
            var formItem = options.formItem;
            return {
                xtype: 'input',
                placeholder: "设置标题文字",
                value: formItem.getSettingByName('title'),
                onAfterEdit: function (event, value) {
                    formItem.setTitle(value);
                }
            }
        },

        __getDescTextAreaConfig: function () {
            var options = this.options;
            var formItem = options.formItem;
            return {
                xtype: 'textarea',
                placeholder: "设置控件描述",
                value: formItem.getSettingByName('desc'),
                onAfterEdit: function (event, value) {
                    formItem.setDesc(value);
                }
            }
        },

        __getPlaceholderConfig: function () {
            var options = this.options;
            var formItem = options.formItem;
            return {
                xtype: 'input',
                placeholder: "设置提示文字",
                value: formItem.getSettingByName('placeholder'),
                onAfterEdit: function (event, value) {
                    formItem.setPlaceholder(value);
                }
            }
        },

        __getInputWidgetValueTypeConfig: function () {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;

            function onAfterItemSelect(element, item) {
                var value = this.getValue();

                var defualtInputWidget = self.getWidgetByName("defaultInput");
                var dataRelyWidget = self.getWidgetByName("dataRely");
                var formulaWidget = self.getWidgetByName("formula");

                switch (value) {
                    case "rely":
                        defualtInputWidget.setVisible(false);
                        dataRelyWidget.setVisible(true);
                        formulaWidget.setVisible(false);
                        formItem.setValue('');
                        break;
                    case "formula":
                        defualtInputWidget.setVisible(false);
                        dataRelyWidget.setVisible(false);
                        formulaWidget.setVisible(true);
                        formItem.setValue('');
                        break;
                    default:
                        defualtInputWidget.setVisible(true);
                        dataRelyWidget.setVisible(false);
                        formulaWidget.setVisible(false);
                        var defValue = defualtInputWidget.getValue();
                        formItem.setValue(defValue);
                }
                formItem.setSetting('valueType', value);
            }

            return {
                xtype: 'combo',
                items: [{
                    value: "custom",
                    text: "自定义",
                    selected: true
                }, {
                    value: "rely",
                    text: "数据联动"
                }, {
                    value: "formula",
                    text: "公式编辑"
                }],
                onDataFilter: function (item) {
                    item.selected = formItem.getSettingByName('valueType') == item.value;
                    return item;
                },
                onAfterItemSelect: onAfterItemSelect
            }
        },

        __getRelyBtnConfig: function (isSelectWidget) {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;
            var visible = (isSelectWidget ? formItem.getSettingByName('sourceType') : formItem.getSettingByName('valueType')) == 'rely';

            return {
                xtype: 'button',
                widgetName: 'dataRely',
                style: 'white',
                text: "数据关联设置",
                onClick: function () {
                    self.openRelyDialog(isSelectWidget);
                },
                visible: visible
            }
        },

        __getFormulaBtnConfig: function () {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;

            return {
                xtype: 'button',
                widgetName: "formula",
                style: 'white',
                iconCls: "icon-function",
                text: "编辑公式",
                onClick: function () {
                    self.openFormulaDialog();
                },
                visible: formItem.getSettingByName('valueType') == 'formula'
            }
        },

        __getInputDefualtValueConfig: function (isTextarea) {
            var options = this.options;
            var formItem = options.formItem;

            if (formItem.xtype == constants.WIDGET_XTYPE.TEXTAREA) {
                return {
                    xtype: 'textarea',
                    placeholder: "可设置默认值",
                    value: formItem.getSettingByName('value'),
                    onAfterEdit: function (event, value) {
                        formItem.setValue(value);
                    }
                }
            } else if (formItem.xtype == constants.WIDGET_XTYPE.DATETIME) {

                var format = formItem.getSettingByName('format');

                return {
                    xtype: 'datetime',
                    widgetName: 'defaultInput',
                    value: formItem.getSettingByName('value'),
                    format: format == 'yyyy-MM-dd' ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm",
                    hasTime: format == "yyyy-MM-dd HH:mm",
                    onAfterEdit: function (value) {
                        formItem.setValue(value);
                    }
                }
            }

            return {
                xtype: 'input',
                widgetName: 'defaultInput',
                placeholder: "可设置默认值",
                value: formItem.getSettingByName('value'),
                onAfterEdit: function (event, value) {
                    formItem.setValue(value);
                },
                visible: formItem.getSettingByName('valueType') == 'custom'
            }
        },

        __getSelectWidgetValueTypeConfig: function () {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;

            function onAfterItemSelect(element, item) {
                var value = this.getValue();

                var optionsGroupWidget = self.getWidgetByName("optionGroup");
                var dataRelyWidget = self.getWidgetByName("dataRely");
                var linkOhterFormItemTreeCombo = self.getWidgetByName("linkOtherFormItemTreeCombo");
                var linkDataQueryLoadWidget = self.getWidgetByName("linkDataQueryLoad");

                switch (value) {
                    case 'rely':
                        optionsGroupWidget.setVisible(false);
                        dataRelyWidget.setVisible(true);
                        linkOhterFormItemTreeCombo.setVisible(false);
                        linkDataQueryLoadWidget.setVisible(true);
                        formItem.setValue('');
                        break;
                    case 'async':
                        optionsGroupWidget.setVisible(false);
                        dataRelyWidget.setVisible(false);
                        linkOhterFormItemTreeCombo.setVisible(true);
                        linkDataQueryLoadWidget.setVisible(true);
                        formItem.setValue('');
                        break;
                    default:
                        optionsGroupWidget.setVisible(true);
                        dataRelyWidget.setVisible(false);
                        linkOhterFormItemTreeCombo.setVisible(false);
                        linkDataQueryLoadWidget.setVisible(false);

                        var result = optionsGroupWidget.getResults();
                        formItem.setItems(result.items);
                        formItem.setValue(result.text);
                }
                formItem.setSetting('sourceType', value);
            }

            return {
                xtype: 'combo',
                items: [{
                    value: 'custom',
                    text: "自定义"
                }, {
                    value: 'async',
                    text: "关联表单数据源"
                }, {
                    value: 'rely',
                    text: "数据联动"
                }],
                onDataFilter: function (item) {
                    item.selected = formItem.getSettingByName('sourceType') == item.value;
                    return item;
                },
                onAfterItemSelect: onAfterItemSelect
            }
        },

        __getOptionSelectGroupConfig: function (isSelectWidget, multi, callback) {
            var options = this.options;
            var formItem = options.formItem;
            var visible = isSelectWidget ? formItem.getSettingByName('sourceType') == 'custom' : true;

            function onGroupItemsChange() {
                var result = this.getResults();
                formItem.setItems(result.items);
                formItem.setValue(result.text);
            }

            return {
                xtype: 'x-option-group',
                widgetName: "optionGroup",
                multi: multi,
                form: options.form,
                items: formItem.getSettingByName('items'),
                widgetView: formItem.el.target,
                visible: visible,
                onAfterDrop: onGroupItemsChange,
                onAfterItemSelect: onGroupItemsChange,
                onAfterItemRemove: onGroupItemsChange,
                onAfterItemAdd: onGroupItemsChange,
                onAfterItemEdit: onGroupItemsChange,
                onAfterItemReliesEdit: onGroupItemsChange
            }
        },

        __getLinkOtherFormItemWidgetConfig: function () {
            var self = this;
            var options = this.options;
            var form = options.form;
            var formItem = options.formItem;
            var dataSources = form.getDataSources();
            var comboTreeData = [];

            Foundation.Array.forEach(dataSources, function (item, i) {

                var name = item.name;
                var table = item.table;

                var entryNode = {
                    name: name,
                    id: table,
                    // appId: entry.appId,
                    // id: entry.entryId,
                    children: []
                };

                Foundation.Array.forEach(item.fields, function (field) {

                    // text: fieldItem.name,
                    // value: fieldItem.field,
                    // vtype: fieldItem.vtype

                    //需要做判断，不是所有的字段都需要显示的
                    entryNode.children.push({
                        name: field.name,
                        id: field.field,
                        vtype: field.vtype
                    });
                }, this);
                if (!Foundation.isEmpty(entryNode.children)) {
                    comboTreeData.push(entryNode);
                }
            }, this);

            var async = formItem.getSettingByName('async');
            var value = null;
            if (!Foundation.isEmpty(async)) {
                value = [async.data.table, async.data.field];
            }

            return {
                xtype: 'combotree',
                widgetName: "linkOtherFormItemTreeCombo",
                placeholder: "选择表单数据源字段",
                items: comboTreeData,
                delimiter: "--",
                onAfterNodeClick: function (node) {
                    var tableNode = node.getParentNode();
                    formItem.setSetting('async', {
                        url: "/data/distinct",
                        data: {
                            table: tableNode.id,
                            field: node.id
                        }
                    });
                },
                value: value,
                visible: formItem.getSettingByName('sourceType') == 'async'
            }
        },

        __getDataSourcesCommboFormItemWidgetConfig: function () {
            var self = this;
            var options = this.options;
            var form = options.form;
            var formItem = options.formItem;
            var dataSources = form.getDataSources();
            // 当前使用这个控件的组件类型
            var xtype = formItem.options.xtype;

            var value = null;
            var visible = true;
            switch (xtype) {
                case 'triggerselect':
                    var datasource = formItem.getSettingByName('datasource');

                    var datasourceType = 'custom';
                    if (!Foundation.isEmpty(datasource)) {
                        var dsTable = datasource.table;
                        if (!Foundation.isEmpty(dsTable)) {
                            value = dsTable.name;
                        }
                        datasourceType = datasource.type;
                    }
                    visible = datasourceType == 'table' || formItem.getSettingByName('sourceType') == 'async';
                    break;
                case 'detailgroup':
                    var linkquery = formItem.getSettingByName('linkquery');
                    if (!Foundation.isEmpty(linkquery)) {
                        var linkTable = linkquery.table;
                        if (!Foundation.isEmpty(linkTable)) {
                            value = linkTable;
                        }
                    }
                    break;
                default:
                    break;
            }

            var dataSourceCombos = [];

            Foundation.Array.forEach(dataSources, function (item, i) {

                var name = item.name;
                var table = item.table;
                var selected = table == value;

                dataSourceCombos.push({
                    text: name,
                    value: table,
                    selected: selected
                });
            }, this);

            return {
                xtype: 'combo',
                widgetName: "datasourceCommboWidget",
                placeholder: "选择表单数据源",
                items: dataSourceCombos,
                visible: visible,
                onAfterItemSelect: function () {
                    var selectValue = this.getValue();
                    switch (xtype) {
                        case 'triggerselect':
                            var displayFieldWidget = self.getWidgetByName("xtype_ds_display_field");
                            var valueFieldWidget = self.getWidgetByName("xtype_ds_value_field");

                            var dataSourceSetting = formItem.getSettingByName('datasource');
                            var dsName = null;
                            if (!Foundation.isEmpty(dataSourceSetting)) {
                                var dsTable = dataSourceSetting.table;
                                if (!Foundation.isEmpty(dsTable)) {
                                    dsName = dsTable.name;
                                }
                            }

                            if (dsName != selectValue) {
                                formItem.setSetting('displayField', '');
                                formItem.setSetting('valueField', '');
                                formItem.setSetting('filterquery', '');
                                displayFieldWidget.setValue('');
                                valueFieldWidget.setValue('');
                            }
                            Foundation.Array.forEach(dataSources, function (item, i) {
                                var table = item.table;
                                if (table == selectValue) {
                                    var popover = {};
                                    // 我再一次被循环体内修改集合中的某个对象会直接修改其引用 导致出现设置参数循环设置的时候总是出现问题的了。。。
                                    // 已修复
                                    popover.paging = {
                                        enable: item.popover.paging.enable,
                                        pageSize: item.popover.paging.pageSize
                                    };
                                    popover.name = table;
                                    var searchItems = [];
                                    item.popover.searchItems.forEach(function (searchItem) {
                                        searchItems.push({
                                            field: searchItem.field,
                                            title: searchItem.name
                                        })
                                    });
                                    popover.searchItems = searchItems;
                                    var tableColumns = [];
                                    item.popover.tableColumns.forEach(function (tableColumn) {
                                        tableColumns.push({
                                            field: tableColumn.field,
                                            title: tableColumn.name
                                        })
                                    });
                                    popover.tableColumns = tableColumns;
                                    dataSourceSetting.table = popover;

                                    var fieldItems = [];
                                    var fields = item.fields;
                                    fields.forEach(function (_item) {
                                        fieldItems.push({
                                            value: _item.field,
                                            text: _item.name,
                                            selected: false
                                        })
                                    });
                                    displayFieldWidget.reload(fieldItems);
                                    valueFieldWidget.reload(fieldItems);
                                    displayFieldWidget.setVisible(true);
                                    valueFieldWidget.setVisible(true);
                                    return false;
                                }
                            }, this);
                            formItem.setSetting('datasource', dataSourceSetting);
                            break;
                        case 'select':
                            Foundation.Array.forEach(dataSources, function (item, i) {

                                var table = item.table;
                                if (table == selectValue) {
                                    var combo = item.combo;
                                    combo.name = table;
                                    combo.displayField = {
                                        title: combo.displayField.name,
                                        field: combo.displayField.field
                                    };
                                    combo.valueField = {
                                        title: combo.valueField.name,
                                        field: combo.valueField.field
                                    };

                                    dataSourceSetting.table = combo;
                                    return false;
                                }

                            }, this);
                            formItem.setSetting('datasource', dataSourceSetting);
                            break;
                        case 'detailgroup':
                            var linkQuerySet = formItem.getSettingByName('linkquery');
                            if (Foundation.isEmpty(linkQuerySet)) {
                                linkQuerySet = {};
                            }
                            linkQuerySet.table = selectValue;
                            formItem.setSetting('linkquery', linkQuerySet);
                            break;
                        default:
                            break;
                    }

                }
            }
        },

        __getLineDataQueryLoadConfig: function () {
            return {
                xtype: "tablecontainer",
                widgetName: "linkDataQueryLoad",
                rowSize: [20],
                colSize: ["auto", 20],
                items: [
                    [{
                        xtype: 'checkbox',
                        text: '开启搜索加载',
                        value: false,
                        onStateChange: function (selected) {

                        }
                    }, {
                        xtype: "tooltip",
                        style: "tip",
                        text: "开启搜索加载后，默认不进行加载，只有输入1个字符后才进行加载数据"
                    }]
                ],
                visible: false
            }
        },

        __getLocationScopeListConfig: function () {
            var options = this.options;
            var formItem = options.formItem;

            return {
                xtype: 'x-location-scope',
                items: formItem.getSettingByName('items'),
                onAfterEdit: function () {
                    formItem.setSetting('items', this.getLocationItems());
                }
            }
        },

        __getRequiredConfig: function () {
            var options = this.options;
            var formItem = options.formItem;

            return {
                xtype: 'checkbox',
                text: '必填',
                value: formItem.getSettingByName('required'),
                onStateChange: function (selected) {
                    formItem.setSetting('required', selected);
                }
            }
        },
        __getReadonlyConfig: function () {
            var options = this.options;
            var formItem = options.formItem;

            return {
                xtype: 'checkbox',
                text: '只读',
                value: formItem.getSettingByName('readonly'),
                onStateChange: function (selected) {
                    formItem.setSetting('readonly', selected);
                }
            }
        },

        __getVisibleConfig: function () {
            var options = this.options;
            var formItem = options.formItem;

            return {
                xtype: 'checkbox',
                text: '显示',
                value: formItem.getSettingByName('visible'),
                onStateChange: function (selected) {
                    formItem.setSetting('visible', selected);
                }
            }
        },

        __getSubtotalConfig: function () {
            var options = this.options;
            var formItem = options.formItem;
            // TODO 判断在明细中
            return {
                xtype: 'checkbox',
                text: '开启小计',
                value: formItem.getSettingByName('subtotal'),
                onStateChange: function (selected) {
                    formItem.setSetting('subtotal', selected);
                }
            }
        }

    };

    return DefaultsImplement
});