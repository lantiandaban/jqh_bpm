define(function(require, exports, module) {
    require('../ext/linkquery-field-condition');

    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormWidgetSettingBasePanel = require('./base');
    var components = require('../../../component/index');

    var LinkQueryPanel = Class.create({
        extend: FormWidgetSettingBasePanel,
        _getFormWidgetSettingOptions: function(formItem) {
            var self = this;
            var options = this.options;
            var form = options.form;

            var entryList = form.getEntryList();
            var formFieldsMap = {};
            var otherFormItems = Foundation.Array.map(entryList, function(entry) {
                formFieldsMap[entry.entryId] = Foundation.Array.map(entry.fields, function(field) {
                    return {
                        text: field.text,
                        name: field.name,
                        xtype: field.xtype
                    }
                }, this);
                return {
                    text: entry.name,
                    value: entry.entryId,
                    entry: entry
                }
            }, this);

            return [{
                    xtype: 'title',
                    title: "标题"
                },
                this.__getTitleConfig(), '-', {
                    xtype: 'title',
                    title: "描述信息"
                },
                this.__getDescTextAreaConfig(), '-', {
                    xtype: 'title',
                    title: "关联表"
                },
                this.__getLinkOhterFormsConfig(otherFormItems, formFieldsMap),
                '-',
                {
                    xtype: 'title',
                    title: "关联字段"
                },
                this.__getLinkQueryFieldEditConfig(otherFormItems, formFieldsMap),
                '-',
                {
                    xtype: 'title',
                    title: "关联字段条件限定"
                }, {
                    xtype: 'button',
                    widgetName: "",
                    style: 'white',
                    text: "添加关联条件",
                    visible: true,
                    onClick: function() {
                        self._openLinkQueryFieldConditionDialog(formFieldsMap);
                    }
                }
            ]
        },

        _openLinkQueryFieldConditionDialog: function(formFieldsMap) {
            var self = this;
            var options = this.options;
            var form = options.form;
            var formItem = options.formItem;
            var linkForm = formItem.getSettingByName('linkForm');

            var widgets = form.getFormItemWidgets();
            var allWidgetItems = Foundation.Array.map(widgets, function(widget) {
                return {
                    text: widget.getTitle(),
                    name: widget.getWidgetName(),
                    xtype: widget.xtype
                }
            }, this);

            this.linkQueryFieldConditionDialog = new components.ConfirmDialog({
                title: "关联条件限定",
                height: 440,
                width: 510,
                contentWidget: {
                    rowSize: [290],
                    colSize: [480],
                    padding: 15,
                    items: [
                        [{
                            xtype: "x-linkquery-field-condition-panel",
                            widgetName: "linkFieldCondition",
                            items: formItem.getSettingByName('conditions'),
                            relyWidgets: allWidgetItems,
                            linkWidgets: formFieldsMap[linkForm]
                        }]
                    ]
                },
                onOk: function() {
                    var linkFieldConditionPanel = self.linkQueryFieldConditionDialog.getWidgetByName('linkFieldCondition');
                    var conditions = linkFieldConditionPanel.getValue();
                    var relies = Foundation.Array.map(conditions, function(condition) {
                        return condition.rely
                    }, this);
                    formItem.setSetting('conditions', conditions);
                    formItem.setSetting('rely', { widgets: relies });
                }
            });
            this.linkQueryFieldConditionDialog.open();
        },

        __getLinkQueryFieldEditConfig: function(otherFormItems, formFieldsMap) {
            var self = this;
            var options = this.options;
            var form = options.form;
            var formItem = options.formItem;

            function onSelectFieldsChanged() {
                var result = this.getResult();
                formItem.setFields(result.fields);
            }

            var linkForm = formItem.getSettingByName('linkForm');

            return {
                xtype: 'x-linkquery-field-edit-panel',
                widgetName: "linkqueryfieldedit",
                allFields: formFieldsMap[linkForm],
                fields: formItem.getSettingByName('linkFields'),
                onAfterFieldAdd: onSelectFieldsChanged,
                onAfterFieldUpdate: onSelectFieldsChanged,
                onAfterFieldRemove: onSelectFieldsChanged,
                onAfterFieldSorted: onSelectFieldsChanged
            }
        },

        __getLinkOhterFormsConfig: function(otherFormItems, formFieldsMap) {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;

            return {
                xtype: 'combo',
                widgetName: 'linkFormSelect',
                items: otherFormItems,
                value: formItem.getSettingByName('linkForm'),
                onAfterItemSelect: function() {
                    var linkForm = this.getValue();
                    if (linkForm == formItem.getSettingByName('linkForm')) {
                        return
                    }
                    formItem.setSetting('linkForm', linkForm);
                    formItem.setSetting('linkFields', []);

                    var linkQueryFieldEidtPanel = self.getWidgetByName("linkqueryfieldedit");
                    if (!linkQueryFieldEidtPanel) {
                        return
                    }
                    linkQueryFieldEidtPanel.options.allFields = formFieldsMap[linkForm];
                    linkQueryFieldEidtPanel.clear();
                }
            }
        }
    });

    FormWidgetSettingBasePanel.register('linkquery', LinkQueryPanel);

    return LinkQueryPanel;
});