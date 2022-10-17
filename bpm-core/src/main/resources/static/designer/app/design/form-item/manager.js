define(function(require, exports, module) {
    var Class = require('Class');

    return new(Class.create({
        initialize: function(options) {
            this._itemsObjects = {};
        },
        register: function(xtype, Item) {
            this._itemsObjects[xtype] = Item;
        },
        create: function(xtype, options, setting) {
            var Item = this._itemsObjects[xtype];
            if (Item) {
                return new Item(options, setting);
            }
            return null;
        }
    }))
});