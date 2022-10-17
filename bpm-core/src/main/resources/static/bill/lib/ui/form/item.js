define(function (require, exports, module) {

    var Class = require('../../class');
    var Component = require('../component');
    var Foundation = require('../../foundation');

    var Utils = require('../../util');
    var vTypes = require('./vtypes');
    var Locale = require('../locale');

    var Dialog = require('../dialog');
    var HttpAjax = require('../../http-ajax');

    Handlebars.registerHelper("exec", function (fn, data) {
        return (Foundation.isFunction(fn) && fn(data)) || ""
    });

    /**
     * 表单组件的基类
     * */
    var BaseFormItem = Class.create({

        extend: Component,

        invalidCls: 'ui-form-item-error',

        hiddenCls: 'ui-hidden',

        disableCls: 'ui-disable',

        readOnlyCls: 'ui-readonly',

        readOnly: false,

        suspendCheckChange: false,

        originalValue: null,

        lastValue: null,

        value: null,

        required: false,

        validator: null,

        //是否阻止错误报出
        preventErrorMark: false,

        validateOnChange: true,

        emptyErrorText: Locale.validateError.emptyText,

        _beforeInit: function () {
            BaseFormItem.superclass._beforeInit.apply(this);
            this.suspendCheckChange = false;
        },

        _afterInit: function () {
            BaseFormItem.superclass._afterInit.apply(this);
            this._initValue();

            if (this.readOnly) {
                this.setReadOnly(true);
            }
            this.setRequired(this.required)
        },

        _initValue: function () {
            this.originalValue = this.lastValue = this.value;
            this.suspendCheckChange = true;
            this.setValue(this.value);
            this.suspendCheckChange = false;

            this.originalValue = this.lastValue = this.getValue();
        },

        setReadOnly: function (readOnly) {
            this.readOnly = readOnly;
            this.fireEvent('readonly', readOnly, this);
            this.el.target.toggleClass(this.readOnlyCls, readOnly);
        },

        setRequired: function (required) {
            var lastRequired = this.required;
            this.required = required;

            if (lastRequired != required) {
                this.fireEvent('required-change', required, this);
                this.onRequiredChange();
            }
        },

        onRequiredChange: Foundation.EMPTY_FUNCTION,

        getValue: function () {
            return this.value
        },

        setValue: function (value) {
            this.value = value;
            this.checkChange();
        },

        //检查变化
        checkChange: function (fn) {
            if (this.suspendCheckChange) {
                return
            }
            var newVal = this.getValue(),
                oldVal = this.lastValue;

            if (!this.isEqual(newVal, oldVal) && !this.isDestroyed) {
                this.lastValue = newVal;
                this.onChange(newVal, oldVal);
                if (Foundation.isFunction(fn)) {
                    fn.call(this, newVal, oldVal);
                }
            }
        },

        onChange: function (newVal, oldVal) {
            this.fireEvent('change', newVal, oldVal);
            if (this.validateOnChange) {
                this.validate();
            }
        },

        isEqual: function (value1, value2) {
            return String(value1) === String(value2)
        },

        clear: function () {
            this.setValue("");
        },

        //判断当前获取值是否符合要求
        isValid: function () {
            return this.isEnabled() && this.validateValue();
        },

        validate: function () {
            var isValid = this.isValid();

            if (isValid !== this.wasValid) {
                this.wasValid = isValid;
                this.fireEvent('validity-change', isValid, this);
            }
            return isValid
        },

        validateValue: function () {
            var errors = Foundation.Array.from(this.getErrors());
            var isValid = Foundation.isEmpty(errors);

            if (!this.preventErrorMark) {
                if (isValid) {
                    this.clearInvalid();
                } else {
                    this.markInvalid(errors);
                }
            }
            return isValid;
        },

        checkValueEmpty: function (value) {
            return Foundation.isEmpty(value)
        },

        getErrors: function () {
            var errorTexts = [];
            var value = this.getValue();

            if (Foundation.isFunction(this.validator)) {
                var message = this.validator.call(this, value);
                if (message !== true) {
                    errorTexts.push(message);
                }
            }

            if (this.required && this.checkValueEmpty(value)) {
                errorTexts.push(this.emptyErrorText);
                return errorTexts
            }
            this.fireEvent('extra-errors', function (extraErrors) {
                errorTexts = Foundation.Array.merge(errorTexts, extraErrors)
            });
            return errorTexts;
        },

        clearInvalid: function () {
            delete this.activeErrors;
            this.renderActiveError();
        },

        markInvalid: function (errors) {
            this.setActiveErrors(errors);
        },

        getActiveErrors: function () {
            return this.activeErrors || [];
        },

        setActiveErrors: function (errors) {
            errors = Foundation.Array.toArray(errors);
            this.activeErrors = errors;
            this.renderActiveError();
        },

        renderActiveError: function () {
            if (this.preventErrorMark) {
                return
            }
            var activeErrors = this.getActiveErrors();
            this.el.target.toggleClass(this.invalidCls, !Foundation.isEmpty(activeErrors));
        },

        batchChanges: function (fn) {
            try {
                this.suspendCheckChange++;
                fn();
            } catch (pseudo) {
                throw pseudo;
            } finally {
                this.suspendCheckChange--;
            }
            this.checkChange();
        }

    });

    /**
     * 文本框输入控件
     * */
    var FormInput = Class.create({

        extend: BaseFormItem,

        baseCls: 'ui-input',

        inputFocusCls: 'ui-input-focus',

        isTextarea: false,

        placeholder: '',

        vtype: null,

        regex: null,

        validator: null,

        //过滤输入字符正则
        maskRegexp: false,

        //是否禁止输入字符过滤
        disableKeyFilter: false,

        blocks: null,

        delimiter: ',',

        prefix: null,

        delimiters: null,

        minLength: 0,

        maxLength: Number.MAX_VALUE,

        minLengthErrorText: Locale.validateError.minLengthText,

        maxLengthErrorText: Locale.validateError.maxLengthText,

        vTypeErrorText: '',

        regexErrorText: '',

        changeOnBlur: true,

        checkChangeEvents: document.all && (!document.documentMode || document.documentMode < 9) ?
            ['change', 'propertychange'] :
            ['change', 'input', 'textInput', 'keyup', 'dragdrop'],

        _init: function () {
            FormInput.superclass._init.apply(this);
            // var inputHTML = this.isTextarea ? '<textarea class="input"></textarea>' : '<input
            // class="input"/>';
            this._renderInput();
        },

        _renderInput: function () {
            this.el.input = $('<input class="input"/>').appendTo(this.el.target);
        },

        _afterInit: function () {
            FormInput.superclass._afterInit.apply(this);

            if (!Foundation.isEmpty(this.placeholder)) {
                this.setPlaceholder(this.placeholder);
            }
        },

        _initEvents: function () {
            var self = this;

            if (!this.changeOnBlur) {
                var onChangeTask = new Utils.DelayedTask(this.onInputChange, this);

                this.onChangeEvent = function () {
                    onChangeTask.delay(100);
                };
                Foundation.Array.forEach(this.checkChangeEvents, function (eventName) {
                    if (eventName === 'propertychange') {
                        self.usesPropertychange = true;
                    }
                    this._bindEvent(this.el.input, eventName, this.onChangeEvent);
                }, this);
            }

            this._bindEvent(this.el.input, 'focus', 'onInputFocus');
            this._bindEvent(this.el.input, 'blur', 'onInputBlur');

            this._bindEvent(this.el.input, 'keydown', 'onInputKeydown');
            if (this.maskRegexp || (this.vtype && this.disableKeyFilter !== true && (this.maskRegexp = vTypes[this.vtype + 'Mask']))) {
                this._bindEvent(this.el.input, 'keypress', 'filterKeys');
            }

        },

        onInputFocus: function () {
            if (!this.isEnabled()) {
                return;
            }
            this.el.input.addClass(this.inputFocusCls);
            this.triggerEvent('focus', this);
            this.triggerEvent('before-edit', this);
        },

        onInputBlur: function () {
            if (!this.isEnabled()) {
                return;
            }

            this.el.input.removeClass(this.inputFocusCls);
            this.triggerEvent('blur', this.getValue(), this.lastValue);

            var rawValue = this.getRawValue();
            this.setRawValue(this.format(rawValue));

            if (this.changeOnBlur) {
                this.checkChange();
            }
        },

        onInputChange: function () {
            var rawValue = this.getRawValue();
            this.setRawValue(this.format(rawValue));
            this.checkChange();
        },

        onInputKeydown: function (input, event) {
            var keyCode = event.keyCode;

            if (keyCode >= 37 && keyCode <= 40) {
                this.triggerEvent('keydown-direction-key', event, keyCode);
            } else if (keyCode == 13) {
                this.triggerEvent('keydown-enter-key', event);
            }
            this.triggerEvent('keydown-key', event, keyCode);
        },

        filterKeys: function (input, event) {
            var keyCode = event.keyCode;
            var charCode = String.fromCharCode(event.charCode);

            var isNavKeyPress = (keyCode >= 33 && keyCode <= 40)
                || keyCode == 13
                || keyCode == 9
                || keyCode == 27;

            var isSpeciakey = (event.type == 'keypress' && event.ctrlKey)
                || isNavKeyPress
                || (keyCode == 8)
                || (keyCode >= 16 && keyCode <= 20)
                || (keyCode >= 44 && keyCode <= 46);

            if ((Utils.browser.isGecko || Utils.browser.isOpera) && (isNavKeyPress || event.key === 8)) {
                return;
            }

            if ((!Utils.browser.isGecko && !Utils.browser.isOpera) && isSpeciakey && !charCode) {
                return;
            }
            if (this.checkBanKeyCodeWithEvent(event, charCode)) {
                event.stopPropagation();
                event.preventDefault();
            }
        },

        /**
         * 检测禁止输入的字符
         * */
        checkBanKeyCodeWithEvent: function (event, charCode) {
            return !this.maskRegexp.test(charCode)
        },

        setValue: function (value) {
            this.setRawValue(this.format(value));
            FormInput.superclass.setValue.apply(this, arguments);
        },

        getValue: function () {
            var val = this.parse(this.getRawValue());
            return this.value = Foundation.isString(val) ? Foundation.String.trim(val) : val;
        },

        // 参考: https://github.com/nosir/cleave.js/blob/master/src/Cleave.js
        format: function (value) {
            return value;
        },

        parse: function (rawValue) {
            return "" + Foundation.value(rawValue, "")
        },

        getRawValue: function () {
            var value = !Foundation.isEmpty(this.el.input) ? this.el.input.val() : Foundation.value(this.rawValue, "");
            this.rawValue = value;
            return value
        },

        setRawValue: function (value) {
            var rawValue = this.rawValue;

            value = Foundation.value(value, "");
            if (rawValue === undefined || rawValue !== value) {
                this.rawValue = value;
                if (this.el.input) {
                    this.bindPropertyChange(false);
                    this.el.input.val(value);
                    this.bindPropertyChange(true);
                }
            }
            return value
        },

        bindPropertyChange: function (active) {
            if (!this.usesPropertychange) {
                return
            }
            if (active) {
                this._bindEvent(this.el.input, 'propertychange', this.onChangeEvent);
            } else {
                this._unbindEvent(this.el.input, 'propertychange', this.onChangeEvent);
            }
        },

        isEqual: function (value1, value2) {
            return Foundation.value(value1, '') == Foundation.value(value2, '')
        },

        setPlaceholder: function (placeholder) {
            this.placeholder = placeholder;
            this.el.input.prop('placeholder', placeholder)
        },

        checkValueEmpty: function (value) {
            return Foundation.isEmpty(value)
        },

        getErrors: function () {
            var value = this.getValue() || "";
            var format = Foundation.String.format;
            var errorTexts = FormInput.superclass.getErrors.apply(this, arguments);
            var isEmpty = this.checkValueEmpty(value);

            if (value.length < this.minLength) {
                errorTexts.push(format(this.minLengthErrorText, this.minLength));
            }

            if (value.length > this.maxLength) {
                errorTexts.push(format(this.maxLengthErrorText, this.maxLength));
            }

            if (!isEmpty) {
                if (this.vtype && Foundation.isFunction(vTypes[this.vtype]) && !vTypes[this.vtype](value, this)) {
                    errorTexts.push(this.vTypeErrorText || vTypes[this.vtype + 'Text']);
                }
                if (this.regex && !this.regex.test(value)) {
                    errorTexts.push(this.regexErrorText || "");
                }
            }

            return errorTexts;
        },

        onEnable: function () {
            FormInput.superclass.onEnable.apply(this);
            this.el.input.prop('disabled', false);
        },

        onDisable: function () {
            FormInput.superclass.onDisable.apply(this);
            this.el.input.prop('disabled', true);
        }

    });
    exports.FormInput = FormInput;

    /**
     * 数字框输入控件
     * */
    var FormNumberInput = Class.create({

        extend: FormInput,

        maskRegexp: /[0-9\\.\\-]/i,

        decimalPrecision: 2,

        allowDecimals: false,

        //十进制分隔符
        decimalSeparator: ".",

        //允许负数
        allowNegative: true,

        minValue: Number.NEGATIVE_INFINITY,

        maxValue: Number.MAX_VALUE,

        extClsList: ['ui-number-input'],

        onFormatPartInteger: Foundation.identityFn,

        format: function (value) {
            var parts, partInteger, partDecimal = '';

            if (Foundation.isEmpty(value)) {
                return ''
            }
            value = String(value);
            value = value.replace(/[A-Za-z]/g, '')
                .replace(this.decimalSeparator, 'M')
                .replace(/[^\dM-]/g, '')
                .replace(/^\-/, 'N')
                .replace(/\-/g, '')
                .replace('N', this.allowNegative ? '-' : '')
                .replace('M', this.decimalSeparator)
                .replace(/^(-)?0+(?=\d)/, '$1');

            partInteger = value;

            if (value.indexOf(this.decimalSeparator) >= 0) {
                parts = value.split(this.decimalSeparator);
                partInteger = parts[0];
                partDecimal = this.decimalSeparator + parts[1].slice(0, this.decimalPrecision);
                partDecimal = partDecimal.replace(/0*$/g, '');
            }
            partInteger = this.onFormatPartInteger(partInteger);

            var stringValue = partInteger.toString() + ((this.allowDecimals && this.decimalPrecision > 0) ? partDecimal.toString() : '');
            stringValue = stringValue.replace(/\.$/g, '');

            if (stringValue >= this.maxValue) {
                stringValue = String(this.maxValue);
            } else if (stringValue <= this.minValue) {
                stringValue = String(this.minValue);
            }
            return stringValue;
        },

        parse: function (rawValue) {
            var value = rawValue;
            if (isNaN(value = parseFloat(String(value)))) {
                value = null
            }
            return this.fixPrecision(value);
        },

        fixPrecision: function (value) {
            var nan = isNaN(value);
            var precision = this.decimalPrecision;

            if (nan || !value) {
                return nan ? '' : value;
            } else if (!this.allowDecimals || precision <= 0) {
                precision = 0;
            }
            return parseFloat(Foundation.Number.toFixed(parseFloat(value), precision));
        }
    });
    exports.FormNumberInput = FormNumberInput;

    /**
     * 数字调节输入框控件
     * */
    var FormNumberAdjustInput = Class.create({

        extend: FormNumberInput,

        step: 1,

        _init: function () {
            FormNumberAdjustInput.superclass._init.apply(this);
            this.renderAdjustBox();
        },

        renderAdjustBox: function () {
            this.el.adjustBox = $('<div class="ui-input-adjust-box"/>').appendTo(this.el.target);
            this.el.upAdjustItem = $('<span class="ui-input-adjust-item ui-input-adjust-up"></span>').appendTo(this.el.adjustBox);
            this.el.downAdjustItem = $('<span class="ui-input-adjust-item ui-input-adjust-down"></span>').appendTo(this.el.adjustBox);
        },

        format: function (value) {
            var parts, partInteger, partDecimal = '';

            if (Foundation.isEmpty(value)) {
                return ''
            }
            value = String(value);
            value = value.replace(/[A-Za-z]/g, '')
                .replace(this.decimalSeparator, 'M')
                .replace(/[^\dM-]/g, '')
                .replace(/^\-/, 'N')
                .replace(/\-/g, '')
                .replace('N', this.allowNegative ? '-' : '')
                .replace('M', this.decimalSeparator)
                .replace(/^(-)?0+(?=\d)/, '$1');

            partInteger = value;

            if (value.indexOf(this.decimalSeparator) >= 0) {
                parts = value.split(this.decimalSeparator);
                partInteger = parts[0];
                partDecimal = this.decimalSeparator + parts[1].slice(0, this.decimalPrecision);
                partDecimal = partDecimal.replace(/0*$/g, '');
            }
            partInteger = this.onFormatPartInteger(partInteger);

            var stringValue = partInteger.toString() + ((this.allowDecimals && this.decimalPrecision > 0) ? partDecimal.toString() : '');
            stringValue = stringValue.replace(/\.$/g, '');
            this.el.upAdjustItem.removeClass('ui-input-adjust-item-disable');
            this.el.downAdjustItem.removeClass('ui-input-adjust-item-disable');

            if (stringValue >= this.maxValue) {
                stringValue = String(this.maxValue);
                this.el.upAdjustItem.addClass('ui-input-adjust-item-disable');
            } else if (stringValue <= this.minValue) {
                stringValue = String(this.minValue);
                this.el.downAdjustItem.addClass('ui-input-adjust-item-disable');
            }

            return stringValue;
        },

        _initEvents: function () {
            FormNumberAdjustInput.superclass._initEvents.apply(this);
            this._bindEvent(this.el.upAdjustItem, 'click', 'onUpAdjustItemClick');
            this._bindEvent(this.el.downAdjustItem, 'click', 'onDownAdjustItemClick');
        },

        onUpAdjustItemClick: function () {
            var value = this.getValue();
            if (Foundation.isEmpty(value)) {
                value = 0;
            }
            value = Foundation.Number.toFixed(parseFloat((value || 0) + this.step), this.allowDecimals ? this.decimalPrecision : 0);
            this.setValue(value);
        },

        onDownAdjustItemClick: function () {
            var value = this.getValue();
            if (Foundation.isEmpty(value)) {
                value = 0;
            }
            value = Foundation.Number.toFixed(parseFloat((value || 0) - this.step), this.allowDecimals ? this.decimalPrecision : 0);
            this.setValue(value);
        }

    });
    exports.FormNumberAdjustInput = FormNumberAdjustInput;

    /**
     * 金额框输入控件
     * */
    var FormMoneyInput = Class.create({

        extend: FormNumberInput,

        maskRegexp: /[0-9\\.]/i,
        // maskRegexp: /[0-9\\.\\-]/i,

        //thousand | lakh | wan
        groupStyle: 'thousand',

        decimalPrecision: 2,

        allowDecimals: true,

        delimiter: ',',

        extClsList: ['ui-money-input'],

        onFormatPartInteger: function (partInteger) {
            switch (this.groupStyle) {
                case 'lakh':
                    partInteger = partInteger.replace(/(\d)(?=(\d\d)+\d$)/g, '$1' + this.delimiter);
                    break;
                case 'wan':
                    partInteger = partInteger.replace(/(\d)(?=(\d{4})+$)/g, '$1' + this.delimiter);
                    break;
                default:
                    partInteger = partInteger.replace(/(\d)(?=(\d{3})+$)/g, '$1' + this.delimiter);
            }
            return partInteger
        },

        parse: function (rawValue) {
            var value = rawValue;
            value = value.replace(new RegExp('\\' + this.delimiter, 'g'), '');
            return FormMoneyInput.superclass.parse.apply(this, [value]);
        }

    });
    exports.FormMoneyInput = FormMoneyInput;

    /**
     * 多行文本输入控件
     * */
    var FormTextArea = Class.create({

        extend: FormInput,

        extClsList: ['ui-textarea'],

        _renderInput: function () {
            this.el.codePre = $('<div class="pre"><span></span><br></div>').appendTo(this.el.target);
            this.el.codeSpan = this.el.codePre.find('span');
            this.el.input = $('<textarea></textarea>').appendTo(this.el.target);
        },

        setPreValue: function (value) {
            value = value.replace(/\r?\n/g, "\r\n");
            this.el.codeSpan.text(value);
        },

        onInputChange: function () {
            var textareaVal = this.el.input.val();
            this.setPreValue(textareaVal);
            FormTextArea.superclass.onInputChange.apply(this);
        },

        setValue: function (value) {
            this.setPreValue(String(value));
            FormTextArea.superclass.setValue.apply(this, arguments);
        }

    });
    exports.FormTextArea = FormTextArea;

    /**
     * 单选按钮组控件
     * */
    var FormRadioGroup = Class.create({

        extend: BaseFormItem,

        extClsList: ['form-item-radio'],

        items: [],

        _beforeInit: function () {
            FormRadioGroup.superclass._beforeInit.apply(this);
            this._item_element_map = {};
        },

        _init: function () {
            FormRadioGroup.superclass._init.apply(this);
            this.el.groupList = $('<div class="ui-radio-group" />').appendTo(this.el.target);
            this._initItems();
        },

        _initEvents: function () {
            this._bindDelegateEvent(this.el.groupList, '.ui-radio-group-item', 'click', '_onRadioItemClick');
        },

        _initItems: function () {
            this.el.groupList.empty();
            Foundation.Array.forEach(this.items, function (item, i) {
                this._createRadioItem(item)
            }, this);
        },

        _createRadioItem: function (item) {
            var itemBodyHtml = '<div class="ui-radio-group-item ui-radio-wrapper"></div>';
            var radioHtml = Foundation.String.format('<span class="ui-radio"><input type="radio" class="ui-radio-input" value="{0}"><span class="ui-radio-inner"></span></span>', item.value);
            var displayHtml = Foundation.String.format('<span>{0}</span>', item.text);

            this._item_element_map[item.value] = $(itemBodyHtml)
                .appendTo(this.el.groupList)
                .append($(radioHtml))
                .append($(displayHtml))
                .data('data', item);
        },

        _onRadioItemClick: function (element) {
            this._selectElement(element);
            this.checkChange();
        },

        _selectElement: function (element) {
            if (this._selectedElement) {
                this._selectedElement.removeClass('ui-radio-wrapper-checked').find('span.ui-radio').removeClass('ui-radio-checked');
                this._selectedElement = null;
            }
            this._selectedElement = element;
            element.addClass('ui-radio-wrapper-checked').find('span.ui-radio').addClass('ui-radio-checked');
            var record = this.selectItem = element.data('data');
            this.fireEvent('select', this, record);
            this.checkChange();
        },

        isEqual: function (value1, value2) {
            return String(value1) === String(value2)
        },

        setValue: function (value) {
            var itemElement = this._item_element_map[value];
            if (Foundation.isEmpty(itemElement)) {
                return
            }
            this._selectElement(itemElement);
        },

        getValue: function () {
            return this.selectItem && this.selectItem.value
        },

        getSelected: function () {
            return this.selectItem
        }

    });
    exports.FormRadioGroup = FormRadioGroup;

    /**
     * 单复选框控件
     * */
    var FormCheckbox = Class.create({

        extend: BaseFormItem,

        baseCls: 'ui-checkbox-wrapper',

        text: null,

        value: null,

        _beforeInit: function () {
            FormCheckboxGroup.superclass._beforeInit.apply(this);
        },

        _init: function () {
            FormCheckboxGroup.superclass._init.apply(this);

            var checkboxHtml = Foundation.String.format('<span class="ui-checkbox">' +
                '<input type="checkbox" class="ui-checkbox-input" value="{0}"><span class="ui-checkbox-inner"></span>' +
                '</span>', this.value || "");
            this.el.checkbox = $(checkboxHtml).appendTo(this.el.target);

            if (!Foundation.isEmpty(this.text)) {
                this._createLabel();
            }
        },

        _createLabel: function () {
            var displayHtml = Foundation.String.format('<span>{0}</span>', this.text);
            this.el.label = $(displayHtml).appendTo(this.el.target);
        },

        _initEvents: function () {
            this._bindEvent(this.el.target, 'click', '_onTargetClick');
        },

        _onTargetClick: function (element, event) {
            this.toggle();
            event.stopPropagation();
            return false
        },

        isChecked: function () {
            return this.el.target.hasClass('ui-checkbox-wrapper-checked')
        },

        isIndeterminate: function () {
            return this.el.target.find('span.ui-checkbox').hasClass('ui-checkbox-indeterminate');
        },

        setIndeterminated: function (status) {
            this.setChecked(false);
            this.el.target.find('span.ui-checkbox')
                .toggleClass('ui-checkbox-indeterminate', status);
        },

        setChecked: function (checked, suspendCheckChange) {
            var isChecked = this.isChecked();

            this.el.target.toggleClass('ui-checkbox-wrapper-checked', checked)
                .find('span.ui-checkbox')
                .removeClass('ui-checkbox-indeterminate')
                .toggleClass('ui-checkbox-checked', checked);

            if (!suspendCheckChange && isChecked != checked) {
                this.fireEvent('change', this, checked);
            }
        },

        toggle: function () {
            this.setChecked(!this.isChecked());
        },

        getValue: function () {
            return this.value
        },

        setValue: function (value) {
            this.value = value;
            this.el.checkbox.find('input').val(value);
        },

        setText: function (text) {
            this.text = text;
            if (Foundation.isEmpty(this.el.label)) {
                this._createLabel();
            } else {
                this.el.label.text(text);
            }
        },

        getText: function () {
            return this.text
        }

    });
    exports.FormCheckbox = FormCheckbox;

    /**
     * 复选框组控件
     * */
    var FormCheckboxGroup = Class.create({

        extend: BaseFormItem,

        baseCls: 'ui-checkbox-group',

        items: [],

        value: [],

        _beforeInit: function () {
            FormCheckboxGroup.superclass._beforeInit.apply(this);
            this.itemStore = new Utils.ArrayList();
            this.boxes = [];
        },

        _init: function () {
            FormCheckboxGroup.superclass._init.apply(this);
            this._initItems();
        },

        _initItems: function () {
            this.el.target.empty();
            this.itemStore.clear();
            this.boxes = [];
            Foundation.Array.forEach(this.items, function (item, i) {
                this._createCheckboxItem(item)
            }, this);
        },

        _createCheckboxItem: function (item) {
            var checkbox = new FormCheckbox({
                targetEl: $('<div class="ui-checkbox-group-item"/>').appendTo(this.el.target),
                text: item.text,
                value: item.value
            });
            this.boxes.push(checkbox);
            this.itemStore.push(item.value, item);
            checkbox.on('change', this.checkChange, this);
        },

        isEqual: function (value1, value2) {
            return String(value1) === String(value2)
        },

        setValue: function (values) {
            var self = this;
            values = values || [];

            this.batchChanges(function () {
                Foundation.Array.forEach(self.boxes, function (checkbox) {
                    var checked = Foundation.Array.contains(values, checkbox.getValue());
                    checkbox.setChecked(checked)
                });
            });
        },

        getValue: function () {
            var selectedValues = [];
            Foundation.Array.forEach(this.boxes, function (checkbox) {
                var checked = checkbox.isChecked();
                checked && selectedValues.push(checkbox.getValue());
            });
            return selectedValues
        },

        getSelected: function () {
            var values = this.getValue();

            var records = [];
            Foundation.Array.forEach(values, function (value) {
                var record = this.itemStore.getByKey(value);
                Foundation.isEmpty(record) || records.push(record)
            }, this);
            return records;
        }

    });
    exports.FormCheckboxGroup = FormCheckboxGroup;

    /**
     * 输入框点击触发控件
     * */
    var InputTrigger = Class.create({

        extend: BaseFormItem,

        baseCls: 'ui-input-trigger',

        placeholder: "请选择",

        showClear: false,

        _beforeInit: function () {
            InputTrigger.superclass._beforeInit.apply(this);
        },

        _init: function () {
            InputTrigger.superclass._init.apply(this);

            this.el.input = $('<input class="ui-input-trigger-input" type="input" placeholder=""/>')
                .prop("readOnly", true)
                .appendTo(this.el.target);
            if (this.showClear) {
                this.el.clearBtn = $('<span class="ui-input-clear-icon"></span>')
                    .appendTo(this.el.target);
            }
            this.el.trigger = $('<span class="ui-input-trigger-icon"></span>')
                .appendTo(this.el.target);
        },

        _afterInit: function () {
            InputTrigger.superclass._afterInit.apply(this);
            this.setPlaceholder(this.placeholder);
        },

        _initEvents: function () {
            this._bindEvent(this.el.target, 'click', 'onTriggerClick');
            this.showClear && this._bindEvent(this.el.clearBtn, 'click', 'onClearBtnClick');
        },

        onTriggerClick: Foundation.EMPTY_FUNCTION,

        onClearBtnClick: function (element, event) {
            this.setValue(null);
            this.fireEvent('clear-selected');
            event.stopPropagation();
            return false
        },

        setPlaceholder: function (placeholder) {
            this.el.input.prop('placeholder', placeholder || "")
        },

        onEnable: function () {
            FormInput.superclass.onEnable.apply(this);
            this.el.input.prop('disabled', false);
        },

        onDisable: function () {
            FormInput.superclass.onDisable.apply(this);
            this.el.input.prop('disabled', true);
        },

        destroy: function (empty) {
            if (this.el.dropdown) {
                this._unbindEvent($(document), 'mousedown.trigger_dropdown');
                this.el.dropdown.remove()
            }
            InputTrigger.superclass.destroy.apply(this, arguments);
        }
    });
    exports.InputTrigger = InputTrigger;

    /**
     * 选择器
     * */
    var PickerInput = Class.create({

        extend: InputTrigger,

        extClsList: ['ui-picker'],

        pickerOpenCls: '',

        isExpanded: false,

        pickerWidth: 'auto',

        onTriggerClick: function () {
            if (this.readOnly || !this.enable) {
                return
            }
            if (this.isExpanded) {
                this.collapse();
            } else {
                this.expand();
            }
        },

        expand: function () {
            if (!this.isExpanded && this.beforeExpand() !== false) {
                this.getPicker().addClass('open').appendTo(document.body).show();
                this.isExpanded = true;
                this.alignPicker();
                this.el.target.addClass(this.pickerOpenCls);
                this._bindEvent($(document), 'mousedown.trigger_dropdown', this.collapseIf, this);
                this.fireEvent('expand', this);
                this.onExpand();
            }
        },

        beforeExpand: Foundation.EMPTY_FUNCTION,

        onExpand: Foundation.EMPTY_FUNCTION,

        collapse: function () {
            if (this.isExpanded) {
                this.el.picker.hide().detach();
                this.isExpanded = false;
                this.el.target.removeClass(this.pickerOpenCls);
                this._unbindEvent($(document), 'mousedown.trigger_dropdown');
                this.fireEvent('collapse', this);
                this.onCollapse();
                this.el.picker && this.el.picker.css({left: 0, top: 0});
            }
        },

        onCollapse: Foundation.EMPTY_FUNCTION,

        renderPicker: function () {
            this.beforeRenderPicker();
            this.onRenderPicker();
            this.afterRenderPicker();
            return this.el.picker;
        },

        beforeRenderPicker: Foundation.EMPTY_FUNCTION,

        onRenderPicker: function () {
            this.el.picker = this.createPicker();
        },

        afterRenderPicker: Foundation.EMPTY_FUNCTION,

        getPicker: function () {
            return this.el.picker = this.el.picker || this.renderPicker();
        },

        createPicker: function () {
            return $('<div class="ui-input-trigger-dropdown"></div>');
        },

        collapseIf: function (target, event) {
            var targetElement = $(event.target);
            if (!Foundation.isEmpty(targetElement.closest(this.el.target))) {
                return
            }
            if (Foundation.isEmpty(targetElement.closest(this.el.picker))) {
                this.collapse();
            }
        },

        alignPicker: function () {
            var windowHeight = $(window).height();
            var pickerHeight = this.el.picker.outerHeight();
            var offset = this.el.target.offset();
            var height = this.el.target.outerHeight();
            var width = this.el.target.outerWidth();

            var top = 0;
            if (offset.top + height + pickerHeight < windowHeight) {
                top = offset.top + height;
            } else {
                top = offset.top - pickerHeight;
            }

            var pickerWidth = this.pickerWidth;
            if (this.pickerWidth == 'auto') {
                pickerWidth = width;
            }
            // else {
            //     pickerWidth = this.pickerWidth >= width ? width : this.pickerWidth;
            // }

            this.el.picker.css({
                left: offset.left + 1,
                top: top + 2,
                width: pickerWidth - 2
            })
        },

        destroy: function (empty) {
            if (this.el.picker) {
                this._unbindEvent($(document), 'mousedown.trigger_dropdown');
                this.el.picker.remove()
            }
            PickerInput.superclass.destroy.apply(this, arguments);
        }

    });
    exports.PickerInput = PickerInput;

    /**
     * 时间控件
     * */
    var FormDateTime = Class.create({

        extend: PickerInput,

        extClsList: ['ui-datetime-picker'],

        placeholder: "请选择日期",

        format: 'yyyy-MM-dd',

        minDateTime: "1900-01-01 00:00:00",

        maxDateTime: '2099-12-31 23:59:59',

        chooseType: 'date',

        pickerWidth: 272,

        range: false,

        _beforeInit: function () {
            FormDateTime.superclass._beforeInit.apply(this);
            if (this.range) {
                this.pickerWidth = 546;
            }
        },

        onRenderPicker: function () {
            FormDateTime.superclass.onRenderPicker.apply(this, arguments);
            this.el.picker.addClass('ui-datetime-picker-dropdown');
        },

        onExpand: function () {
            this.el.dateWrappe = $('<div/>').appendTo(this.el.picker);
            layui.laydate.render({
                elem: this.el.dateWrappe[0],
                type: this.chooseType,
                position: 'static',
                value: this.value,
                format: this.format,
                min: this.minDateTime,
                max: this.maxDateTime,
                range: this.range,
                done: this.onChooseDate.bind(this)
            });
        },

        onCollapse: function () {
            if (!Foundation.isEmpty(this.el.dateWrappe)) {
                this.el.dateWrappe.remove();
            }
        },

        onChooseDate: function (datetime) {
            this.setValue(datetime);
            this.collapse();
        },

        setMinDateTime: function (min) {
            this.minDateTime = min;
        },

        setMaxDateTime: function (max) {
            this.maxDateTime = max;
        },

        setValue: function (value) {
            this.value = value;
            this.el.input.val(value || "");
            FormDateTime.superclass.setValue.apply(this, arguments);
        },

        getValue: function () {
            return this.value = Foundation.String.trim(this.el.input.val() || "");
        },

        isEqual: function (value1, value2) {
            return String(value1) === String(value2)
        },

        setPlaceholder: function (placeholder) {
            this.el.input.prop('placeholder', placeholder)
        }

    });
    exports.FormDateTime = FormDateTime;

    /**
     * 弹出选择控件
     * */
    var TriggerSelect = Class.create({

        statics: {
            _choose_comp_map: {},
            DEFAULT_CONTENT_DIALOG_SIZE: {
                width: 400,
                height: 500
            },
            registerChooseComp: function (name, comp) {
                this._choose_comp_map[name] = comp;
            },
            getChooseCompDialogSize: function (name) {
                var Comp = this._choose_comp_map[name];
                if (Foundation.isEmpty(Comp)) {
                    return this.DEFAULT_CONTENT_DIALOG_SIZE
                }
                return Comp.getContentDialogSize() || this.DEFAULT_CONTENT_DIALOG_SIZE
            },
            getChooseComp: function (name) {
                return this._choose_comp_map[name];
            }
        },

        extend: InputTrigger,

        extClsList: ['ui-select-trigger'],

        showClear: true,

        placeholder: "请选择",

        selectDialogTitle: "请选择",

        valueField: 'value',

        displayField: 'text',

        partition: ',',

        maxDisplayCount: 3,

        execBlockName: null,

        execBlockOptions: {},
        filterquery:{},

        _beforeInit: function () {
            TriggerSelect.superclass._beforeInit.apply(this);
            this._value_records = [];
        },

        onTriggerClick: function () {
            if (this.isEnabled()) {
                this._openSelectDataDialog()
            }
        },

        _initSelectDataDialog: function () {
            if (this._selectDataDialog) {
                return
            }

            var confirmBtnItem = {
                name: 'confirm',
                icon: 'ui-icon-check',
                title: "确定选择",
                handler: this._onChooseCompConfirm.bind(this)
            };
            var size = TriggerSelect.getChooseCompDialogSize(this.execBlockName);
            this._selectDataDialog = new Dialog({
                title: this.selectDialogTitle,
                autoClose: true,
                width: size.width,
                height: size.height,
                btnItems: [confirmBtnItem],
                listeners: {
                    close: this._onSelectDataDialogClosed.bind(this)
                }
            });
        },

        _onSelectDataDialogClosed: function () {
            var contentComp = this._selectDataDialog.getContentComp();
            if (Foundation.isEmpty(contentComp)) {
                return;
            }
            contentComp.destroy();
        },

        _onChooseCompConfirm: function () {
            var records = [];
            var chooseComp = this._selectDataDialog.getContentComp();
            if (!Foundation.isEmpty(chooseComp) && Foundation.isFunction(chooseComp.getSelected)) {
                records = chooseComp.getSelected();
                this.fireEvent('selected', records);
            }
            this._selectDataDialog.close();
            this.setValue(records);
        },

        _getDisplayTextWithRecord: function (record) {
            return record[this.displayField]
        },

        _openSelectDataDialog: function () {
            this._initSelectDataDialog();
            var options = Foundation.clone(this.execBlockOptions);
            options.filterquery=this.filterquery;
            this._selectDataDialog.setContentComp(TriggerSelect.getChooseComp(this.execBlockName), Foundation.clone(options));
            this._selectDataDialog.open();
            var contentComp = this._selectDataDialog.getContentComp();
            contentComp.on('selected-over', function () {
                this._onChooseCompConfirm()
            }, this);
            contentComp.resize({
                height: this._selectDataDialog.getBodyElement().height()
            });
        },

        setValue: function (records) {
            if ((!Foundation.isArray(records) && !Foundation.isObject(records)) || Foundation.isEmpty(records)) {
                this._value_records = [];
            } else {
                this._value_records = Foundation.Array.from(records);
            }

            var displayTexts = [];
            Foundation.Array.forEach(this._value_records, function (record) {
                var text = this._getDisplayTextWithRecord(record);
                if (!Foundation.isEmpty(text)) {
                    displayTexts.push(text)
                }
            }, this);

            var display = "";
            if (displayTexts.length > this.maxDisplayCount) {
                display = Foundation.String.format('已选择了{0}条记录', displayTexts.length);
            } else {
                display = displayTexts.join(this.partition);
            }

            this.el.input.val(display);
            this.checkChange();
        },

        getValue: function () {
            return this._value_records;
        },

        isEqual: function (value_records1, value_records2) {
            value_records1 = Foundation.Array.from(value_records1);
            value_records2 = Foundation.Array.from(value_records2);

            if (value_records1.length != value_records2.length) {
                return false
            }

            var value_map1 = {};
            var value_map2 = {};

            Foundation.Array.forEach(value_records1, function (record) {
                value_map1[record[this.valueField]] = record[this.displayField];
            }, this);

            Foundation.Array.forEach(value_records2, function (record) {
                value_map2[record[this.valueField]] = record[this.displayField];
            }, this);

            var hasDiff = false;
            Foundation.Object.each(value_map1, function (key, value) {
                if (value_map2[key] != value) {
                    hasDiff = true
                }
            }, this);

            return !hasDiff
        },

        destroy: function (empty) {
            this._selectDataDialog && this._selectDataDialog.destroy();
            TriggerSelect.superclass.destroy.apply(this, arguments);
        }

    });
    exports.TriggerSelect = TriggerSelect;

    /**
     * 下拉选择控件
     * */
    var ComboBox = Class.create({

        extend: PickerInput,

        implement: [Utils.DataLoader],

        extClsList: ['ui-combo-box'],

        itemSelectedCls: 'ui-combo-dropdown-item-selected',

        placeholder: "请选择",

        valueField: 'value',

        displayField: 'text',

        multi: false,

        async: false,

        url: '',

        params: {},

        searchable: false,

        searchField: 'keyword',

        items: [],

        itemInnerTpl: null,

        partition: ',',

        maxDisplayCount: 3,

        moreDisplayFormat: '已选择了{0}条记录',

        _beforeInit: function () {
            ComboBox.superclass._beforeInit.apply(this);

            var self = this;
            this.source = new Utils.ArrayList(function (obj) {
                return obj[self.valueField];
            });
            this.valueStorage = [];
            this._http_ajax_pool = [];
            if (!this.async && !Foundation.isEmpty(this.items)) {
                this.loadDataSource(this.items);
            }
        },

        _init: function () {
            ComboBox.superclass._init.apply(this);

        },

        loadDataSource: function (data) {
            this.source.clear();
            this.valueStorage = [];

            Foundation.Array.forEach(data, function (item, i) {
                var record = this.formatRecord(item);
                this.fireEvent('format-record', this, record);
                this.source.push(record);
            }, this);
        },

        setData: function (data) {
            this.loadDataSource(data);
            if (!Foundation.isEmpty(this.el.picker)) {
                this.renderPickerItems();
            }
        },

        getData: function () {
            return this.source.getOriginalArray()
        },

        getServerLoaderAjax: function () {
            var self = this;
            if (!this.dataLoader) {
                this.dataLoader = new HttpAjax({type: 'GET'});
                this.dataLoader.successHandler(function (result) {
                    var data = self.formatServerLoaderResult(result);
                    if (!Foundation.isDefined(data)) {
                        data = result
                    }
                    self.setData(data);
                });
                this.dataLoader.on('before-send', function () {
                    self.el.picker.addClass('ui-combo-dropdown-loading');
                });
                this.dataLoader.on('complete', function () {
                    self.el.picker.removeClass('ui-combo-dropdown-loading');
                    self.alignPicker();
                });
            }
            return this.dataLoader
        },

        loadServerDataSource: function (params) {
            if (!Foundation.isEmpty(this._http_ajax_pool)) {
                Foundation.Array.forEach(this._http_ajax_pool, function (ajax) {
                    ajax.abort();
                }, this);
                this._http_ajax_pool = [];
            }

            this.dataLoader = this.getServerLoaderAjax();
            this.dataLoader.setUrl(this.url);
            this.dataLoader.setParams(params || {});
            var ajax = this.dataLoader.send();
            this._http_ajax_pool.push(ajax)
        },

        formatServerLoaderResult: Foundation.identityFn,

        createPicker: function () {
            var pickerElement = $('<div class="ui-input-trigger-dropdown"></div>');
            pickerElement.addClass('ui-combo-dropdown');
            if (this.multi) {
                pickerElement.addClass('ui-combo-dropdown-multi');
            }
            this.el.picker = pickerElement;

            if (this.async && this.searchable) {
                this._createDropdownSearch();
            }

            this.el.dropdown_body = $('<div class="ui-combo-dropdown-body"/>').appendTo(this.el.picker);
            this.el.datasource_tip = $('<div class="ui-combo-dropdown-tip">数据加载中...</div>').appendTo(this.el.dropdown_body);
            this.el.dropdown_list = $('<ul class="ui-combo-dropdown-list"/>').appendTo(this.el.dropdown_body);

            return pickerElement;
        },

        _createDropdownSearch: function () {
            this.el.picker.addClass('ui-combo-dropdown-searchable');
            this.el.dropdown_search = $('<div class="ui-combo-dropdown-search"><i></i><input type="text"/></div>')
                .appendTo(this.el.picker);
            this.el.dropdown_search_input = this.el.dropdown_search.find('input');
        },

        onRenderPicker: function () {
            ComboBox.superclass.onRenderPicker.apply(this);

            if (this.async && !this.searchable) {
                this.loadServerDataSource(Foundation.clone(this.params));
            }
            if (!this.async) {
                this.renderPickerItems();
            }
        },

        afterRenderPicker: function () {
            this.initPickerEvents();
        },

        initPickerEvents: function () {
            this._bindDelegateEvent(this.el.dropdown_list, '.ui-combo-dropdown-item', 'click', 'onItemClick');

            if (this.searchable) {
                var onChangeTask = new Utils.DelayedTask(this.checkSearchChange, this);

                function onSearchChangeEvent() {
                    onChangeTask.delay(250);
                }

                this._bindEvent(this.el.dropdown_search_input, 'keyup', onSearchChangeEvent);
            }
        },

        checkSearchChange: function () {
            var keyword = this.el.dropdown_search_input.val();
            if (Foundation.isEmpty(keyword)) {
                this.setData([]);
                return
            }

            var params = {};
            params[this.searchField] = keyword;
            params = Foundation.apply(params, this.params);

            this.loadServerDataSource(params);
        },

        renderPickerItems: function () {
            var self = this;
            var value = this.getValue();
            var items = this.source.getOriginalArray();
            var keys = Foundation.Array.from(value.split(this.partition));

            function checkSelectFn(record) {
                var value = record[self.valueField];
                return Foundation.Array.contains(keys, value) ? self.itemSelectedCls : "";
            }

            var itemHTML = this.getPickerItemsTpl()({
                items: items,
                checkSelectFn: checkSelectFn
            });
            this.el.dropdown_list.empty().html(itemHTML);

            this.el.items = this.el.dropdown_list.find('li.ui-combo-dropdown-item');
            this.itemLoaded = true;
        },

        getPickerItemsTpl: function () {
            var templateHTML = Foundation.String.format('{{#each items}}<li data-index="{{@index}}" data-key="{{{0}}}" ' +
                'class="ui-combo-dropdown-item {{exec ../checkSelectFn .}}">{1}</li>{{/each}}',
                this.valueField, this.getPickerItemInnerTpl());

            return this.pickerItemsTpl = this.pickerItemsTpl || Handlebars.compile(templateHTML);
        },

        getPickerItemInnerTpl: function () {
            if (Foundation.isString(this.itemInnerTpl)) {
                return this.itemInnerTpl
            }
            return Foundation.String.format('<span>{{{0}}}</span>', this.displayField);
        },

        clearSearch: function () {
            this.el.dropdown_search_input.val("");
            this.setData([]);
        },

        formatRecord: function (item) {
            var record = {};
            if (Foundation.isString(item)) {
                record[this.valueField] = record[this.displayField] = item;
            }
            else if (Foundation.isArray(item)) {
                var value = item[1];
                var display = item[0];

                if (Foundation.isObject(display)) {
                    display[this.valueField] = value;
                    record = display;
                } else {
                    record[this.valueField] = value;
                    record[this.displayField] = display;
                }
            }
            else if (Foundation.isObject(item)) {
                record = item;
            }
            return record;
        },

        onItemClick: function (itemElement, event) {
            var selectedRecords;
            var itemValue = itemElement.attr('data-key');
            var index = parseInt(itemElement.attr('data-index'));
            this.valueStorage = this.valueStorage || [];

            if (!this.multi) {
                if (this.valueStorage[0] != itemValue) {
                    this.valueStorage = [itemValue];
                    selectedRecords = this.source.getByKey(itemValue);
                    itemElement.addClass(this.itemSelectedCls).siblings().removeClass(this.itemSelectedCls);
                    this.fireEvent('select', this, selectedRecords, index);

                    this.stopResetItemClsSet = true;
                    this.setValue(selectedRecords);
                    this.stopResetItemClsSet = false;
                }
                this.collapse();
            } else {
                if (Foundation.Array.contains(this.valueStorage, itemValue)) {
                    Foundation.Array.remove(this.valueStorage, itemValue);
                    itemElement.removeClass(this.itemSelectedCls);
                    this.fireEvent('select', this, this.source.getByKey(itemValue), itemValue);
                } else {
                    this.valueStorage.push(itemValue);
                    itemElement.addClass(this.itemSelectedCls);
                    this.fireEvent('unselect', this, this.source.getByKey(itemValue), itemValue);
                }

                selectedRecords = Foundation.Array.map(this.valueStorage, function (value) {
                    return this.source.getByKey(value)
                }, this);

                this.stopResetItemClsSet = true;
                this.setValue(selectedRecords);
                this.stopResetItemClsSet = false;
            }
        },

        onExpand: function () {
            ComboBox.superclass.onExpand.apply(this);
            if (this.async && this.searchable) {
                this.el.dropdown_search_input.focus();
            }
        },

        onCollapse: function () {
            ComboBox.superclass.onCollapse.apply(this);
            if (this.async && this.searchable) {
                this.clearSearch();
            }
        },

        findRecordByValue: function (record) {
            if (!Foundation.isObject(record)) {
                var obj = {};
                obj[this.valueField] = record;
                record = obj;
            }
            return this.source && this.source.findBy(function (item) {
                return item[this.valueField] == record[this.valueField];
            }, this) || null;
        },

        isEqual: function (v1, v2) {
            var len;

            v1 = Foundation.Array.from(v1);
            v2 = Foundation.Array.from(v2);
            len = v1.length;

            if (len !== v2.length) {
                return false;
            }
            for (var i = 0; i < len; i++) {
                if ((Foundation.isObject(v1[i]) && v1[i][this.valueField] || v1[i]) !==
                    (Foundation.isObject(v2[i]) && v2[i][this.valueField] || v2[i])) {
                    return false;
                }
            }
            return true;
        },

        setDisplayValue: function (records) {
            var display = "";
            if (records.length > this.maxDisplayCount) {
                display = Foundation.String.format(this.moreDisplayFormat, records.length);
            } else {
                display = Foundation.Array.map(records, function (record) {
                    return record[this.displayField] || ""
                }, this).join(this.partition);
            }
            this.el.input.val(display);
        },

        setValue: function (value) {
            var displayData = [];

            this.valueStorage = [];
            if (Foundation.isString(value) && value.indexOf(this.partition) > -1) {
                value = value.split(this.partition);
            }
            value = Foundation.Array.from(value);

            Foundation.Array.forEach(value, function (val) {
                var record = this.findRecordByValue(val);

                if (Foundation.isEmpty(record)) {
                    record = val;
                    if (!Foundation.isObject(record)) {
                        var dataObj = {};
                        dataObj[this.valueField] = record;
                        dataObj[this.displayField] = record;
                        record = dataObj;
                    }
                    this.source.push(record);
                }
                var itemValue = record[this.valueField];
                displayData.push(record);
                this.valueStorage.push(itemValue);
            }, this);

            this.value = this.multi ? this.valueStorage : this.valueStorage[0];
            if (!Foundation.isDefined(this.value)) {
                this.value = null;
            }
            this.setDisplayValue(displayData);
            this.checkChange();

            if (this.el.picker && !this.stopResetItemClsSet && this.itemLoaded) {
                this.checkItemsSelected();
            }
        },

        checkItemsSelected: function () {
            var self = this;
            this.el.items.each(function () {
                var itemElement = $(this);
                var itemValue = itemElement.attr('data-key');
                itemElement.toggleClass(self.itemSelectedCls, Foundation.Array.contains(self.valueStorage, itemValue));
            });
        },

        getValue: function () {
            return Foundation.isArray(this.value) ? this.value.join(this.partition) : (this.value || "");
        },

        getSelected: function () {
            var selecteds = [];
            var values = Foundation.Array.from(this.getValue());

            Foundation.Array.forEach(values, function (value) {
                if (Foundation.isEmpty(value)) {
                    return
                }
                var record = this.source.getByKey(value);
                record && selecteds.push(record);
            }, this);
            return selecteds
        }

    });
    exports.ComboBox = ComboBox;

    /**
     * 标签组件
     * */
    var TagInput = Class.create({

        extend: ComboBox

    });
    exports.TagInput = TagInput;

    /**
     * 上传组件
     * */
    var UploadInput = Class.create({

        extend: InputTrigger,

        extClsList: ['ui-input-upload'],

        placeholder: '选择文件...',

        auto: true,

        url: '',

        method: 'POST',

        fileValField: 'file',

        accept: null,

        sizeLimit: null,

        singleSizeLimit: 200 * 1024 * 1024,

        params: {},

        value: null,

        filename: '',

        //formatValueFormResult: function (result) { return result.id },

        _init: function () {
            UploadInput.superclass._init.apply(this);
            this.createWebUpload();

            //由于webuploader组件修改了target内部结构,所以要重新获取下el
            this.el.input = this.el.target.find('input.ui-input-trigger-input');
            this.el.trigger = this.el.target.find('span.ui-input-trigger-icon');
        },

        createWebUpload: function () {
            this.webUploader = window.WebUploader.create({
                pick: {
                    id: this.el.target[0],
                    multiple: false
                },
                server: this.url,
                method: this.method,
                fileVal: this.fileValField,
                accept: this.accept,
                fileSizeLimit: this.sizeLimit,
                fileSingleSizeLimit: this.singleSizeLimit,
                auto: this.auto,
                formData: this.params,
                duplicate: true
            })
        },

        _afterInit: function () {
            UploadInput.superclass._afterInit.apply(this);
            this.setFileName(this.filename);
        },

        _initEvents: function () {
            this.webUploader.on('fileQueued', this.onUploadFileQueued.bind(this));

            this.webUploader.on('uploadStart', this.onFileUploadStart.bind(this));
            this.webUploader.on('uploadProgress', this.onFileUploadProgress.bind(this));
            this.webUploader.on('uploadError', this.onFileUploadFailure.bind(this));
            this.webUploader.on('uploadSuccess', this.onFileUploadSuccess.bind(this));
            this.webUploader.on('uploadComplete', this.onFileUploadComplete.bind(this));
            this.webUploader.on('error', this.onError.bind(this));
        },

        onUploadFileQueued: function (file) {
            this.file = file;
            this.setFileName(file.name);
        },

        onFileUploadStart: function (file) {
            this.fireEvent('start', file);
            this.el.target.addClass('ui-input-upload-ing');
            this.el.trigger.addClass('ui-icon-spin');
        },

        onFileUploadProgress: function (file, percentage) {
            this.fireEvent('progress', file, percentage);
        },

        onFileUploadFailure: function (file) {
            this.fireEvent('failure', file);
        },

        onFileUploadSuccess: function (file, result) {
            this.fireEvent('success', file, result);
            this.setValue(this.formatValueFormResult(result));
        },

        onFileUploadComplete: function () {
            this.fireEvent('complete');
            this.el.target.removeClass('ui-input-upload-ing');
            this.el.trigger.removeClass('ui-icon-spin');
        },

        onError: function (type) {
            this.fireEvent('error', type);
            switch (type) {
                case 'Q_EXCEED_NUM_LIMIT':
                    break;
                case 'F_EXCEED_SIZE':
                case 'Q_EXCEED_SIZE_LIMIT':
                    this.onFilesSizeExceed();
                    break;
                case 'Q_TYPE_DENIED':
                    this.onFileTypeError();
                    break;
            }
        },

        onFilesSizeExceed: function () {
            this.fireEvent('exceed-size-limit-error');
        },

        onFileTypeError: function () {
            layer.open({
                title: '温馨提示',
                content: '文件类型不正确!',
                icon: 2
            });
        },

        formatValueFormResult: function (result) {
            return result.id;
        },

        /**
         * 设置上传参数
         * */
        setParams: function (params) {
            this.params = params || {};
            this.webUploader.option('formData', this.params);
        },

        setFileName: function (filename) {
            this.filename = filename || "";
            this.el.input.val(this.filename);
        },

        getFileName: function () {
            return this.filename
        },

        setValue: function (value) {
            if (Foundation.isEmpty(value)) {
                return;
            }
            this.value = value;
        },

        upload: function () {
            if (Foundation.isEmpty(this.file)) {
                return
            }
            this.webUploader.upload();
        },

        getValue: function () {
            return this.value
        },

        destroy: function () {
            this.webUploader.destroy();
            UploadInput.superclass.destroy.apply(this, arguments);
        }

    });
    exports.UploadInput = UploadInput;

    /**
     * 搜索框控件
     * */
    var FormSearchInput = Class.create({

        extend: FormInput,

        extClsList: ['ui-search-input'],

        _init: function () {
            FormSearchInput.superclass._init.apply(this);
            this.el.searchBtn = $('<span class="ui-search-input-trigger-icon"></span>')
                .appendTo(this.el.target);
        },

        onInputKeydown: function (input, event) {
            FormSearchInput.superclass.onInputKeydown.apply(this, arguments);
            var keyCode = event.keyCode;
            if (keyCode == 13) {
                this.search()
            }
        },

        _initEvents: function () {
            FormSearchInput.superclass._initEvents.apply(this);
            this._bindEvent(this.el.searchBtn, 'click', 'search')
        },

        search: function () {
            this.triggerEvent('search', this.getValue());
        }

    });
    exports.FormSearchInput = FormSearchInput;

    /**
     * 下拉树
     * */
    var TreeInput = Class.create({

        extend: PickerInput,

        extClsList: ['ui-tree-combo-box'],

        multi: true,

        maxDisplayCount: 3,

        moreDisplayFormat: '已选择了{0}条记录',

        partition: ',',

        valueField: 'value',

        displayField: 'text',

        treeSettingAsync: {},

        treeSettingData: {},

        treeSettingView: {},

        treeNodes: [],

        afterRenderPicker: function () {
            if (Foundation.isEmpty(this.el.treeBox)) {
                this._treeID = Foundation.uniqueId('ui-tree-combo');
                this.el.treeBox = $('<ul id="' + this._treeID + '" class="ztree"></ul>').appendTo(this.el.picker);
            }
            this.__initTree();
            this.el.picker.css({
                maxHeight: 300,
                overflow: 'auto'
            });
        },

        __initTree: function () {
            var setting = {};
            setting.async = this.treeSettingAsync;
            setting.data = this.treeSettingData;
            setting.view = this.treeSettingView;

            if (this.multi) {
                setting.check = {
                    enable: true,
                    chkboxType: {"Y": "", "N": ""}
                };
                setting.view.dblClickExpand = false;
            }

            setting.callback = {
                beforeClick: this.onTreeNodeBeforeClick.bind(this),
                onClick: this.onTreeNodeClick.bind(this),
                onCheck: this.onTreeNodeCheck.bind(this)
            };
            this.tree = $.fn.zTree.init(this.el.treeBox, setting, this.treeNodes);
        },

        onTreeNodeBeforeClick: function (treeId, node) {
            if (this.multi) {
                this.tree.checkNode(node, !node.checked, null, true);
                return false;
            } else {
                if (this.triggerEvent('before-node-select', node) === false) {
                    return false
                }
            }
        },

        onTreeNodeClick: function (event, treeId, node) {
            if (this.multi) {
                return
            }
            this.triggerEvent('select-node', node);
            this.setValue(node);
            this.collapse();
        },

        onTreeNodeCheck: function (event, treeId, node) {
            if (!this.multi) {
                return
            }
            var nodes = this.tree.getCheckedNodes(true);
            this.setValue(nodes);
        },

        getTree: function () {
            return this.tree
        },

        setDisplayValue: function (records) {
            var display = "";
            if (records.length > this.maxDisplayCount) {
                display = Foundation.String.format(this.moreDisplayFormat, records.length);
            } else {
                display = Foundation.Array.map(records, function (record) {
                    return record[this.displayField] || ""
                }, this).join(this.partition);
            }
            this.el.input.val(display);
        },

        setValue: function (value) {
            var displayData = [];

            this.valueRecordStorage = [];
            this.valueStorage = [];
            value = Foundation.Array.from(value);

            Foundation.Array.forEach(value, function (record) {
                var itemValue = record[this.valueField];
                displayData.push(record);
                this.valueStorage.push(itemValue);
                this.valueRecordStorage.push(record);
            }, this);

            this.value = this.multi ? this.valueStorage : this.valueStorage[0];
            if (!Foundation.isDefined(this.value)) {
                this.value = null;
            }
            this.setDisplayValue(displayData);
            this.checkChange();
        },

        getValue: function () {
            return Foundation.isArray(this.value) ? this.value.join(this.partition) : (this.value || "");
        },

        getSelected: function () {
            if (this.multi) {
                return this.valueRecordStorage
            }
            return this.valueRecordStorage[0]
        }

    });
    exports.TreeInput = TreeInput;

});
