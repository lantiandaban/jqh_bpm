define(function (require, exports, module) {

    var Hamster = require('lib/index');
    var ApprovalFormItemFactory = require('./factory');

    /**
     * 审批表单组件基类
     * */
    var BaseApprovalFormItemComponent = Class.create({

        extend: Component,

        baseCls: 'approval-form-item',

        disableCls: 'approval-form-item-disable',

        hiddenCls: 'approval-form-item-hidden',

        containerTdEl: null,

        relationTitleEl: null,

        config: {},

        title: "组件标题",

        required: false,

        visible: true,

        xtype: null,

        viewMode: false,

        _beforeInit: function () {
            BaseApprovalFormItemComponent.superclass._beforeInit.apply(this);
            if (!this.enable) {
                this.viewMode = true;
            }
            this.el.containerTd = $(this.containerTdEl);
        },

        _init: function () {
            BaseApprovalFormItemComponent.superclass._init.apply(this);

            if (this.viewMode) {
                this.renderViewElement();
            } else {
                this.renderNormalElement();
            }
            this.renderError();
            this.setRelationTitleElement(this.relationTitleEl);
            this.setRequired(this.required);
        },

        _afterInit: function () {
            BaseApprovalFormItemComponent.superclass._afterInit.apply(this);
            this._initValue();
        },

        _initEvents: function () {
            if (this.formItemWidget) {
                this.formItemWidget.on('extra-errors', this.getExtraErrors, this);
                this.formItemWidget.on('validity-change', this.onValidityChange, this);
                this.formItemWidget.on('change', this.onChange, this);
            }
        },

        _initValue: function () {
            if (this.formItemWidget) {
                this.formItemWidget.lastValue = this.value;
            }
            this.setValue(this.value, true);
        },

        renderNormalElement: function () {
            this.formItemWidget = this.getOriginalFormItemWidget();
        },

        renderViewElement: function () {
            this.el.textView = $('<div class="approval-form-viewMode-text" />').appendTo(this.el.target);
        },

        onChange: function (value, oldValue) {
            this.fireEvent('change', this, value, oldValue);
        },

        getOriginalFormItemWidget: Hamster.EMPTY_FUNCTION,

        setRelationTitleElement: function (element) {
            if (Hamster.isEmpty(element)) {
                return
            }
            this.el.relationTitleEl = element;
            this.el.relationTitleEl.addClass('title');
            this.setTitle(this.title);
        },

        setTitle: function (title) {
            this.title = title;
            if (!Hamster.isEmpty(this.el.relationTitleEl)) {
                this.el.relationTitleEl.html('<span class="approval-form-item-title">' + title + '</span>')
            }
        },

        getTitle: function () {
            return this.title
        },

        setRequired: function (required) {
            this.required = required;
            if (!Hamster.isEmpty(this.el.relationTitleEl)) {
                this.el.relationTitleEl.toggleClass('required', required);
            }
            if (this.formItemWidget) {
                this.formItemWidget.setRequired(required);
            }
        },

        isRequired: function () {
            return this.required
        },

        getValue: function () {
            if (this.viewMode) {
                return this.getViewModeValue();
            }
            var value = this.getEditModeValue();
            return Hamster.isDefined(value) ? value : null;
        },

        getViewModeValue: function () {
            return Hamster.isDefined(this.value) ? this.value : null;
        },

        getEditModeValue: function () {
            if (this.formItemWidget) {
                return this.formItemWidget.getValue()
            }
            return null
        },

        checkValueLegal: function (value) {
            return !Hamster.isEmpty(value, true)
        },

        setValue: function (value, suspendCheckChange) {
            if (!this.checkValueLegal(value)) {
                return;
            }
            if (this.viewMode) {
                this.setViewModeValue(value, suspendCheckChange);
                return;
            }
            this.setEditModeValue(value, suspendCheckChange);
        },

        setViewModeValue: function (value, suspendCheckChange) {
            this.value = value;
            suspendCheckChange && (this.suspendCheckChange = true);
            this.el.textView && this.el.textView.text(this.formatViewModeValue(value));
            suspendCheckChange && (this.suspendCheckChange = false);
        },

        formatViewModeValue: function (value) {
            return Hamster.isEmpty(value) ? "" : value;
        },

        setEditModeValue: function (value, suspendCheckChange) {
            this.value = value;

            if (this.formItemWidget) {
                suspendCheckChange && (this.formItemWidget.suspendCheckChange = true);
                this.formItemWidget.setValue(value);
                suspendCheckChange && (this.formItemWidget.suspendCheckChange = false);
            } else {
                suspendCheckChange && (this.suspendCheckChange = true);
                this.checkChange();
                suspendCheckChange && (this.suspendCheckChange = false);
            }
        },

        validate: function () {
            if (this.formItemWidget) {
                return this.formItemWidget.validate()
            }

            var isValid = this.isValid();
            if (isValid !== this.wasValid) {
                this.wasValid = isValid;
                this.onValidityChange(isValid);
            }
            return isValid
        },

        checkChange: function () {
            if (this.suspendCheckChange) {
                return
            }
            var newVal = this.getValue(),
                oldVal = this.lastValue;

            if (!this.isEqual(newVal, oldVal) && !this.isDestroyed) {
                this.lastValue = newVal;
                this.onChange(this, newVal, oldVal);
                this.validate();
            }
        },

        isValid: function () {
            return this.isEnabled() ? this.validateValue() : true;
        },

        validateValue: function () {
            return Hamster.isEmpty(this.getErrors())
        },

        onValidityChange: function (validity) {
            this.el.containerTd.toggleClass('error', !validity);
            if (validity) {
                this.el.error.detach();
            } else {
                this.el.target.after(this.el.error);
            }
        },

        isEqual: function (value1, value2) {
            return String(value1) === String(value2)
        },

        checkValueEmpty: function (value) {
            return Hamster.isEmpty(value)
        },

        getErrors: function () {
            if (this.formItemWidget) {
                return this.formItemWidget.getErrors()
            }

            var extraErrors = [];
            if (!Hamster.isEmpty(this.validateConfig)) {
                extraErrors = this.getExtraErrors() || []
            }

            var value = this.getValue();
            var errorTexts = [];
            if (this.required && this.checkValueEmpty(value)) {
                errorTexts.push(this.emptyErrorText);
            }
            return Hamster.Array.merge(errorTexts, extraErrors)
        },

        getExtraErrors: function (extraErrorsSetFn) {
            var errors = [];
            var config = this.validateConfig;
            var value = this.getValue();

            if (!Hamster.isEmpty(config)) {
                if (Hamster.isObject(config.length)) {
                    var min = config.length.min,
                        max = config.length.max;

                    var lengthError = this.getValueLengthError(value, min, max);
                    if (!Hamster.isEmpty(lengthError)) {
                        errors.push(lengthError);
                    }
                } else if (Hamster.isObject(config.regex)) {
                    var regexError = this.getValueRegexError(value, config.regex);
                    if (!Hamster.isEmpty(regexError)) {
                        errors.push(regexError);
                    }

                } else if (Hamster.isArray(config.relates) && !Hamster.isEmpty(config.relates)) {
                    Hamster.Array.forEach(config.relates, function (relate) {
                        var relateValue, relateTitle;
                        if (!Hamster.isEmpty(relate.widgetName)) {
                            var widget = this.form.getFormItemWidgetByName(relate.widgetName, 0);
                            if (!Hamster.isEmpty(widget)) {
                                relateValue = widget.getValue();
                                relateTitle = widget.getTitle();
                            }
                        } else {
                            relateValue = relate.comparisonValue;
                        }
                        if (!Hamster.isEmpty(relateValue)) {
                            var error = this.getValueRelateError(value, relateValue, relateTitle, relate.judge);
                            if (!Hamster.isEmpty(error)) {
                                errors.push(error)
                            }
                        }
                    }, this);
                }
            }

            if (Hamster.isFunction(extraErrorsSetFn)) {
                extraErrorsSetFn(errors);
                return
            }
            return errors
        },

        getValueLengthError: function (value, min, max) {
            return null
        },

        getValueRegexError: function (value, regex) {
            return null
        },

        getValueRelateError: function (value, relateValue, relateTitle, judge) {
            return []
        },

        getStringValueRelateError: function (value, relateValue, relateTitle, judge) {
            var error;
            var endTip = Hamster.isEmpty(relateTitle) ? relateValue : Hamster.String.format('{0}的值', relateTitle);

            switch (judge) {
                case '=':
                    if (value != relateValue) {
                        error = Hamster.String.format('该值必须等于{0}', endTip);
                    }
                    break;
                case '^':
                    if (!Hamster.String.startsWith(value, relateValue)) {
                        error = Hamster.String.format('该值必须以{0}开头', endTip);
                    }
                    break;
                case '$':
                    if (!Hamster.String.endsWith(value, relateValue)) {
                        error = Hamster.String.format('该值必须以{0}结尾', endTip);
                    }
                    break;
                case '*':
                    if (!Hamster.String.has(value, relateValue)) {
                        error = Hamster.String.format('该值必须包含{0}', endTip);
                    }
                    break;
                default:
            }
            return error
        },

        getNumberValueRelateError: function (value, relateValue, relateTitle, judge) {
            var error;
            var endTip = Hamster.isEmpty(relateTitle) ? relateValue : Hamster.String.format('{0}的值', relateTitle);

            value = parseFloat(value);
            relateValue = parseFloat(relateValue);

            switch (judge) {
                case '=':
                    if (value != relateValue) {
                        error = Hamster.String.format('该值必须等于{0}', endTip);
                    }
                    break;
                case '>':
                    if (value > relateValue) {
                        error = Hamster.String.format('该值必须大于{0}', endTip);
                    }
                    break;
                case '<':
                    if (value < relateValue) {
                        error = Hamster.String.format('该值必须小于{0}', endTip);
                    }
                    break;
                case '>=':
                    if (value >= relateValue) {
                        error = Hamster.String.format('该值必须大于或等于{0}', endTip);
                    }
                    break;
                case '<=':
                    if (value >= relateValue) {
                        error = Hamster.String.format('该值必须小于或等于{0}', endTip);
                    }
                    break;
                default:
            }
            return error
        },

        getDateTimeValueRelateError: function (value, relateValue, relateTitle, judge) {
            var error;
            var endTip = Hamster.isEmpty(relateTitle) ? relateValue : Hamster.String.format('{0}的值', relateTitle);

            switch (judge) {
                case '=':
                    if (!moment(value).isSame(relateValue)) {
                        error = Hamster.String.format('该值必须等于{0}', endTip);
                    }
                    break;
                case '>':
                    if (moment(value).isBefore(relateValue) || moment(value).isSame(relateValue)) {
                        error = Hamster.String.format('该值必须大于{0}', endTip);
                    }
                    break;
                case '<':
                    if (moment(value).isAfter(relateValue) || moment(value).isSame(relateValue)) {
                        error = Hamster.String.format('该值必须小于{0}', endTip);
                    }
                    break;
                case '>=':
                    if (moment(value).isBefore(relateValue)) {
                        error = Hamster.String.format('该值必须大于或等于{0}', endTip);
                    }
                    break;
                case '<=':
                    if (moment(value).isAfter(relateValue)) {
                        error = Hamster.String.format('该值必须小于或等于{0}', endTip);
                    }
                    break;
                default:
            }
            return error
        },

        renderError: function () {
            this.el.error = $('<div class="approval-form-item-error"><i></i></div>');
            this.el.error.tooltipster({
                side: 'right',
                trigger: 'hover',
                animation: 'fade',
                delay: 200,
                contentAsHTML: true,
                content: true,
                functionFormat: this.formatErrorForTooltip.bind(this)
            });
        },

        formatErrorForTooltip: function (instance, helper, content) {
            var errors = this.getErrors() || [];
            return Hamster.Array.map(errors, function (error) {
                return '<span>' + error + '</span>'
            }, this);
        },

        setVisible: function (visible) {
            BaseApprovalFormItemComponent.superclass.setVisible.apply(this, arguments);

            if (!Hamster.isEmpty(this.el.relationTitleEl)) {
                this.el.relationTitleEl.toggleClass('approval-form-row-column-empty', !this.visible);
                // if (this.visible) {
                //     this.el.relationTitleEl.show();
                // } else {
                //     this.el.relationTitleEl.hide();
                // }
            }
            this.el.containerTd.toggleClass('approval-form-row-column-empty', !this.visible);
            // if (this.visible) {
            //     this.el.containerTd.show();
            // } else {
            //     this.el.containerTd.hide();
            // }

            var rowColumnsIsAllHidden = true;
            this.el.containerTd.closest('tr').find('td').each(function () {
                if (!$(this).hasClass('approval-form-row-column-empty')) {
                    rowColumnsIsAllHidden = false;
                    return false;
                }
            });
            var rowElement = this.el.containerTd.closest('.approval-form-row');
            rowElement.toggleClass('approval-form-row-hidden', rowColumnsIsAllHidden);
        },

        // setEnable: function (enable) {
        //     BaseApprovalFormItemComponent.superclass.setEnable.apply(this, arguments);
        //     this.el.containerTd.toggleClass('approval-form-row-column-disable', !enable);
        // },

        destroy: function () {
            if (!Hamster.isEmpty(this.el.error)) {
                this.el.error.remove();
            }
            this.formItemWidget && this.formItemWidget.destroy();
            this.el.containerTd.addClass('approval-form-row-column-disable');
        }

    });

    /**
     * 审批业务只读组件
     * */
    var ApprovalBizReadonly = Class.create({

        extend: BaseApprovalFormItemComponent,

        extClsList: ['approval-form-readonly'],

        value: '',

        type: '',

        canEdit: false,

        isBizWidget: true,

        _beforeInit: function () {
            ApprovalBizReadonly.superclass._beforeInit.apply(this);
            if (this.canEdit) {
                this.required = true;
            }
        },

        renderNormalElement: function () {
            if (this.canEdit) {
                ApprovalBizReadonly.superclass.renderNormalElement.apply(this);
            } else {
                this.el.text = $('<span class="approval-form-single-text"/>').appendTo(this.el.target);
            }
        },

        getOriginalFormItemWidget: function () {
            this.input = new Hamster.ui.FormInput({
                appendToEl: this.el.target,
                required: this.required,
                preventErrorMark: true,
                changeOnBlur: false
            });
            return this.input;
        },

        setEditModeValue: function (value) {
            this.value = value;
            if (this.canEdit) {
                this.input.setValue(value);
            } else {
                this.el.text.text(value)
            }
        },

        getValue: function () {
            if (this.viewMode) {
                return this.value
            }
            if (this.canEdit) {
                return ApprovalBizReadonly.superclass.getValue.apply(this);
            }
            return this.value
        },

        validate: function () {
            if (this.canEdit) {
                return ApprovalBizReadonly.superclass.validate.apply(this);
            }
            return true
        }
    });
    ApprovalFormItemFactory.register('biz', ApprovalBizReadonly);

    /**
     * 审批单行文本输入组件
     * */
    var ApprovalTextInput = Class.create({

        extend: BaseApprovalFormItemComponent,

        extClsList: ['approval-form-input'],

        format: '',

        value: '',

        valueType: '',

        placeholder: '',

        isInput: true,

        getOriginalFormItemWidget: function () {
            this.input = new Hamster.ui.FormInput({
                appendToEl: this.el.target,
                placeholder: this.placeholder,
                required: this.required,
                preventErrorMark: true,
                changeOnBlur: true
            });
            return this.input;
        },

        getValueLengthError: function (value, min, max) {
            if (!Hamster.isString(value)) {
                return
            }
            value = Hamster.value(value, '');

            if (value.length < min) {
                return '长度不能小于min'
            } else if (value.length > max) {
                return '长度不能大于max'
            }
        },

        getValueRegexError: function (value, regex) {
            if (!Hamster.isString(value)) {
                return
            }
            value = Hamster.value(value, '');

            if (!regex.val.test(value)) {
                return regex.tip
            }
        },

        getValueRelateError: function (value, relateValue, relateTitle, judge) {
            return this.getStringValueRelateError(value, relateValue, relateTitle, judge);
        }

    });
    ApprovalFormItemFactory.register('text', ApprovalTextInput);

    /**
     * 审批数字输入组件
     * */
    var ApprovalNumberInput = Class.create({

        extend: BaseApprovalFormItemComponent,

        extClsList: ['approval-form-number'],

        placeholder: '',

        value: '',

        valueType: '',

        isInput: true,

        getOriginalFormItemWidget: function () {
            this.input = new Hamster.ui.FormNumberInput({
                appendToEl: this.el.target,
                placeholder: this.placeholder,
                required: this.required,
                decimalPrecision: this.decimals.length,
                allowDecimals: this.decimals.enabled,
                preventErrorMark: true,
                changeOnBlur: true
            });
            return this.input;
        },

        getValueRelateError: function (value, relateValue, relateTitle, judge) {
            return this.getNumberValueRelateError(value, relateValue, relateTitle, judge);
        }

    });
    ApprovalFormItemFactory.register('number', ApprovalNumberInput);

    /**
     * 审批金额输入组件
     * */
    var ApprovalMoneyInput = Class.create({

        extend: BaseApprovalFormItemComponent,

        extClsList: ['approval-form-money'],

        placeholder: '',

        value: '',

        valueType: '',

        isInput: true,

        getOriginalFormItemWidget: function () {
            this.input = new Hamster.ui.FormMoneyInput({
                appendToEl: this.el.target,
                placeholder: this.placeholder,
                required: this.required,
                preventErrorMark: true,
                changeOnBlur: true
            });
            return this.input;
        },

        getValueRelateError: function (value, relateValue, relateTitle, judge) {
            return this.getNumberValueRelateError(value, relateValue, relateTitle, judge);
        }

    });
    ApprovalFormItemFactory.register('money', ApprovalMoneyInput);

    /**
     * 审批多行文本输入控件
     * */
    var ApprovalTextArea = Class.create({

        extend: BaseApprovalFormItemComponent,

        extClsList: ['approval-form-textarea'],

        isTextArea: true,

        isInput: true,

        placeholder: '',

        value: '',

        valueType: '',

        getOriginalFormItemWidget: function () {
            this.input = new Hamster.ui.FormTextArea({
                appendToEl: this.el.target,
                placeholder: this.placeholder,
                required: this.required,
                preventErrorMark: true,
                changeOnBlur: false
            });
            this.input.el.target.addClass('ui-textarea-noborder');
            return this.input;
        }

    });
    ApprovalFormItemFactory.register('textarea', ApprovalTextArea);

    /**
     * 审批时间选择组件
     * */
    var ApprovalDateTime = Class.create({

        extend: BaseApprovalFormItemComponent,

        extClsList: ['approval-form-datetime'],

        placeholder: '',

        getOriginalFormItemWidget: function () {
            this.input = new Hamster.ui.FormDateTime({
                appendToEl: this.el.target,
                value: this.value,
                chooseType: this.format == 'yyyy-MM-dd HH:mm' ? 'datetime' : 'date',
                format: this.format,
                placeholder: this.placeholder,
                preventErrorMark: true
            });
            return this.input;
        },

        getValueRelateError: function (value, relateValue, relateTitle, judge) {
            return this.getDateTimeValueRelateError(value, relateValue, relateTitle, judge);
        },

        setValue: function (value, suspendCheckChange) {
            if (!Hamster.isEmpty(value)) {
                var _momentDate = moment(value);
                var _momentFormat = this.format == 'yyyy-MM-dd HH:mm' ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD";
                value = _momentDate.format(_momentFormat);
            }
            ApprovalDateTime.superclass.setValue.apply(this, [value, suspendCheckChange]);
        }

    });
    ApprovalFormItemFactory.register('datetime', ApprovalDateTime);

    /**
     * 审批弹出选择组件
     * */
    var ApprovalTriggerSelect = Class.create({

        extend: BaseApprovalFormItemComponent,

        extClsList: ['approval-form-select-trigger'],

        placeholder: '',

        value: [],

        datasource: {
            table: {
                searchItems: [],
                name: [],
                tableColumns: [],
                paging: {}
            },
            type: 'table',
            block: null
        },
        filterquery:{
            conditions:[]
        },
        multiSelect: false,

        valueField: 'value',

        displayField: 'text',

        getOriginalFormItemWidget: function () {
            var blockName = this.datasource.type == 'table' ? "approval-datasource-table" : this.datasource.block;
            var blockOptions = this.datasource.type == 'table' && this.datasource.table || {};
            blockOptions.multiSelect = this.multiSelect;
            this.triggerSelect = new Hamster.ui.TriggerSelect({
                appendToEl: this.el.target,
                selectDialogTitle: this.title,
                placeholder: this.placeholder,
                value: this.value,
                valueField: this.valueField,
                displayField: this.displayField,
                execBlockName: blockName,
                execBlockOptions: blockOptions,
                filterquery: this.filterquery,
                preventErrorMark: true
            });
            return this.triggerSelect;
        },

        checkValueLegal: function (value) {
            if (this.multiSelect && Hamster.isArray(value)) {
                return true
            } else if (!this.multiSelect && Hamster.isObject(value)) {
                return true
            }
            return false
        },

        formatViewModeValue: function (value) {
            var values = Hamster.Array.from(value);
            return Hamster.Array.map(values, function (record) {
                return record.text
            }, this).join(', ')
        },

        setEditModeValue: function (value, suspendCheckChange) {
            var values = Hamster.isEmpty(value) ? [] : Hamster.Array.from(value);
            var records = [];
            Hamster.Array.forEach(values, function (record) {
                if (Hamster.isObject(record) && Hamster.isObject(record.record)) {
                    records.push(Hamster.clone(record.record));
                }
            }, this);
            ApprovalTriggerSelect.superclass.setEditModeValue.apply(this, [records, suspendCheckChange]);
        },

        getEditModeValue: function () {
            var value_records = this.triggerSelect.getValue();
            var values = Hamster.Array.map(value_records, function (record) {
                var _record = {};
                _record.value = record[this.valueField];
                _record.text = record[this.displayField];
                _record.record = Hamster.clone(record);
                return _record;
            }, this);
            return this.multiSelect ? values : values[0];
        }

    });
    ApprovalFormItemFactory.register('triggerselect', ApprovalTriggerSelect);

    /**
     * 审批弹出选择组件的数据源选择面板
     * */
    var TriggerSelectDefaultChoosePanel = Class.create({

        statics: {
            getContentDialogSize: function () {
                return {
                    width: 800,
                    height: 600
                }
            }
        },

        extend: Component,

        filterquery:{},

        name: '',

        searchItems: [],

        tableColumns: [],

        paging: {},

        multiSelect: true,

        _beforeInit: function () {
            TriggerSelectDefaultChoosePanel.superclass._beforeInit.apply(this);
            this._fields = [];
        },

        _init: function () {
            TriggerSelectDefaultChoosePanel.superclass._init.apply(this);
            this._initFilterForm();
            console.log(this.widgetMap);
            this._createServerDataTable();
        },

        _initFilterForm: function () {
            // this.el.filter_box = $('<div class="filter-box"/>').appendTo(this.el.target);
            this.el.filter_box = $('<form class="filter-box"/>').appendTo(this.el.target);
            this.el.filter_form = $('<div class="filter-form g-row g-row-padding"/>').appendTo(this.el.filter_box);
            this.el.filter_actions = $('<div class="filter-actions"/>').appendTo(this.el.filter_box);

            Hamster.Array.forEach(this.searchItems, function (item) {
                this._createFilterField(item);
            }, this);

            new Hamster.ui.Button({
                appendToEl: this.el.filter_actions,
                title: '搜索',
                icon: 'ui-icon-filter',
                submit: true,
                handler: this._onFilterBtnClick.bind(this)
            });

            new Hamster.ui.Button({
                appendToEl: this.el.filter_actions,
                title: '重置',
                handler: this._onClearBtnClick.bind(this)
            });
        },

        _initEvents: function () {
            TriggerSelectDefaultChoosePanel.superclass._initEvents.apply(this);
            this.el.filter_box.submit(function () {
                return false
            });
        },

        _createFilterField: function (item) {
            var columnElement = $('<div class="g-col-4"></div>').appendTo(this.el.filter_form);
            var fieldElement = $('<div class="ui-form-field"><label class="ui-form-field-label"></label><div class="ui-form-field-content"></div></div>').appendTo(columnElement);
            fieldElement.find('label.ui-form-field-label').text(item.title + ":");

            var inputWidget = new Hamster.ui.FormInput({
                widgetName: item.field,
                appendToEl: fieldElement.find('.ui-form-field-content')
            });
            this._fields.push(inputWidget);
        },

        _createServerDataTable: function () {
            var columns = Hamster.Array.map(this.tableColumns, function (column) {
                return {data: column.field, title: column.title}
            }, this);
            this._serverDataTable = new Hamster.ui.ServerDataTable({
                appendToEl: this.el.target,
                extClsList: ['ui-data-grid-border-t'],
                border: false,
                url: 'datasource/rest/triggerselect',
                paging: this.paging.enable,
                pageSize: this.paging.pageSize,
                multiSelect: this.multiSelect,
                columns: columns,
                tableAutoWidth: false,
                onGetMoreSendPrams: this._onGetMoreServerParams.bind(this),
                height: 510 - this.el.filter_box.outerHeight()
            });
            this._serverDataTable.on('single-select-row-dblclick', this.onSingleSelectRowDblclick.bind(this));
        },

        _onGetMoreServerParams: function () {
            var query = {};
            Hamster.Array.forEach(this._fields, function (fieldWidget) {
                query[fieldWidget.getWidgetName()] = fieldWidget.getValue()
            }, this);
            //这个地方需要获取表单中其他的过滤信息
            return {table: this.name, query: query};
        },

        _onClearBtnClick: function () {
            Hamster.Array.forEach(this._fields, function (fieldWidget) {
                fieldWidget.clear();
            }, this);
            this._serverDataTable.reload();
        },

        _onFilterBtnClick: function () {
            this._serverDataTable.reload();
        },

        onSingleSelectRowDblclick: function () {
            this.triggerEvent('selected-over');
        },

        getSelected: function () {
            return this._serverDataTable.getSelected();
        },

        destroy: function () {
            this._loader && this._loader.destroy();
            this._serverDataTable && this._serverDataTable.destroy();
            TriggerSelectDefaultChoosePanel.superclass.destroy.apply(this, arguments);
        }
    });
    Hamster.ui.TriggerSelect.registerChooseComp('approval-datasource-table', TriggerSelectDefaultChoosePanel);

    /**
     * 审批下拉选择组件
     * */
    var ApprovalCombo = Class.create({

        extend: BaseApprovalFormItemComponent,

        extClsList: ['approval-form-select'],

        title: '',

        visible: true,

        placeholder: '',

        value: '',

        items: [],

        sourceType: 'custom',

        multi: false,

        _beforeInit: function () {
            ApprovalMoneyInput.superclass._beforeInit.apply(this);
            this.multi = this.xtype == 'multiselect';

            this.valueField = 'value';
            this.displayField = 'text';
            this._isLocal = this.sourceType == 'custom';
        },

        getOriginalFormItemWidget: function () {
            this.combo = new Hamster.ui.ComboBox({
                appendToEl: this.el.target,
                pickerWidth: 200,
                placeholder: this.placeholder,
                valueField: this.valueField,
                displayField: this.displayField,
                items: this.items,
                required: this.required,
                preventErrorMark: true

                // async: true,
                // url: 'api/datasource/combo',
                // params: {
                //     table: 'ds_customer',
                //     field: 'name',
                //     keyword: ''
                // },
                // searchable: false,
                // searchField: 'keyword',
                // formatServerLoaderResult: function (result) {
                //     return result.data
                // },
                // value: '0001,0002'
            });
            return this.combo;
        },

        _initEvents: function () {
            ApprovalMoneyInput.superclass._initEvents.apply(this);

            if (!this.viewMode) {
                this.combo.on('select', function (widget, record) {
                    this.fireEvent('select', this, record);
                }, this);
            }
        },

        checkValueLegal: function (value) {
            if (this.multi && Hamster.isArray(value)) {
                return true
            } else if (!this.multi && Hamster.isObject(value)) {
                return true
            }
            return false
        },

        formatViewModeValue: function (value) {
            var records = [];
            value = Hamster.Array.from(value);
            Hamster.Array.forEach(value, function (record) {
                if (Hamster.isEmpty(record)) {
                    return
                }
                records.push(record.text)
            }, this);

            return records.join(', ')
        },

        setEditModeValue: function (value, suspendCheckChange) {
            if (Hamster.isEmpty(value)) {
                return;
            }
            var records = [];
            value = Hamster.Array.from(value);
            Hamster.Array.forEach(value, function (record) {
                if (Hamster.isEmpty(record)) {
                    return
                }
                if (Hamster.isObject(record) && Hamster.isObject(record.record)) {
                    var _record = Hamster.clone(record.record);
                    records.push(_record)
                }
            }, this);
            ApprovalCombo.superclass.setEditModeValue.apply(this, [records, suspendCheckChange]);
        },

        getEditModeValue: function () {
            var selecteds = Hamster.Array.from(this.combo.getSelected());
            var values = Hamster.Array.map(selecteds, function (record) {
                var item = {};
                item.value = record[this.valueField];
                item.text = record[this.displayField];
                var _record = Hamster.clone(record);
                if (this._isLocal) {
                    delete _record.selected;
                    delete _record.relies;
                }
                item.record = _record;
                return item;
            }, this);
            return this.multi ? values : values[0];
        },

        checkIsChooseOnRecord: function (record) {
            var valueRecord = this.getValue();
            return record.value == (valueRecord && valueRecord.value);
        }

    });
    ApprovalFormItemFactory.register('select', ApprovalCombo);
    ApprovalFormItemFactory.register('multiselect', ApprovalCombo);

    /**
     * 审批多选框组件
     * */
    var ApprovalCheckboxGroup = Class.create({

        extend: BaseApprovalFormItemComponent,

        extClsList: ['approval-form-checkboxgroup'],

        getOriginalFormItemWidget: function () {
            this.checkboxGroup = new Hamster.ui.FormCheckboxGroup({
                appendToEl: this.el.target,
                required: this.required,
                items: Hamster.clone(this.items),
                preventErrorMark: true
            });
            return this.checkboxGroup;
        },

        formatViewModeValue: function (value) {
            var displayValues = [];
            var records = Hamster.Array.from(value);
            Hamster.Array.forEach(records, function (record) {
                if (Hamster.isEmpty(record) || Hamster.isEmpty(record.text)) {
                    return;
                }
                displayValues.push(record.value)
            }, this);
            return displayValues.join(', ')
        },

        setEditModeValue: function (value, suspendCheckChange) {
            var records = Hamster.Array.from(value);
            var values = Hamster.Array.map(records, function (record) {
                return record && record.value || null;
            }, this);
            ApprovalCheckboxGroup.superclass.setEditModeValue.apply(this, [values, suspendCheckChange]);
        },

        getEditModeValue: function () {
            var records = this.checkboxGroup.getSelected();
            if (Hamster.isEmpty(records)) {
                return [];
            }
            return Hamster.Array.map(records, function (record) {
                var _record = {};
                _record.text = record.text;
                _record.value = record.value;
                _record.record = {};
                return _record
            }, this);
        }

    });
    ApprovalFormItemFactory.register('checkboxgroup', ApprovalCheckboxGroup);

    /**
     * 审批单选框组件
     * */
    var ApprovalRadioGroup = Class.create({

        extend: BaseApprovalFormItemComponent,

        extClsList: ['approval-form-radiogroup'],

        getOriginalFormItemWidget: function () {
            this.radioGroup = new Hamster.ui.FormRadioGroup({
                appendToEl: this.el.target,
                required: this.required,
                items: Hamster.clone(this.items),
                preventErrorMark: true
            });
            return this.radioGroup;
        },

        _initEvents: function () {
            ApprovalRadioGroup.superclass._initEvents.apply(this);

            if (!this.viewMode) {
                this.radioGroup.on('select', function (widget, record) {
                    this.fireEvent('select', this, record);
                }, this)
            }
        },

        formatViewModeValue: function (record) {
            if (Hamster.isEmpty(record)) {
                return ""
            }
            return record.text
        },

        setEditModeValue: function (value, suspendCheckChange) {
            if (Hamster.isArray(value)) {
                value = value[0];
            }
            if (!Hamster.isEmpty(value)) {
                value = value.value;
            }
            ApprovalRadioGroup.superclass.setEditModeValue.apply(this, [value, suspendCheckChange]);
        },

        getEditModeValue: function () {
            var record = this.radioGroup.getSelected();
            if (Hamster.isEmpty(record)) {
                return null;
            }
            var _record = {};
            _record.text = record.text;
            _record.value = record.value;
            _record.record = {};
            return _record;
        },

        checkIsChooseOnRecord: function (record) {
            var valueRecord = this.getValue();
            return record.value == (valueRecord && valueRecord.value);
        }

    });
    ApprovalFormItemFactory.register('radiogroup', ApprovalRadioGroup);

    /**
     * 审批文件上传组件
     * */
    var ApprovalFileUpload = Class.create({

        extend: BaseApprovalFormItemComponent,

        isFileUpload: true,

        extClsList: ['approval-form-fileupload'],

        emptyErrorText: "至少上传一个文件",

        allowMulti: false,

        uploadAccept: null,

        triggerButtonTitle: '选择文件',

        triggerButtonIcon: 'ui-icon-paper-clip',

        _beforeInit: function () {
            ApprovalFileUpload.superclass._beforeInit.apply(this);

            this.uploading = false;
            this.fileElements = {};
            this.fileStore = new Hamster.utils.ArrayList(function (record) {
                return record.attrId;
            });
        },

        renderNormalElement: function () {
            ApprovalFileUpload.superclass.renderNormalElement.apply(this);

            this.el.header = $('<div class="approval-form-fileupload-header"/>').appendTo(this.el.target);
            this.el.body = $('<div class="approval-form-fileupload-body" />').appendTo(this.el.target);
            this.el.list = $('<ul class="approval-form-fileupload-results" />').appendTo(this.el.body);

            this.uploadButton = new Hamster.ui.UploadButton({
                appendToEl: this.el.header,
                title: this.triggerButtonTitle,
                icon: this.triggerButtonIcon,
                multiUpload: this.allowMulti,
                uploadOptions: {
                    url: g.ctx + 'bill/file/rest/upload',
                    accept: this.uploadAccept,
                    fileSingleSizeLimit: 200 * 1024 * 1024
                }
            });
        },

        renderViewElement: function () {
            ApprovalFileUpload.superclass.renderViewElement.apply(this);

            this.el.body = $('<div class="approval-form-fileupload-body" />').appendTo(this.el.target);
            this.el.list = $('<ul class="approval-form-fileupload-results" />').appendTo(this.el.body);
        },

        _initEvents: function () {
            if (!this.viewMode) {
                this.uploadButton.on('single-upload-before-queued', this.onFileBeforeQueued, this);
                this.uploadButton.on('single-upload-start', this.onStartSingleUpload, this);
                this.uploadButton.on('single-upload-failure', this.onSingleUploadFailure, this);
                this.uploadButton.on('single-upload-progress', this.onSingleUploadProgress, this);
                this.uploadButton.on('single-upload-success', this.onSingleUploadSuccess, this);
                this.uploadButton.on('single-upload-exceed-size-limit-error', this.onSingleUploadExceedSizeLimitError, this);
                this.uploadButton.on('multi-files-confirm-finished', this.onMultiFilesConfirmFinished, this);
                this.uploadButton.on('multi-files-close-dialog-on-uploading', this.onMultiFilesCloseDialogOnUploading, this);
                this._bindDelegateEvent(this.el.list, 'span.approval-form-fileupload-item-remove', 'click', 'onFileDisplayItemRemoveClick');
            } else {
                this._bindDelegateEvent(this.el.list, 'i.download', 'click', 'onFileDownloadBtnClick');
            }
        },

        onFileBeforeQueued: function (file) {
            if (this.uploading) {
                layer.open({
                    title: '温馨提示',
                    content: '有文件正在上传中!',
                    icon: 2
                });
            }
            return !(!!this.uploading);
        },

        onStartSingleUpload: function (file) {
            this.uploading = true;
            this.fileElements = {};
            this.fileStore.clear();
            this.el.list.empty();

            var record = this.formatResultRecordFromFile(file);
            this.createFileDisplayItem(record);
        },

        onSingleUploadProgress: function (file, percentage) {
            var itemElement = this.fileElements[file.id];
            itemElement.find('span.approval-form-fileupload-item-progress').width(200 * percentage);
        },

        onSingleUploadSuccess: function (file, result) {
            var itemElement = this.fileElements[file.id];
            itemElement.find('span.approval-form-fileupload-item-progress').hide();

            var record = this.formatResultRecord(result);
            this.fileStore.removeAtKey(file.id);
            this.fileStore.push(record);
            this.uploading = false;
            this.checkChange();
        },

        onSingleUploadFailure: function (file) {
            this.uploading = false;
            layer.open({
                title: '温馨提示',
                content: '文件上传失败!',
                icon: 2
            });
        },

        onSingleUploadExceedSizeLimitError: function () {
            this.uploading = false;
            layer.open({
                title: '温馨提示',
                content: '文件大小超出范围!',
                icon: 2
            });
        },

        onFileDisplayItemRemoveClick: function (element) {
            if (this.allowMulti) {
                var itemElement = element.closest('li');
                var fileId = itemElement.attr('data-attr-id');
                itemElement.remove();
                this.fileStore.removeAtKey(fileId);
                delete this.fileElements[fileId];
            } else {
                this.fileElements = {};
                this.fileStore.clear();
                this.el.list.empty();
                this.uploading = false;
            }
            this.checkChange();
        },

        onMultiFilesConfirmFinished: function (results) {
            Hamster.Array.forEach(results, function (record) {
                record = this.formatResultRecord(record);
                this.createFileDisplayItem(record);
            }, this);
            this.checkChange();
        },

        onMultiFilesCloseDialogOnUploading: function () {
            layer.open({
                title: '温馨提示',
                content: '文件正在上传中,不能关闭!',
                icon: 2
            });
        },

        formatResultRecordFromFile: function (file) {
            var _record = {};
            _record.unuploaded = true;
            _record.name = file.name;
            _record.size = file.size;
            _record.attrId = file.id;
            _record.type = file.ext;
            _record.file = file;
            return _record;
        },

        formatResultRecord: function (record) {
            var _record = {};
            _record.name = record.fileName;
            _record.size = record.fileSize;
            _record.attrId = record.id;
            _record.path = record.url;
            _record.type = record._originalFile.ext;
            _record.image = record.imageFlag;
            return _record;
        },

        createFileDisplayItem: function (record) {
            var itemTemplate = '<li class="approval-form-fileupload-item" data-attr-id="{0}">' +
                '<div class="approval-form-fileupload-item-content">{1}</div>' +
                '<div class="approval-form-fileupload-item-info">' +
                '<span class="name">{2}</span>' +
                '<small>{3}</small>' +
                '</div>' +
                (this.viewMode ? this.getFileToolbarHtml(record) : '') +
                (this.viewMode ? '' : '<span class="approval-form-fileupload-item-remove"></span>') +
                (this.viewMode ? '' : '<span class="approval-form-fileupload-item-progress"></span>') +
                '</li>';

            var itemHTML = Hamster.String.format(itemTemplate,
                record.attrId,
                this.getFileDisplayContentHtml(record),
                record.name,
                Hamster.String.format('文件大小: {0}', Hamster.utils.fileSize(record.size || 0)));

            var itemElement = $(itemHTML);

            this.fileElements[record.attrId] = itemElement;
            this.el.list.append(itemElement);
            this.fileStore.push(record);
        },

        getFileToolbarHtml: function (record) {
            return Hamster.String.format('<div class="approval-form-fileupload-toolbar"><i class="download" data-path="{0}"></i></div>',
                record.path
            );
        },

        getFileDisplayContentHtml: function (record) {
            var htmls = [];
            if (record.image) {
                htmls.push(Hamster.String.format('<img src="{0}"/>', record.path));
            } else {
                htmls.push(Hamster.String.format('<span>{0}</span>', (record.type || "").toUpperCase() || "未知"));
            }
            return htmls.join('');
        },

        onFileDownloadBtnClick: function (element) {
            var path = g.ctx + "bill/file/rest/download/" + element.attr('data-path');
            var a = $('<a href="' + path + '" target="_blank" style="display: none;">文件下载</a>');  //生成一个临时链接对象
            var d = a.get(0);
            var e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            d.dispatchEvent(e);
            a.remove();
        },

        initImageViewer: function () {
            var self = this;
            this.imageViewer = new Viewer(this.el.list[0], {
                navbar: false,
                zIndex: 10000999,
                fullscreen: false,
                transition: false,
                viewed: function () {
                    $('.viewer-canvas').click(function (e) {
                        if (e.target.className == 'viewer-canvas') {
                            self.imageViewer.hide();
                        }
                    });
                }
            });
        },

        setViewModeValue: function (value, suspendCheckChange) {
            this.value = value;
            suspendCheckChange && (this.suspendCheckChange = true);

            var records = Hamster.Array.from(value);
            Hamster.Array.forEach(records, function (record) {
                this.createFileDisplayItem(record)
            }, this);

            suspendCheckChange && (this.suspendCheckChange = false);
            this.initImageViewer();
        },

        setEditModeValue: function (value, suspendCheckChange) {
            var records = Hamster.Array.from(value);
            Hamster.Array.forEach(records, function (record) {
                this.createFileDisplayItem(record)
            }, this);

            ApprovalFileUpload.superclass.setEditModeValue.apply(this, [records, suspendCheckChange]);
        },

        getEditModeValue: function () {
            var files = this.fileStore.getOriginalArray();
            if (this.allowMulti) {
                return files
            }
            var file = files[0];
            if (!Hamster.isEmpty(file) && !file.unuploaded) {
                return file
            }
            return null
        },

        isEqual: function () {
            return false
        },

        destroy: function () {
            this.uploadButton && this.uploadButton.destroy();
            this.downloadIframe && this.downloadIframe.remove();
            this.imageViewer && this.imageViewer.destroy();
            ApprovalFileUpload.superclass.setVisible.apply(this, arguments);
        }

    });
    ApprovalFormItemFactory.register('fileupload', ApprovalFileUpload);

    var ApprovalImageUpload = Class.create({

        extend: ApprovalFileUpload,

        uploadAccept: {
            title: '选择图片文件',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/gif,image/jpg,image/jpeg,image/png,image/bmp'
        },

        triggerButtonTitle: '选择图片',

        triggerButtonIcon: 'ui-icon-picture'

    });
    ApprovalFormItemFactory.register('imageupload', ApprovalImageUpload);

    /**
     * 审批明细组组件中的合计组件
     * */
    var ApprovalDetailCalculate = Class.create({

        extend: BaseApprovalFormItemComponent,

        extClsList: ['approval-form-calculate'],

        isDetailCalculate: true,

        renderNormalElement: function () {
            this.el.text = $('<span class="approval-form-single-text"/>').appendTo(this.el.target);
        },

        setEditModeValue: function (value, suspendCheckChange) {
            this.value = value;
            this.el.text.text(value);
            ApprovalDetailCalculate.superclass.setEditModeValue.apply(this, [value, suspendCheckChange]);
        },

        getEditModeValue: function () {
            return this.value
        }

    });
    ApprovalFormItemFactory.register('detailcalculate', ApprovalDetailCalculate);

    /**
     * 审批明细组组件
     * */
    var ApprovalDetailGroup = Class.create({

        extend: BaseApprovalFormItemComponent,

        isDetailGroupWidget: true,

        extClsList: ['approval-form-detail-group'],

        items: [],

        defaultColumnWidth: 200,

        contentColumnWidthMap: {
            number: 100,
            money: 100,
            datetime: 150,
            select: 150,
            multiselect: 150
        },

        calculateColumnWidth: 120,

        listenBlurEventWidgetXTypes: ['text', 'textarea', 'number', 'money'],

        _beforeInit: function () {
            ApprovalDetailGroup.superclass._beforeInit.apply(this);

            var formRowElement = this.el.containerTd.closest('.approval-form-row');
            formRowElement.addClass('approval-form-row-margin');

            this.columnWidgetOptionsMap = {};
            this.contentWidgetItems = [];
            this.calculateWidgetItems = [];
            this.needSubTotalWidgetNames = [];

            this.subTotalColumnMap = {};
            this.widgetRows = new Hamster.utils.ArrayList();
            this.chooseCheckboxs = new Hamster.utils.ArrayList();
            this.hasQuickEntryButton = false;

            Hamster.Array.forEach(this.items, function (widgetOption) {
                if (!this.hasQuickEntryButton && widgetOption.xtype == "datetime") {
                    this.hasQuickEntryButton = true;
                }
                if (widgetOption.xtype == "detailcalculate") {
                    this.calculateWidgetItems.push(widgetOption);
                } else {
                    this.contentWidgetItems.push(widgetOption);
                }
                if (widgetOption.subtotal) {
                    this.needSubTotalWidgetNames.push(widgetOption.widgetName);
                }
                this.columnWidgetOptionsMap[widgetOption.widgetName] = widgetOption;
            }, this);
        },

        renderNormalElement: function () {
            this._initHeader();
            this._initDetailGroupBody();
            if (this.needSubTotalWidgetNames.length > 0) {
                this._initSubTotalRow();
            }
        },

        renderViewElement: function () {
            this.renderNormalElement()
        },

        _initHeader: function () {
            this.el.header = $('<div class="approval-form-detail-group-header"/>').appendTo(this.el.target);
            this.el.title = $('<div class="approval-form-detail-group-title"/>').text(this.title).appendTo(this.el.header);
            this.el.action_list = $('<div class="approval-form-detail-group-actions"/>').appendTo(this.el.header);

            if (this.viewMode) {
                return
            }

            this.addRowButton = new Hamster.ui.Button({
                appendToEl: this.el.action_list,
                title: '添加',
                icon: 'ui-icon-plus'
            });
            this.removeRowButton = new Hamster.ui.Button({
                appendToEl: this.el.action_list,
                title: '删除',
                icon: 'ui-icon-delete'
            });

            if (this.hasQuickEntryButton) {
                this.quickEntryButton = new Hamster.ui.Button({
                    appendToEl: this.el.action_list,
                    title: "快速录入",
                    icon: "ui-icon-hdd"
                })
            }
        },

        _initDetailGroupBody: function () {
            this.el.body = $('<div class="approval-form-detail-group-body"/>').appendTo(this.el.target);
            this._initDetailGroupChooseBody();
            this._initDetailGroupTotalBody();
            this._initDetailGroupContentBody();
        },

        _initDetailGroupChooseBody: function () {
            var chooseBodyElement = $('<div class="approval-form-detail-group-fixed-left">' +
                '<table><colgroup><col style="width:50px;"/></colgroup><thead><tr><th class="checkbox-column"></th></tr></thead><tbody></tbody><tfoot></tfoot></table>' +
                '</div>');
            chooseBodyElement.appendTo(this.el.body);

            this.el.choose_table_tbody = chooseBodyElement.find('tbody');
            this.el.choose_table_tfoot = chooseBodyElement.find('tfoot');

            this.selectAllCheckbox = new Hamster.ui.FormCheckbox({
                appendToEl: chooseBodyElement.find('th.checkbox-column')
            })
        },

        _initDetailGroupTotalBody: function () {
            var htmlObj = this._getTableColHtmlAndHeaderHtml(this.calculateWidgetItems);
            var totalBodyHtml = Hamster.String.format('<div class="approval-form-detail-group-fixed-right">' +
                '<table><colgroup>{0}</colgroup><thead><tr>{1}</tr></thead><tbody></tbody><tfoot></tfoot></table></div>',
                htmlObj.col, htmlObj.header);

            var totalBodyElement = $(totalBodyHtml).appendTo(this.el.body);

            this.el.total_table_tbody = totalBodyElement.find('tbody');
            this.el.total_table_tfoot = totalBodyElement.find('tfoot');
        },

        _initDetailGroupContentBody: function () {
            var htmlObj = this._getTableColHtmlAndHeaderHtml(this.items);
            var contentBodyHtml = Hamster.String.format('<div class="approval-form-detail-group-inner"><table style="width: {0}px">' +
                '<colgroup>{1}</colgroup><thead><tr>{2}</tr></thead><tbody></tbody><tfoot></tfoot></table></div>',
                this.tableWidth, htmlObj.col, htmlObj.header);

            var contentBodyElement = $(contentBodyHtml).appendTo(this.el.body);

            this.el.content_table_tbody = contentBodyElement.find('tbody');
            this.el.content_table_tfoot = contentBodyElement.find('tfoot');
        },

        _initSubTotalRow: function () {
            this.el.choose_table_tfoot.append('<tr><td><div class="inner">小计</div></td></tr>');

            var contentSubTotalRowElement = $('<tr/>').appendTo(this.el.content_table_tfoot);
            var totalSubTotalRowElement = $('<tr/>').appendTo(this.el.total_table_tfoot);

            Hamster.Array.forEach(this.contentWidgetItems, function (item) {
                this.subTotalColumnMap[item.widgetName] = $('<td class="subtotal"/>').appendTo(contentSubTotalRowElement);
            }, this);
            Hamster.Array.forEach(this.calculateWidgetItems, function (item) {
                this.subTotalColumnMap[item.widgetName] = $('<td class="subtotal"/>').appendTo(totalSubTotalRowElement);
            }, this);
        },

        _getTableColHtmlAndHeaderHtml: function (widgetOptions) {
            this.tableWidth = 0;
            var colHtmls = [], headerHtmls = [];

            Hamster.Array.forEach(widgetOptions, function (options) {
                var colWidth = options.xtype == "detailcalculate" ? this.calculateColumnWidth : options.width || this.contentColumnWidthMap[options.xtype] || this.defaultColumnWidth;
                this.tableWidth += colWidth;
                colHtmls.push(Hamster.String.format('<col width="{0}px"/>', colWidth));

                var colClasses = [];
                options.required && colClasses.push('required');
                options.xtype == 'detailcalculate' && colClasses.push('hidden');
                headerHtmls.push(Hamster.String.format('<th class="{0}">{1}</th>', colClasses.join(' '), options.title));
            }, this);

            return {
                col: colHtmls.join(''),
                header: headerHtmls.join('')
            }
        },

        _initEvents: function () {
            this.selectAllCheckbox.on('change', this.onChooseAllCheckboxChanged, this);

            if (this.viewMode) {
                return
            }
            this.addRowButton.on('click', this.onAddButtonClick, this);
            this.removeRowButton.on('click', this.onDeleteButtonClick, this);
            this.hasQuickEntryButton && this.quickEntryButton.on('click', this.onQuickEntryClick, this);
        },

        onAddButtonClick: function () {
            // 明细表格的"添加"按钮事件
            var newRowRecord = this.getNewAddRowRecord();
            this.addRow(newRowRecord, false, true);
            //this.lastRowFormulaAndRely();
        },

        onDeleteButtonClick: function () {
            this.chooseCheckboxs.each(function (checkbox) {
                if (checkbox.isChecked()) {
                    this.removeRow(checkbox.getValue());
                }
            }, this);
            if (this.widgetRows.length == 0) {
                this.addRow(this.getNewAddRowRecord(), false, true)
            }
        },

        onQuickEntryClick: function () {
            this.quickEntryDialog = this.getQuickEnterDialog();
            this.quickEntryDialog.open();
        },

        getQuickEnterDialog: function () {
            if (this.quickEntryDialog) {
                return this.quickEntryDialog
            }
            this.quickEntryDialog = new Hamster.ui.Dialog({
                title: '快速录入',
                width: 350,
                height: 250,
                contentPadding: 20,
                contentHtml: '<div class="ui-form-horizontal">' +
                    '<div class="ui-form-field">' +
                    '<div id="approval-quick-enter-start-time"></div>' +
                    '</div>' +
                    '<div class="ui-form-field">' +
                    '<div id="approval-quick-enter-end-time"></div>' +
                    '</div>' +
                    '<div class="ui-form-field">' +
                    '<div id="approval-quick-enter-limit-checkbox"></div>' +
                    '</div>' +
                    '</div>',
                btnItems: [
                    {
                        icon: "",
                        title: "确定",
                        handler: this.onConfirmQuickEnter.bind(this)
                    }
                ],
                listeners: {
                    'after-content-rendered': this.onQuickEnterDialogContentRendered.bind(this),
                    'close': this.onQuickEnterDialogClose.bind(this)
                }
            });
            return this.quickEntryDialog;
        },

        onQuickEnterDialogContentRendered: function (dialog, content) {
            this.quickEntryStartDateTime = new Hamster.ui.FormDateTime({
                targetEl: $('#approval-quick-enter-start-time'),
                placeholder: "开始时间"
            });
            this.quickEntryEndDateTime = new Hamster.ui.FormDateTime({
                targetEl: $('#approval-quick-enter-end-time'),
                placeholder: "结束时间"
            });
            this.quickEntryLimitCheckBox = new Hamster.ui.FormCheckbox({
                targetEl: $('#approval-quick-enter-limit-checkbox'),
                text: "忽略周六/周日"
            });
        },

        onQuickEnterDialogClose: function () {
            this.quickEntryStartDateTime.setValue("");
            this.quickEntryEndDateTime.setValue("");
            this.quickEntryLimitCheckBox.setChecked(false);
        },

        onConfirmQuickEnter: function () {
            var self = this;
            var startDateValue = this.quickEntryStartDateTime.getValue();
            var endDateValue = this.quickEntryEndDateTime.getValue();
            var isLimit = this.quickEntryLimitCheckBox.isChecked();

            if (Hamster.isEmpty(startDateValue) || Hamster.isEmpty(endDateValue)) {
                Hamster.ui.Message.warning('日期填写不完整!');
                return
            }

            this._loader = this._loader || new Hamster.ui.Loader({
                text: '导入数据中...',
                container: this.quickEntryDialog.getBodyElement()
            });
            this._loader.start();

            var dataHttpAjax = new HttpAjax({
                url: 'api/bill/import/item/quick',
                type: 'GET',
                params: {
                    processId: this.formParams.processId,
                    startDate: startDateValue,
                    endDate: endDateValue,
                    skipWeek: isLimit
                }
            });
            dataHttpAjax.successHandler(function (data) {
                self.clearRows();
                Hamster.Array.forEach(data, function (record) {
                    // var _record = self.form.formulaDetailGroupRecord(self, record);
                    self.addRow(record, false);
                    // 处理联动
                    //self.lastRowFormulaAndRely();
                });
                self._loader.stop();
                self.quickEntryDialog.close();
            });
            dataHttpAjax.send();
        },
        // 对表格中的最后一行进行表达式和联动处理
        lastRowFormulaAndRely: function () {
            var self = this;
            // sogyf 当添加一行后，触发其表达式的联动处理 2017-11-10
            var lastRow = this.widgetRows.last();
            if (!Hamster.isEmpty(lastRow)) {
                Hamster.Object.each(lastRow.widgets, function (name, widget) {
                    if (!Hamster.isEmpty(widget.formula)) {
                        var formula = widget.formula.value;
                        if (!Hamster.isEmpty(formula)) {
                            self.form.dealRely(name, widget, null, widget.getValue());
                        }
                    } else if (!Hamster.isEmpty(widget.rely)) {
                        self.form.dealRely(name, widget, null, widget.getValue());
                    }

                }, this);
            }
            // endif
        },

        /**
         * 获取新行的数据
         * */
        getNewAddRowRecord: function () {
            var lastRowRecord = {}, record = {};

            var lastRow = this.widgetRows.last();
            if (!Hamster.isEmpty(lastRow)) {
                Hamster.Object.each(lastRow.widgets, function (name, widget) {
                    lastRowRecord[name] = widget.getValue();
                }, this);
            }

            Hamster.Array.forEach(this.contentWidgetItems, function (widgetOptions) {
                var name = widgetOptions.widgetName;
                var value = lastRowRecord[name];
                if (widgetOptions.xtype == 'datetime' && !Hamster.isEmpty(value)) {
                    // 如果是日期，则添加行的时候，自动将上一行的日期值+1天 sogyf
                    var dtMoment = moment(value);
                    var plusOneDay = dtMoment.add('1', 'd');
                    record[name] = plusOneDay.format('YYYY-MM-DD');
                    // ended
                }
            }, this);
            return record;
        },

        /**
         * 添加一行数据
         * */
        addRow: function (record, suspend, withDefaultValue) {
            record = record || {};

            var rowId = Hamster.uniqueId('row');
            var chooseRowElement = $('<tr/>').appendTo(this.el.choose_table_tbody);
            var contentRowElement = $('<tr/>').appendTo(this.el.content_table_tbody);
            var totalRowElement = $('<tr/>').appendTo(this.el.total_table_tbody);
            var checkboxTdElement = $('<td/>').appendTo(chooseRowElement);

            contentRowElement.data('rowId', rowId);

            var checkbox = new Hamster.ui.FormCheckbox({
                appendToEl: checkboxTdElement,
                value: rowId
            });
            checkbox.on('change', this.checkChooseAllCheckboxStatus, this);
            this.chooseCheckboxs.push(rowId, checkbox);

            var rowWidgets = {};
            Hamster.Array.forEach(this.contentWidgetItems, function (widgetOptions) {
                this._createColumnAndWidget(widgetOptions, rowWidgets, contentRowElement, record, withDefaultValue);
            }, this);
            Hamster.Array.forEach(this.calculateWidgetItems, function (widgetOptions) {
                this._createColumnAndWidget(widgetOptions, rowWidgets, totalRowElement, record, withDefaultValue);
            }, this);

            this.widgetRows.push(rowId, {
                checkbox: checkbox,
                widgets: rowWidgets,
                elements: [chooseRowElement, contentRowElement, totalRowElement]
            });

            this.syncRowElementHeight(contentRowElement.index());

            if (!suspend) {
                this.checkChooseAllCheckboxStatus();
                this.recalculateSubTotal();
                this.fireEvent('change', this);
            }
        },

        /**
         * 删除一行数据,根据行ID(行ID为系统自动生成的UUID)
         * */
        removeRow: function (rowId, suspend) {
            if (Hamster.isEmpty(rowId)) {
                return
            }
            var row = this.widgetRows.getByKey(rowId);
            Hamster.Object.each(row.widgets, function (name, widget) {
                widget && widget.destroy();
            }, this);
            Hamster.Array.forEach(row.elements, function (element) {
                element.remove();
            }, this);
            this.widgetRows.removeAtKey(rowId);

            row.checkbox.destroy();
            this.chooseCheckboxs.removeAtKey(rowId);

            if (!suspend) {
                this.checkChooseAllCheckboxStatus();
                this.recalculateSubTotal();
                this.fireEvent('change', this);
            }
        },

        /**
         * 清除所有行
         * */
        clearRows: function () {
            var rowKeys = [];
            this.widgetRows.eachKey(function (key) {
                rowKeys.push(key);
            });
            Hamster.Array.forEach(rowKeys, function (key) {
                this.removeRow(key, true);
            }, this);
        },

        /**
         * 创建行中的一列,并且初始化对应的组件
         * */
        _createColumnAndWidget: function (widgetOptions, rowWidgets, rowElement, record, withDefaultValue) {
            var options = Hamster.clone(widgetOptions);
            var tdElement = $('<td class="approval-form-row-column"/>').appendTo(rowElement);

            options.appendToEl = options.containerTdEl = tdElement;
            options.isDetailGroupSubWidget = true;
            options.detailGroupWidgetName = this.getWidgetName();
            options.withDefaultValue = !!withDefaultValue;
            options.value = record[options.widgetName];

            if (this.viewMode) {
                options.viewMode = true
            }
            this.fireEvent('before-create-widget', this, options);
            var widget = ApprovalFormItemFactory.create(options.xtype, Hamster.clone(options));
            this.fireEvent('after-create-widget', this, widget);

            if (options.subtotal) {
                widget.on('change', this.recalculateSubTotal, this);
            }
            if (widget.isTextArea || widget.isBizWidget || widget.isDetailCalculate) {
                widget.on('change', this.onHeighVariabletWidgetChange, this);
            }
            if (widget.isInput && !widget.viewMode) {
                widget.formItemWidget.on('keydown-direction-key', this.onInputKeydownDirectionKey, this);
            }

            rowWidgets[widget.getWidgetName()] = widget;
            tdElement.data('widget', widget);
            return widget;
        },

        /**
         * 当input输入框输入了方向键时触发
         * */
        onInputKeydownDirectionKey: function (event, keyCode) {

            if (keyCode != 38 && keyCode != 40) {
                return
            }
            var targetElement = $(event.target),
                tdElement = targetElement.closest('td'),
                rowElement = targetElement.closest('tr');

            var widget = tdElement.data('widget'),
                widgetName = widget.getWidgetName();

            var oRowElement = keyCode == 38 ? rowElement.prev() : rowElement.next();
            if (Hamster.isEmpty(oRowElement)) {
                return
            }
            var oRowId = oRowElement.data('rowId'),
                row = this.widgetRows.getByKey(oRowId),
                oWidget = row.widgets[widgetName];

            if (!Hamster.isEmpty(oWidget.formItemWidget.el.input)) {
                oWidget.formItemWidget.el.input.focus();
            }
        },

        /**
         * 当全选Checkbox值发生变化后,修改行Checkbox的值
         * */
        onChooseAllCheckboxChanged: function (allCheckbox, checked) {
            this.chooseCheckboxs.each(function (checkbox) {
                checkbox.setChecked(checked);
            }, this)
        },

        /**
         * 检查全选Checkbox状态
         * */
        checkChooseAllCheckboxStatus: function () {
            var checkedCount = 0;
            this.chooseCheckboxs.each(function (checkbox) {
                checkbox.isChecked() && checkedCount++;
            }, this);
            this.selectAllCheckbox.setChecked(this.chooseCheckboxs.length !== 0 && this.chooseCheckboxs.length == checkedCount, true);
            if (!this.viewMode && this.removeRowButton) {
                this.removeRowButton.setEnable(checkedCount > 0)
            }
        },

        /**
         * 监听高度可变组件值发生变化,并且同步行高
         * */
        onHeighVariabletWidgetChange: function (widget) {
            var rowElement = widget.__rowElement = widget.__rowElement
                || widget.el.target.closest('tr');

            this.syncRowElementHeight(rowElement.index());
        },

        /**
         * 同步一行的高度
         * */
        syncRowElementHeight: function (index) {
            var row = this.widgetRows.getAt(index);
            if (Hamster.isEmpty(row)) {
                return
            }

            var widgetHeights = [];
            Hamster.Object.each(row.widgets, function (name, widget) {
                var widgetElement = widget.getTargetElement();
                widgetHeights.push(widgetElement.height());
            }, this);

            var maxHeight = Hamster.Array.max(widgetHeights);
            Hamster.Array.forEach(row.elements, function (element) {
                element.find('td').height(maxHeight);
            }, this);
        },

        /**
         * 重新计算小计
         * */
        recalculateSubTotal: function () {
            if (Hamster.isEmpty(this.needSubTotalWidgetNames)) {
                return
            }
            var totalRecord = {};
            this.widgetRows.each(function (row) {
                Hamster.Array.forEach(this.needSubTotalWidgetNames, function (widgetName) {
                    var widget = row.widgets[widgetName];
                    if (!widget) {
                        return
                    }
                    totalRecord[widgetName] = totalRecord[widgetName] || 0;
                    totalRecord[widgetName] += parseFloat(widget.getValue()) || 0;
                }, this);
            }, this);

            Hamster.Array.forEach(this.needSubTotalWidgetNames, function (name) {
                var widgetOptions = this.getColumnWidgetOptionsByName(name);

                var total = totalRecord[name], totalText;
                if (total === 0) {
                    totalText = "--";
                } else if (widgetOptions.xtype == 'money') {
                    totalText = Hamster.utils.number(total, '000,000.00');
                } else if (Hamster.isNumber(parseFloat(total))) {
                    totalText = Hamster.utils.number(total, '000,000.00');
                } else {
                    totalText = String(total);
                }
                this.subTotalColumnMap[name].html('<div class="inner">' + totalText + '</div>');
            }, this);

            var subTotalHeights = [];
            Hamster.Object.each(this.subTotalColumnMap, function (name, element) {
                subTotalHeights.push(element.find('.inner').height());
            }, this);
            var maxHeight = Hamster.Array.max(subTotalHeights);

            this.el.choose_table_tfoot.find('td').height(maxHeight);
            this.el.content_table_tfoot.find('td').height(maxHeight);
            this.el.total_table_tfoot.find('td').height(maxHeight);
        },

        /**
         * 获取子字段,根据组件名和行下标
         * */
        getSubFormItemWidgetByName: function (fieldName, index) {
            var widgets = [];
            this.widgetRows.each(function (row) {
                widgets.push(row.widgets[fieldName]);
            });
            return Hamster.isNumber(index) ? widgets[index] : widgets
        },

        /**
         * 根据组件名称获取列组件的配置
         * */
        getColumnWidgetOptionsByName: function (widgetName) {
            return this.columnWidgetOptionsMap[widgetName]
        },

        /**
         * 获取第一行所有组件
         * */
        getFirstRowWidgets: function () {
            var firstRow = this.widgetRows.first();
            if (Hamster.isEmpty(firstRow)) {
                return []
            }
            return firstRow.widgets || []
        },

        /**
         * 数据验证
         * */
        validate: function () {
            var isValid = true;
            this.widgetRows.each(function (row) {
                Hamster.Object.each(row.widgets, function (name, widget) {
                    if (!widget.validate() && isValid) {
                        isValid = false;
                    }
                }, this);
            }, this);
            return isValid
        },

        isEqual: function () {
            return false
        },

        setValue: function (value, suspendCheckChange) {
            this.clearRows();
            if (Hamster.isEmpty(value)) {
                value = {};
            }
            var self = this;
            var records = Hamster.Array.from(value);
            Hamster.Array.forEach(records, function (record) {
                if (Hamster.isEmpty(record)) {
                    return
                }
                this.addRow(record, true, Hamster.isEmptyObject(value));

                // sogyf 处理联动
                //self.lastRowFormulaAndRely();
            }, this);

            this.checkChooseAllCheckboxStatus();
            this.recalculateSubTotal();

            suspendCheckChange || this.fireEvent('change', this);
        },

        getValue: function () {
            var values = [];
            this.el.content_table_tbody.find('tr').each(function () {
                var rowElement = $(this);
                var rowValue = {};
                rowElement.find('td').each(function () {
                    var colElement = $(this);
                    var widget = colElement.data('widget');
                    widget && (rowValue[widget.getWidgetName()] = widget.getValue());
                });
                values.push(rowValue);
            });

            var totalValues = [];
            this.el.total_table_tbody.find('tr').each(function () {
                var rowElement = $(this);
                var rowValue = {};
                rowElement.find('td').each(function () {
                    var colElement = $(this);
                    var widget = colElement.data('widget');
                    widget && (rowValue[widget.getWidgetName()] = widget.getValue());
                });
                totalValues.push(rowValue);
            });

            Hamster.Array.forEach(values, function (valueObj, i) {
                return Hamster.applyIf(valueObj, totalValues[i] || {});
            });
            return values;
        },

        // setEnable: function (enable) {
        //     ApprovalDetailGroup.superclass.setEnable.apply(this, arguments);
        //     this.addRowButton.setEnable(enable);
        //     this.removeRowButton.setEnable(enable);
        // },

        destroy: function () {
            this.contentWidgetItems = [];
            this.calculateWidgetItems = [];
            this.needSubTotalWidgetNames = [];

            if (this.quickEntryDialog) {
                this.quickEntryDialog.destroy();
            }

            this.widgetRows.each(function (row) {
                Hamster.Object.each(row.widgets, function (name, widget) {
                    widget && widget.destroy();
                }, this);
            });
            ApprovalDetailGroup.superclass.destroy.apply(this, arguments);
        }

    });
    ApprovalFormItemFactory.register('detailgroup', ApprovalDetailGroup);

});