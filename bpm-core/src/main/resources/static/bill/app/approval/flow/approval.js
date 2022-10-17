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
    var echarts = require('resource/lib/plugins/echart/echarts.common.min');

    var flowApprovalPageHtml = require('text!view/approval/flow/approval.hbs');

    var layTable = layui.table;

    //创建界面对象
    var flowApprovalPage = Class.create({

        //继承于BasePage对象
        extend: BasePage,

        //重写_getContentElement钩子方法,获取组件内容jQuery对象, 可通过this.el.target来访问
        _getContentElement: function () {
            return $(flowApprovalPageHtml)
        },

        _beforeInit: function () {
            flowApprovalPage.superclass._beforeInit.apply(this);
        },

        //重写_init钩子方法,
        // 实现一些自己的逻辑
        _init: function () {
            //调用父类的_init方法
            flowApprovalPage.superclass._init.apply(this);
            this.el.approval_start_time = $("#approval-start-time");
            this.el.approval_end_time = $("#approval-end-time");
            this.el.process_types = $("#approval-process-types");
            this.el.employee_select = $("#approval-employee-select");
            this.el.collection_select = $("#approval-customer-select");
            this.el.approval_table = this.el.target.find('#approval-data-div');
            this.el.approval_flow_status = $("#approval-flow-status");
            this.el.approval_search = $("#approval-search");

            this.el.approval_total_btn = $('#approval-total-btn');
            this.el.applyBtn = $('#approval-apply-btn');
            this.el.approval_total_body = $('#approvalTotalRightBody');

            this.StatusCombobox = FlowSearch.SendBillStatusCombox(this.el.approval_flow_status);
            this.EmployeeSelect2 = FlowSearch.ApproverSelect2(this.el.employee_select);
            this.CustomerSelect2 = FlowSearch.SupplierSelect2(this.el.collection_select);
            this.startTime = new Hamster.ui.FormDateTime({
                width: 120,
                placeholder: '请选择',
                chooseType: "date",
                format: 'yyyy-MM-dd',
                appendToEl: this.el.approval_start_time
            });
            this.endTime = new Hamster.ui.FormDateTime({
                width: 120,
                placeholder: '请选择',
                chooseType: "date",
                format: 'yyyy-MM-dd',
                appendToEl: this.el.approval_end_time
            });
            this._loader = new Hamster.ui.Loader({
                text: '数据加载中...',
                container: this.el.target
            });
            this.queryCookieName = 'toa_approval_detail_param';
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
                var collectionData = queryParam['collectionData'];
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
                if (collectionData) {
                    FlowSearch.Select2SetValue(this.CustomerSelect2, collectionData[0]);
                }
            }
        },

        formatApprovalStatus: function (status) {
            switch (status) {
                case 11:
                    return "已支付";
                case 12:
                    return "支付中";
                case 13:
                    return "未支付";
                default:
                    return "无";
            }
        },

        _initServerDataTable: function () {
            var self = this;
            var param = this.queryParam_wait();
            this._serverDataTable = layTable.render({
                elem: '#toa_bill_approval_tb',
                height: 'full-290', //容器高度
                page: true,
                loading: true,
                even: true,
                url: 'api/bill/web/todo',
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
                        templet: '#laytool_approval_code'
                        // fixed: true
                    },
                    {
                        field: 'title',
                        width: 320,
                        title: '标题',
                        templet: '#laytool_approval_title'
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
                    },
                    {
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
                        toolbar: '#laytool_approval_action'
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
            layTable.on('tool(approvalTb)', function (obj) {
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
                            title: "待办事项",
                            url: 'app/approval/flow/approval',
                            breadcrumbs: breadcrumbs
                        }]);
                }
            });
        },

        //重写_initEvents钩子方法
        _initEvents: function () {
            var self = this;
            this._bindEvent(this.el.approval_search, "click", function (element) {
                self.research();
            });

            this._bindEvent(this.el.applyBtn, 'click', function () {
                pageTabManager.openPage('发起审批',
                    'app/approval/start', {}, [{
                        title: "首页",
                        url: 'app/home/index'
                    }]);
            });
            this._bindEvent(this.el.approval_total_btn, 'click', 'onTotalBtnClick');
            this._bindEvent(this.el.approval_total_body.find('i.close'), 'click', 'closeTotalBody');
            this._bindDelegateEvent(this.el.approval_total_body, '.table-content tr', 'click', 'onTotalTableRowClick');
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
            var query_time_app = this.startTime.getValue() + ' - ' + this.endTime.getValue();
            if(query_time_app==' - '){
                query_time_app='';
            }
            var query_process_id_app = this.ProcessCombox.getValue();
            var query_status = this.StatusCombobox.getValue();
            var employeeData = this.EmployeeSelect2.select2('data');
            var customerData = this.CustomerSelect2.select2('data');
            var employeeId = '0';
            if (!Hamster.isEmpty(employeeData)) {
                employeeId = employeeData[0].id;
            }
            if (!Hamster.isEmpty(this._totalTableSearchEmployeeId)) {
                employeeData = this._totalTableSearchEmployeeId;
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
            if (!Hamster.isEmpty(cacheQueryValue) && query_process_id_app == "") {
                var queryParam = JSON.parse(cacheQueryValue);
                if (queryParam['processId']) {
                    query_process_id_app = queryParam['processId'];
                }
            }

            this._totalTableSearchEmployeeId = null;
            this._totalTableSearchCustomerId = null;
            return {
                rangeTime: query_time_app
                , processId: query_process_id_app
                , status: query_status
                , employeeData: employeeData
                , customerData: customerData
                , sender: employeeId
                , customerName: customerName
            }
        },

        onTotalBtnClick: function () {
            this.openTotalBody();
        },

        openTotalBody: function () {
            var self = this;
            this.el.approval_total_body.show();
            if (!this.totalBodyRendered) {
                var httpAjax = new HttpAjax({
                    url: 'api/bill/state/todo',
                    type: "get"
                });
                httpAjax.successHandler(function (data) {
                    self.renderTotalBody(data);
                });
                httpAjax.send();
            }
        },

        closeTotalBody: function () {
            this.el.approval_total_body.hide();
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
        renderTotalBody: function (data) {
            if (Hamster.isEmpty(data.typeCount) && Hamster.isEmpty(data.employeeStateDtos)) {
                this.el.approval_total_body.addClass('empty');
                return;
            }

            this.el.approval_total_body.removeClass('empty').find('.emptyText').remove();

            this.renderTotalChart(data.typeCount);
            this.renderTotalTable(data.employeeStateDtos);
            this.totalBodyRendered = true;
        },

        renderTotalChart: function (data) {
            var seriesTitles = [];
            var seriesData = Hamster.Array.map(data, function (item) {
                seriesTitles.push(item.processName);
                return {
                    value: item.count,
                    name: item.processName,
                    processId: item.processId
                }
            }, this);

            var chartOptions = {
                title: {
                    text: '审批助手',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    bottom: 'left',
                    data: seriesTitles
                },
                series: [
                    {
                        name: '申请单数量',
                        type: 'pie',
                        radius: '55%',
                        data: seriesData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };

            var totalChart = echarts.init(this.el.target.find('.charts-content')[0]);
            totalChart.setOption(chartOptions);
            totalChart.on('click', this.onTotalChartItemClick.bind(this));
        },

        renderTotalTable: function (data) {
            var totalTableElement = $('<table class="ui-table ui-table-hoverable"/>').appendTo(this.el.approval_total_body.find('.table-content'));
            Hamster.Array.forEach(data, function (item) {
                var rowHtml = Hamster.String.format('<tr><td>{0}</td><td>{1}</td></tr>', item.name, item.count);
                totalTableElement.append($(rowHtml).data('record', item));
            }, this);
        },

        onTotalChartItemClick: function (params) {
            this.ProcessCombox.setValue(params.data.processId);
            this.research();
        },

        onTotalTableRowClick: function (rowElement) {
            var record = rowElement.data('record');

            this._totalTableSearchEmployeeId = record.employeeId;

            FlowSearch.Select2SetValue(this.el.employee_select, {
                id: record.employeeId,
                text: record.name
            });
            this.research();
        },

        reloadApprovalData: function () {
            this._serverDataTable.reload();
        }
    });

    return flowApprovalPage;
});