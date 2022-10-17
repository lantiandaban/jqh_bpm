define(function (require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var Container = require('./container');

    var SettingPanel = Class.create({
        extend: Container,
        _defaultOptions: function () {
            return Foundation.apply(SettingPanel.superclass._defaultOptions.apply(this), {
                items: []
            });
        },

        _init: function () {
            SettingPanel.superclass._init.apply(this);
            this.el.content = $('<div class="fx_config_pane"></div>');
            this.el.target.append(this.el.content);
            var options = this.options;

            //通过配置项来创建面板中的配置组件
            if (!Foundation.isEmpty(options.items)) {
                Foundation.Array.forEach(options.items, function (item, i) {
                    this._createSubWidget(item);
                }, this);
            }
        },
        //根据属性来创建对应的配置组件
        //注意：item中，必须要包含xtype字段，该字段是需要创建组件的别名，这些组件在app/component目录下        
        _createSubWidget: function (item) {
            var element;
            if (item.xtype == 'title') {
                element = this._getTitleElement(item.title, item.id);
            } else if (item == '-' || item == '|') {
                element = this._getLineElement();
            } else {
                element = item.renderEl = this._getItemWrap();
                this.addWidget(item);
            }
            this.el.content.append(element);
        },
        _getTitleElement: function (title, id) {
            return $('<div class="cfg_title" id="' + id + '"><span>' + title + '</span></div>')
        },
        _getLineElement: function () {
            return $('<div class="cfg_split"/>')
        },
        _getItemWrap: function () {
            return $('<div class="cfg_content"></div>');
        }
    });

    return SettingPanel;

});