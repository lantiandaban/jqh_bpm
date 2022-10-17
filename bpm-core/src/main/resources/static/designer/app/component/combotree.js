define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var TriggerWidget = require('./trigger');
    var Tree = require('./tree');
    var Foundation = require('Foundation');

    var ComboTreeWidget = Class.create({
        extend: TriggerWidget,
        _defaultOptions: function() {
            return Foundation.apply(ComboTreeWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fui_combotree",
                triggerIcon: "icon-ui-combo",
                triggerList: "combotree-list",
                delimiter: ",",
                items: null,
                onAfterNodeClick: null
            });
        },
        _init: function() {
            ComboTreeWidget.superclass._init.apply(this);

            this._initStoreValue();
            if (!this.options.async) {
                this._createTreeView()
            }
        },

        _initStoreValue: function() {
            this.value = [];
            this.text = [];
        },

        _onTriggerClick: function(b) {
            if (!this.isEnabled()) {
                return;
            }
            var self = this;
            this._showTreeView();
            $(document).bind("mousedown.treeview", function(b) {
                var d = b.target,
                    e = $(d).closest(self.treeView);
                if (Foundation.isEmpty(e)) {
                    self._hideTreeView()
                }
            })
        },
        _createTreeView: function() {
            var b = this.options,
                c = this;
            this.treeView = $('<div class="x-dropdown x-dropdown-list"/>').addClass(b.triggerList);
            this.tree = new Tree({
                renderEl: this.treeView,
                Nodes: b.items,
                setting: {
                    treeId: b.treeId,
                    data: {
                        simpleData: {
                            enable: !0
                        }
                    },
                    callback: {
                        onClick: function(a, d) {
                            if (d.isParent) {
                                this.onSwitchNode(a, d)
                            } else {
                                c._setValueByNode(d);
                                c._applyCallback(b.onAfterNodeClick, c, [d]);
                                c._hideTreeView()
                            }
                        }
                    }
                }
            })
        },

        _setValueByNode: function(a) {
            if (a) {
                this.value = [a.id];
                this.text = [a.name];
                for (var b = a.getParentNode(); b;) {
                    this.value.unshift(b.id);
                    this.text.unshift(b.name);
                    b = b.getParentNode()
                }
            }
            this.el.input && this.el.input.val(this.text.join(this.options.delimiter))
        },
        _hideTreeView: function() {
            if (this.treeView) {
                $(document).unbind("mousedown.treeview");
                this.treeView.detach()
            }
        },
        _showTreeView: function() {
            if (!this.treeView) {
                this._createTreeView()
            }
            this.treeView.appendTo("body").css(this._getTriggerViewPosition()).show()
        },
        setValue: function(b) {
            var c = this,
                d = $.makeArray(b),
                e = this.tree.getNodes();
            this.value = [];
            this.text = [];

            Foundation.Array.forEach(d, function(b, a) {
                var f = false;
                Foundation.Array.forEach(e, function(h, g) {
                    if (h.id === b) {
                        c.value.push(h.id);
                        c.text.push(h.name);
                        f = !0;
                        e = h.children;
                        if (a === d.length - 1) {
                            c.tree.selectNode(h)
                        }
                        return false
                    }
                });
                if (!f) {
                    return false
                }
            });
            this.el.input && this.el.input.val(this.text.join(this.options.delimiter))
        },
        getValue: function() {
            return this.value
        },
        getText: function() {
            return this.text
        }

    });

    Widget.register('combotree', ComboTreeWidget);

    return ComboTreeWidget;
});