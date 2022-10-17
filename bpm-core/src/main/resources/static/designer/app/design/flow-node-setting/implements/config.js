
define(function(require, exports, module) {

    var Class = require('Class');
    var Foundation = require('Foundation');

    var DefualtsImplement = {
        __getTitleConfig: function() {
            return {
                xtype: 'input',
                widgetName: 'titleInput',
                placeholder: "双击节点编辑标题",
                enable: false,
                value: this.getNodeSettingByName('title')
            }
        },

        __getDescConfig: function ( ) {
            var self = this;
            return {
                xtype: 'textarea',
                placeholder: "设置节点描述",
                value: this.getNodeSettingByName('desc'),
                onAfterEdit: function(event, value) {
                    self.setNodeSetting('desc', value);
                }
            }
        }
    };

    return DefualtsImplement
});