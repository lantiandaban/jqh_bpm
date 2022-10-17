  

/**
 *
 * @author sog
 * @version 1.0
 */
define(function (require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var FormBaseWidget = require('./base');

    var alignMap = ['right', 'left', 'center'];

    var bizTypes = {
        billTitle : '审批标题',
        billCode : '审批编号',
        loginUser : '审批申请人',
        department : '申请人部门'
    };

    var FormBizWidget = Class.create({
        extend: FormBaseWidget,
        xtype: FormBaseWidget.XTYPE.biz,
        settingPanelType: 'biz',
        _init: function () {
            FormBizWidget.superclass._init.apply(this);
            this.el.text = $('<div />').addClass('dui-label').appendTo(this.el.target);
        },
        _afterInit: function () {
            FormBizWidget.superclass._afterInit.apply(this);
            var options = this.options;
            this.setTextAlign(options.align);

            var type = this.getSettingByName('type');

            var tipText = bizTypes[type];
            this.el.text.text(tipText);

        },

        _defaultSetting: function () {
            return Foundation.apply(FormBizWidget.superclass._defaultSetting.apply(this), {
                title: "标题",
                align: 1,
                type: 'billTitle',
                canEdit: false
            })
        },

        setType: function (type) {
            this.options.type = type;
            this.setSetting('type', type);

            var tipText = bizTypes[type];
            this.el.text.text(tipText);
        },

        getType: function () {
            return this.getSettingByName('type');
        },
        setTextAlign: function (align) {
            this.el.text.css('text-align', alignMap[align]);
            this.options.align = align;
            this.setSetting('align', align);
        }
    });

    return FormBizWidget
});