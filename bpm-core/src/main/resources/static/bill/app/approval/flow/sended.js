/**
 *
 * @author Mr_Zhou
 * @version 1.0
 */
define(function (require, exports, module) {
    var layTable = layui.table;
    var Hamster = require('lib/index');
    var BasePage = require('app/layout/page');

    var FlowSearch = require('./search/flow-search');
    //获取界面对应的Html字符串, 这里使用的是hbs
    var flowSendedPageHtml = require('text!view/approval/flow/sended.hbs');
    var pageTabManager = require('app/layout/page-tab-manager');

    //创建界面对象
    var flowSendPage = Class.create({

        //继承于BasePage对象
        extend: BasePage,

        //重写_getContentElement钩子方法,获取组件内容jQuery对象, 可通过this.el.target来访问
        _getContentElement: function () {
            return $(flowSendedPageHtml)
        },

        _beforeInit: function () {
            flowSendPage.superclass._beforeInit.apply(this);
        },
        _tableQuery: function () {
            // debugger
            var self = this;
            var param = self._queryParam();
            self._serverDataTable.reload({
                where: {
                    _: Hamster.uniqueId('toa_'),
                    q: JSON.stringify(param)
                }
                , done: function (res, curr, count) {
                    $.cookie(self.queryCookieName, JSON.stringify(param), {expires: 24});
                }
            });
        },
        _queryParam: function () {
            // debugger
            var query_time = this.startTime.getValue()+' - '+this.endTime.getValue();
            if(query_time==' - '){
                query_time='';
            }
            var query_process_id = this.ProcessCombox.getValue();
            var query_status = this.StatusCombox.getValue();
            var approvals = this.ApproverSelect.select2('data');
            var customerData = this.CustomerSelect2.select2('data');
            var approvals_id = '0';
            if (!Hamster.isEmpty(approvals)) {
                approvals_id = approvals[0].id;
            }
            var customerName = '';
            if (!Hamster.isEmpty(customerData)) {
                customerName = customerData[0].text;
            }
            if (!Hamster.isEmpty(this._totalTableSearchCustomerId)) {
                customerData = this._totalTableSearchCustomerId;
            }
            //因为审批类型数据是从后台异步加载的
            // 这里只能从cook中获取
            var cacheQueryValue = $.cookie(this.queryCookieName);
            this._totalTableSearchCustomerId = null;
            if (!Hamster.isEmpty(cacheQueryValue) && query_process_id == "") {
                var queryParam = JSON.parse(cacheQueryValue);
                if (queryParam['processId']) {
                    query_process_id = queryParam['processId'];
                }
            }
            return {
                rangeTime: query_time
                , processId: query_process_id
                , status: query_status
                , approvals: approvals
                , approval: approvals_id,
                customerData: customerData,
                customerName: customerName
                , oldEmpId: $("#current-user-id").val()
            }
        },

        //重写_init钩子方法,
        // 实现一些自己的逻辑
        _init: function () {
            //调用父类的_init方法
            flowSendPage.superclass._init.apply(this);
            this.el.process_types = $("#sended-process-types");
            this.el.employee_select = $("#sended-employee-select");
            this.el.sended_flow_status = $("#sended-flow-status");
            this.el.collection_select = $("#approval-customer-select");
            this.el.send_search = $("#send-search");
            this.el.applyBtn = $('#sended-apply-btn');

            this.ApproverSelect = FlowSearch.ApproverSelect2(this.el.employee_select);
            this.StatusCombox = FlowSearch.SendBillStatusCombox(this.el.sended_flow_status);
            this.CustomerSelect2 = FlowSearch.SupplierSelect2(this.el.collection_select);
            this.el.sended_start_time = $("#sended-start-time");
            this.el.sended_end_time = $("#sended-end-time");
            this.startTime = new Hamster.ui.FormDateTime({
                width: 120,
                placeholder: '请选择',
                chooseType: "date",
                format: 'yyyy-MM-dd',
                appendToEl: this.el.sended_start_time
            });
            this.endTime = new Hamster.ui.FormDateTime({
                width: 120,
                placeholder: '请选择',
                appendToEl: this.el.sended_end_time
            });
            this._loader = new Hamster.ui.Loader({
                text: '数据加载中...',
                container: this.el.target
            });
            this.queryCookieName = 'toa_send_detail_param';

            this._initQueryTool();
            this._initServerDataTable();
        },
        _initQueryTool: function () {
            var self = this;
            var cacheQueryValue = $.cookie(self.queryCookieName);
            var currentUserId = $("#current-user-id").val();
            if (Hamster.isEmpty(cacheQueryValue)) {
                var time = moment().subtract('months', 6).format('YYYY-MM-DD');
                this.startTime.setValue(time);
                var end = moment().format('YYYY-MM-DD');
                this.endTime.setValue(end);
                this.ProcessCombox = FlowSearch.ProcessCombox(this.el.process_types);
            } else if (JSON.parse(cacheQueryValue).oldEmpId != currentUserId) {
                var time = moment().subtract('months', 6).format('YYYY-MM-DD');
                this.startTime.setValue(time);
                var end = moment().format('YYYY-MM-DD');
                this.endTime.setValue(end);
                this.ProcessCombox = FlowSearch.ProcessCombox(this.el.process_types);

            } else {
                var queryParam = JSON.parse(cacheQueryValue);
                var rangeTime = queryParam['rangeTime'];
                var queryType = queryParam['processId'];
                var queryStatu = queryParam['status'];
                var approvals = queryParam['approvals'];
                var time = rangeTime.split(" - ");
                this.startTime.setValue(time[0]);
                this.endTime.setValue(time[1]);
                this.StatusCombox.setValue(queryStatu);

                // if(queryType){
                this.ProcessCombox = FlowSearch.ProcessCombox(this.el.process_types, queryType);
                // }

                if (approvals) {
                    FlowSearch.Select2SetValue(this.ApproverSelect, approvals[0]);
                }
            }
        },
        _initServerDataTable: function () {
            var self = this;
            var param = this._queryParam();
            this._serverDataTable = layTable.render({
                elem: '#toa_bill_sender_tb'
                , height: 'full-290' //容器高度
                , page: true
                , loading: true
                , even: true
                , url: 'api/bill/web/minecreate'
                // , where: {t: Hamster.uniqueId('toa_')}
                , cols: [[
                    {fixed: true, width: 58, title: '序号', templet: '#laytpl_public_index'}
                    , {
                        field: 'code',
                        width: 220,
                        title: '审批编号',
                        sort: true,
                        templet: '#laytool_sended_code'
                    }
                    , {width: 280, title: '标题', templet: '#laytool_sended_title'}
                    , {field: 'processName', width: 150, title: '审批类型'}
                    , {
                        width: 80,
                        title: '优先级',
                        templet: '#laytpl_public_priority'
                    }
                    , {field: 'startTime', width: 155, title: '发起时间', templet: '#laytpl_time'}
                    , {field: 'status', width: 88, title: '审批状态', templet: '#laytpl_public_status'},
                    {
                        field: 'customerName',
                        width: 155,
                        title: '收款单位'
                    }
                    , {fixed: 'right', width: 70, title: '操作', toolbar: '#laytool_action'}]
                ]
                , where: {
                    t: Hamster.uniqueId('toa_'),
                    q: JSON.stringify(param)
                }
                , done: function () {
                    self._loader.stop();
                }
            });

            //监听工具条
            layTable.on('tool(senderTb)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
                var data = obj.data; //获得当前行数据
                var layEvent = obj.event; //获得 lay-event 对应的值

                if (layEvent === 'detail') { //查看
                    var billId = data.id;
                    var breadcrumbs = [{
                        title: "首页",
                        url: 'app/home/index'
                    }];
                    pageTabManager.openPage('查看审批单',
                        'app/approval/edit', {mode: 'view', billId: billId, list: 'sended'},
                        [{
                            title: "首页", url: 'app/home/index', breadcrumbs: breadcrumbs
                        }, {
                            title: "我发起的", url: 'app/approval/flow/sended', breadcrumbs: breadcrumbs
                        }]);
                }
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
        //重写_initEvents钩子方法
        _initEvents: function () {
            var self = this;
            this._bindEvent(this.el.applyBtn, 'click', function () {
                pageTabManager.openPage('发起审批',
                    'app/approval/start', {}, [{
                        title: "首页",
                        url: 'app/home/index'
                    }]);
            });
            this._bindEvent(this.el.send_search, "click", function (element) {
                self._tableQuery();
            });

        }
    });

    return flowSendPage;
});