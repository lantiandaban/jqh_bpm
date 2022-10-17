define(function (require, exports, module) {

    var Hamster = require('lib/index');
    var BasePage = require('app/layout/page');
    var launchApprovalHtml = require('text!view/approval/start.hbs');
    var launchApprovalGrounp = Handlebars.compile(require('text!view/approval/launch-group.hbs'));
    var pageTabManager = require('app/layout/page-tab-manager');

    var LaunchApprovalPage = Class.create({

        extend: BasePage,

        el: {
            start_link: $('a.view-detail')
        },

        _initEvents: function () {
            this._bindDelegateEvent(this.el.body, 'li.ui-panel-listPart', 'click', function (target) {
                var processData = target.data();
                var processId = processData['id'];
                var processName = processData['name'];
                var breadcrumbs = [{
                    title: "首页",
                    url: 'app/home/index'
                }];
                pageTabManager.openPage(processName, 'app/approval/edit',
                    {mode: 'create', processId: processId}, [{
                        title: "首页",
                        url: 'app/home/index', breadcrumbs: breadcrumbs
                    }, {
                        title: "发起审批",
                        url: 'app/approval/start', breadcrumbs: breadcrumbs
                    }]);
            });

        },
        _init: function () {
            var self = this;
            LaunchApprovalPage.superclass._init.apply(this);
            this.el.body = $('#approval-launch-body');
            // ajax获取数据
            var httpAjax = new HttpAjax({
                url: 'api/process/list/type',
                needLoading: true,
                type: "get"
            });
            httpAjax.successHandler(function (datas) {
                self._loadApprovalItemListData(datas);
                self.initLazy();
            });
            httpAjax.satusCodeHandler(500, function () {
                layer.msg("请求数据失败", {icon: 5});
            });
            httpAjax.send();

        },

        _loadApprovalItemListData: function (group) {
            var startItemsHtml = launchApprovalGrounp({
                group: group
            });
            this.el.body.append(startItemsHtml);
        },
        onPageBreadcrumbItemClick: function (data) {
            if (data.url && data.url != undefined) {
                pageTabManager.openPage(data.title,
                    data.url, {}, []);
            }
        },
        /**
         * 图片加载出错改写路径（Lazy插件）
         */
        initLazy: function () {
            $("img.lazy").Lazy({
                onError: function (element) {
                    $(element).attr('src', g.ctx + 'static/resource/img/noImage.gif');
                }
            });
        },
        _getContentElement: function () {
            return $(launchApprovalHtml);
        }

    });

    return LaunchApprovalPage;
});