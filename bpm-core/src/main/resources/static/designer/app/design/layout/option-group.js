define('design-option-group-data', function () {
    return [{
        title: "基础部件",
        items: [{
            xtype: 'text',
            icon: "text",
            name: "单行文本"
        }, {
            xtype: 'number',
            icon: "number",
            name: "数字"
        }, {
            xtype: 'money',
            icon: "combocheck",
            name: "金额"
        }, {
            xtype: 'textarea',
            icon: "textarea",
            name: "多行文本"
        }, {
            xtype: 'datetime',
            icon: "datetime",
            name: "日期时间"
        }, {
            xtype: 'radiogroup',
            icon: "radiogroup",
            name: "单选按钮组"
        }, {
            xtype: 'checkboxgroup',
            icon: "checkboxgroup",
            name: "复选框组"
        }, {
            xtype: 'select',
            icon: "combo",
            name: "下拉框"
        }, {
            xtype: 'multiselect',
            icon: "combocheck",
            name: "下拉复选框"
        }]
    }, {
        title: "增强部件",
        items: [
            //     {
            //     xtype: 'location',
            //     icon: "location",
            //     name: "定位"
            // },
            {
                xtype: 'detailgroup',
                icon: "subform",
                name: "明细"
            }, {
                xtype: 'biz',
                icon: "dept",
                name: "业务只读控件"
            },
            {
                xtype: 'detailcalculate',
                icon: "linkquery",
                name: "逻辑计算控件"
            }, {
                xtype: 'triggerselect',
                icon: "combinedtable",
                name: "弹出选择"
            }, {
                xtype: 'imageupload',
                icon: "image",
                name: "图片"
            }, {
                xtype: 'fileupload',
                icon: "upload",
                name: "附件"
            }]
    }];
});

define(function (require, exports, module) {

    var designOptionGroupData = require('design-option-group-data');
    var designOptionGroupTpl = Handlebars.compile(require('text!view/design/design-option-group.hbs'));

    function DesignOptionGroup(config) {
        this.config = config;
        this.$content = $('#fx-frame-west');
        this.init();
    }

    DesignOptionGroup.prototype = {

        templateData: (function () {
            return {
                groups: designOptionGroupData
            }
        })(),

        init: function () {
            this._initTemplateToDom();
            this._initGroupDargDorp();
        },

        _initTemplateToDom: function () {
            this.$content.html(designOptionGroupTpl(this.templateData));
        },

        _initGroupDargDorp: function () {
            this.$content.find('li').draggable({
                containment: '#fx-factory',
                helper: function (event) {
                    return $(event.currentTarget).clone().css('zIndex', 100).width(110).appendTo(document.body);
                },
                cursor: 'move',
                revert: false
            });
        }
    }

    return DesignOptionGroup;

});