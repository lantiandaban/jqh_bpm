/*
 * Copyright © 2015-2018, AnHui Mobiao technology co. LTD Inc. All Rights Reserved.
 */

define(function (require, exports, module) {
    var Hamster = require('lib/index');
    var pageHtml = require('text!view/approval/form/org-select.hbs');

    /**
     * 组织机构选择器面板组件
     * */
    var OrganizationPanel = Class.create({

        statics: {
            getContentDialogSize: function () {
                return {
                    width: 300,
                    height: 600
                }
            }
        },

        extend: Component,

        _getContentElement: function () {
            return $(pageHtml)
        },

        _beforeInit: function () {
            OrganizationPanel.superclass._beforeInit.apply(this);
        },

        _init: function () {
            OrganizationPanel.superclass._init.apply(this);
            var self = this;
            this.searchInput = new Hamster.ui.FormSearchInput({
                appendToEl: $("#tree_panel_header"),
                placeholder: "输入部门名称回车搜索",
                listeners: {
                    search: function (keyword) {
                        self._searchOrg(keyword);
                    }
                }
            });
            this.el.btnOrgSearch = this.el.target.find("#btn-org-search");
            this._initTree();
        },

        _initTree: function () {
            this.el.orgTree = $("#orgTree");
            console.log($("#orgTree"));
            this.orgTree = this.el.orgTree.initZtree({
                service: g.ctx + 'process/tree/rest/organization'
            }, {
                check: {
                    enable: false //单选
                },
                view: {
                    showLine: true
                },
                callback: {
                    /**
                     * 树的节点点击事件
                     */
                    onClick: function (event, treeId, treeNode) {
                        treeNode.checked = true;
                    }
                }
            });
        },

        getSelected: function () {
            var selected = this.orgTree.getSelectedNodes();
            if (selected) {
                var record = selected[0];
                if (record) {
                    var data = record.data;
                    if (data) {
                        return {
                            id: selected[0].data.id || null,
                            name: selected[0].data.name || null
                        }
                    } else {
                        layer.alert('不能选择顶级菜单', {title: '温馨提示'});
                        return false
                    }
                }
            }
        },

        _initEvents: function () {
            var self = this;
            this._bindEvent(this.el.btnOrgSearch, 'click', function () {
                self._searchOrg();
            });
        },

        _searchOrg: function (keyword) {
            var self = this;
            var name = keyword;
            if (!name) {
                return;
            }
            var nodeList = this.orgTree.getNodesByParamFuzzy("name", name);
            if (nodeList.length) {
                var flag = true;
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].checked) {
                        if (i < nodeList.length - 1) {
                            flag = false;
                            nodeList[i++].checked = false;
                            nodeList[i].checked = true;
                            self.orgTree.selectNode(nodeList[i]);
                        }
                    }
                }
                if (flag) {
                    nodeList[0].checked = true;
                    self.orgTree.selectNode(nodeList[0]);
                }
            }
        },

        destroy: function () {
            OrganizationPanel.superclass.destroy.apply(this, arguments);
        }
    });
    Hamster.ui.TriggerSelect.registerChooseComp('organization-choose-panel', OrganizationPanel);
    /**
     * 职位树选择器面板组件
     * */
    var positionPanel = Class.create({

        statics: {
            getContentDialogSize: function () {
                return {
                    width: 300,
                    height: 600
                }
            }
        },

        extend: Component,

        _getContentElement: function () {
            return $(pageHtml)
        },

        _beforeInit: function () {
            positionPanel.superclass._beforeInit.apply(this);
        },

        _init: function () {
            positionPanel.superclass._init.apply(this);

            var self = this;
            this.searchInput = new Hamster.ui.FormSearchInput({
                appendToEl: $("#tree_panel_header"),
                placeholder: "输入职位名称回车搜索",
                listeners: {
                    search: function (keyword) {
                        self._searchOrg(keyword);
                    }
                }
            });
            this.el.btnOrgSearch = this.el.target.find("#btn-org-search");
            this._initTree();
        },

        _initTree: function () {
            this.orgTree = $("#orgTree").initZtree({
                service: g.ctx + 'process/tree/rest/position'
            }, {
                check: {
                    enable: false //单选
                },
                view: {
                    showLine: true
                },
                callback: {
                    /**
                     * 树的节点点击事件
                     */
                    onClick: function (event, treeId, treeNode) {
                        // treeNode.checked = true;
                    }
                }
            });
        },

        getSelected: function () {
            var selected = this.orgTree.getSelectedNodes();
            if (selected) {
                if (selected[0].id == 0) {
                    layer.msg('请选择一个正确的职位');
                    return;
                }
                return {
                    id: selected[0].data.id || null,
                    name: selected[0].data.name || null
                }
            }
        },

        _initEvents: function () {
            var self = this;
            this._bindEvent(this.el.btnOrgSearch, 'click', function () {
                self._searchOrg();
            });
        },

        _searchOrg: function (keyword) {
            var self = this;
            var name = keyword;
            if (!name) {
                return;
            }
            var nodeList = this.orgTree.getNodesByParamFuzzy("name", name);
            if (nodeList.length) {
                var flag = true;
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].checked) {
                        if (i < nodeList.length - 1) {
                            flag = false;
                            nodeList[i++].checked = false;
                            nodeList[i].checked = true;
                            self.orgTree.selectNode(nodeList[i]);
                        }
                    }
                }
                if (flag) {
                    nodeList[0].checked = true;
                    self.orgTree.selectNode(nodeList[0]);
                }
            }
        },

        destroy: function () {
            positionPanel.superclass.destroy.apply(this, arguments);
        }
    });
    Hamster.ui.TriggerSelect.registerChooseComp('position-choose-panel', positionPanel);
    /**
     * 员工单选组件
     * */
    var EmployeeSingleChoosePanel = Class.create({

        statics: {
            getContentDialogSize: function () {
                return {
                    width: 1000,
                    contentPadding: 20,
                    height: 710
                }
            }
        },

        extend: Component,
        _getContentElement: function () {
            var HTMLS = [];
            HTMLS.push('<div class="fill">');
            HTMLS.push('    <div class="search-box clearfix p-l-xs p-r-xs component-el" id="search_bar">');
            HTMLS.push('        <div class="search-item">');
            HTMLS.push('            <label>人员名称</label>');
            HTMLS.push('            <div class="search-item-content none-border component-el" id="search_username_input"></div>');
            HTMLS.push('        </div>');
            HTMLS.push('        <div class="search-item">');
            HTMLS.push('            <label>所在部门</label>');
            HTMLS.push('            <div class="search-item-content none-border component-el" id="search_org_tree"></div>');
            HTMLS.push('        </div>');
            HTMLS.push('        <div class="search-item">');
            HTMLS.push('            <label>岗位</label>');
            HTMLS.push('            <div class="search-item-content none-border component-el" id="search_position_tree"></div>');
            HTMLS.push('        </div>');
            HTMLS.push('        <div class="search-action-item component-el" id="search_submit_btn"></div>');
            HTMLS.push('    </div>');
            HTMLS.push('    <div class="p-xs"><div class="component-el" id="data_table_wrapper"></div></div>');
            HTMLS.push('</div>');
            return $(HTMLS.join(''))
        },

        _beforeInit: function () {
            EmployeeSingleChoosePanel.superclass._beforeInit.apply(this);
        },

        _init: function () {
            EmployeeSingleChoosePanel.superclass._init.apply(this);
            this.initSearchBar();
            this.initDataTable();
        },

        initSearchBar: function () {
            this.usernameInput = new Hamster.ui.FormInput({
                appendToEl: $("#search_username_input")
            });
            this.organizationId = new Hamster.ui.TriggerSelect({
                placeholder: "请选择所属部门部门",
                valueField: 'id',
                displayField: 'name',
                required: true,
                execBlockName: 'organization-choose-panel',
                execBlockOptions: {},
                appendToEl: $("#search_org_tree")
            });
            this.positionIdSel = new Hamster.ui.TriggerSelect({
                placeholder: "请选择职位",
                valueField: 'id',
                displayField: 'name',
                required: true,
                execBlockName: 'position-choose-panel',
                execBlockOptions: {},
                appendToEl: $("#search_position_tree")
            });
            this.searchBtn = new Hamster.ui.Button({
                appendToEl: $("#search_submit_btn"),
                title: "搜索",
                handler: this.search.bind(this)
            });
        },

        initDataTable: function () {
            this._serverDataTable = new Hamster.ui.ServerDataTable({
                appendToEl: $("#data_table_wrapper"),
                border: true,
                url: 'user/center/datagrids',
                extClsList: ['ui-data-grid-border-t'],
                paging: true,
                pageSize: 10,
                multiSelect: false,
                hasIndex: false,
                columns: [
                    {
                        width: '40px',
                        orderable: false,
                        render: function (row, type, set, meta) {
                            return meta.settings._iDisplayStart + meta.row + 1;
                        },
                        className: 'text-center dt_index',
                        title: '序号'
                    },
                    {
                        data: 'username',
                        width: 100,
                        title: '姓名'
                    },
                    {
                        data: 'orgName',
                        width: 200,
                        title: '所在部门'
                    },
                    {
                        data: 'position',
                        width: 200,
                        title: '岗位'
                    }
                ],
                tableAutoWidth: true,
                height: 500,
                width: 600,
                originalDataTableOptions: {
                    ordering: true,
                    order: [[2, 'asc']]
                }
            });
            this._serverDataTable.on('single-select-row-dblclick', this.onSingleSelectRowDblclick.bind(this));
        },

        onSingleSelectRowDblclick: function () {
            this.triggerEvent('selected-over');
        },

        search: function () {
            var orgId = 0;
            if (!Hamster.isEmpty(this.organizationId.getValue())) {
                orgId = this.organizationId.getValue()[0].id;
            }
            var positionId = 0;
            if (!Hamster.isEmpty(this.positionIdSel.getValue())) {
                positionId = this.positionIdSel.getValue()[0].id;
            }
            var params = {
                username: this.usernameInput.getValue(),
                orgId: orgId,
                positionId: positionId
            };
            this._serverDataTable.setParams(params);
            this._serverDataTable.reload();
        },

        getSelected: function () {
            return this._serverDataTable.getSelected();
        },

        destroy: function () {
            EmployeeSingleChoosePanel.superclass.destroy.apply(this, arguments);
        }
    });
    Hamster.ui.TriggerSelect.registerChooseComp('employee-single-choose-panel', EmployeeSingleChoosePanel);

});