define(function(require, exports, module) {
    require('./location-scope-edit');

    var Class = require('Class');
    var Widget = require('../../../component/widget');
    var components = require('../../../component/index');
    var Foundation = require('Foundation');

    var LocationScopeListWidget = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(LocationScopeListWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fx_location_list",
                items: [],
                onAfterEdit: null
            });
        },
        _init: function() {
            LocationScopeListWidget.superclass._init.apply(this);
            this._createBtn();
            this._createList()
        },

        _createBtn: function() {
            var self = this;
            new components.Button({
                renderEl: $("<div/>").appendTo(this.el.target),
                text: "新增定位中心",
                height: 30,
                style: "white",
                onClick: function() {
                    self._createDialog()
                }
            })
        },

        _createList: function() {
            var options = this.options;
            this.el.positionList = $('<ul class="location-list"/>').appendTo(this.el.target);
            Foundation.Array.forEach(options.items || [], function(item) {
                this._createPosition(item)
            }, this);
        },

        _initEvents: function() {
            this._bindDelegateEvent(this.el.positionList, 'i.icon-edit', 'click', '_onPositionItemEditBtnClick');
            this._bindDelegateEvent(this.el.positionList, 'i.icon-trasho', 'click', '_onPositionItemRemoveBtnClick');
        },

        _createPosition: function(item) {
            $('<li class="location-item"/>')
                .append($('<span class="location-name"/>').text(item.name))
                .append($('<i class="icon-trasho"/>'))
                .append($('<i class="icon-edit"/>'))
                .data("position", item).appendTo(this.el.positionList)
        },

        _onPositionItemEditBtnClick: function(element, event) {
            var locationElement = element.closest('.location-item');
            this._createDialog(locationElement);
        },

        _onPositionItemRemoveBtnClick: function(element, event) {
            var positionElement = element.closest("li.location-item");
            positionElement.remove();
            this._applyCallback(this.options.onAfterEdit, this);
        },

        _createDialog: function(positionElement) {
            this.positionDialog = new components.ConfirmDialog({
                title: "新增定位中心",
                width: 570,
                height: 510,
                contentWidget: {
                    rowSize: [450],
                    colSize: [540],
                    hgap: 0,
                    vgap: 15,
                    padding: 15,
                    items: [
                        [{
                            xtype: "x-location-scope-edit",
                            widgetName: "locationLimit"
                        }]
                    ]
                },
                onOk: this._onLocationDialogSave.bind(this),
                onClose: this._onLocationDialogClose.bind(this)
            });
            this.positionDialog.open();

            if (positionElement) {
                this._curEditPositionElement = positionElement;
                var locationScopeEdit = this.positionDialog.getWidgetByName("locationLimit");
                locationScopeEdit.setValue(positionElement.data('position'))
            }
        },

        _onLocationDialogSave: function() {
            var locationScopeEdit = this.positionDialog.getWidgetByName("locationLimit");
            if (!locationScopeEdit.checkValidate()) {
                return;
            }
            var positionItem = locationScopeEdit.getValue();
            if (this._curEditPositionElement) {
                this._curEditPositionElement.children('.location-name').text(positionItem.name);
                this._curEditPositionElement.data('position', positionItem);
            } else {
                this._createPosition(positionItem);
            }
            this._applyCallback(this.options.onAfterEdit, this);
        },

        _onLocationDialogClose: function() {
            this._curEditPositionElement = null;
        },

        getLocationItems: function() {
            var items = [];
            this.el.positionList.children(".location-item").each(function(event, itemElement) {
                items.push($(itemElement).data("position"))
            });
            return items;
        }
    });

    Widget.register('x-location-scope', LocationScopeListWidget);

    return LocationScopeListWidget;
});