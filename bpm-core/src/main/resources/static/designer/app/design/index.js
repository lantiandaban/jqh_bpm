requirejs.config({
    baseUrl: g.ctx + 'static/designer/',
    urlArgs: "t=" + +new Date,
    paths: {
        text: g.ctx + "static/vendor/require/require.text",
        app: 'app',
        view: 'tpl',
        Class: 'app/class',
        Foundation: 'app/foundation'
    }
});

require(['app/design/layout/design',
    'app/design/layout/config',
    'app/design/layout/flow'], function (FormDesign, FormConfig, FlowProcess) {

    function App() {
        this.el = {
            navibarItems: $('.frame-edit-navibar a'),
            designContent: $('#fx-factory'),
            configContent: $('#form-config-content'),
            flowContent: $('#form-flow-content')
        };
        this.init();
    }

    App.prototype = {
        init: function () {
            this._initEvents();
            this._activeNavibarContent(this.el.navibarItems.eq(0));
            this._initType();

        },

        _initEvents: function () {
            var self = this;
            console.log(this);
            this.el.navibarItems.bind('click', function () {
                self._activeNavibarContent($(this));
            });
        },
        /**
         * 菜单点击触发事件
         * @param  itemElement 菜单元素
         */
        _activeNavibarContent: function (itemElement) {
            var itemType = itemElement.attr('data-type');
            itemElement.addClass('active').siblings().removeClass('active');
            switch (itemType) {
                case 'design':
                    this.el.designContent.show().siblings().hide();
                    this._destroyFlow();
                    this._initFromDesignIfNeed();
                    break;
                case 'flow':
                    this.el.flowContent.show().siblings().hide();
                    this._initFromFlowIfNeed();
                    break;
            }
        },
        /**
         * 触发表单初始化，如果已经存在，则不进行初始化
         */
        _initFromDesignIfNeed: function () {
            this.formDesign = this.formDesign || new FormDesign();
        },

        _initFromFlowIfNeed: function () {
            this.flowProcess = this.flowProcess || new FlowProcess({
                formItemWidgets: this.formDesign.getFormItmeWidgets()
            });
        },
        _initType: function() {
            console.log(this);
            switch (g.type) {
                case "2":
                    this._activeNavibarContent(this.el.navibarItems.eq(1));
                    $("a.design").hide();
                    break;
                case "3":
                    this._activeNavibarContent(this.el.navibarItems.eq(0));
                    $("a.flow").hide();
                    break;
            }
        },
        _destroyFlow: function () {
            if (this.flowProcess) {
                this.flowProcess.saveCache();
                this.flowProcess.destroy();
                this.flowProcess = null;
            }
        }
    };

    new App();
});