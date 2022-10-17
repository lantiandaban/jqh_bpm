define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormButtonWidget = require('./button');

    var PhoneFormFileUploadWidget = Class.create({
        extend: FormButtonWidget,
        xtype: FormButtonWidget.XTYPE.FILE_UPLOAD,
        settingPanelType: 'fileupload',
        _defaultOptions: function() {
            return Foundation.apply(PhoneFormFileUploadWidget.superclass._defaultOptions.apply(this), {
                buttonCls: 'dui-button-fileupload',
                buttonTitle: '点击上传文件'
            });
        },
        _defaultSetting: function() {
            return Foundation.apply(PhoneFormFileUploadWidget.superclass._defaultSetting.apply(this), {
                title: "文件上传",
                allowMulti: false
            })
        },
        _setting2Options: function(setting) {
            return Foundation.apply(PhoneFormFileUploadWidget.superclass._setting2Options.apply(this, arguments), {

            })
        }
    });
    return PhoneFormFileUploadWidget;
});