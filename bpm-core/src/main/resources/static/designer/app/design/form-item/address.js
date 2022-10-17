define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormBaseWidget = require('./base');

    var PhoneFormAddressWidget = Class.create({
        extend: FormBaseWidget,
        xtype: FormBaseWidget.XTYPE.ADDRESS,
        settingPanelType: 'address',
        isGroup: true,
        _getCellItems: function() {
            var areaCell = this._createCell(PhoneFormAddressWidget.CELL_CONFIG.SELECT, 'area', {
                title: this.getSettingByName('areaTitle'),
                value: null
            });
            var detailCell = this._createCell(PhoneFormAddressWidget.CELL_CONFIG.TEXTAREA, 'detail', {
                isTextArea: true,
                title: this.getSettingByName('detailTitle'),
                placeholder: this.getSettingByName('detailPlaceholder'),
                value: null,
                visible: this.getSettingByName('needDetail')
            });
            return [areaCell, detailCell]
        },

        _defaultSetting: function() {
            return Foundation.apply(PhoneFormAddressWidget.superclass._defaultSetting.apply(this), {
                title: '时间区间',
                areaTitle: '地区',
                detailTitle: '详细地址',
                detailPlaceholder: '请输入详细地址',
                needDetail: false
            })
        },

        getOptions: function() {
            return Foundation.apply(PhoneFormAddressWidget.superclass.getOptions.apply(this), {

            })
        },

        setAraeTitle: function(title) {
            this.options.areaTitle = title;
            this.getCellByName('area').setTitle(title);
        }

    });

    return PhoneFormAddressWidget;
});