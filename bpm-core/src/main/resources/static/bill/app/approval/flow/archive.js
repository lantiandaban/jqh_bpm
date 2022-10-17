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

    var flowApprovalPageHtml = require('text!view/approval/flow/archive.hbs');

    var layTable = layui.table;

    var FlowArchivePage = Class.create({
        extend: BasePage,

        //重写_getContentElement钩子方法,获取组件内容jQuery对象, 可通过this.el.target来访问
        _getContentElement: function () {
            return $(flowApprovalPageHtml)
        },

        _beforeInit: function () {
            FlowArchivePage.superclass._beforeInit.apply(this);
        },

        //重写_init钩子方法,
        _init: function () {
            //调用父类的_init方法
            FlowArchivePage.superclass._init.apply(this);
            this.el.archive_start_time = $("#archive-start-time");
            this.el.archive_end_time = $("#archive-end-time");
            this.el.process_types = $("#archive-process-types");
            this.el.employee_select = $("#archive-employee-select");
            this.el.archive_table = this.el.target.find('#archive-data-div');
            this.el.archive_flow_status = $("#archive-flow-status");
            this.el.archive_search = $("#archive-search");
            this.el.archive_apply_btn = $("#archive-apply-btn");

            this.StatusCombobox = FlowSearch.SendBillStatusCombox(this.el.archive_flow_status);
            this.EmployeeSelect2 = FlowSearch.ApproverSelect2(this.el.employee_select);
            this.startTime = new Hamster.ui.FormDateTime({
                width: 120,
                placeholder: '请选择',
                chooseType: "date",
                format: 'yyyy-MM-dd',
                appendToEl: this.el.archive_start_time
            });
            this.endTime = new Hamster.ui.FormDateTime({
                width: 120,
                placeholder: '请选择',
                chooseType: "date",
                format: 'yyyy-MM-dd',
                appendToEl: this.el.archive_end_time
            });
            this._loader = new Hamster.ui.Loader({
                text: '数据加载中...',
                container: this.el.target
            });
            this.queryCookieName = 'toa_archive_detail_param';
            this._initQueryTool();
            this._initServerDataTable();
        },
        _initQueryTool: function () {
            var self = this;
            var cacheQueryValue = $.cookie(self.queryCookieName);
            if (Hamster.isEmpty(cacheQueryValue)) {
                var time = moment().subtract('months', 6).format('YYYY-MM-DD');
                var end = moment().format('YYYY-MM-DD');
                this.startTime.setValue(time);
                this.endTime.setValue(end);
                this.ProcessCombox = FlowSearch.ProcessCombox(this.el.process_types);
            } else {
                var queryParam = JSON.parse(cacheQueryValue);
                var rangeTime = queryParam['rangeTime'];
                var queryType = queryParam['processId'];
                var queryStatu = queryParam['status'];
                var employeeData = queryParam['employeeData'];
                var time = rangeTime.split(' - ');
                this.startTime.setValue(time[0]);
                this.endTime.setValue(time[1]);
                this.StatusCombobox.setValue(queryStatu);
                // if(queryType){
                this.ProcessCombox = FlowSearch.ProcessCombox(this.el.process_types, queryType);
                // }
                if (employeeData) {
                    FlowSearch.Select2SetValue(this.EmployeeSelect2, employeeData[0]);
                }
            }
        },
        _initServerDataTable: function () {
            var self = this;
            var param = this.queryParam_wait();
            this._serverDataTable = layTable.render({
                elem: '#toa_bill_archive_tb',
                height: 'full-290', //容器高度
                page: true,
                loading: true,
                even: true,
                url: 'api/bill/web/archive',
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
                        fixed: true,
                        templet: '#laytool_archive_code'
                        // fixed: true
                    },
                    {
                        field: 'title',
                        width: 320,
                        title: '标题',
                        templet: '#laytool_archive_title'
                    },
                    {
                        field: 'nodeName',
                        width: 100,
                        title: '任务名称'
                    },
                    {
                        field: 'senderName',
                        width: 88,
                        title: '发起人'
                    },
                    {
                        field: 'processName',
                        width: 120,
                        title: '审批类型'
                    },
                    {
                        field: 'status',
                        width: 88,
                        title: '审批状态',
                        templet: '#laytpl_public_status'
                    },
                    {
                        field: 'paymentStatus',
                        width: 88,
                        title: '支付状态',
                        templet: '#laytpl_public_paymentStatus'
                    }, {
                        field: 'priority',
                        width: 88,
                        title: '优先级',
                        templet: '#laytpl_public_priority'
                    },
                    {
                        field: 'startTime',
                        width: 150,
                        title: '发起时间',
                        templet: '#laytpl_apprival_time'
                    },
                    {
                        fixed: 'right',
                        width: 70,
                        title: '操作',
                        toolbar: '#laytool_archive_action'
                    }]
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
            layTable.on('tool(archiveTb)', function (obj) {
                var data = obj.data;
                var layEvent = obj.event;
                var billId = data.id;

                var breadcrumbs = [{
                    title: "首页",
                    url: 'app/home/index'
                }];

                if (layEvent === 'detail') { //查看
                    pageTabManager.openPage('查看审批单',
                        'app/approval/edit', {
                            mode: 'view',
                            billId: billId,
                            list: 'approval'
                        }, [{
                            title: "首页", url: 'app/home/index', breadcrumbs: breadcrumbs
                        }, {
                            title: "归档事项",
                            url: 'app/approval/flow/archive',
                            breadcrumbs: breadcrumbs
                        }]);
                }
            });
        },

        //重写_initEvents钩子方法
        _initEvents: function () {
            var self = this;
            this._bindEvent(this.el.archive_search, "click", function (element) {
                self.research();
            });

            this._bindEvent(this.el.archive_apply_btn, 'click', function () {
                pageTabManager.openPage('发起审批',
                    'app/approval/start', {}, [{
                        title: "首页",
                        url: 'app/home/index'
                    }]);
            });
        },

        research: function () {
            var self = this;
            var param = self.queryParam_wait();
            self._serverDataTable.reload({
                where: {
                    _: Hamster.uniqueId('toa_')
                    , q: JSON.stringify(param)
                }
                , done: function (res, curr, count) {
                    $.cookie(self.queryCookieName, JSON.stringify(param), {expires: 24})
                }
            });
        },

        queryParam_wait: function () {
            var query_time_app = this.startTime.getValue()+' - '+this.endTime.getValue();
            if(query_time_app==' - '){
                query_time_app='';
            }
            var query_process_id_app = this.ProcessCombox.getValue();
            var query_status = this.StatusCombobox.getValue();
            var employeeData = this.EmployeeSelect2.select2('data');
            var employeeId = '0';
            if (!Hamster.isEmpty(employeeData)) {
                employeeId = employeeData[0].id;
            }
            if (!Hamster.isEmpty(this._totalTableSearchEmployeeId)) {
                employeeData = this._totalTableSearchEmployeeId;
            }

            //因为审批类型数据是从后台异步加载的
            // 这里只能从cook中获取
            var cacheQueryValue = $.cookie(this.queryCookieName);
            if (!Hamster.isEmpty(cacheQueryValue) && query_process_id_app == "") {
                var queryParam = JSON.parse(cacheQueryValue);
                if (queryParam['processId']) {
                    query_process_id_app = queryParam['processId'];
                }
            }

            this._totalTableSearchEmployeeId = null;
            return {
                rangeTime: query_time_app
                , processId: query_process_id_app
                , status: query_status
                , employeeData: employeeData
                , sender: employeeId
            }
        },

        onPageBreadcrumbItemClick: function (data) {
            var url = data.url;
            if (!Hamster.isEmpty(url)) {
                if (data.url === 'app/home/index') {
                    pageTabManager.openPage(data.title,
                        data.url, {}, []);
                } else {
                    pageTabManager.openPage(data.title,
                        data.url, {}, []);
                }
            }
        },

        reloadApprovalData: function () {
            this._serverDataTable.reload();
        }
    });

    return FlowArchivePage;
});