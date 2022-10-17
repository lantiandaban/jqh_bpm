define(function(require, exports, module) {
    var Widget = require('./widget');
    var Container = require('./container');
    var Class = require('Class');
    var Foundation = require('Foundation');

    var TableContainer = Class.create({
        extend: Container,
        _defaultOptions: function() {
            return Foundation.apply({}, {
                baseCls: "x-layout-table",
                rowSize: [],
                colSize: [],
                hgap: 0,
                vgap: 0,
                items: [],
                padding: 0
            }, TableContainer.superclass._defaultOptions.apply())
        },
        _init: function() {
            TableContainer.superclass._init.apply(this);
            this.el.rows = [];
            var options = this.options;
            if (options.padding) {
                this.el.target.css({
                    padding: options.padding
                });
            }
            Foundation.Array.mapCount(options.rowSize.length, function(i) {
                var rowElement = $('<div class="x-layout-table-row"/>').appendTo(this.el.target);
                Foundation.Array.mapCount(options.colSize.length, function(j) {
                    var item = this.options.items[i][j];
                    if (!Foundation.isEmpty(item)) {
                        var colElement = $('<div class="x-layout-table-item"/>').appendTo(rowElement);
                        if (item.xtype) {
                            item = Foundation.apply(item, {
                                width: item.width ? item.width : options.colSize[j],
                                height: item.height ? item.height : options.rowSize[i],
                                renderEl: colElement
                            });
                            this.addWidget(item)
                        } else {
                            colElement.css({
                                width: options.colSize[j],
                                height: options.rowSize[i]
                            }).append(item)
                        }
                        if (j > 0) {
                            colElement.css({
                                "margin-left": options.hgap
                            })
                        }
                    }
                }, this);
                if (i > 0) {
                    rowElement.css({
                        "margin-top": options.vgap
                    })
                }
                this.el.rows.push(rowElement)
            }, this);
        },
        getRowAt: function(i) {
            return this.el.rows[i]
        },
        setRowVisible: function(indexs, visible) {
            Foundation.Array.forEach(indexs, function(index) {
                visible ? this.el.rows[indexs[index]].show() : this.el.rows[indexs[index]].hide()
            }, this);
        }
    });

    Widget.register('tablecontainer', TableContainer);

    return TableContainer;
});