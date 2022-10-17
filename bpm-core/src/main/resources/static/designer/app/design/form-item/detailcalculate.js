  

define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormInputWidget = require('./input');

    var FormDetailCalateWidget = Class.create({
        extend: FormInputWidget,
        xtype: FormInputWidget.XTYPE.DETAIL_CALCULATE,
        settingPanelType: 'detailcalculate',
        _defaultOptions: function() {
            return Foundation.apply(FormDetailCalateWidget.superclass._defaultOptions.apply(this), {
                isTextArea: false
            });
        },
        _defaultSetting: function() {
            return Foundation.apply(FormDetailCalateWidget.superclass._defaultSetting.apply(this), {
                title: "计算控件",
                formula: null,
                valueType: 'formula'
            })
        },
        getOptions: function() {
            return $.extend(FormDetailCalateWidget.superclass.getOptions.apply(this), {

            });
        }
    });
    return FormDetailCalateWidget;
});