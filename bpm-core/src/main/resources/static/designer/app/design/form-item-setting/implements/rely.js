define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var components = require('../../../component/index');
    var constants = require('../../constants');

    // 请求发出的参数
    // var a = {
    //     field: '_widget_name_1499938331077',
    //     fieldValue: 'xxx',
    //     table: 'tablename',
    //     equalField: "xx",
    //     correspondField: "xx",
    // }

    var ALLOW_RELY_FORM_ITEM_WIDGET_TYPES = [
        constants.WIDGET_XTYPE.TEXT,
        constants.WIDGET_XTYPE.NUMBER,
        constants.WIDGET_XTYPE.MONEY,
        constants.WIDGET_XTYPE.DATETIME,
        constants.WIDGET_XTYPE.SELECT,
        constants.WIDGET_XTYPE.RADIO_GROUP,
        constants.WIDGET_XTYPE.TRIGGER_SELECT
    ];

    //string, number, array, datetime

    var RELY_VTYPE = {};
    RELY_VTYPE[constants.WIDGET_XTYPE.TEXT] = ['string', 'number'];
    RELY_VTYPE[constants.WIDGET_XTYPE.NUMBER] = ['string', 'number'];
    RELY_VTYPE[constants.WIDGET_XTYPE.MONEY] = ['string', 'number'];
    RELY_VTYPE[constants.WIDGET_XTYPE.DATETIME] = ['datetime'];
    RELY_VTYPE[constants.WIDGET_XTYPE.SELECT] = ['string'];
    RELY_VTYPE[constants.WIDGET_XTYPE.RADIO_GROUP] = ['string'];
    RELY_VTYPE[constants.WIDGET_XTYPE.TRIGGER_SELECT] = ['string', 'number', 'datetime'];


    var selectRelyTableItem, selectFormInnerWidgetItem;

    var RelyImplement = {

        openRelyDialog: function(isSelectWidget) {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;
            var contentWidgetOptions = this.__getRelyDialogContentWidgetOptions(formItem);

            function onRelyDialogSave() {
                var dataFieldWidget = self._relyDialog.getWidgetByName("dataField"),
                    relyDataWidget = self._relyDialog.getWidgetByName("relyData"),
                    formInnerWidgetCombo = self._relyDialog.getWidgetByName('formInnerWidgetCombo'),
                    tableCombo = self._relyDialog.getWidgetByName('tableCombo');

                var table = tableCombo.getValue();
                var equalField = relyDataWidget.getValue();
                var correspondField = dataFieldWidget.getValue();
                var field = formInnerWidgetCombo.getValue();
                var rely = {
                    ref: {
                        table: table,
                        equalField: equalField,
                        correspondField: correspondField
                    },
                    field: field,
                    widgets: [field]
                };
                formItem.setSetting('rely', Foundation.clone(rely));

                if (formItem.xtype == constants.WIDGET_XTYPE.SELECT || formItem.xtype == constants.WIDGET_XTYPE.TRIGGER_SELECT) {
                    var async = {
                        url: '/form/rest/rely',
                        data: {
                            table: table,
                            field: correspondField
                        }
                    };
                    formItem.setSetting('async', Foundation.clone(async));
                }
            }

            function onRelyDialogClose() {
                selectRelyTableItem = null;
                selectFormInnerWidgetItem = null;
            }

            this._relyDialog = new components.ConfirmDialog({
                title: "数据联动",
                width: 450,
                height: 300,
                contentWidget: {
                    rowSize: [30, 30, 30],
                    colSize: [130, 75, 130, 60],
                    hgap: 8,
                    vgap: 20,
                    padding: 15,
                    items: contentWidgetOptions
                },
                onOk: onRelyDialogSave,
                onClose: onRelyDialogClose
            });
            this._relyDialog.open();
        },

        __getRelyTableComboItems: function(formItem) {
            var options = this.options;
            var form = options.form;
            var rely = formItem.getSettingByName('rely');
            var dataSources = form.getDataSources();

            return Foundation.Array.map(dataSources, function(item, i) {
                var name = item.name;
                var table = item.table;
                var childrens = [];
                var asChildrens = [];
                Foundation.Array.forEach(item.fields, function(fieldItem, j) {
                    childrens.push({
                        text: fieldItem.name,
                        value: fieldItem.field,
                        vtype: fieldItem.vtype
                    });
                    asChildrens.push({
                        text: fieldItem.name,
                        value: fieldItem.field,
                        vtype: fieldItem.vtype
                    });
                }, this);

                var tableItem = {
                    text: name,
                    value: table,
                    childrens: childrens,
                    asChildrens: asChildrens
                };
                if (rely && rely.ref.table == table) {
                    selectRelyTableItem = tableItem
                }
                return tableItem
            }, this);
        },

        __getFormInnerWidgetComboItems: function(formItem) {
            var comboItems = [];
            var itemWidgets = this.options.form.getFormItemWidgets();
            var rely = formItem.getSettingByName('rely');

            // Foundation.Array.forEach(itemWidgets, function(widget, i) {
            //     var title = widget.getTitle();
            //     var xtype = widget.xtype;
            //
            //     if (xtype == constants.WIDGET_XTYPE.DETAIL_GROUP) {
            //         console.log(widget.getSubWidgets());
            //         Foundation.Array.forEach(widget.getSubWidgets(), function (_widget) {
            //
            //         }, this);
            //         return
            //     }
            //
            //     if (!Foundation.Array.contains(ALLOW_RELY_FORM_ITEM_WIDGET_TYPES, xtype) ||
            //         widget.getWidgetName() === this.options.formItem.getWidgetName()) {
            //         return;
            //     }
            //     var item = {};
            //     item.text = title;
            //     item.value = widget.getWidgetName();
            //     item.xtype = xtype;
            //     comboItems.push(item);
            //
            //     if (rely && rely.field == item.value) {
            //         selectFormInnerWidgetItem = item;
            //     }
            // }, this);

            this._getFormInnerWidgetComboItemsFromWidgetList(rely, comboItems, null, itemWidgets);

            return comboItems;
        },


        _getFormInnerWidgetComboItemsFromWidgetList: function (rely, comboItems, parentWidget, itemWidgets) {

            Foundation.Array.forEach(itemWidgets, function(widget, i) {
                var xtype = widget.xtype;
                var isDetailSubWidget = !Foundation.isEmpty(parentWidget);

                if (xtype == constants.WIDGET_XTYPE.DETAIL_GROUP) {
                    this._getFormInnerWidgetComboItemsFromWidgetList(rely, comboItems, widget, widget.getSubWidgets());
                    return
                }

                if (!Foundation.Array.contains(ALLOW_RELY_FORM_ITEM_WIDGET_TYPES, xtype) ||
                    widget.getWidgetName() === this.options.formItem.getWidgetName()) {
                    return;
                }
                var item = {};
                var title, value;

                if (isDetailSubWidget) {
                    title = Foundation.String.format('{0}.{1}', parentWidget.getTitle(), widget.getTitle());
                    value = Foundation.String.format('{0}.{1}', parentWidget.getWidgetName(), widget.getWidgetName());
                } else {
                    title = widget.getTitle();
                    value = widget.getWidgetName();
                }

                item.text =  title;
                item.value =  value;
                item.xtype = xtype;
                comboItems.push(item);

                if (rely && rely.field == item.value) {
                    selectFormInnerWidgetItem = item;
                }
            }, this);

        },

        __getRelyTableFieldtComboItems: function(xtype) {
            if (Foundation.isEmpty(xtype)) {
                return [];
            }
            var items = [];
            var childrens = selectRelyTableItem && selectRelyTableItem.childrens || [];
            Foundation.Array.forEach(childrens, function(item, i) {
                var vtypes = RELY_VTYPE[xtype];
                if (!Foundation.isEmpty(vtypes) && Foundation.Array.contains(vtypes, item.vtype)) {
                    items.push(item);
                }
            }, this);
            return items;
        },
        __getRelyTableFieldtAsComboItems: function(xtype) {
            if (Foundation.isEmpty(xtype)) {
                return [];
            }
            var items = [];
            var childrens = selectRelyTableItem && selectRelyTableItem.asChildrens || [];
            console.log(childrens,"数据源的下拉框");
            Foundation.Array.forEach(childrens, function(item, i) {
                var vtypes = RELY_VTYPE[xtype];
                if (!Foundation.isEmpty(vtypes) && Foundation.Array.contains(vtypes, item.vtype)) {
                    items.push(item);
                }
            }, this);
            return items;
        },

        __getRelyDialogContentWidgetOptions: function(formItem) {
            var self = this;
            var rely = formItem.getSettingByName('rely');

            return [
                [{
                    xtype: "label",
                    text: "数据关联表",
                    width: 80
                }, {
                    xtype: "combo",
                    widgetName: "tableCombo",
                    placeholder: "请选择数据关联表",
                    allowBlank: false,
                    width: 330,
                    items: function() {
                        return self.__getRelyTableComboItems(formItem)
                    },
                    onAfterItemSelect: this.__onRelyExternalFormComboItemSelected.bind(this),
                    value: rely && rely.ref.table || null
                }],
                [{
                    xtype: "combo",
                    widgetName: "formInnerWidgetCombo",
                    placeholder: "表单内控件",
                    allowBlank: false,
                    items: function() {
                        return self.__getFormInnerWidgetComboItems(formItem)
                    },
                    onAfterItemSelect: function(itemElement, item) {
                        selectFormInnerWidgetItem = item;
                        var relyDataWidget = self._relyDialog.getWidgetByName("relyData");
                        relyDataWidget.setValue(null);
                        relyDataWidget.reload();
                    },
                    value: rely && rely.field || null
                }, {
                    xtype: "label",
                    text: "值等于",
                    customCls: ""
                }, {
                    xtype: "combo",
                    widgetName: "relyData",
                    placeholder: "关联表字段",
                    allowBlank: false,
                    items: function() {
                        var xtype = selectFormInnerWidgetItem && selectFormInnerWidgetItem.xtype;
                        return self.__getRelyTableFieldtAsComboItems(xtype)
                    },
                    value: rely && rely.ref.equalField || null
                }, {
                    xtype: "label",
                    text: "的值时"
                }],
                [{
                    xtype: "input",
                    enable: false,
                    value: this.options.formItem.getTitle()
                }, {
                    xtype: "label",
                    text: "联动显示为"
                }, {
                    xtype: "combo",
                    widgetName: "dataField",
                    placeholder: "关联表字段",
                    allowBlank: false,
                    width: 130,
                    items: function() {
                        return self.__getRelyTableFieldtComboItems(self.options.formItem.xtype);
                    },
                    value: rely && rely.ref.correspondField || null
                }, {
                    xtype: "label",
                    text: "中对应值"
                }]
            ]
        },

        __onRelyExternalFormComboItemSelected: function(itemElement, item) {
            var dataFieldWidget = this._relyDialog.getWidgetByName("dataField"),
                relyDataWidget = this._relyDialog.getWidgetByName("relyData");

            selectRelyTableItem = item;

            relyDataWidget.setValue(null);
            relyDataWidget.reload();

            dataFieldWidget.setValue(null);
            dataFieldWidget.reload();
        }

    };

    return RelyImplement
});