define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('../../../component/widget');
    var components = require('../../../component/index');
    var Foundation = require('Foundation');

    var LocationScopeEditWidget = Class.create({
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(LocationScopeEditWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fx_location_limit"
            });
        },
        _init: function() {
            LocationScopeEditWidget.superclass._init.apply(this);
            this.mapAutoComplete = new AMap.Autocomplete({});
            this._createMap();
            this._createRadius()
        },
        _createMap: function() {
            this.el.map = $('<div id="location-map" class="location-map" style="border: 1px solid #e0e0e0"/>').appendTo(this.el.target);
            this.map = new AMap.Map("location-map", {
                resizeEnable: true,
                zooms: [14, 18]
            });
            this.el.searchResultList = $('<ul class="location-tip"/>').appendTo(this.el.target);

            this.nameInput = new components.Input({
                renderEl: $('<div class="location-search" id="location-search"/>').appendTo(this.el.target),
                placeholder: "选择定位中心",
                onAfterEdit: this._onSearchInputAfterEdit.bind(this)
            })
        },
        _createRadius: function() {
            var locationRadiusElement = this.el.locationRadius = $('<div class="location-radius"/>').appendTo(this.el.target);
            locationRadiusElement.append($("<span/>").text("定位范围"));
            this.radiusInput = new components.Input({
                renderEl: $('<div class="radius-input"/>').appendTo(locationRadiusElement)
            });
            locationRadiusElement.append($("<span/>").text("米"))
                .append($('<div class="radius-tip"/>').text("以定位中心为圆心设置定位半径，建议范围500-1000"));
        },

        _onSearchInputAfterEdit: function() {
            var self = this;
            var searchText = this.nameInput.getValue();
            this.mapAutoComplete.search(searchText, function(status, result) {
                self.el.searchResultList.empty().show();
                if (Foundation.isEmpty(result.tips)) {
                    self.el.searchResultList.append($('<div class="tip-empty"/>').text("当前无搜索结果"));
                }
                Foundation.Array.forEach(result.tips, function(item, i) {
                    if (item.location) {
                        var itemElement = $('<li class="tip-item"/>')
                            .append($('<span class="tip-name"/>').text(item.name))
                            .append($('<span class="tip-address"/>').text(item.district))
                            .data("tip", item);
                        self.el.searchResultList.append(itemElement)
                    }
                })
            })
        },

        _initEvents: function() {
            var self = this;
            this._bindEvent(this.el.target, 'click', function() {
                self.el.searchResultList.hide()
            });
            this._bindDelegateEvent(this.el.searchResultList, '.tip-item', 'click', '_onSearchResultItemClick');
        },

        _onSearchResultItemClick: function(itemElement, event) {
            var item = itemElement.data('tip');
            if (!item || !item.location) {
                return;
            }
            if (this.marker) {
                this.marker.setPosition([item.location.lng, item.location.lat])
            } else {
                this.marker = new AMap.Marker({
                    position: [
                        item.location.lng,
                        item.location.lat
                    ],
                    map: this.map
                })
            }

            this.position = [item.location.lng, item.location.lat];
            this.nameInput.setValue(item.name);
            this.map.setFitView()
        },

        checkValidate: function() {
            return true
        },

        getValue: function() {
            return {
                position: this.position,
                name: this.nameInput.getValue(),
                radius: this.radiusInput.getValue()
            }
        },
        setValue: function(value) {
            if (!value) {
                return;
            }
            this.nameInput.setValue(value.name);
            this.radiusInput.setValue(value.radius);
            this.position = value.position;
            if (this.marker) {
                this.marker.setPosition(value.position)
            } else {
                this.marker = new AMap.Marker({
                    position: value.position,
                    map: this.map
                })
            }
            this.map.setFitView()
        }
    });

    Widget.register('x-location-scope-edit', LocationScopeEditWidget);

    return LocationScopeEditWidget;
});