define(function (require, exports, module) {
    require('../ext/detailgroup-field-panel');
    require('../ext/linkquery-field-condition');

    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');
    var components = require('../../../component/index');

    var DetailGroupPanel = Class.create({
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

            var block = '';
            var linkquery = formItem.getSettingByName('linkquery');
            if (!Foundation.isEmpty(linkquery)) {
                block = linkquery['block'];
            }
            return [
                {
                    xtype: 'title',
                    title: "标题"
                },
                this.__getTitleConfig(), '-', {
                    xtype: 'title',
                    title: "描述信息"
                },
                this.__getDescTextAreaConfig(),
                '-', {
                    xtype: 'title',
                    title: "关联表单数据源"
                },
                this.__getDataSourcesCommboFormItemWidgetConfig(),
                {
                    xtype: 'title',
                    title: "关联条件"
                }, {
                    xtype: 'button',
                    widgetName: 'lq_condition_widget',
                    style: 'white',
                    text: "添加关联条件",
                    onClick: function () {
                        self._openConditionDialog(formFieldsMap);
                    },
                    visible: true
                }, {
                    xtype: 'title',
                    title: "执行函数"
                }, {
                    xtype: 'input',
                    widgetName: 'titleInput',
                    placeholder: "请输入与系统约定的执行函数",
                    value: block,
                    onAfterEdit: function (event, value) {

                        var linkquery = formItem.getSettingByName('linkquery');
                        if (Foundation.isEmpty(linkquery)) {
                            linkquery = {block: value};
                        } else {
                            linkquery['block'] = value;
                        }
                        formItem.setSetting('linkquery', linkquery);
                    }
                }, '-', {
                    xtype: 'title',
                    title: "明细字段"
                }, {
                    xtype: 'x-detailgroup-field-panel',
                    widgetName: "fieldPanel",
                    items: formItem.getSettingByName('items'),
                    onAfterItemAdd: function (item) {
                        formItem.addFieldItem(item);
                    },
                    onAfterItemRemove: function (index) {
                        formItem.removeFieldItemByIndex(index);
                    },
                    onAfterItemSelect: function (index) {

                    }
                }, '-', {
                    xtype: 'title',
                    title: "校验"
                },
                this.__getRequiredConfig()
            ]
        },

        _openConditionDialog: function (formFieldsMap) {
            var self = this;
            var options = this.options;
            var form = options.form;
            var formItem = options.formItem;
            var linkQuery = formItem.getSettingByName('linkquery');
            if (Foundation.isEmpty(linkQuery)) {
                components.Msg.toast({type: "warning", msg: "请先选择关联的表单数据源"});
                return;
            }
            var linkDs = linkQuery.table;
            if (Foundation.isEmpty(linkDs)) {

                components.Msg.toast({type: "warning", msg: "请先选择关联的表单数据源"});
                return;
            }
            var widgets = form.getFormItemWidgets();
            var allWidgetItems = Foundation.Array.map(widgets, function (widget) {
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
                            items: linkQuery['conditions'],
                            relyWidgets: allWidgetItems,
                            linkWidgets: formFieldsMap[linkDs]
                        }]
                    ]
                },
                onOk: function () {
                    var linkFieldConditionPanel = self.linkQueryFieldConditionDialog.getWidgetByName('linkFieldCondition');
                    var conditions = linkFieldConditionPanel.getValue();
                    linkQuery['widgets'] = Foundation.Array.map(conditions, function (condition) {
                        return condition.rely
                    }, this);

                    linkQuery['conditions'] = Foundation.Array.map(conditions, function (condition) {
                        return {
                            widget: condition.rely,
                            field: condition.link
                        }
                    }, this);
                    linkQuery['url'] ='api/form/linkquery';
                    formItem.setSetting('linkquery', linkQuery);

                }
            });
            this.linkQueryFieldConditionDialog.open();
        }

    });

    FormWidgetSettingBasePanel.register('detailgroup', DetailGroupPanel);

    return DetailGroupPanel;
});