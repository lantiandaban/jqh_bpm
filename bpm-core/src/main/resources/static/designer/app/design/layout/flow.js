define(function (require, exports, module) {

    var processPage = Handlebars.compile(require('text!view/process/home.hbs'));
    var processEmptyPage = require('text!view/process/empty.hbs');

    var Class = require('Class');
    var Foundation = require('Foundation');
    var server = require('../server');
    var constants = require('../constants');
    var FlowSettingPanel = require('../flow-setting/panel');
    var flowNodeSettingPanels = require('../flow-node-setting/panel/index');
    var FlowNodeSettingPanel = require('../flow-node-setting/panel/base');
    var DEFAULT_FLOW_NODE_SETTING = require('../flow-node-setting/def-setting');

    var FLOW_NODE_TYPE_MAP = {
        'bpmn:StartEvent': constants.FLOW_NODE_XTYPE.START,
        'bpmn:EndEvent': constants.FLOW_NODE_XTYPE.END,
        'bpmn:SequenceFlow': constants.FLOW_NODE_XTYPE.LINE,
        'bpmn:Task': constants.FLOW_NODE_XTYPE.TASK,
        'bpmn:ExclusiveGateway': constants.FLOW_NODE_XTYPE.JUDGE
    };

    var __cacheFlowData = null;

    function createFlowNodeSetting(type, nodeId, extSetting) {
        console.log(type, nodeId, extSetting, '-----------');
        var setting = DEFAULT_FLOW_NODE_SETTING[type] || DEFAULT_FLOW_NODE_SETTING[constants.FLOW_NODE_XTYPE.DEFAULT];
        return Foundation.apply({}, Foundation.apply(extSetting || {}, {
            ntype: type,
            nodeId: nodeId
        }), setting);
    }

    /**
     * 流程设计器对象
     */
    return Class.create({

        initialize: function (options) {
            this.options = Foundation.apply({
                formItemWidgets: []
            }, options);

            this.el = {};
            this.el.target = $('#form-flow-content');

            this._initEmptyTipElement();
            this._initFlowWrapElement();
            this._initEvents();
            this._loadFlowData();
        },

        _loadFlowData: function () {
            if (!Foundation.isEmpty(__cacheFlowData)) {
                this._initFlowWithConfig(__cacheFlowData);
                return;
            }
            this._initFlowWithConfig(window.g.process.workflow);
        },

        _initFlowWithConfig: function (config) {
            this.__enable = config.enable;
            this.__node_setting_map = {};
            this.__setting = Foundation.clone(config.attr);
            this.__flowXML = config.xml;

            Foundation.Array.forEach(config.nodeSettings || [], function (setting) {
                this.__node_setting_map[setting.nodeId] = setting;
            }, this);
            this.setFlowEnable(this.__enable);
        },

        _initEmptyTipElement: function () {
            this.el.empty = $(processEmptyPage).addClass('x-ui-hidden').appendTo(this.el.target);
        },

        _initFlowWrapElement: function () {
            this.el.flowContent = $(processPage()).addClass('x-ui-hidden').appendTo(this.el.target);
            this.el.flowConfigTab = this.el.flowContent.find('#flowConfigTab');
            this.el.flowNodeSettingContent = $('#flowNodeSettingContent');
            this.el.flowSettingContent = $('#flowSettingContent');
            this.el.saveBtn = $('#flow-save-btn');
            this.el.closeBtn = $('#flow-close-btn');
        },

        /**
         * 事件绑定
         */
        _initEvents: function () {
            var self = this;
            this.el.empty.on('click', 'div.empty-btn', function (e) {
                self._onOpenFlow();
            });

            this.el.flowConfigTab.find('.tab-item').bind('click', function () {
                var tab = $(this);
                var type = tab.attr('data-type');
                if (type === 'node') {
                    self._showFlowNodeSettingElement();
                } else {
                    self._showFlowSettingElement();
                }
            });

            this.el.saveBtn.bind('click', function () {
                self._onFlowSave();
            });
            this.el.closeBtn.bind('click', function () {
                var layerIdx = layer.confirm('是否确定关闭当前窗口?', {
                    title: '警告',
                    icon: 3,
                    closeBtn: false,
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    //todo 需要跨域解决关闭窗口
                    closeWindow();
                }, function () {
                    layer.close(layerIdx);
                });
            });
        },

        _showFlowNodeSettingElement: function () {
            this.el.flowConfigTab.find('.node-tab').addClass('tab-item-actived').siblings().removeClass('tab-item-actived');
            this.el.flowNodeSettingContent.removeClass('x-ui-hidden');
            this.el.flowSettingContent.addClass('x-ui-hidden');
        },

        _showFlowSettingElement: function () {
            this.el.flowConfigTab.find('.flow-tab').addClass('tab-item-actived').siblings().removeClass('tab-item-actived');
            this.el.flowNodeSettingContent.addClass('x-ui-hidden');
            this.el.flowSettingContent.removeClass('x-ui-hidden');
        },

        //初始化流程属性设置面板对象
        _initFlowSettingPanel: function () {
            var self = this;
            this.flowSettingPanel = new FlowSettingPanel({
                renderEl: this.el.flowSettingContent,
                setting: this.__setting,
                onCloseFlow: this._onCloseFlow.bind(this),
                onSettingChange: function (name, value) {
                    self.setFlowSetting(name, value);
                }
            });
        },

        _initFlowPanel: function () {
            this.bpmn = new BpmnJS({
                container: '#chart-content',
                keyboard: {
                    bindTo: document
                }
            });
            this._initBindBpmnEvents();
            this._loadBpmnData();
        },

        _initBindBpmnEvents: function () {
            this._bpmnEventBus = this.bpmn.get('eventBus');
            this._bpmnEventBus.on('element.click', this._onBpmnElementClick.bind(this));
            this._bpmnEventBus.on('shape.added', this._onBpmnShapeAdded.bind(this));
            this._bpmnEventBus.on('connection.added', this._onBpmnConnectionAdded.bind(this));
            this._bpmnEventBus.on('shape.removed', this._onBpmnShapeRemoved.bind(this));
            this._bpmnEventBus.on('connection.removed', this._onBpmnConnectionRemoved.bind(this));
            this._bpmnEventBus.on('commandStack.element.updateLabel.executed', this._onBpmnElementUpdateLabel.bind(this));
        },

        //点击Bpmn的节点
        _onBpmnElementClick: function (event) {
            var type = event.element.type;
            if (type === 'label') {
                return;
            }
            if (type === 'bpmn:Process') {
                //this._activeFlowSettingPanel();
            } else {
                var ntype = FLOW_NODE_TYPE_MAP[type];
                this._activeFlowNodeSettingPanel(ntype, event.element, event.gfx);
            }
        },

        //创建新Shape节点时, 初始化创建的节点除外
        _onBpmnShapeAdded: function (event, data) {
            var nodeId = event.element.id;
            var type = data.element.type;
            if (!this.__bpmnLoadDataFinish || type === 'label') {
                return
            }
            var ntype = FLOW_NODE_TYPE_MAP[type];
            this._addFlowNodeSetting(ntype, nodeId);
            this._activeFlowNodeSettingPanel(ntype, data.element, event.gfx);
        },

        _onBpmnConnectionAdded: function (event) {
            var nodeId = event.element.id;
            var type = event.element.type;
            if (!this.__bpmnLoadDataFinish) {
                return
            }
            var ntype = FLOW_NODE_TYPE_MAP[type];
            this._addFlowNodeSetting(ntype, nodeId);
        },

        //删除Shape节点
        _onBpmnShapeRemoved: function (event) {
            var node = event.element;
            if (node == this._currentActiveFlowNode) {
                this._activeFlowSettingPanel();
                this._destroyCurrentNodeSettingPanel();
            }
            this._removeFlowNodeSetting(node.id);
        },

        //删除Connection节点
        _onBpmnConnectionRemoved: function (event) {
            var node = event.element;
            if (node == this._currentActiveFlowNode) {
                this._activeFlowSettingPanel();
                this._destroyCurrentNodeSettingPanel();
            }
            this._removeFlowNodeSetting(node.id);
        },

        //删除节点的label改变后
        _onBpmnElementUpdateLabel: function (event) {
            var label = event.context.newLabel;
            if (this.currentFlowNodeSettingPanel) {
                this.currentFlowNodeSettingPanel.setTitleWidgetValue(label);
                this.setFlowNodeSetting(event.context.element.id, 'title', label);
            }
        },

        //加载bpmn的初始化数据
        _loadBpmnData: function () {
            var self = this;
            this._onBeforeLoadBpmnData();
            this.bpmn.importXML(this.__flowXML, function (err) {
                if (err) {
                    return console.error('could not import BPMN 2.0 diagram', err);
                }
                self._onAfterLoadBpmnData();
            })
        },

        _onBeforeLoadBpmnData: function () {
            this.__bpmnLoadDataFinish = false;
        },

        _onAfterLoadBpmnData: function () {
            this.__bpmnLoadDataFinish = true;
            var canvas = this.bpmn.get('canvas');
            canvas.zoom('fit-viewport');
        },

        //激活流程设置面板
        _activeFlowSettingPanel: function () {
            this._destroyCurrentNodeSettingPanel();
            this._showFlowSettingElement()
        },

        //激活流程节点设置面板
        _activeFlowNodeSettingPanel: function (ntype, node, elem) {
            var self = this,
                nodeId = node.id;

            if (Foundation.isEmpty(ntype)) {
                ntype = constants.FLOW_NODE_XTYPE.DEFAULT
            }

            this._currentActiveFlowNode = node;
            this._showFlowNodeSettingElement();

            if (this.currentFlowNodeSettingPanel) {
                if (nodeId === this.currentFlowNodeSettingPanel.nodeId) {
                    return;
                }
                this._destroyCurrentNodeSettingPanel();
            }

            this.currentFlowNodeSettingPanel = FlowNodeSettingPanel.create(ntype, {
                renderEl: this.el.flowNodeSettingContent,
                formItemWidgets: this.options.formItemWidgets,
                linkFlowNodeElement: $(elem),
                setting: this.getFlowNodeSetting(nodeId, ntype),
                onSettingChange: function (key, value) {
                    self.setFlowNodeSetting(nodeId, key, value);
                }
            });
            this.currentFlowNodeSettingPanel.nodeId = nodeId;
        },

        _destroyCurrentNodeSettingPanel: function () {
            if (this.currentFlowNodeSettingPanel) {
                this.currentFlowNodeSettingPanel.destroy();
                this.currentFlowNodeSettingPanel = null;
            }
        },

        _onCloseFlow: function () {
            var self = this;
            server.closeProcess(window.g.process.id, function () {
                self.setFlowEnable(false)
            })
        },

        _onOpenFlow: function () {
            var self = this;
            server.openProcess(window.g.process.id, function () {
                self.setFlowEnable(true)
            })
        },

        _onFlowSave: function () {
            var flowData = this._getFlowData();
            server.saveFlowData(window.g.process.id, this._getFlowData());
        },

        _addFlowNodeSetting: function (ntype, nodeId) {
            if (Foundation.isEmpty(ntype)) {
                ntype = constants.FLOW_NODE_XTYPE.DEFAULT
            }
            this.__node_setting_map[nodeId] = createFlowNodeSetting(ntype, nodeId);
        },

        _removeFlowNodeSetting: function (nodeId) {
            delete this.__node_setting_map[nodeId]
        },

        _getFlowData: function () {
            var flowData = {
                enable: this.__enable,
                nodeSettings: this.getAllFlowNodeSettings(),
                attr: this.__setting
            };
            this.bpmn.saveXML({format: false}, function (error, xml) {
                if (error) {
                    return console.error('获取流程XML失败', error);
                }
                flowData.xml = xml;
            });
            return flowData
        },

        //获取流程节点设置
        getFlowNodeSetting: function (nodeId, ntype) {
            var setting = this.__node_setting_map[nodeId];
            if (Foundation.isEmpty(setting)) {
                setting = this._addFlowNodeSetting(ntype, nodeId);
            }
            return Foundation.clone(setting)
        },

        //设置流程节点设置
        setFlowNodeSetting: function (nodeId, key, value) {
            var setting = this.__node_setting_map[nodeId];
            setting[key] = value;
        },

        setFlowSetting: function (name, key) {
            this.__setting[name] = key;
        },

        getAllFlowNodeSettings: function () {
            var nodeSettings = [];
            Foundation.Object.each(this.__node_setting_map, function (nodeId, setting) {
                console.log(setting);
                if (setting.ntype == constants.FLOW_NODE_XTYPE.TASK) {
                    //补全操作权限设置
                    setting = flowNodeSettingPanels.TaskNodePanel.completionPermissions(setting, this.options.formItemWidgets);
                }
                nodeSettings.push(setting);
            }, this);
            return nodeSettings;
        },

        //保存缓存,在切换最顶部菜单时,会保存当前流程数据,再次切换过来时候,会直接使用缓存数据进行初始化
        saveCache: function () {
            __cacheFlowData = this._getFlowData();
        },

        //设置流程开启关闭状态
        setFlowEnable: function (enable) {
            if (!(this.__enable = enable)) {
                this.el.empty.removeClass('x-ui-hidden');
                this.el.flowContent.addClass('x-ui-hidden');
                return
            }

            this.el.empty.addClass('x-ui-hidden');
            this.el.flowContent.removeClass('x-ui-hidden');
            this._showFlowSettingElement();
            this.bpmn || this._initFlowPanel();
            this.flowSettingPanel || this._initFlowSettingPanel();
        },

        destroy: function () {
            this.el.target.empty();
        }

        // //设置当前选中的流程节点label值
        // setFlowNodeLabel: function (label, node) {
        //     var modeling = this.bpmn.get('modeling');
        //     node = node || this._currentActiveFlowNode;
        //     if (Foundation.isEmpty(node)) {
        //         return
        //     }
        //     modeling.updateLabel(node, label);
        // },
    })

});