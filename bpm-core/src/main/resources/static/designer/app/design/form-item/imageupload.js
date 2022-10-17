define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormButtonWidget = require('./button');

    var PhoneFormImageUploadWidget = Class.create({
        extend: FormButtonWidget,
        xtype: FormButtonWidget.XTYPE.IMAGE_UPLOAD,
        settingPanelType: 'imageupload',
        _defaultOptions: function() {
            return Foundation.apply(PhoneFormImageUploadWidget.superclass._defaultOptions.apply(this), {
                buttonCls: 'dui-button-imageupload',
                buttonTitle: '点击上传图片'
            });
        },
        _defaultSetting: function() {
            return Foundation.apply(PhoneFormImageUploadWidget.superclass._defaultSetting.apply(this), {
                title: "图片上传",
                allowMulti: true,
                onlyCamera: false
            })
        },
        getOptions: function() {
            return Foundation.apply(PhoneFormImageUploadWidget.superclass.getOptions.apply(this), {

            });
        }
    });
    return PhoneFormImageUploadWidget;
});