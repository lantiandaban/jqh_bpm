define(function(require, exports, module) {
    var Class = require('Class');
    var FormBaseWidget = require('./base');

    return Class.create({
        extend: FormBaseWidget,
        _getMainCellItem: function() {
            return {
                title: this.getSettingByName('title'),
                value: this.getSettingByName('value')
            }
        }
    });
});