define(function (require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var components = require('../../component/index');
    var formWidgetManager = require('../form-item/manager');
    var constants = require('../constants');

    return Class.create({

        _setConfig: function (config) {
            this.config = Foundation.apply({}, {
                _id: config._id,
                columnItems: config.columnItems || [],
                attr: config.attr
            }, this._getDefaultConfig())
        },

        _getDefaultConfig: function () {
            return {}
        },

        _getDefualtOptions: function () {
            return {
                onFormItemChoosed: null,
                onFormItemRemoved: null,
                onClickFromSettingMenuItem: null
            }
        },

        initialize: function (options) {
            this.options = Foundation.apply({}, options, this._getDefualtOptions());
            this.config = {};

            this.el = {};
            this.el.target = $('#design-warpper');
            this.el.title = $('#pc-design-layout-table-title');
            this.el.table = $('#design-layout-table');
            this.el.tableColGroup = this.el.table.find('>colgroup');
            this.el.tableBody = this.el.table.find('>tbody');

            this._initLayoutTableColSelectable();
            this._initContextMenu();
            this._initEvents();

            this._loadFormConfig();
        },

        _loadFormConfig: function () {
            this._initLayoutTableFormWithConfig(window.g.process.form)
        },

        _initLayoutTableFormWithConfig: function (config) {
            this._setConfig(config);
            var formAttr = this.config.attr;
            var layout = formAttr.layout;
            this.setTitle(this.config.attr.name);
            this._initLayoutTableColItems();
            this._setLayoutTableColgroup(layout.width, layout.colgroup);
        },

        _setLayoutTableColgroup: function (tableWidth, colgroup) {
            colgroup = colgroup || [];

            var flexCount = 0,
                unflexColTotleWidth = 0;

            Foundation.Array.forEach(colgroup, function (col) {
                if (col.type == 'flex') {
                    flexCount += parseInt(col.value)
                } else {
                    unflexColTotleWidth += parseInt(col.value)
                }
            }, this);

            this.__flexCount = flexCount;
            this.__unflexColTotleWidth = unflexColTotleWidth;

            if (tableWidth != 'auto') {
                this.el.table.width(tableWidth);
            } else {
                this.el.table.width(this.el.target.width());
            }

            var htmls = Foundation.Array.map(colgroup || [], function (col, i) {
                var width = Foundation.String.format('{0}px', col.type == 'px' ? col.value : this._getFlexColWidth(tableWidth, col.value));
                return Foundation.String.format('<col style="width:{0}"/>', width);
            }, this);
            this.el.tableColGroup.empty().html(htmls.join(''));
        },

        _getFlexColWidth: function (tableWidth, flex) {
            var _tableWidth = tableWidth == "auto" ? this.el.target.width() : tableWidth;
            var flexWidth = (_tableWidth - this.__unflexColTotleWidth) / this.__flexCount;
            return flex * flexWidth
        },

        _initLayoutTableColItems: function () {
            var columnItems = this.config.columnItems || [];
            var widgetTdElements = [];
            Foundation.Array.forEach(columnItems, function (items) {
                var trElement = $('<tr/>');
                Foundation.Array.forEach(items, function (item) {
                    var tdElement = this._createColElement(item.colspan, item.rowspan).appendTo(trElement);
                    if (!Foundation.isEmpty(item.widget)) {
                        tdElement.data('widget', item.widget);
                        widgetTdElements.push(tdElement);
                    }
                }, this);
                this.el.tableBody.append(trElement);
            }, this);

            Foundation.Array.forEach(widgetTdElements, function (tdElement) {
                var widgetSetting = tdElement.data('widget');
                this._createTableItemWidgetAndTitle(tdElement, widgetSetting);
            }, this);
        },

        _initLayoutTableColSelectable: function () {
            this.el.table.selectable({
                distance: 20,
                delay: 100,
                classes: {
                    "ui-selected": "selected"
                }
            })
        },

        _initContextMenu: function () {
            var self = this;

            function onBeforeShow(ele, event) {
                var targetEl = $(event.target);
                if (Foundation.isEmpty(targetEl.closest('.pc-designer-layout-table-column-chooseLayer')) || targetEl.hasClass('pc-designer-layout-table-column-chooseLayer')) {
                    return true
                }
                if (Foundation.isEmpty(targetEl.closest('.form-pc-designer-warpper'))) {
                    return false
                }
            }

            new components.ContextMenu({
                contextEl: this.el.target,
                onBeforeShow: onBeforeShow,
                onGetMenuItems: function () {
                    return [{
                        text: '新增一行',
                        fn: function () {
                            self._insertRowElement();
                        }
                    }, {
                        text: '合并单元格',
                        fn: function () {
                            self._mergeColumns();
                        }
                    }, '-', {
                        text: '表单设置',
                        fn: function () {
                            if (Foundation.isFunction(self.options.onClickFromSettingMenuItem)) {
                                self.options.onClickFromSettingMenuItem();
                            }
                        }
                    }]
                }
            })
        },

        _mergeColumns: function () {

            var $t = this.el.table;

            var sigDel = "sign4delete"; // 删除标记，用作类名
            var sigSel = "ui-selected"; // 选中标记，用作类名

            // 补充单元格以便后继正确计算坐标
            $("th,td", this.el.table).each(function () {
                // 坐标要实时计算，因会实时补充
                var ridx = $(">tr", $t).index($(this).parent("tr"));
                var cidx = $(this).parent().children("th,td").index(this);
                var rowspan = Number($(this).attr("rowspan")) || 1;
                var colspan = Number($(this).attr("colspan")) || 1;
                var isSel = $(this).hasClass(sigSel);
                // 非选单元格拆出的单元格要加删除标记

                if (rowspan <= 1 && colspan <= 1)
                    return;
                // 跨格开插
                $(">tr", $t).each(function () {
                    var idx = $(">tr", $t).index(this);
                    var arr, $td = $("<td>").addClass(isSel ? sigSel : sigDel);

                    if (idx == ridx) {
                        // 本行在 [cidx] 后插入 colspan-1 个

                        arr = $(); // 准备待插单元格
                        for (var i = 0; i < colspan - 1; i++)
                            arr = arr.add($td.clone());
                        // 插入
                        $("th,td", this).eq(cidx).after(arr);

                    } else if (ridx < idx && idx < ridx + rowspan) {
                        // 以下行在 [cidx] 前插入 colspan 个

                        arr = $(); // 准备待插单元格
                        for (var j = 0; j < colspan; j++)
                            arr = arr.add($td.clone());
                        // 插入
                        if (cidx > 0 && $("th,td", this).eq(cidx - 1).length > 0)
                            $("th,td", this).eq(cidx - 1).after(arr);
                        else if ($("th,td", this).eq(cidx).length > 0)
                            $("th,td", this).eq(cidx).before(arr);
                        else
                            $(this).prepend(arr);
                    }
                });
            });

            var rmin = 10000,
                cmin = 10000;
            var rmax = 0,
                cmax = 0;
            var rnum, cnum;
            // 计算起始和跨距
            $("th,td", $t).filter("." + sigSel).each(function () {
                var ridx = $("tr", $t).index($(this).parent("tr"));
                rmin = ridx < rmin ? ridx : rmin;
                rmax = ridx > rmax ? ridx : rmax;
                var cidx = $(this).parent().children("th,td").index(this);
                cmin = cidx < cmin ? cidx : cmin;
                cmax = cidx > cmax ? cidx : cmax;
            });
            rnum = rmax - rmin + 1;
            cnum = cmax - cmin + 1;

            // 合并单元格
            $("th,td", $t).each(function () {
                var ridx = $("tr", $t).index($(this).parent("tr"));
                var cidx = $(this).parent().children("th,td").index(this);
                // 标记单元格待删
                if (rmin <= ridx && ridx <= rmax &&
                    cmin <= cidx && cidx <= cmax)
                    $(this).addClass(sigDel);
                // 处理被选左上角单元格
                if (ridx == rmin && cidx == cmin)
                    $(this).removeClass(sigDel).attr({
                        rowspan: rnum,
                        colspan: cnum
                    });
                // 清理残余
                if ($(this).attr("rowspan") == 1) $(this).removeAttr("rowspan");
                if ($(this).attr("colspan") == 1) $(this).removeAttr("colspan");
            }).remove("." + sigDel);

        },

        _clearAllTableColSelected: function () {
            this.el.table.find('td.selected').removeClass('selected ui-selected');
        },

        _createTableItemWidget: function (tdElement, widgetSetting) {
            if (Foundation.isEmpty(widgetSetting)) {
                return
            }
            if (Foundation.isEmpty(widgetSetting.xtype)) {
                return
            }

            var self = this,
                options = {};
            if (widgetSetting.xtype == constants.WIDGET_XTYPE.DETAIL_GROUP) {
                options.onSubFieldItemWidgetClick = function (widget) {
                    self.options.onFormItemChoosed && self.options.onFormItemChoosed(widget);
                }
            }

            var formItemWidget = formWidgetManager.create(widgetSetting.xtype, options, widgetSetting);
            if (formItemWidget) {
                formItemWidget.el.target.appendTo(tdElement);
                tdElement.addClass('has-widgeted');
                tdElement.data('widget', formItemWidget);
                tdElement.append('<i class="remove"/>');
            }
            return formItemWidget
        },

        _createTableItemWidgetAndTitle: function (tdElement, widgetSetting, needChoose) {
            var formItemWidget = this._createTableItemWidget(tdElement, widgetSetting);
            var prevTdElement = tdElement.prev();
            if (!Foundation.isEmpty(prevTdElement) && !prevTdElement.hasClass('has-widgeted')) {
                if (formItemWidget) {
                    var titleWidget = formWidgetManager.create('label', {}, {
                        value: formItemWidget.getTitle()
                    });
                    titleWidget.el.target.appendTo(prevTdElement);
                    prevTdElement.data('widget', titleWidget).addClass('label-column');
                    prevTdElement.droppable("option", "disabled", true);
                    formItemWidget.options.relationTitleWidget = titleWidget;
                }
            }
            needChoose && this._chooseFormItemColumn(tdElement);
            tdElement.droppable("option", "disabled", true);
        },

        _initLayoutTableColDrop: function (tdElement) {
            var self = this;
            tdElement.droppable({
                accept: 'li.form-edit-widget-label',
                hoverClass: 'drag-hover',
                drop: function (event, ui) {
                    var dragElement = ui.draggable;
                    self._onDragElementDrop(this, dragElement, event)
                }
            })
        },

        _onDragElementDrop: function (tdElement, dragElement, event) {
            tdElement = $(tdElement);
            var xtype = dragElement.attr('xtype');
            if (Foundation.isEmpty(xtype)) {
                return
            }

            if (constants.WIDGET_XTYPE.DETAIL_GROUP == xtype) {
                var trElement = tdElement.parents('tr');
                if (trElement.find('td').length > 1) {
                    alert('明细必须占用一整行');
                    return
                }
            }
            this._createTableItemWidgetAndTitle(tdElement, {xtype: xtype}, true);
        },

        _initEvents: function () {
            var self = this;
            var resizeTimeout;

            $(window).bind('resize', function () {
                if (resizeTimeout) {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = null;
                }
                resizeTimeout = setTimeout(function () {
                    var formAttr = self.config.attr;
                    var layout = formAttr.layout;
                    self._setLayoutTableColgroup(layout.width, layout.colgroup);
                }, 100);
            });

            this.el.table.delegate('td.table-layout-column', 'click', function (e) {
                self._clearAllTableColSelected();
                self._chooseFormItemColumn($(this));
                e.stopPropagation();
                return false;
            });

            this.el.table.delegate('i.remove', 'click', function (e) {
                self._onClickRmoveFormItemWidgetBtn(this);
                return false;
            });
        },

        _chooseFormItemColumn: function (tdElement) {
            if (!tdElement.hasClass('has-widgeted')) {
                return
            }
            if (this._chooseTdElement) {
                if (this._chooseTdElement[0] == tdElement[0]) {
                    return
                }
                this._chooseTdElement.removeClass('choosed');
            }
            this._chooseTdElement = tdElement.addClass('choosed');
            this.chooosedFormItemWidget = tdElement.data('widget');
            this.options.onFormItemChoosed && this.options.onFormItemChoosed(this.chooosedFormItemWidget);
        },

        _onClickRmoveFormItemWidgetBtn: function (ele) {
            var self = this;

            function onClickOkBtn() {
                self.__doRmoveChoosedFormItemWidget()
            }

            function onMsgBubbleShow() {
                self._chooseTdElement.addClass('msg_bubble_showing')
            }

            components.Msg.bubble({
                anchor: $(ele),
                contentHTML: $('<div class="delete-confirm-info"/>').text("若删除该控件，其对应的表单数据也会被清除。确定删除？"),
                dockPosition: "right",
                type: "error",
                text4Ok: "删除",
                hAdjust: -1,
                onOk: onClickOkBtn,
                onShow: onMsgBubbleShow
            });
        },

        __doRmoveChoosedFormItemWidget: function () {
            if (this._chooseTdElement) {
                this._chooseTdElement.removeClass('choosed has-widgeted msg_bubble_showing');
                this._chooseTdElement.removeData('widget');
                this._chooseTdElement.droppable("option", "disabled", false);
                this._chooseTdElement.find('i.remove').remove();

                var titleTdElement = this._chooseTdElement.prev();
                if (!Foundation.isEmpty(titleTdElement) && !titleTdElement.hasClass('has-widgeted')) {
                    var titleWidget = titleTdElement.data('widget');
                    titleTdElement.removeClass('label-column').removeData('widget');
                    titleTdElement.droppable("option", "disabled", false);
                    titleWidget && titleWidget.destroy();
                }
                this._chooseTdElement = null;
            }
            if (this.chooosedFormItemWidget) {
                this.chooosedFormItemWidget.destroy();
            }
            if (this.options.onFormItemRemoved) {
                this.options.onFormItemRemoved(this.chooosedFormItemWidget);
            }
        },

        _insertRowElement: function (rowCount) {
            var formAttr = this.config.attr;
            var layout = formAttr.layout;
            var trElement = $('<tr/>');
            Foundation.Array.eachCount(layout.colgroup.length, function () {
                this._createColElement(1, 1).appendTo(trElement);
            }, this);
            // TODO 优化
            var $choosedTd = this.el.tableBody.find('td.choosed');
            if (!Foundation.isEmpty($choosedTd)) {
                var $currentTr = $choosedTd.closest('tr');
                $currentTr.after(trElement);
            } else {
                trElement.appendTo(this.el.tableBody);
            }
        },

        _createColElement: function (colspan, rowspan, widget) {
            var tdElement = $('<td/>')
                .addClass('table-layout-column')
                .attr({colspan: colspan || 1, rowspan: rowspan || 1})
                .data('widget', widget);
            this._initLayoutTableColDrop(tdElement);
            return tdElement
        },

        getFormItemWidgets: function () {
            var widgetItems = [];
            var widgetItemElements = this.el.tableBody.find('>tr>td.has-widgeted');
            widgetItemElements.each(function () {
                widgetItems.push($(this).data('widget'));
            });
            return widgetItems;
        },

        getFormEntry: function () {
            var items = [];
            Foundation.Array.forEach(this.config.items, function (item, i) {
                items.push({
                    id: item.formId,
                    text: item.label,
                    name: item.props.widgetName,
                    xtype: item.props.xtype
                });
            }, this);

            return [{
                entryId: this.config.entryId,
                name: this.config.name,
                xtype: "form",
                fields: items
            }]
        },

        getNextFormItemWidgets: function (widgetElement) {
            if (Foundation.isEmpty(widgetElement)) {
                return [];
            }
            var currentTdElement = widgetElement.closest('td.table-layout-column');
            if (Foundation.isEmpty(currentTdElement)) {
                return []
            }

            var widgets = [],
                can = false;
            this.el.tableBody.find('>tr>td.has-widgeted:not(.label-column)').each(function () {
                if (currentTdElement[0] == this) {
                    can = true;
                    return
                }
                can && widgets.push($(this).data('widget'));
            });
            return widgets;
        },

        getFormTableColumnItems: function () {
            var rows = [];
            this.el.tableBody.find('>tr').each(function () {
                var cols = [];
                var empty = true;
                $(this).find('>td').each(function () {
                    var columnElement = $(this);
                    var colspan = columnElement.attr('colspan');
                    var rowspan = columnElement.attr('rowspan');

                    var widgetSetting = null;
                    if (columnElement.hasClass('has-widgeted')) {
                        var formItemWidget = columnElement.data('widget');
                        widgetSetting = formItemWidget.getSetting();
                        empty = false;
                    }
                    cols.push({
                        widget: widgetSetting,
                        colspan: colspan,
                        rowspan: rowspan
                    })
                });
                empty || rows.push(cols)
            });
            return rows
        },

        getDataSources: function () {
            return window.g.sources
        },

        getFormAttr: function () {
            return this.config.attr || {}
        },

        getFormAttrByName: function (name) {
            return this.config.attr[name]
        },

        setFormAttr: function (name, value) {
            this.config.attr[name] = value;
        },

        setTitle: function (title) {
            this.el.title.text(title);
            this.setFormAttr('name', title);
        },

        setFormAttrLayout: function (layout) {
            var self = this;
            this._setLayoutTableColgroup(layout.width, layout.colgroup);
            var diff = layout.colgroup.length - this.config.attr.layout.colgroup.length;

            if (diff > 0) {
                this.el.tableBody.find('tr').each(function () {
                    var trElement = $(this);
                    Foundation.Array.eachCount(diff, function () {
                        self._createColElement(1, 1).appendTo(trElement);
                    })
                });
            } else if (diff < 0) {
                this.el.tableBody.find('tr').each(function () {
                    var trElement = $(this);
                    Foundation.Array.eachCount(-diff, function () {
                        var tdElement = trElement.find('td:last');
                        var widget = tdElement.data('widget');
                        widget && widget.destroy();
                        tdElement.remove();
                    })
                });
            }
            this.setFormAttr('layout', Foundation.clone(layout));
        },

        setFormStyleBorder: function (border) {
            this.setFormAttr('style', {
                border: border
            });
        },

        getEntryList: function () {
            return this.config.entryList || []
        }

    })
});