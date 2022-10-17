define(function (require, exports, module) {
    var Class = require('../class');
    var Component = require('./component');
    var Foundation = require('../foundation');
    var HttpAjax = require('../http-ajax');
    var Loader = require('./loader');
    var formItemComps = require('./form/item');

    var jDataTable = $.fn.dataTable;

    /**
     * 覆盖原生的jQuery DataTable的默认配置属性
     * */
    Foundation.apply(jDataTable.defaults, {
        oLanguage: {
            oAria: {
                sSortAscending: ": activate to sort column ascending",
                sSortDescending: ": activate to sort column descending"
            },
            oPaginate: {
                sFirst: "First",
                sLast: "Last",
                sNext: "Next",
                sPrevious: "Previous"
            },
            sEmptyTable: null,
            sInfo: "第 _PAGE_ 页 ( 总共 _PAGES_ 页 )",
            sInfoEmpty: "没有找到记录",
            sInfoFiltered: "(从 _MAX_ 条记录过滤)",
            sInfoPostFix: "",
            sDecimal: "",
            sThousands: ",",
            sLengthMenu: "每页 _MENU_ 条记录",
            sLoadingRecords: "加载中...",
            sProcessing: "Processing...",
            sSearch: "Search:",
            sSearchPlaceholder: "",
            sUrl: "",
            sZeroRecords: null
        },
        ordering: false,
        filter: false,
        info: true,
        pagingType: "simple_numbers",
        lengthChange: false
    });

    /**
     * 数据表格组件
     * */
    var ServerDataTable = Class.create({

        statics: {},

        extend: Component,

        baseCls: 'ui-data-grid',

        border: true,

        hasIndex: true,

        url: '',

        paging: true,

        pageSize: 10,

        multiSelect: true,

        columns: [],

        tableAutoWidth: true,

        serverParamsField: 'params',

        onBeforeSendAjax: null,

        onGetMoreSendPrams: null,

        onServerSuccess: null,

        onServerFailure: null,

        onAfterDraw: null,

        originalDataTableOptions: {},

        _beforeInit: function () {
            ServerDataTable.superclass._beforeInit.apply(this);

            this._row_checkboxs = [];
            this._params = {};
        },

        _init: function () {
            ServerDataTable.superclass._init.apply(this);

            this.el.target.height(this.height);
            this.el.table = $('<table width="100%"/>').appendTo(this.el.target);

            this._createOriginalDataTable();

            this._loader = new Loader({container: this.el.target});
            this._loader.start();

            if (this.border) {
                this.el.t_container.addClass('ui-data-grid-border')
            }
            if (this.multiSelect) {
                this._createSelectAllCheckbox($('th.ui-data-grid-table-checkbox-column', this.el.t_container))
            }
        },

        _createOriginalDataTable: function () {
            var dataTableOptions = Foundation.apply({}, this._getServerDataTableOptions(), this.originalDataTableOptions);
            this.originalDataTable = this.el.table.DataTable(dataTableOptions);

            this.el.t_body = $(this.originalDataTable.table().body());
            this.el.t_container = $(this.originalDataTable.table().container());
            this.el.t_body_scroll = this.el.t_container.find('.ui-data-grid-scroll-body');
        },

        _initEvents: function () {
            this._bindDelegateEvent(this.el.t_body, 'tr', 'click', '_onTableBodyRowElementClick');
            this._bindDelegateEvent(this.el.t_body, 'tr', 'dblclick', '_onTableBodyRowElementDblClick');
        },

        _getServerDataTableOptions: function () {
            return {
                scrollY: 300,
                scrollX: true,
                autoWidth: this.tableAutoWidth,
                columns: this._getDataTableColumns(),
                paging: this.paging,
                info: this.paging,
                pageLength: this.pageSize,
                stateSave: false,
                serverSide: true,
                ajaxDataProp: "data",
                ajax: this._getServerAjaxOptions(),
                createdRow: this._onTableRowCreated.bind(this),
                drawCallback: this._onDataTableDrawed.bind(this)
            }
        },

        _getDataTableColumns: function () {
            var columns = [];

            if (this.multiSelect) {
                columns.push({
                    width: '20px',
                    orderable: false,
                    title: '',
                    targets: 0,
                    className: 'ui-data-grid-table-checkbox-column',
                    render: function () {
                        return ''
                    }
                })
            }

            if (this.hasIndex) {
                columns.push({
                    width: '30px',
                    orderable: false,
                    render: function (row, type, set, meta) {
                        return meta.settings._iDisplayStart + meta.row + 1;
                    },
                    className: 'ui-data-grid-table-index-column',
                    title: '序号'
                })
            }

            Foundation.Array.forEach(this.columns, function (column) {
                columns.push(column)
            });
            return columns
        },

        _getServerAjaxOptions: function () {
            return {
                url: g.ctx + this.url,
                type: 'POST',
                timeout: 20000,
                dataType: 'json',
                contentType: 'application/json',
                beforeSend: this._onBeforeGetServerData.bind(this),
                data: this._onGetServerDataParams.bind(this),
                dataSrc: this._onGetServerDataSuccess.bind(this),
                error: this._onGetServerDataFailure.bind(this)
            }
        },

        _onGetServerDataParams: function (data) {
            var customParams = this._applyCallback(this.onGetMoreSendPrams, this, [this]) || {};
            data[this.serverParamsField] = Foundation.apply(Foundation.clone(this._params), customParams);
            return JSON.stringify(data);
        },

        _onBeforeGetServerData: function (request) {
            var authorization = Foundation.String.format('{0}', getAuthorization());
            request.setRequestHeader("Authorization", authorization);
            this._applyCallback(this.onBeforeSendAjax, this, []);
            this._loader && this._loader.start();
        },
        _onGetServerDataSuccess: function (result) {
            this._loader.stop();
            var data = this._applyCallback(this.onServerSuccess, this, [result.data]);
            if (!Foundation.isEmpty(data)) {
                result.data = data;
            }
            return result.data;
        },

        _onGetServerDataFailure: function () {
            this._loader.stop();
            this._applyCallback(this.onServerSuccess, this, []);
        },

        _onTableRowCreated: function (rowElement, data, dataIndex) {
            rowElement = $(rowElement);
            if (this.multiSelect) {
                if (dataIndex == 0) {
                    this._clearRowSelectCheckbox();
                }
                this._createRowSelectCheckbox($('td.ui-data-grid-table-checkbox-column', rowElement), rowElement, data);
            }
            rowElement.data('record', data);
        },

        _onDataTableDrawed: function () {
            this._applyCallback(this.onAfterDraw, this, [this]);
        },

        _createSelectAllCheckbox: function (tdElement) {
            var self = this;

            function onSelectAllCheckboxChanged(checked) {
                Foundation.Array.forEach(self._row_checkboxs, function (checkbox) {
                    checkbox && checkbox.setChecked(checked)
                }, self);
            }

            this._selectAllCheckbox = new formItemComps.FormCheckbox({
                appendToEl: tdElement,
                value: null,
                onChange: onSelectAllCheckboxChanged
            });
        },

        _createRowSelectCheckbox: function (tdElement, rowElement, data) {

            function onRowCheckboxChanged(checkbox) {
                if (this.multiSelect) {
                    rowElement.toggleClass('ui-data-grid-row-selected', checkbox.isChecked());
                    this._checkRowCheckboxIsAllChecked()
                } else {
                    rowElement.addClass('ui-data-grid-row-selected').siblings().removeClass('ui-data-grid-row-selected');
                }
            }

            var checkbox = new formItemComps.FormCheckbox({
                appendToEl: tdElement,
                value: null
            });
            checkbox.on('change', onRowCheckboxChanged, this);
            checkbox.__record = data;
            this._row_checkboxs.push(checkbox);
            rowElement.data('checkbox', checkbox);
        },

        _clearRowSelectCheckbox: function () {
            this._selectAllCheckbox.setChecked(false);
            if (!Foundation.isEmpty(this._row_checkboxs)) {
                Foundation.Array.forEach(this._row_checkboxs, function (checkbox) {
                    checkbox && checkbox.destroy();
                }, this);
                this._row_checkboxs = [];
            }
        },

        _checkRowCheckboxIsAllChecked: function () {
            var allChecked = true;
            var hasChecked = false;
            Foundation.Array.forEach(this._row_checkboxs, function (checkbox) {
                if (checkbox.isChecked()) {
                    hasChecked = true;
                } else {
                    allChecked = false;
                }
            }, this);

            if (allChecked) {
                this._selectAllCheckbox.setChecked(true);
            } else if (hasChecked) {
                this._selectAllCheckbox.setIndeterminated(true);
            } else {
                this._selectAllCheckbox.setChecked(false);
            }
        },

        _onTableBodyRowElementClick: function (trElement, event) {
            if (this.multiSelect) {
                var checkbox = trElement.data('checkbox');
                checkbox && checkbox.toggle(true);
            } else {
                trElement.addClass('ui-data-grid-row-selected').siblings().removeClass('ui-data-grid-row-selected');
            }
        },

        _onTableBodyRowElementDblClick: function (trElement, event) {
            if (!this.multiSelect) {
                this.triggerEvent('single-select-row-dblclick', trElement.data('record'), trElement);
            }
        },

        resize: function (size) {
            if (size) {
                this.width = size.width;
                this.height = size.height;
            }
            if (!Foundation.isEmpty(this.width)) {
                //this.el.target.width(this.width);
            }
            if (!Foundation.isEmpty(this.height)) {
                this.el.t_container.outerHeight(this.height);
                this.el.t_body_scroll.outerHeight(this.height - (this.paging ? 38 : -2) - 35);
            }
        },

        setParam: function (name, value) {
            if (Foundation.isEmpty(name)) {
                return
            }
            this._params[name] = value;
        },

        setParams: function (params) {
            Foundation.apply(this._params, params || {})
        },

        clearParams: function () {
            this._params = {};
        },

        reload: function () {
            this.originalDataTable.ajax.reload();
        },

        getSelected: function () {
            var selectRecords = [];
            this.el.t_body.find('tr.ui-data-grid-row-selected').each(function () {
                var trElement = $(this);
                selectRecords.push(trElement.data('record'));
            });
            return this.multiSelect ? selectRecords : selectRecords[0];
        },

        getSelectedCount: function () {
            return this.el.t_body.find('tr.ui-data-grid-row-selected').length
        },

        getOriginalDataTable: function () {
            return this.originalDataTable
        },

        getTbodyElement: function () {
            return this.el.t_body;
        },

        getRecordByRowElement: function (rowElement) {
            return rowElement.data('record')
        },

        destroy: function (empty) {
            this._loader && this._loader.destroy();
            this.originalDataTable.destroy();
            ServerDataTable.superclass.destroy.apply(this, arguments);
        }

    });

    return ServerDataTable
});

