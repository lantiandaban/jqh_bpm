/**
 *
 * @author Mr_Zhou
 * @version 1.0
 */
/**
 *
 * @author Mr_Zhou
 * @version 1.0
 */
define(function (require, exports, module) {

    var Hamster = require('lib/index');
    var BasePage = require('app/layout/page');
    var FlowSearch = require('./search/flow-search');
    var flowCcmePageHtml = require('text!view/approval/flow/ccme.hbs');
    var pageTabManager = require('app/layout/page-tab-manager');

    var layTable = layui.table;

    //创建界面对象
    var flowCcmePage = Class.create({

        //继承于BasePage对象
        extend: BasePage,

        //重写_getContentElement钩子方法,获取组件内容jQuery对象, 可通过this.el.target来访问
        _getContentElement: function () {
            return $(flowCcmePageHtml)
        },

        _beforeInit: function () {
            flowCcmePage.superclass._beforeInit.apply(this);
        },

        //重写_init钩子方法,
        // 实现一些自己的逻辑
        _init: function () {
            //调用父类的_init方法
            flowCcmePage.superclass._init.apply(this);
            this.query = {};
            this.el.ccme_start_time = $('#ccme-start-time');
            this.el.ccme_end_time = $('#ccme-end-time');
            this.el.process_types = $("#ccme-process-types");
            this.el.employee_select = $("#ccme-employee-select");
            this.el.ccme_flow_status = $("#ccme-flow-status");
            this.el.ccme_search = $("#ccme-search");
            this.el.applyBtn = $("#ccme-apply-btn");

            this.StatusCombobox = FlowSearch.SendBillStatusCombox(this.el.ccme_flow_status);
            this.EmployeeSelect2 = FlowSearch.ApproverSelect2(this.el.employee_select);
            this.startTime = new Hamster.ui.FormDateTime({
                width: 120,
                placeholder: '请选择',
                chooseType: "date",
                format: 'yyyy-MM-dd',
                appendToEl: this.el.ccme_start_time
            });
            this.endTime = new Hamster.ui.FormDateTime({
                width: 120,
                placeholder: '请选择',
                chooseType: "date",
                format: 'yyyy-MM-dd',
                appendToEl: this.el.ccme_end_time
            });
            this.queryCookieName = 'toa_bill_ccme_tb_param';
            this._initQueryTool();
            this._initServerDataTable();
        },

        _initQueryTool: function () {
            var self = this;
            var cacheQueryValue = $.cookie(self.queryCookieName);
            var currentUserId = $("#current-user-id").val();
            if (Hamster.isEmpty(cacheQueryValue)) {
                var time = moment().subtract('months', 6).format('YYYY-MM-DD');
                var end = moment().format('YYYY-MM-DD');
                this.startTime.setValue(time);
                this.endTime.setValue(end);
                this.ProcessCombox = FlowSearch.ProcessCombox(this.el.process_types);
            } else if (JSON.parse(cacheQueryValue).oldEmpId != currentUserId) {
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
            var param = this.queryParam_wait();
            this._serverDataTable = layTable.render({
                elem: '#toa_bill_ccme_tb',
                // id:'#toa_bill_ccme_tb',
                height: 'full-290', //容器高度
                page: true,
                loading: true,
                even: true,
                url: 'api/bill/web/cc',
                // , where: {t: Hamster.uniqueId('toa_')},
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
                        templet: '#laytool_ccme_code'
                    },
                    {
                        field: 'title',
                        width: 320,
                        title: '标题',
                        templet: '#laytool_ccme_title'
                    },
                    {
                        field: 'senderName',
                        width: 80,
                        title: '发起人'
                    },
                    {
                        field: 'dateline',
                        width: 150,
                        title: '抄送时间',
                        templet: '#laytpl_ccme_dateline'
                    },
                    {
                        field: 'processName',
                        width: 120,
                        title: '审批类型'
                    },
                    {
                        field: 'priority',
                        width: 90,
                        title: '优先级',
                        templet: '#laytpl_public_priority'
                    },
                    {
                        field: 'startTime',
                        width: 150,
                        title: '发起时间',
                        templet: '#laytpl_ccme_time'
                    },
                    {
                        fixed: 'right',
                        width: 70,
                        title: '操作',
                        toolbar: '#laytool_ccme_action'
                    }]
                ]
                , where: {
                    t: Hamster.uniqueId('toa_'),
                    q: JSON.stringify(param)
                }
                , done: function () {
                    // this._loader.stop();
                }
            });

            // TODO 排序字段绑定事件，点击排序字段时，向服务器发送请求
            // layTable.on('sort(ccmeTb)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性
            // lay-filter="对应的值" console.log(obj.field); //当前排序的字段名 console.log(obj.type);
            // //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）

            // layTable.reload('#toa_bill_ccme_tb', {
            //     initSort: obj //记录初始排序，如果不设的话，将无法标记表头的排序状态。 layui 2.1.1 新增参数
            //     ,where: { //请求参数
            //         field: obj.field //排序字段
            //         ,order: obj.type //排序方式
            //     }
            // });
            // });

            //监听工具条
            layTable.on('tool(ccmeTb)', function (obj) {
                var data = obj.data;
                var layEvent = obj.event;
                var billId = data.id;
                var breadcrumbs = [{
                    title: "首页",
                    url: 'app/home/index'
                }];
                if (layEvent === 'detail') { //查看
                    pageTabManager.openPage('查看审批单',
                        'app/approval/edit', {mode: 'view', billId: billId, list: 'cc'}, [{
                            title: "首页", url: 'app/home/index', breadcrumbs: breadcrumbs
                        }, {
                            title: "抄送我的",
                            url: 'app/approval/flow/ccme', breadcrumbs: breadcrumbs
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
            this._bindEvent(this.el.ccme_search, "click", function (element) {
                self.research();
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
            var query_time = this.startTime.getValue() + ' - ' + this.endTime.getValue();
            if(query_time==' - '){
                query_time='';
            }
            var query_process_id = this.ProcessCombox.getValue();
            var query_status = this.StatusCombobox.getValue();
            var approvals = this.EmployeeSelect2.select2('data');

            var employeeId = '0';
            if (!Hamster.isEmpty(approvals)) {
                employeeId = approvals[0].id;
            }
            if (!Hamster.isEmpty(this._totalTableSearchEmployeeId)) {
                approvals = this._totalTableSearchEmployeeId;
            }

            //因为审批类型数据是从后台异步加载的
            // 这里只能从cook中获取
            var cacheQueryValue = $.cookie(this.queryCookieName);
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
                , employeeData: approvals
                , sender: employeeId
                , oldEmpId: $("#current-user-id").val()
            }
            this._totalTableSearchEmployeeId = null
        }
    });

    return flowCcmePage;
});