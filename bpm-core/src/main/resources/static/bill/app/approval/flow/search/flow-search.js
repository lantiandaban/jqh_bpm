  

/**
 *
 * @author sog
 * @version 1.0
 */
define(function (require) {
    var Hamster = require('lib/index');

    var _ApproverSelect = function ($dom) {

        // var approverComboBox = new Hamster.ui.ComboBox({
        //     width: 120,
        //     appendToEl: $dom,
        //     async: true,
        //     url: "api/org/employee/query",
        //     searchable: true,
        //     searchField: 'q',
        //     valueField: 'id',
        //     displayField: 'text',
        //     formatServerLoaderResult: function (result) {
        //         return result.results
        //     }
        // });
        //
        // return approverComboBox;

        var $employeeSelect2 = $dom.select2({
            language: 'zh-CN',
            placeholder: '全部',
            allowClear: true,
            ajax: {
                url: g.ctx + "api/org/employee/query",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;
                    var results = data.results;
                    return {
                        results: Hamster.isEmpty(results) ? [] : results,
                        pagination: {
                            more: (params.page * 20) < data.total
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            minimumInputLength: 1
        });

        $dom.on('click', 'span.select2-selection__clear', function (e) {
            e.preventDefault();
            $employeeSelect2.val(null).trigger('change');
        });

        return $employeeSelect2;
    };

    var _ProjectSelect = function ($dom) {
        var $projectSelect2 = $dom.select2({
            language: 'zh-CN',
            placeholder: '项目名称搜索',
            allowClear: true,
            ajax: {
                url: g.ctx + "api/project/query",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;
                    var results = data.results;
                    return {
                        results: Hamster.isEmpty(results) ? [] : results,
                        pagination: {
                            more: (params.page * 20) < data.total
                        }
                    };
                },
                cache: false
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            minimumInputLength: 1
        });

        $dom.on('click', 'span.select2-selection__clear', function (e) {
            e.preventDefault();
            $projectSelect2.val(null).trigger("change");
        });

        return $projectSelect2;
    };
    var _CustomerSelect2 = function ($dom) {
        var $customerSelect2 = $dom.select2({
            language: 'zh-CN',
            placeholder: '客户名称或者拼音',
            allowClear: true,
            ajax: {
                url: g.ctx + "api/customer/query",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;

                    var results = data.results;
                    return {
                        results: Hamster.isEmpty(results) ? [] : results,
                        pagination: {
                            more: (params.page * 20) < data.total
                        }
                    };
                },
                cache: false
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            minimumInputLength: 1
        });

        $dom.on('click', 'span.select2-selection__clear', function (e) {
            e.preventDefault();
            $customerSelect2.val(null).trigger("change");
        });

        return $customerSelect2;
    };

    var _SupplierSelect2 = function ($dom) {
        var $supplierSelect2 = $dom.select2({
            language: 'zh-CN',
            placeholder: '客户名称或者拼音',
            allowClear: true,
            ajax: {
                url: g.ctx + "api/customer/supplier/query",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;

                    var results = data.results;
                    return {
                        results: Hamster.isEmpty(results) ? [] : results,
                        pagination: {
                            more: (params.page * 20) < data.total
                        }
                    };
                },
                cache: false
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            minimumInputLength: 1
        });

        $dom.on('click', 'span.select2-selection__clear', function (e) {
            e.preventDefault();
            $supplierSelect2.val(null).trigger("change");
        });

        return $supplierSelect2;
    };
    /**
     * 给默认值,
     * @param $comboDom
     * @param selectVal
     * @returns {*}
     * @private
     */
    var _ProcessCombox = function ($comboDom,selectVal) {
        var processCombox = new Hamster.ui.ComboBox({
            width: 120,
            appendToEl: $comboDom
        });

        var httpAjax = new HttpAjax({
            url: 'api/process/list',
            needLoading: true,
            type: "get"
        });
        httpAjax.successHandler(function (datas) {
            var items = [{
                text: "全部",
                value: '-1'
            }];

            datas.forEach(function (item, index) {
                items.push({
                    text: item.name,
                    value: item.id
                });
            });
            processCombox.setData(items);
            if(selectVal){
                processCombox.setValue(selectVal);
            }
        });
        httpAjax.satusCodeHandler(500, function () {
            layer.msg("获取审批类型出错", {icon: 5});
        });
        httpAjax.send();
        return processCombox;
    };


    var _SendBillStatusCombox = function ($statusDom) {
        var items = [{
            text: "全部",
            value: '-1'
        }, {
            text: "审批中",
            value: '1'
        }, {
            text: "已撤销",
            value: '2'
        }, {
            text: "已拒绝",
            value: '3'
        }, {
            text: "归档中",
            value: '4'
        }, {
            text: "已完成",
            value: '8'
        }];
        return new Hamster.ui.ComboBox({
            width: 90,
            appendToEl: $statusDom,
            items: items
        });
    };

    var _SendBillStatusForSummaryCombox = function ($statusDom) {
        var items = [{
            text: "全部",
            value: '-1'
        }, {
            text: "审批中",
            value: '1'
        }, {
            text: "归档中",
            value: '4'
        }, {
            text: "已完成",
            value: '8'
        }];
        return new Hamster.ui.ComboBox({
            width: 90,
            appendToEl: $statusDom,
            placeholder: '全部',
            items: items
        });
    };

    var _CompanyCombox = function ($companyDom) {
      var items = [{
          text: "全部",
          value: ''
      },{
          text: "上海",
          value: '上海'
      },{
          text: "深圳",
          value: '深圳'
      },{
          text: "成都",
          value: '成都'
      },{
          text: "上海景志电商",
          value: '上海景志电商'
      }];
      return new Hamster.ui.ComboBox({
         width: 90,
         placeholder: '全部',
         appendToEl: $companyDom,
         items: items
      });
    };

    var _Select2SetValue = function ($dom, data) {
        if(Hamster.isEmpty(data)){
            return;
        }
        var newOption = new Option(data.text, data.id, true, true);
        $dom.append(newOption).trigger('change');
        $dom.trigger({
            type: 'select2:select',
            params: {
                data: data
            }
        });
    };

    return {
        ApproverSelect2: _ApproverSelect,
        Select2SetValue: _Select2SetValue,
        ProjectSelect2: _ProjectSelect,
        CustomerSelect2: _CustomerSelect2,
        SupplierSelect2: _SupplierSelect2,
        ProcessCombox: _ProcessCombox,
        SendBillStatusCombox: _SendBillStatusCombox,
        SendBillStatusForSummaryCombox: _SendBillStatusForSummaryCombox,
        CompanyCombox: _CompanyCombox
    };
});