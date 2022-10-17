/*!
 DataTables Bootstrap 3 integration
 ©2011-2015 SpryMedia Ltd - datatables.net/license
 */
(function (b) {
    "function" === typeof define && define.amd ? define(["jquery", "datatables.net"], function (a) {
        return b(a, window, document)
    }) : "object" === typeof exports ? module.exports = function (a, d) {
        a || (a = window);
        if (!d || !d.fn.dataTable)d = require("datatables.net")(a, d).$;
        return b(d, a, a.document)
    } : b(jQuery, window, document)
})(function (b, a, d, m) {
    var f = b.fn.dataTable;
    b.extend(!0, f.defaults, {
        // dom: "<'row'<'col-sm-6'l><'col-sm-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>",
        dom: "<'g-row'<'g-col-12'tr>><'g-row'<'g-col-5'i><'g-col-7'p>>",
        renderer: "bootstrap",
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

    b.extend(f.ext.classes,
        {
            sWrapper: "dataTables_wrapper",
            sRowEmpty: "dataTables_empty ui-data-grid-body-empty",
            sScrollHead: "dataTables_scrollHead ui-data-grid-scroll-header",
            sScrollBody: "dataTables_scrollBody ui-data-grid-scroll-body",
            sInfo: "ui-data-grid-info",
            sPaging: "ui-data-grid-paging paging_",
            sPageButton: "ui-pagination-item",
            sPageButtonActive: "ui-pagination-item-active",
            sPageButtonDisabled: "ui-pagination-disabled",
            sProcessing: "dataTables_processing panel panel-default"
        });
    f.ext.renderer.pageButton.bootstrap = function (a, h, r, s, j, n) {
        var o = new f.Api(a), t = a.oClasses, k = a.oLanguage.oPaginate, u = a.oLanguage.oAria.paginate || {}, e, g, p = 0, q = function (d, f) {
            var l, h, i, c, m = function (a) {
                a.preventDefault();
                !b(a.currentTarget).hasClass(t.sPageButtonDisabled) && o.page() != a.data.action && o.page(a.data.action).draw("page")
            };
            l = 0;
            for (h = f.length; l < h; l++)if (c = f[l], b.isArray(c))q(d, c); else {
                g = e = "";
                switch (c) {
                    case "ellipsis":
                        e = "&#x2026;";
                        g = t.sPageButton + ' ' + t.sPageButtonDisabled;
                        break;
                    case "first":
                        e = k.sFirst;
                        g = c + (0 < j ? "" : " " + t.sPageButtonDisabled);
                        break;
                    case "previous":
                        // e = k.sPrevious;
                        e = "";
                        g = 'ui-pagination-prev ' + (0 < j ? "" : " " + t.sPageButtonDisabled);
                        break;
                    case "next":
                        // e = k.sNext;
                        e = "";
                        g = 'ui-pagination-next ' + (j < n - 1 ? "" : " " + t.sPageButtonDisabled);
                        break;
                    case "last":
                        e = k.sLast;
                        g = c + (j < n - 1 ? "" : " " + t.sPageButtonDisabled);
                        break;
                    default:
                        e = c + 1;
                        g = j === c ? t.sPageButtonActive : "";
                        g = t.sPageButton + ' ' + g;
                }
                //e &&
                (i = b("<li>", {
                    "class": g,
                    id: 0 === r && "string" === typeof c ? a.sTableId + "_" + c : null
                }).append(b("<a>", {
                    href: "#",
                    "aria-controls": a.sTableId,
                    "aria-label": u[c],
                    "data-dt-idx": p,
                    tabindex: a.iTabIndex
                }).html(e)).appendTo(d), a.oApi._fnBindAction(i, {action: c}, m), p++)
            }
        }, i;
        try {
            i = b(h).find(d.activeElement).data("dt-idx")
        } catch (v) {
        }
        q(b(h).empty().html('<ul class="ui-pagination"/>').children("ul"), s);
        i !== m && b(h).find("[data-dt-idx=" + i + "]").focus()
    };
    return f
});

