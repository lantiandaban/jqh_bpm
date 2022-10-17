define(function (require, exports, module) {

    var Hamster = require('lib/index');

    /**
     * 表单字段组件依赖处理器
     * */
    var ApprovalFormRelyProcessor = Class.create({

        /**
         * 默认批次修改版本
         * */
        defaultVersion: 0,

        /**
         * 当前批次修改版本
         * */
        version: 0,

        initialize: function (widgets) {
            /**
             * 关联组件批次修改版本
             * */
            this.versionMap = {};
            /**
             * 组件修改值的同步版本
             * */
            this.asyncVersionMap = {};
            /**
             * 组件关联, 比如A组件的值是由B组件和C组件的和产生
             * */
            this.relevanceMap = {};
            /**
             * 组件被关联
             * */
            this.linkMap = {};
            /**
             *
             * */
            this.stateVersionMap = {};

            this.widgets = widgets;
            this.relevanceMap = this.getRelevanceMap(this.widgets);
            this.initLinkMap();
        },

        /**
         * 初始化组件关联
         * */
        getRelevanceMap: function (widgets) {
            var relevanceMap = {};
            Hamster.Array.forEach(widgets, function (widgetOptions) {
                if (widgetOptions.xtype == 'detailgroup') {
                    var detailGroupRelevanceMap = this.getRelevanceMap(widgetOptions.items);
                    Hamster.Object.each(detailGroupRelevanceMap, function (widgetName, widgets) {
                        widgetName = [widgetOptions.widgetName, widgetName].join('.');
                        relevanceMap[widgetName] = widgets;
                    }, this);
                }
                var relevance = widgetOptions.rely || widgetOptions.formula || widgetOptions.linkquery;
                if (!Hamster.isEmpty(relevance) && !Hamster.isEmpty(relevance.widgets)) {
                    relevanceMap[widgetOptions.widgetName] = relevance.widgets;
                }
            }, this);
            return relevanceMap
        },

        /**
         * 初始化组件被关联
         * */
        initLinkMap: function () {
            Hamster.Object.each(this.relevanceMap, function (widgetName, widgets) {
                Hamster.Array.forEach(widgets, function (linkWidgetName) {
                    this.createLink(linkWidgetName, widgetName)
                }, this);
            }, this)
        },

        createLink: function (linkWidgetName, widgetName) {
            this.linkMap[linkWidgetName] = this.linkMap[linkWidgetName] || [];
            if (!Hamster.Array.contains(this.linkMap[linkWidgetName], widgetName)) {
                this.linkMap[linkWidgetName].push(widgetName);
            }
            // 加上

            // if (/\./.test(linkWidgetName) && !/\./.test(widgetName)) {
            //     var n = linkWidgetName.split(".")[0];
            //     this.createLink(n, widgetName)
            // }

            if (/\./.test(linkWidgetName)) {
                var n = linkWidgetName.split(".")[0];
                this.createLink(n, widgetName)
            }
        },

        /**
         * 判断是否为明细组件中的子组件
         * */
        isDetailGroupSubWidget: function (t) {
            return /\./.test(t)
        },

        /**
         * 获取关联组件版本
         * */
        getRelevanceVersion: function (widgetName, index, version, map) {
            if (!this.isDetailGroupSubWidget(widgetName)) {
                index = -1;
            }

            map = map || {};
            var relevanceWidgetNames = this.linkMap[widgetName] || [];
            Hamster.Array.forEach(relevanceWidgetNames, function (widgetName) {
                if (!map[widgetName] && !map[widgetName + index]) {
                    if (index > -1 && this.isDetailGroupSubWidget(widgetName)) {
                        map[widgetName + index] = version;
                    } else {
                        map[widgetName] = version
                    }
                    this.getRelevanceVersion(widgetName, index, version, map)
                }
            }, this);
            return map;
        },

        getWidgetVersion: function (widgetName, index) {
            var version = this.versionMap[widgetName] || this.defaultVersion;
            if (index > -1 && this.isDetailGroupSubWidget(widgetName)) {
                version = Math.max(version, this.versionMap[widgetName + index] || this.defaultVersion)
            }
            return version;
        },

        /**
         * 触发关联操作
         * */
        fireRely: function (widget, version, form) {
            var index = -1;
            var widgetName = widget.getWidgetName();

            if (widget.isDetailGroupSubWidget) {
                widgetName = [widget.detailGroupWidgetName, widgetName].join('.');
                index = widget.el.target.closest('tr').index();
            }

            if (Hamster.isEmpty(version)) {
                this.version++;
                version = this.version;
                Hamster.apply(this.versionMap, this.getRelevanceVersion(widgetName, index, version));
            }

            if (index > -1) {
                this.asyncVersionMap[widgetName] = this.asyncVersionMap[widgetName] || {};
                this.asyncVersionMap[widgetName][index] = version;
            } else {
                this.asyncVersionMap[widgetName] = version
            }

            var value = widget.getValue();

            Hamster.Array.forEach(this.linkMap[widgetName], function (name) {
                if (this.getWidgetVersion(name, index) !== version) {
                    return
                }
                var flag = true;
                Hamster.Array.each(this.relevanceMap[name], function (name2) {
                    if (this.getWidgetVersion(name2, index) !== version) {
                        return
                    }
                    var asyncVersion = this.asyncVersionMap[name2];
                    if (this.isDetailGroupSubWidget(name2)) {
                        asyncVersion = asyncVersion || {};
                        if (index > -1 && this.isDetailGroupSubWidget(name)) {
                            flag = asyncVersion[index] === version;
                        } else {
                            var _flag = this.stateVersionMap[name2] === version;
                            Hamster.Object.each(asyncVersion, function (name3, _version) {
                                if (this.stateVersionMap[name2 + name3] === version) {
                                    _flag = true;
                                    if (_version !== version) {
                                        _flag = false;
                                        return false
                                    }
                                }
                            }, this);
                            if (!_flag) {
                                flag = false;
                            }
                        }
                    } else {
                        flag = asyncVersion === version;
                    }
                    return flag && void 0;
                }, this);

                if (!flag) {
                    return
                }

                if (index > -1) {
                    if (this.stateVersionMap[name + index] === version) {
                        return
                    }
                    this.stateVersionMap[name + index] = version;
                } else {
                    if (this.stateVersionMap[name] === version) {
                        return
                    }
                    this.stateVersionMap[name] = version
                }

                var relevanceWidget;
                if (this.isDetailGroupSubWidget(name)) {
                    if (index > -1) {
                        relevanceWidget = form.getFormItemWidgetByName(name, index);
                        if (Hamster.isEmpty(relevanceWidget)) {
                            return
                        }
                        this.asyncVersionMap[name] = this.asyncVersionMap[name] || {};
                        this.asyncVersionMap[name][index] = false;
                        form.dealRely(name, relevanceWidget, version, value);
                    } else {

                        var _index = 0;
                        this.asyncVersionMap[name] = this.asyncVersionMap[name] || {};
                        do {
                            if (relevanceWidget = form.getFormItemWidgetByName(name, _index)) {
                                this.asyncVersionMap[name][_index] = false;
                                form.dealRely(name, relevanceWidget, version, value);
                            }
                            _index++;
                        } while (relevanceWidget)
                    }
                } else {
                    relevanceWidget = form.getFormItemWidgetByName(name);
                    if (Hamster.isEmpty(relevanceWidget)) {
                        return
                    }
                    this.asyncVersionMap[name] = false;
                    form.dealRely(name, relevanceWidget, version, value);
                }
            }, this);
        },

        destroy: function () {
            this.defaultVersion = 0;
            this.version = 0;
            this.versionMap = {};
            this.asyncVersionMap = {};
            this.relevanceMap = {};
            this.linkMap = {};
            this.stateVersionMap = {};

            delete this.versionMap;
            delete this.asyncVersionMap;
            delete this.relevanceMap;
            delete this.linkMap;
            delete this.stateVersionMap;
        }

    });
    return ApprovalFormRelyProcessor;
});