define(function (require, exports, module) {

    var formConditionsHtml = require('text!view/process/form-conditions.hbs');

    var Class = require('Class');
    var Foundation = require('Foundation');
    var Widget = require('../../../component/widget');
    var components = require('../../../component/index');
    var constants = require('../../constants');
    var AssignUserChoosePanel = require('./assign-user-choose-panel');

    var FormConditionsPanelWidget = Class.create({
        extend: Widget,
        _defaultOptions: function () {
            return Foundation.apply(FormConditionsPanelWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fx_assign_user_choose",
                formItems: [],
                conditionsItems: []
            });
        },
        _init: function () {
            FormConditionsPanelWidget.superclass._init.apply(this);

            this.el.conditionsBox = this.el.target.find('.conditions-box');
            this.el.addConditionBtn = this.el.conditionsBox.find('.add-btn');
            this.el.userChooseBox = this.el.target.find('.user-choose-box');
            this.el.conditionsList = this.el.conditionsBox.find('ul.conditions-list');

            this._unactiveUserChoosePanel();
            this._initUserChoosePanel();
        },

        _defaultRoot: function () {
            return $(formConditionsHtml)
        },

        _initDefaultValue: function() {
            this.setConditionsItems(this.options.conditionsItems);
        },


        _initEvents: function () {
            this._bindEvent(this.el.addConditionBtn, 'click', '_onAddConditionBtnClick');
            this._bindDelegateEvent(this.el.conditionsList, '.remove-btn', 'click', '_onRemoveConditionBtnClicks');
        },

        _onAddConditionBtnClick: function (element, event) {
            this._createConditionsItemElement();
        },

        _onRemoveConditionBtnClicks: function (element, event) {
            var self = this;
            var itemELement = element.closest('li');

            function doRemove() {
                var settingButton = itemELement.data('settingButton');
                if (settingButton.el.target.hasClass('selected')) {
                    self._unactiveUserChoosePanel();
                }
                itemELement.remove();
            }

            if (!itemELement.data('edited')) {
                doRemove();
                return
            }

            components.Msg.bubble({
                anchor: element,
                contentHTML: $('<div class="delete-confirm-info"/>').text("若删除该组判断条件，将会影响到表单的控制流程。确定删除？"),
                dockPosition: "right",
                type: "error",
                text4Ok: "删除",
                hAdjust: -1,
                onOk: doRemove
            })
        },

        _createConditionsItemElement: function (conditions) {
            conditions = conditions || {
                    ao: 'and',
                    judge: '=',
                    value: '',
                    users: [],
                    formItemWidgetName: ''
                };

            var itemElement = $('<li />');

            new components.ComboBox({
                renderEl: $('<div class="filter-item"/>').appendTo(itemElement),
                width: 100,
                items: [{
                    value: "and",
                    text: "AND条件",
                    selected: true
                }, {
                    value: "or",
                    text: "OR条件"
                }],
                onDataFilter: function (item) {
                    item.selected = conditions.ao == item.value;
                    return item;
                },
                onAfterItemSelect: function (element, item) {
                    conditions.ao = item.value;
                    itemElement.data('edited', true);
                }
            });

            new components.ComboBox({
                renderEl: $('<div class="filter-item"/>').appendTo(itemElement),
                width: 150,
                placeholder: "表单中字段组件",
                items: Foundation.clone(this.options.formItems || []),
                onDataFilter: function (item) {
                    item.selected = conditions.formItemWidgetName == item.value;
                    return item;
                },
                onAfterItemSelect: function (element, item) {
                    conditions.formItemWidgetName = item.value;
                    itemElement.data('edited', true);
                }
            });

            new components.ComboBox({
                renderEl: $('<div class="filter-item"/>').appendTo(itemElement),
                width: 120,
                items: [{
                    value: "=",
                    text: "等于(=)",
                    selected: true
                }, {
                    value: ">",
                    text: "大于(>)"
                }, {
                    value: "<",
                    text: "小于(<)"
                }, {
                    value: ">",
                    text: "大于等于(>=)"
                }, {
                    value: ">",
                    text: "小于等于(<=)"
                }],
                onDataFilter: function (item) {
                    item.selected = conditions.judge == item.value;
                    return item;
                },
                onAfterItemSelect: function (element, item) {
                    conditions.judge = item.value;
                    itemElement.data('edited', true);
                }
            });

            new components.Input({
                renderEl: $('<div class="filter-item"/>').appendTo(itemElement),
                width: 150,
                placeholder: "判断值",
                value: conditions.value || null,
                onAfterEdit: function (event, value) {
                    conditions.value = value;
                    itemElement.data('edited', true);
                }
            });

            var settingButton = new components.Button({
                renderEl: $('<div class="filter-item"/>').appendTo(itemElement),
                width: 65,
                style: 'white',
                text: '审批人',
                onClick: this._onSettingButtonClick.bind(this)
            });

            $('<span class="remove-btn"><i class="icon-trasho"></i></span>').appendTo(itemElement);

            itemElement.appendTo(this.el.conditionsList);
            itemElement.data('conditions', conditions);
            itemElement.data('settingButton', settingButton);
            itemElement.data('edited', false);
        },

        _onSettingButtonClick: function (event) {
            var itemElement = $(event.target).closest('li');
            var settingButton = itemElement.data('settingButton');

            itemElement.siblings().each(function () {
                var otherItemElement = $(this);
                var otherSettingButton = otherItemElement.data('settingButton');
                otherSettingButton.el.target.removeClass('selected');
                otherSettingButton.setValue('审批人');
            });
            this._currentSetUserConditionsElement = null;

            settingButton.setValue('设置中');
            settingButton.el.target.addClass('selected');
            this._currentSetUserConditionsElement = itemElement;
            this._currentSetUserConditions = itemElement.data('conditions');
            this._setUserChoosePanelValue(this._currentSetUserConditions.users);
        },

        _initUserChoosePanel: function () {
            var self = this;
            this._assignUserChoosePanel = new AssignUserChoosePanel({
                userIdKey: 'id',
                userNameKey: 'name',
                value: [],
                onUserItemsChanged: function () {
                    self._currentSetUserConditions.users = self._assignUserChoosePanel.getValue();
                    self._currentSetUserConditionsElement && self._currentSetUserConditionsElement.data('edited', true);
                }
            });
            this._assignUserChoosePanel.el.target.appendTo(this.el.userChooseBox);
        },

        _setUserChoosePanelValue: function (value) {
            this._activeUserChoosePanel();
            this._assignUserChoosePanel.setValue(value, true);
        },

        _activeUserChoosePanel: function () {
            this.el.userChooseBox.removeClass('empty');
        },

        _unactiveUserChoosePanel: function () {
            this.el.userChooseBox.addClass('empty');
        },

        setConditionsItems: function (conditionsItems) {
            if (Foundation.isEmpty(conditionsItems)) {
                this._createConditionsItemElement();
                return
            }
            console.log(conditionsItems);
            Foundation.Array.forEach(conditionsItems || [], function (conditions) {
                this._createConditionsItemElement(conditions);
            }, this);
        },

        getConditionsItems: function () {
            var items = [];
            this.el.conditionsList.find('li').each(function () {
                var conditions = $(this).data('conditions');
                items.push(Foundation.clone(conditions));
            });
            return items;
        }

    });

    return FormConditionsPanelWidget;
});