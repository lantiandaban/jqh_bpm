define(function (require, exports, module) {
    require('./item/index');

    var Hamster = require('lib/index');
    var ApprovalFormItemFactory = require('./item/factory');
    var ApprovalFormRelyProcessor = require('./rely-processor');
    var formulasManager = require('./formula');

    /**
     * 审批表单组件基类
     * */
    var ApprovalForm = Class.create({

        extend: Component,

        rows: [],

        layout: {},

        permissions: [],

        data: {},

        mode: 'create',

        billId: null,

        processId: null,

        taskId: null,

        _beforeInit: function () {
            ApprovalForm.superclass._beforeInit.apply(this);

            this.hasEdited = false;
            this.widgetMap = {};
            this.widgetPermissionsMap = {};
            this.widgetContactsMap = {};

            //this.singleSelectableWidgetStatusMap = {};

            this.defaultValueWidgets = [];
            this.firstLoadSingleChoosedWidgets = [];

            this.widgetValidateRelatesMap = {};

            this.detailGroupWidgets = new Hamster.utils.ArrayList();
            this.widgetOptionsStore = this.getWidgetOptionsData();

            this.initWidgetVisibleAndDisableMap();
            this.initWidgetValidateRelatesMap();
            this.initRelyProcessor();
        },

        _init: function () {
            ApprovalForm.superclass._init.apply(this);

            this.calculateFormLayoutTableColgroupHtml();
            Hamster.Array.forEach(this.rows || [], function (columns) {
                this.createRow(columns);
            }, this);

            Hamster.Array.forEach(this.defaultValueWidgets, function (widget) {
                widget && this.relyProcessor.fireRely(widget, null, this);
            }, this);

            Hamster.Array.forEach(this.firstLoadSingleChoosedWidgets, function (config) {
                this.doWidgetContact(config.widget, config.record);
            }, this);
        },

        _afterInit: function () {
            ApprovalForm.superclass._afterInit.apply(this);
        },

        /**
         * 获取所有组件的配置数据集合
         * */
        getWidgetOptionsData: function () {
            var widgetOptionsStore = new Hamster.utils.ArrayList();
            Hamster.Array.forEach(this.rows, function (row) {
                Hamster.Array.forEach(row, function (column) {
                    var options = column.widget;
                    if (Hamster.isEmpty(options)) {
                        return
                    }

                    options = Hamster.clone(options);
                    if (options.xtype == 'detailgroup') {
                        Hamster.Array.forEach(options.items, function (options) {
                            options = Hamster.clone(options);
                            options.__isSubWidget = true;
                            widgetOptionsStore.push(options.widgetName, options);
                        }, this);
                    }
                    widgetOptionsStore.push(options.widgetName, options);
                }, this);
            }, this);
            return widgetOptionsStore
        },

        /**
         * 初始化组件关联验证配置Map
         * */
        initWidgetValidateRelatesMap: function () {
            this.widgetOptionsStore.each(function (widgetOptions) {
                var config = widgetOptions.validateConfig;
                if (!Hamster.isEmpty(config) && !Hamster.isEmpty(config.relates)) {
                    Hamster.Array.forEach(config.relates, function (relate) {
                        if (relate.widgetName) {
                            this.widgetValidateRelatesMap[relate.widgetName] = this.widgetValidateRelatesMap[relate.widgetName] || [];
                            this.widgetValidateRelatesMap[relate.widgetName].push(widgetOptions.widgetName);
                        }
                    }, this);
                }
            }, this);
        },

        /**
         * 初始化组件的显示配置对象
         * */
        initWidgetVisibleAndDisableMap: function () {
            this.widgetVisibleAuth = {
                permission: {},
                widget: {}
            };
            this.widgetEnableAuth = {
                permission: {},
                widget: {}
            };
            Hamster.Array.forEach(this.permissions, function (permission) {
                this.widgetVisibleAuth.permission[permission.widgetName] = !permission.hidden;
                this.widgetEnableAuth.permission[permission.widgetName] = permission.edit;
            }, this);

            this.widgetOptionsStore.each(function (widgetOptions) {
                this.widgetVisibleAuth.widget[widgetOptions.widgetName] = widgetOptions.visible;
            }, this);
        },

        /**
         * 获取组件的显示授权
         * */
        getWidgetVisibleAuth: function (widgetName) {
            var permissionVisible = this.widgetVisibleAuth.permission[widgetName];
            if (!Hamster.isBoolean(permissionVisible)) {
                permissionVisible = true;
            }
            if (!permissionVisible) {
                return false
            }
            return this.widgetVisibleAuth.widget[widgetName];
        },

        /**
         * 获取组件的编辑授权
         * */
        getWidgetEnableAuth: function (widgetName) {
            var permissionEnable = this.widgetEnableAuth.permission[widgetName];
            if (!Hamster.isBoolean(permissionEnable)) {
                permissionEnable = true;
            }
            return permissionEnable
        },

        /**
         * 初始化组件依赖处理器
         * */
        initRelyProcessor: function () {
            this.relyProcessor = new ApprovalFormRelyProcessor(this.widgetOptionsStore.filterBy(function (widgetOptions) {
                return !widgetOptions.__isSubWidget
            }).getOriginalArray());
        },

        _initEvents: function () {
            this._bindEvent(this.el.target, 'resize', '_onResize');
        },

        /**
         * 当组件的大小改变
         * */
        _onResize: function () {
            Hamster.Function.createBuffered(function () {
                this.calculateFormLayoutTableColgroupHtml();
                this.el.target.find('table.approval-form-table>colgroup').html(this.__colgroupHtml)
            }, 100, this)();
        },

        /**
         * 创建表单中的一行
         * */
        createRow: function (columns) {
            var rowTableElement = $('<div class="approval-form-row"><table class="approval-form-table"><colgroup></colgroup><tbody></tbody></table></div>')
                .appendTo(this.el.target);
            var colgroupElement = rowTableElement.find('colgroup');
            var tbodyElement = rowTableElement.find('tbody');
            var rowElement = $('<tr/>').appendTo(tbodyElement);

            colgroupElement.html(this.__colgroupHtml);

            var widgetTdElements = [];
            Hamster.Array.forEach(columns || [], function (column) {
                var tdElement = this.createColumn(column, rowElement);
                if (!Hamster.isEmpty(column.widget)) {
                    tdElement.data('widget', column.widget);
                    widgetTdElements.push(tdElement);
                }
            }, this);

            Hamster.Array.forEach(widgetTdElements, function (tdElement) {
                var widgetOptions = tdElement.data('widget');
                this.createFormItemWidget(tdElement, widgetOptions);
            }, this);
        },

        /**
         * 创建表单组件列
         * */
        createColumn: function (column, rowElement) {
            var tdElement = $('<td class="approval-form-row-column approval-form-row-column-empty"/>')
                .attr({colspan: column.colspan || 1, rowspan: column.rowspan || 1})
                .data('column', column);
            return tdElement.appendTo(rowElement);
        },

        /**
         * 创建件表单组件
         * */
        createFormItemWidget: function (tdElement, widgetOptions) {
            if (Hamster.isEmpty(widgetOptions)) {
                return
            }
            var xtype = widgetOptions.xtype;
            if (Hamster.isEmpty(widgetOptions.xtype)) {
                return
            }

            var widgetName = widgetOptions.widgetName, self = this;

            var prevTdElement = tdElement.prev();
            if (!Hamster.isEmpty(prevTdElement) && !prevTdElement.hasClass('has-widgeted')) {
                widgetOptions.relationTitleEl = prevTdElement
            }

            widgetOptions.isSingleChooseWidget = xtype == 'select' || xtype == 'radiogroup';
            widgetOptions.appendToEl = widgetOptions.containerTdEl = tdElement;
            widgetOptions.enable = this.getWidgetEnableAuth(widgetName);
            widgetOptions.visible = this.getWidgetVisibleAuth(widgetName);
            widgetOptions = Hamster.apply(widgetOptions, this.getFormItemWidgetExtOptions(widgetOptions));
            widgetOptions.form = this;

            var widget = ApprovalFormItemFactory.create(widgetOptions.xtype, widgetOptions);
            if (!widget) {
                return
            }
            if (widget.isDetailGroupWidget) {
                this.detailGroupWidgets.push(widget.getWidgetName(), widget);
            }

            this.widgetMap[widget.getWidgetName()] = widget;

            //处理create模式下,组件的默认值(value)处理
            if (this.mode == 'create') {
                if (widget.isDetailGroupWidget) {
                    Hamster.Array.forEach(widget.items || [], function (itemWidgetOptions) {
                        if (!Hamster.isEmpty(itemWidgetOptions.value)) {
                            var subWidget = widget.getSubFormItemWidgetByName(itemWidgetOptions.widgetName, 0);
                            this.defaultValueWidgets.push(subWidget);
                        }
                    }, this);
                } else if (!Hamster.isEmpty(widgetOptions.value)) {
                    this.defaultValueWidgets.push(widget);
                }
            }

            //处理单选组件值关联
            if (this.hasContactWidgets(widget)) {
                Hamster.Array.forEach(widget.items, function (record) {
                    if (!Hamster.isEmpty(record.relies)) {
                        var valueRecord = widget.getValue();
                        if (record.value == (valueRecord && valueRecord.value)) {
                            this.firstLoadSingleChoosedWidgets.push({
                                widget: widget,
                                record: Hamster.clone(record)
                            })
                        }
                    }
                }, this);
            }

            tdElement.addClass('has-widgeted');
            tdElement.data('widget', widget);

            return widget
        },

        /**
         * 判断表单字段组件是否有联系组件(控制组件的显示和是否可编辑, 针对select和radiogroup两种组件)
         * */
        hasContactWidgets: function (widget) {
            if (!widget) {
                return false
            }
            if (!widget.isSingleChooseWidget) {
                return false
            }
            if (!Hamster.isEmpty(widget.async)) {
                return false
            }
            var hasRelies = false;
            Hamster.Array.each(widget.items, function (item) {
                if (!Hamster.isEmpty(item.relies)) {
                    hasRelies = true;
                    return false
                }
            }, this);
            return hasRelies
        },

        /**
         * 处理组件联系
         * */
        doWidgetContact: function (widget, item) {
            var widgetName = widget.getWidgetName();
            var record = this.widgetContactsMap[widgetName];

            if (!Hamster.isEmpty(record)) {
                Hamster.Array.forEach(record.relies, function (rely) {
                    var contactsWidget = this.getFormItemWidgetByName(rely.widgetName);
                    if (!contactsWidget) {
                        return
                    }
                    var status = record.statusMap[rely.widgetName];
                    if (status) {
                        this.setWidgetVisible(contactsWidget, status.visible, true);
                        this.setWidgetRequired(contactsWidget, status.required);
                    }
                }, this);
            }

            var statusMap = {};
            Hamster.Array.forEach(item.relies, function (rely) {
                var contactsWidget = this.getFormItemWidgetByName(rely.widgetName);
                if (!contactsWidget) {
                    return
                }

                var status = {};
                status.visible = contactsWidget.isVisible();
                status.required = contactsWidget.isRequired();
                statusMap[rely.widgetName] = status;

                this.setWidgetVisible(contactsWidget, !rely.hidden);
                this.setWidgetRequired(contactsWidget, rely.required);
            }, this);
            this.widgetContactsMap[widgetName] = {
                statusMap: statusMap,
                relies: Hamster.clone(item.relies)
            }
        },

        /**
         * 获取表单字段组件的扩展属性
         * */
        getFormItemWidgetExtOptions: function (widgetOptions) {
            var options = {}, self = this;
            var xtype = widgetOptions.xtype;
            var widgetName = widgetOptions.widgetName;

            if (!widgetOptions.isDetailGroupSubWidget) {
                options.viewMode = (this.mode == 'view' && !this.getWidgetEnableAuth(widgetName));
            }

            if (!widgetOptions.isDetailGroupSubWidget || widgetOptions.withDefaultValue) {
                options.value = this.getFormItemWidgetInitValue(widgetName);
            }
            options.formParams = {
                processId: this.processId,
                billId: this.billId,
                taskId: this.taskId
            };

            var listeners = options.listeners = {
                'change': this.onWidgetValueChange.bind(this),
                'before-init': this.onFormItemWidgetBeforeInit.bind(this)
            };

            if (this.hasContactWidgets(widgetOptions)) {
                listeners.select = this.onHasContactWidgetSelect.bind(this);
            }

            switch (xtype) {
                case 'detailgroup':
                    Hamster.apply(listeners, {
                        'before-create-widget': function (detailGroup, options) {
                            Hamster.apply(options, self.getFormItemWidgetExtOptions(options));
                        },
                        'after-create-widget': function (detailGroup, widget) {

                        }
                    });
                    break;
            }
            return options
        },

        /**
         * 获取表单字段组件的初始化值
         * */
        getFormItemWidgetInitValue: function (widgetName) {
            var defaultValue;
            var widgetOptions = this.widgetOptionsStore.getByKey(widgetName);
            var widgetType = widgetOptions.xtype;

            switch (widgetType) {
                case 'text':
                case 'number':
                case 'money':
                case 'textarea':
                case 'datetime': {
                    defaultValue = widgetOptions.value || null;
                    break;
                }
                case 'select':
                case 'multiselect':
                case 'radiogroup':
                case 'checkboxgroup': {
                    var selected = [];
                    var isCombo = widgetType == 'select' || widgetType == 'multiselect';
                    var isMulti = widgetType == 'multiselect' || widgetType == 'checkboxgroup';
                    if (isCombo && widgetOptions.sourceType != 'custom') {
                        return
                    }
                    Hamster.Array.forEach(widgetOptions.items, function (item) {
                        var data = {};
                        data.text = item.text;
                        data.value = item.value;
                        data.record = {text: item.text, value: item.value};
                        item.selected && selected.push(data);
                    }, this);
                    defaultValue = isMulti ? selected : selected[0];
                    break;
                }
            }

            var value = this.data[widgetName];
            if (Hamster.isEmpty(value)) {
                value = defaultValue;
            }
            return value;
        },

        /**
         * 当表单字段组件初始化前
         * */
        onFormItemWidgetBeforeInit: function (widget) {
            //处理没有关联其他组件的公式
            if (!Hamster.isEmpty(widget.formula)) {
                var formula = widget.formula;
                if (Hamster.isEmpty(formula.widgets) && !Hamster.isEmpty(formula.value)) {
                    widget.value = this.execFormula(formula.value, {});
                }
            }
        },

        /**
         * 当含有联系组件的select事件触发时
         * */
        onHasContactWidgetSelect: function (widget, record) {
            this.doWidgetContact(widget, record);
        },

        /**
         * 设置组件的显示状态
         * */
        setWidgetVisible: function (widget, visible, judge) {
            if (judge && !this.getWidgetVisibleAuth(widget.getWidgetName())) {
                return
            }
            widget.setVisible(visible);
        },

        /**
         * 设置组件的必填状态
         * */
        setWidgetRequired: function (widget, required) {
            if (!widget.isEnabled() || !widget.isVisible()) {
                return
            }
            widget.setRequired(required);

            // if (!required && Hamster.isEmpty(widget.getErrors())) {
            //     widget.validate();
            // }
        },

        /**
         * 计算表单布局table的列宽度,并且生成colgroup的HTML
         * */
        calculateFormLayoutTableColgroupHtml: function () {
            var layout = this.layout;
            var colgroup = layout.colgroup;
            var tableWidth = layout.width;

            var flexCount = 0,
                unflexColTotleWidth = 0;

            Hamster.Array.forEach(colgroup, function (col) {
                if (col.type == 'flex') {
                    flexCount += parseInt(col.value)
                } else {
                    unflexColTotleWidth += parseInt(col.value)
                }
            }, this);

            this.__flexCount = flexCount;
            this.__unflexColTotleWidth = unflexColTotleWidth;

            return this.__colgroupHtml = Hamster.Array.map(colgroup || [], function (col, i) {
                var width = Hamster.String.format('{0}px', col.type == 'px' ? col.value : this.getFlexFormTableColWidth(tableWidth, col.value));
                return Hamster.String.format('<col style="width:{0}"/>', width);
            }, this);
        },

        /**
         * 获取单位占比列宽度
         * */
        getFlexFormTableColWidth: function (tableWidth, flex) {
            var _tableWidth = this.el.target.width();
            var flexWidth = (_tableWidth - this.__unflexColTotleWidth) / this.__flexCount;
            return flex * flexWidth
        },

        /**
         * 获取组件的权限
         * */
        getWidgetPermissions: function (filename) {
            return this.widgetPermissionsMap[filename] || {visible: true, disable: false}
        },

        /**
         * 根据组件名获取对应的组件
         * */
        getFormItemWidgetByName: function (fieldName, index) {
            if (Hamster.isEmpty(fieldName)) {
                return null
            }

            var widget;
            if (this.isDetailGroupWidget(fieldName)) {
                var names = fieldName.split('.');
                var parentFieldName = names[0];
                var subFieldName = names[1];

                var parentWidget = this.getFormItemWidgetByName(parentFieldName);
                if (parentWidget) {
                    widget = parentWidget.getSubFormItemWidgetByName(subFieldName, index);
                }
            } else {
                widget = this.widgetMap[fieldName]
            }
            return widget
        },

        /**
         * 判断是否为明细组件
         * */
        isDetailGroupWidget: function (fieldName) {
            return /\./.test(fieldName)
        },

        /**
         * 计算明细列表行数据
         * */
        formulaDetailGroupRecord: function (detailGroupWidget, record) {
            Hamster.Object.each(record, function (widgetName) {
                var subWidgetOptions = detailGroupWidget.getColumnWidgetOptionsByName(widgetName);

                if (!Hamster.isEmpty(subWidgetOptions.formula) && !Hamster.isEmpty(subWidgetOptions.formula.value)) {
                    var valueMap = {};
                    Hamster.Array.forEach(subWidgetOptions.formula.widgets, function (_widgetName) {
                        var __widgetName = _widgetName.split('.')[1];
                        __widgetName && (valueMap[_widgetName] = record[__widgetName]);
                    }, this);
                    record[widgetName] = this.execFormula(subWidgetOptions.formula.value, valueMap)
                }
            }, this);
            return record
        },

        /**
         * 导入明细
         * */
        importDetailData: function (data) {
            if (this.detailGroupWidgets.length == 0) {
                return
            }
            var detailGroupWidget = this.detailGroupWidgets.getAt(0);
            detailGroupWidget.clearRows();

            Hamster.Array.forEach(Hamster.Array.from(data), function (record) {
                record = this.formulaDetailGroupRecord(detailGroupWidget, record);
                detailGroupWidget.addRow(record)
            }, this);
        },

        /**
         * 监听表单组件值变化
         * */
        onWidgetValueChange: function (widget) {
            this.hasEdited = true;
            var validateRelatesWidgetNames = this.widgetValidateRelatesMap[widget.getWidgetName()];
            if (!Hamster.isEmpty(validateRelatesWidgetNames)) {
                Hamster.Array.forEach(validateRelatesWidgetNames, function (widgetName) {
                    var widget = this.getFormItemWidgetByName(widgetName);
                    widget.validate();
                }, this);
            }

            this.relyProcessor.fireRely(widget, null, this);
            this.fireEvent('widget-value-change', widget);
        },

        /**
         * 处理关联并且计算
         * */
        dealRely: function (name, widget, version, value) {
            var index, xtype = widget.xtype;

            if (widget.isDetailGroupSubWidget) {
                index = widget.el.target.closest('tr').index();
            }

            if (!Hamster.isEmpty(widget.formula)) {
                var valueMap = {};
                var formula = widget.formula.value;

                valueMap[name] = value;
                Hamster.Array.forEach(widget.formula.widgets, function (widgetName) {
                    var widgets = this.getFormItemWidgetByName(widgetName, index);
                    if (Hamster.isArray(widgets)) {
                        valueMap[widgetName] = Hamster.Array.map(widgets, function (widget) {
                            return widget.getValue();
                        });
                    } else {
                        var widget = widgets;
                        widget && (valueMap[widgetName] = widget.getValue())
                    }
                }, this);
                var formulaValue = this.execFormula(formula, valueMap);
                widget.setValue(formulaValue);
                this.relyProcessor.fireRely(widget, version, this);
                return;
            }

            if (widget.rely) {
                switch (xtype) {
                    case 'select':
                    case 'multiselect':
                        this.execComboDataRely(widget, version);
                        break;
                    default:
                        this.execDefaultDataRely(widget, version);
                }
                return;
            }
            if (xtype == 'detailgroup' && widget.linkquery) {
                this.execDetailGroupLinkQuery(widget, version);
            }
        },

        /**
         * 执行默认的数据关联(除了select和multiselect)
         * */
        execDefaultDataRely: function (widget, version) {
            var self = this,
                rely = widget.rely,
                fieldValue = "",
                index = 0;

            if (widget.isDetailGroupSubWidget) {
                index = widget.el.target.closest('tr').index();
            }

            var _widget = this.getFormItemWidgetByName(rely.field, index);
            if (!Hamster.isEmpty(_widget)) {
                fieldValue = _widget.getValue();
            }
            if (Hamster.isEmpty(fieldValue)) {
                fieldValue = "";
            }
            if (!Hamster.isString(fieldValue)) {
                fieldValue = JSON.stringify(fieldValue);
            }

            var field = rely.field;
            if (this.isDetailGroupWidget(field)) {
                field = field.split('.')[1];
            }

            var params = {
                field: field,
                fieldValue: fieldValue,
                table: rely.ref.table,
                equalField: rely.ref.equalField,
                correspondField: rely.ref.correspondField,
                xtype: widget.xtype
            };
            var dataHttpAjax = new HttpAjax({
                url: 'form/rest/rely',
                type: 'POST',
                params: params
            });
            dataHttpAjax.successHandler(function (result) {
                widget.setValue(result);
                self.relyProcessor.fireRely(widget, version, self);
            });
            dataHttpAjax.send();
        },

        /**
         * 执行下拉选择(复选)的数据关联
         * */
        execComboDataRely: function (widget, version) {
            //TODO
        },

        /**
         * 执行明细组件的关联查询
         * */
        execDetailGroupLinkQuery: function (widget, version) {
            var self = this,
                linkQuery = widget.linkquery,
                params = {};

            var values = Hamster.Array.map(linkQuery.conditions || [], function (item) {
                var value = "";
                var record = Hamster.clone(item);
                var _widget = this.getFormItemWidgetByName(item.widget);
                if (!Hamster.isEmpty(_widget)) {
                    value = _widget.getValue();
                }
                record.value = value;
                return record
            }, this);

            params.processId = this.processId;
            params.query = JSON.stringify({
                tablename: linkQuery.table,
                block: linkQuery.block,
                xtype: widget.xtype,
                values: values
            });
            var dataHttpAjax = new HttpAjax({
                url: linkQuery.url,
                type: 'POST',
                params: params
            });
            dataHttpAjax.successHandler(function (result) {
                widget.setValue(result, true);
                self.relyProcessor.fireRely(widget, version, self);
            });
            dataHttpAjax.send();
        },

        /**
         * 执行运算表达式公式
         * */
        execFormula: function (formula, valueMap) {
            var snippet = [];
            var paragraphs = formula.split(/(\$[0-9a-zA-Z\._#@]+)/g);

            Hamster.Array.forEach(paragraphs, function (paragraph) {
                if (Hamster.String.startsWith(paragraph, "$_widget_name")) {
                    var widgetNames = paragraph.replace('$', "").split("#");
                    var parentWidgetName = widgetNames[0];
                    var widgetName = widgetNames[1];

                    if (Hamster.isEmpty(widgetName)) {
                        widgetName = parentWidgetName;
                        var data = {};
                        if (valueMap) {
                            data = valueMap[widgetName];
                        } else {
                            var widget = this.getFormItemWidgetByName(widgetName);
                            if (Hamster.isArray(widget)) {
                                data = [];
                                Hamster.Array.forEach(widget, function (w) {
                                    data.push(w.getValue());
                                }, this);
                            } else if (!Hamster.isEmpty(widget)) {
                                data = widget.getValue();
                            }
                        }
                        var d = JSON.stringify(data) + "";
                        if (!isNaN(data) && data < 0) {
                            d = "(" + d + ")";
                        }
                        snippet.push(d);
                    } else {
                        snippet.push('"' + paragraph + '"');
                    }
                } else {
                    snippet.push(paragraph);
                }
            }, this);

            var value;
            try {
                value = formulasManager.eval(snippet.join(""))
            } catch (t) {
                value = ""
            }
            return value
        },

        /**
         * 验证表单中组件
         * */
        validate: function () {
            var pass = true;
            Hamster.Object.each(this.widgetMap, function (fieldName, widget) {
                if (!widget.isVisible()) {
                    return
                }
                var success = widget.validate();
                //console.log(Hamster.String.format('验证: {0}, 标题: {1}, 是否成功: {2}', fieldName,
                // widget.getTitle(), success));
                if (!success && pass) {
                    pass = false
                }
            }, this);
            return pass
        },

        /**
         * 获取可编辑组件的表单数据
         * */
        getEditableFormData: function () {
            var data = {};
            Hamster.Object.each(this.widgetMap, function (fieldName, widget) {
                if (!widget.viewMode && !widget.isBizWidget) {
                    Hamster.isEmpty(fieldName) || (data[fieldName] = widget.getValue());
                }
            }, this);
            return data;
        },

        /**
         * 获取表单数据
         * */
        getFormData: function () {
            var data = {};
            Hamster.Object.each(this.widgetMap, function (fieldName, widget) {
                Hamster.isEmpty(fieldName) || (data[fieldName] = widget.getValue());
            }, this);
            return data;
        },

        /**
         * 设置表单数据
         * */
        setFormData: function (data) {
            Hamster.Object.each(data, function (fieldName, value) {
                var widget = this.widgetMap[fieldName];
                widget && widget.setValue(value, true);
            }, this);
        },

        /**
         * 检查表单是否修改过
         * */
        formHasEdited: function () {
            return this.hasEdited
        },

        /**
         * 检查表单是否有文件正在上传中
         * */
        formHasUploading: function () {
            if (this.ignoreFileUploading) {
                return false;
            }
            var hasUploading = false;
            Hamster.Object.each(this.widgetMap, function (fieldName, widget) {
                if (widget.isFileUpload && widget.uploading) {
                    hasUploading = true;
                    return;
                }
            }, this);
            return hasUploading;
        },

        setFormEdited: function (edited) {
            this.hasEdited = edited;
        },

        /**
         * 销毁表单以及表单中的所有组件
         * */
        destroy: function () {
            Hamster.Object.each(this.widgetMap, function (name, widget) {
                widget && widget.destroy();
            }, this);
            this.widgetOptionsStore.clear();
            this.widgetOptionsStore = null;
            this.relyProcessor && this.relyProcessor.destroy();
            this.relyProcessor = null;
            ApprovalForm.superclass.destroy.apply(this);
        }

    });
    return ApprovalForm
});