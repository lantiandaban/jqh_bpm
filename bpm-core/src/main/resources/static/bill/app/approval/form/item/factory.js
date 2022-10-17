define(function (require, exports, module) {
    return {
        _item_comp_map: {},

        register: function (name, Comp) {
            this._item_comp_map[name] = Comp;
        },

        create: function (name, config) {
            var Comp = this._item_comp_map[name];
            if (!Comp) {
                return
            }
            return new Comp(config)
        }
    }
});