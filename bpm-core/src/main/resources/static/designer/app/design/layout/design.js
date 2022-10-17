define(function (require, exports, module) {
    require('../form-item/index');
    require('../form-item-setting/panel/index');

    var Class = require('Class');
    var Foundation = require('Foundation');
    var server = require('../server');
    var DesignOptionGroup = require('./option-group');
    var DesignForm = require('./form');
    var components = require('../../component/index');
    var FormWidgetSettingPanel = require('../form-item-setting/panel/base');
    var FormSettingPanel = require('../form-setting/panel');

    return Class.create({

        initialize: function () {
            this.el = {};
            this.el.formItemSettingPanel = $('#widget-config-pane');
            this.el.formSettingPanel = $('#form-config-pane');
            this.el.tab = $('#design-config-tab');
            this.el.saveBtn = $('#form-designer-save-btn');
            this.el.closeBtn = $('#form-designer-close-btn');

            this._initDesignOptionGroup();
            this._initDesignForm();
            this._initFormSettingPanel();
            this._initEvents();
        },
        /**
         * 绑定操作事件
         */
        _initEvents: function () {
            var self = this;
            this.el.tab.find('.tab-item').bind('click', function () {
                var tab = $(this);
                var type = tab.attr('data-type');
                if (type == 'item') {
                    self.showFormItemSettingPanel();
                } else {
                    self.showFormSettingPanel();
                }
            });
            this.el.saveBtn.bind('click', function () {
                self._onFormDesignSave();
            });
            this.el.closeBtn.bind('click', () => {
                var layerIdx = layer.confirm('是否确定关闭当前窗口?', {
                    title: '警告',
                    icon: 3,
                    closeBtn: false,
                    btn: ['确定', '取消'] //按钮
                }, () => {
                    //todo 需要跨域解决关闭窗口
                     closeWindow();
                }, () => {
                    layer.close(layerIdx);
                });
            })
        },

        showFormItemSettingPanel: function () {
            this.el.tab.find('.widget-tab').addClass('tab-item-actived').siblings().removeClass('tab-item-actived');
            this.el.formItemSettingPanel.show().siblings().hide();
        },

        showFormSettingPanel: function () {
            this.el.tab.find('.form-tab').addClass('tab-item-actived').siblings().removeClass('tab-item-actived');
            this.el.formSettingPanel.show().siblings().hide();
        },

        _initDesignOptionGroup: function () {
            var self = this;

            function onContainerItemDragStart(designOptionGroup, $item, container) {

            }

            function onContainerItemDrag(designOptionGroup, $item, position) {
                var scrollTop = $(".phone-form-panel").scrollTop();
                position.left = 0;
                position.top -= (designOptionGroup.dd.startPoint.top - scrollTop);
            }

            function onOptionItemDrop(designOptionGroup, $item, container) {
                var title = $item.find('span').text();
                var xtype = $item.attr('xtype');
                self.designForm.insertFormItem(xtype, title, $item);
            }

            function afterDrop() {
                currentDragContainerFormItem = null;
            }

            function onContainerPlaceholderMove(designOptionGroup, $placeholder) {

            }

            this.designOptionGroup = new DesignOptionGroup({
                isContainerItem: function ($item) {
                    return $item.hasClass('form-item')
                },
                onContainerItemDragStart: onContainerItemDragStart,
                onContainerItemDrag: onContainerItemDrag,
                onOptionItemDrop: onOptionItemDrop,
                afterDrop: afterDrop,
                onContainerPlaceholderMove: onContainerPlaceholderMove
            });
        },

        _initDesignForm: function () {
            var self = this;
            this.designForm = new DesignForm({
                onFormItemChoosed: this._onFormItemWidgetChoosed.bind(this),
                onFormItemRemoved: this._onFormItemWidgetRemoved.bind(this),
                onClickFromSettingMenuItem: function () {
                    self.showFormSettingPanel();
                }
            });
        },

        _initFormSettingPanel: function () {
            this.formSettingPanel = new FormSettingPanel({
                renderEl: this.el.formSettingPanel,
                form: this.designForm
            });
        },

        //当点击表单组件时触发的事件
        _onFormItemWidgetChoosed: function (formItem) {
            this.showFormItemSettingPanel();

            if (this.currentFormWidgetSettingPanel) {
                //TODO 有的情况下 this.el.target是不能remove的
                this.currentFormWidgetSettingPanel.destroy();
                this.currentFormWidgetSettingPanel = null;
            }
            //创建右侧的表单组件设置面板组件对象，通过表单组件（formItem）的settingPanelType来创建对应的面板组件
            //请移步到 form-item-setting/panel/base.js 下查看statics下的register和create方法
            this.currentFormWidgetSettingPanel = FormWidgetSettingPanel.create(formItem.settingPanelType, {
                form: this.designForm,
                formItem: formItem,
                renderEl: this.el.formItemSettingPanel
            });
        },

        _onFormItemWidgetRemoved: function (formItem) {
            if (this.currentFormWidgetSettingPanel) {
                this.currentFormWidgetSettingPanel.destroy();
                this.currentFormWidgetSettingPanel = null;
            }
        },

        //保存表单设置
        _onFormDesignSave: function () {
            var formDesignData = {};
            formDesignData.attr = this.designForm.getFormAttr();
            formDesignData.attr.id = window.g.process.id;
            formDesignData.columnItems = this.designForm.getFormTableColumnItems();
            server.saveFormData(formDesignData);
        },

        getFormItmeWidgets: function () {
            return this.designForm.getFormItemWidgets();
        }
    })
});