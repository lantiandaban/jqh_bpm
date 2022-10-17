define(function (require, exports, module) {
    require('../ext/field-formula-editor-panel');

    var Class = require('Class');
    var Foundation = require('Foundation');
    var components = require('../../../component/index');
    // var selectFieldPanel = require('../ext/select-field-panel');
    var constants = require('../../constants');

    var availableFieldTypes = [
        constants.WIDGET_XTYPE.TEXT,
        constants.WIDGET_XTYPE.NUMBER,
        constants.WIDGET_XTYPE.TEXTAREA,
        constants.WIDGET_XTYPE.MONEY,
        constants.WIDGET_XTYPE.DATETIME,
        constants.WIDGET_XTYPE.RADIO_GROUP,
        constants.WIDGET_XTYPE.CHECKBOX_GROUP,
        constants.WIDGET_XTYPE.SELECT,
        constants.WIDGET_XTYPE.MULTI_SELECT
    ];

    var FormulaImplement = {

        __getAvailableFieldWidgets: function () {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;
            var items = [];

            var formItemWidgets = this.options.form.getFormItemWidgets();
            Foundation.Array.forEach(formItemWidgets, function (widget, i) {
                if (Foundation.Array.contains(availableFieldTypes, widget.xtype)) {
                    items.push(widget);
                }
                if (widget.xtype == constants.WIDGET_XTYPE.DETAIL_GROUP) {
                    var subWidgets = widget.getSubWidgets();
                    var groupTitle = widget.getTitle();
                    var groupWidgetName = widget.getWidgetName();
                    Foundation.Array.forEach(subWidgets, function (detailWidget, i) {
                        if (Foundation.Array.contains(availableFieldTypes, detailWidget.xtype)) {
                            detailWidget.options.in_detail_group = true;
                            detailWidget.options.group_title = groupTitle;
                            detailWidget.options.group_widget_name = groupWidgetName;
                            items.push(detailWidget);
                        }
                    })
                }
            }, this);
            return items
        },

        __createSelectFieldPanel: function (availableFieldWidgets) {
            var self = this;
            var fieldSelectPanelElement = $('<div class="fx_formula_field_tab"/>');
            var header = $('<div class="head"/>').appendTo(fieldSelectPanelElement);
            $('<div class="tab active"/>').text("当前表单字段").appendTo(header);

            var selectPanelElement = $('<div class="fx_field_select_pane"/>').appendTo(fieldSelectPanelElement);
            var selectListElement = $('<ul class="field-list"/>').appendTo(selectPanelElement);

            Foundation.Array.forEach(availableFieldWidgets, function (widget) {
                var widgetTitle = '';
                var widgetName = '';
                if(widget.options.in_detail_group){
                    widgetTitle  = widget.options.group_title + '.' + widget.getTitle();
                    widgetName  = widget.options.group_widget_name + '.' + widget.getWidgetName();
                } else {
                    widgetTitle = widget.getTitle();
                    widgetName = widget.getWidgetName();
                }

                var html = Foundation.String.format('<li class="field" name="{0}"><a class="menu-item"><span>{1}</span></a></li>', widgetName, widgetTitle);
                $(html).data('widget', widget).appendTo(selectListElement)
            }, this);

            this._bindDelegateEvent(selectListElement, 'li', 'click', function (element, event) {
                var widget = element.data('widget');
                var widgetTitle = '';
                var widgetName = '';
                if(widget.options.in_detail_group){
                    widgetTitle  = widget.options.group_title + '.' + widget.getTitle();
                    widgetName  = widget.options.group_widget_name + '.' + widget.getWidgetName();
                } else {
                    widgetTitle = widget.getTitle();
                    widgetName = widget.getWidgetName();
                }

                this._formulaDialog.getWidgetByName("formulaEditor").insertField({
                    text: widgetTitle,
                    name: widgetName
                })
            });

            return fieldSelectPanelElement
        },

        __getFormulaEditorPanel: function (availableFieldWidgets) {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;
            var formula = formItem.getSettingByName('formula');

            var labelMap = {};
            Foundation.Array.forEach(availableFieldWidgets, function (widget) {
                var widgetTitle = '';
                var widgetName = '';
                if(widget.options.in_detail_group){
                    widgetTitle  = widget.options.group_title + '.' + widget.getTitle();
                    widgetName  = widget.options.group_widget_name + '.' + widget.getWidgetName();
                } else {
                    widgetTitle = widget.getTitle();
                    widgetName = widget.getWidgetName();
                }
                var key = Foundation.String.format('${0}#', widgetName);
                labelMap[key] = widgetTitle
            }, this);
            return {
                xtype: 'x-formula-editor-panel',
                widgetName: "formulaEditor",
                value: formula && formula.value || null,
                text: this.options.formItem.options.title,
                hasFunction: true,
                labelMap: labelMap
            }
        },

        openFormulaDialog: function () {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;
            var availableFieldWidgets = this.__getAvailableFieldWidgets();

            this._formulaDialog = new components.ConfirmDialog({
                title: "公式编辑",
                width: 620,
                height: 510,
                contentWidget: {
                    rowSize: [380],
                    colSize: [220, 350],
                    hgap: 15,
                    vgap: 10,
                    padding: 15,
                    items: [
                        [this.__createSelectFieldPanel(availableFieldWidgets), this.__getFormulaEditorPanel(availableFieldWidgets)]
                    ]
                },
                onOk: function () {
                    var formula = self._formulaDialog.getWidgetByName('formulaEditor').getValue();
                    console.log(formula);
                    formItem.setSetting('formula', {
                        value: formula.value,
                        widgets: formula.widgets
                    });
                },
                onClose: function () {

                }
            });
            this._formulaDialog.open();
        }
    };
    return FormulaImplement
});