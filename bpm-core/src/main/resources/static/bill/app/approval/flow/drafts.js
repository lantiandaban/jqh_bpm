/**
 *
 * @author Mr_Zhou
 * @version 1.0
 */
define(function (require, exports, module) {

    var Hamster = require('lib/index');
    var BasePage = require('app/layout/page');
    var pageTabManager = require('app/layout/page-tab-manager');

    var FlowSearch = require('./search/flow-search');

    var layTable = layui.table;

    //获取界面对应的Html字符串, 这里使用的是hbs
    var flowdraftsPageHtml = require('text!view/approval/flow/drafts.hbs');

    //创建界面对象
    var flowdraftsPage = Class.create({

        //继承于BasePage对象
        extend: BasePage,

        //重写_getContentElement钩子方法,获取组件内容jQuery对象, 可通过this.el.target来访问
        _getContentElement: function () {
            return $(flowdraftsPageHtml)
        },

        _beforeInit: function () {
            flowdraftsPage.superclass._beforeInit.apply(this);
        },

        //重写_init钩子方法,
        // 实现一些自己的逻辑
        _init: function () {
            //调用父类的_init方法
            flowdraftsPage.superclass._init.apply(this);
            this.el.process_types = $("#drafts-process-types");
            this.el.drafts_search = $("#drafts-search");
            this.el.applyBtn = $("#drafts-apply-btn");

            this.ProcessCombox = FlowSearch.ProcessCombox(this.el.process_types);

            this.startTime = new Hamster.ui.FormDateTime({
                width: 120,
                placeholder: '请选择',
                chooseType: "date",
                format: 'yyyy-MM-dd',
                appendToEl: $('#drafts-start-time')
            });
            this.endTime = new Hamster.ui.FormDateTime({
                width: 120,
                placeholder: '请选择',
                chooseType: "date",
                format: 'yyyy-MM-dd',
                appendToEl: $('#drafts-end-time')
            });

            this._initServerDataTable();
        },
        _initServerDataTable: function () {
            var self = this;
            this._serverDataTable = layTable.render({
                elem: '#toa_bill_drafts_tb',
                height: 'full-290', //容器高度
                page: true,
                loading: true,
                even: true,
                url: 'api/bill/web/drafts'
                , where: {t: Hamster.uniqueId('toa_')},
                cols: [[
                    {
                        width: 58,
                        title: '序号',
                        fixed: true,
                        templet: '#laytpl_public_index'
                    },
                    {
                        field: 'code',
                        width: 220,
                        title: '编号',
                        sort: true,
                        templet: '#laytool_drafts_code'
                    },
                    {
                        field: 'title',
                        width: 300,
                        title: '标题',
                        templet: '#laytool_drafts_title'
                    },
                    {
                        field: 'processName',
                        width: 120,
                        title: '业务流程'
                    },
                    {
                        field: 'priority',
                        width: 88,
                        title: '优先级',
                        templet: '#laytpl_public_priority'
                    },
                    {
                        field: 'createTime',
                        width: 150,
                        title: '创建时间',
                        templet: '#laytpl_drafts_time'
                    },
                    {
                        fixed: 'right',
                        width: 160,
                        title: '操作',
                        toolbar: '#laytool_drafts_action'
                    }]
                ]
            });

            //监听工具条
            layTable.on('tool(draftsTb)', function (obj) {
                var data = obj.data;
                var layEvent = obj.event;
                var billId = data.id;
                if (layEvent === 'detail') { //查看
                    var breadcrumbs = [{
                        title: "首页",
                        url: 'app/home/index'
                    }];
                    pageTabManager.openPage('查看审批单',
                        'app/approval/edit', {mode: 'view', billId: billId}, [{
                            title: "首页", url: 'app/home/index', breadcrumbs: breadcrumbs
                        }, {
                            title: "草稿箱",
                            url: 'app/approval/flow/drafts', breadcrumbs: breadcrumbs
                        }]);
                } else if (layEvent === 'del') {
                    if (billId) {
                        layer.confirm('您确定要删除该申请么？', {icon: 3, title: '温馨提示'},
                            function (index) {
                                var httpAjax = new HttpAjax({
                                    url: 'api/bill/flow/drafts/remove',
                                    params: {billId: billId},
                                    needLoading: true,
                                    type: "post"
                                });
                                httpAjax.successHandler(function (datas) {
                                    self._serverDataTable.reload();
                                    layer.msg('删除成功');
                                    layer.close(index);
                                });
                                httpAjax.satusCodeHandler(500, function () {
                                    layer.msg("请求数据失败", {icon: 5});
                                });
                                httpAjax.send();
                            });
                    }
                }
            });
        },

        //重写_initEvents钩子方法
        _initEvents: function () {
            var self = this;
            this._bindEvent(this.el.drafts_search, "click", function (element) {
                var query_time = self.startTime.getValue() + ' - ' + self.endTime.getValue();
                if(query_time==' - '){
                    query_time='';
                }
                var query_process_id = self.ProcessCombox.getValue();
                var where = {
                    processId: query_process_id,
                    rangeTime: query_time
                };
                self._serverDataTable.reload({
                    where: {
                        t: Hamster.uniqueId('toa_')
                        , q: JSON.stringify(where)
                    }
                });
            });

            this._bindEvent(this.el.applyBtn, 'click', function () {
                pageTabManager.openPage('发起审批',
                    'app/approval/start', {}, [{
                        title: "首页",
                        url: 'app/home/index'
                    }]);
            });
        },
        onPageBreadcrumbItemClick: function (data) {
            if (data.url && data.url != undefined) {
                if (data.url == 'app/home/index') {
                    pageTabManager.openPage(data.title,
                        data.url, {}, []);
                } else {
                    pageTabManager.openPage(data.title,
                        data.url, {}, []);
                }
            }
        },
        reloadDraftsData: function () {
            this._serverDataTable.reload();
        }
    });

    return flowdraftsPage;
});