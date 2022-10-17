define(function(require, exports, module) {
    var Class = require('Class');
    var FormWidgetSettingBasePanel = require('./base');
    var Foundation = require('Foundation');

    var ImageUploadPanel = Class.create({
        extend: FormWidgetSettingBasePanel,
        _defaultOptions: function() {
            return Foundation.apply(ImageUploadPanel.superclass._defaultOptions.apply(this), {

            });
        },
        _getFormWidgetSettingOptions: function() {
            var self = this;
            var options = this.options;
            var formItem = options.formItem;
            var formItemOptions = options.formItem.options;

            return [{
                    xtype: 'title',
                    title: "标题"
                },
                this.__getTitleConfig(), '-', {
                    xtype: 'title',
                    title: "描述信息"
                },
                this.__getDescTextAreaConfig(), '-', {
                    xtype: 'title',
                    title: "校验"
                },
                this.__getVisibleConfig(),
                this.__getRequiredConfig(),
                {
                    xtype: 'checkbox',
                    text: '允许上传多张图片',
                    value: formItem.getSettingByName('allowMulti'),
                    onStateChange: function(selected) {
                        formItem.setSetting('allowMulti', selected)
                    }
                }, {
                    xtype: 'checkbox',
                    text: '仅允许拍照上传',
                    value: formItem.getSettingByName('onlyCamera'),
                    onStateChange: function(selected) {
                        formItem.setSetting('onlyCamera', selected)
                    }
                }
            ]
        }
    });

    FormWidgetSettingBasePanel.register('imageupload', ImageUploadPanel);

    return ImageUploadPanel;
});