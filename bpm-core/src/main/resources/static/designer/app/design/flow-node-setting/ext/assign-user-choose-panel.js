define(function (require, exports, module) {

    var assignUserChooseHtml = require('text!view/process/assign-user-choose.hbs');

    var Class = require('Class');
    var Foundation = require('Foundation');
    var Widget = require('../../../component/widget');
    var components = require('../../../component/index');
    var constants = require('../../constants');
    var server = require('../../server');


    var departmentTreeDataSource = [
        {
            "name": "上海景同信息科技股份有限公司",
            "departmentId": 1,
            "parentId": 0,
            "open": true
        },
        {
            "name": "协同事业部",
            "departmentId": 16657539,
            "parentId": 1
        },
        {
            "name": "合肥协同事业部",
            "departmentId": 16852480,
            "parentId": 1
        }
    ];


    var userDataSource = [
        {
            "id": "59240af1c872010b38dbfd0f",
            "username": "ding360c77d29d792ffa-02393532267604",
            "name": "安国潮",
            "category": 2
        },
        {
            "id": "59240af1c872010b38dbfd10",
            "username": "ding360c77d29d792ffa-03342863149179",
            "name": "杨友峰",
            "category": 2
        },
        {
            "id": "59240af1c872010b38dbfd12",
            "username": "ding360c77d29d792ffa-034709666324447477",
            "name": "张继铜",
            "category": 2
        },
        {
            "id": "59240af1c872010b38dbfd14",
            "username": "ding360c77d29d792ffa-034710332421467251",
            "name": "周华龙",
            "category": 2
        },
        {
            "id": "59240af1c872010b38dbfd0c",
            "username": "ding360c77d29d792ffa-043702390129582866",
            "name": "王贵远",
            "category": 2
        },
        {
            "id": "59240af1c872010b38dbfd13",
            "username": "ding360c77d29d792ffa-04416609657101",
            "name": "张名东",
            "category": 2
        },
        {
            "id": "59240af1c872010b38dbfd0e",
            "username": "ding360c77d29d792ffa-04416609669000",
            "name": "张庆",
            "category": 2
        },
        {
            "id": "59240af1c872010b38dbfd0d",
            "username": "ding360c77d29d792ffa-04416609675478",
            "name": "杜海斌",
            "category": 2
        },
        {
            "id": "59240af1c872010b38dbfd11",
            "username": "ding360c77d29d792ffa-0463494328783779",
            "name": "彭杰",
            "category": 2
        },
        {
            "id": "59240af1c872010b38dbfd18",
            "username": "ding360c77d29d792ffa-051943242421148280",
            "name": "刘琳琳",
            "category": 2
        },
        {
            "id": "59240af1c872010b38dbfd17",
            "username": "ding360c77d29d792ffa-0545545809695504",
            "name": "卢菲",
            "category": 2
        },
        {
            "id": "59240af1c872010b38dbfd15",
            "username": "ding360c77d29d792ffa-055351115026734026",
            "name": "杨鸿雁",
            "category": 2
        },
        {
            "id": "59240af1c872010b38dbfd16",
            "username": "ding360c77d29d792ffa-080847165526375925",
            "name": "杨煜轩",
            "category": 2
        }
    ];


    var treeDefaultSettingOption = {
        view: {
            expandSpeed: 100
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {},
        check: {
            enable: false,
            chkboxType: {
                Y: "",
                N: ""
            }
        }
    };


    var AssignUserChoosePanelWidget = Class.create({
        extend: Widget,
        _defaultOptions: function () {
            return Foundation.apply(AssignUserChoosePanelWidget.superclass._defaultOptions.apply(this), {
                baseCls: "fx_assign_user_choose",
                userIdKey: 'id',
                userNameKey: 'name',
                value: [],
                onUserItemsChanged: null,
            });
        },
        _init: function () {
            AssignUserChoosePanelWidget.superclass._init.apply(this);

            this._selectedUserMap = {};

            this.el.selectList = this.el.target.find('.select-list');
            this.el.tabItems = this.el.target.find('.tab-list>.tab-item');
            this.el.userList = this.el.target.find('.user-list');

            this.el.panel = {};
            this.el.panel.department = this.el.target.find('#select-tree-body-department');
            this.el.panel.position = this.el.target.find('#select-tree-body-position');

            this._activeTab('department');
        },

        _defaultRoot: function () {
            return $(assignUserChooseHtml)
        },

        _initDefaultValue: function() {
            this.setValue(this.options.value);
        },


        _initEvents: function () {
            this._bindEvent(this.el.tabItems, 'click', '_onTabItemClick');
            this._bindDelegateEvent(this.el.userList, '.x-check', 'click', '_onUserItemCheckboxClick');
            this._bindDelegateEvent(this.el.selectList, '.remove-btn', 'click', '_onSelectedUserItemRemoveBtnClick');
        },

        _onTabItemClick: function (element) {
            var type = element.attr('data-type');
            this._activeTab(type);
        },

        _activeTab: function (type) {
            var element = this.el.tabItems.filter('[data-type=' + type + ']');
            element.addClass('selected').siblings().removeClass('selected');
            this.el.panel[type].show().siblings().hide();

            if (type == 'department') {
                this.departmentTree || this._initDepartmentTree();
            } else {
                this.positionTree || this._initPositionTree();
            }
        },

        _initDepartmentTree: function () {
            var self =this;
            server.getOrgsData(function (departmentTreeDataSource) {
                self.departmentTree = new components.Tree({
                    treeId: "departmentTree",
                    renderEl: $("<div/>").appendTo(self.el.panel.department),
                    customCls: "x-department-tree  select-department",
                    Nodes: Foundation.clone(departmentTreeDataSource),
                    setting: Foundation.Object.merge({
                        data: {
                            simpleData: {
                                idKey: "departmentId",
                                pIdKey: "parentId"
                            }
                        },
                        callback: {
                            onClick: self._onDepartmentTreeNodeClick.bind(self)
                        }
                    }, treeDefaultSettingOption)
                })
            });
        },

        _initPositionTree: function () {
            var nodes = Foundation.clone(window.g.positsions || []);
            this.positionTree = new components.Tree({
                treeId: "positionTree",
                renderEl: $("<div/>").appendTo(this.el.panel.position),
                customCls: "x-position-tree select-position",
                Nodes: nodes,
                setting: Foundation.Object.merge({
                    data: {
                        simpleData: {
                            idKey: "id",
                            pIdKey: "prarentId"
                        }
                    },
                    callback: {
                        onClick: this._onPositionTreeNodeClick.bind(this)
                    }
                }, treeDefaultSettingOption)
            })
        },

        //部门树节点点击
        _onDepartmentTreeNodeClick: function (event, node) {
            var self = this;
            server.getUsersDataByOrgId(node.departmentId, function (userDataSource) {
                self._loadUserChooseList(userDataSource);
            });
        },

        //职位树节点点击
        _onPositionTreeNodeClick: function (event, node) {
            var self = this;
            server.getUsersDataByPositionId(node.id, function (userDataSource) {
                self._loadUserChooseList(userDataSource);
            });
        },

        //加载用户选择列表
        _loadUserChooseList: function (data) {
            var itemHtmlFormatString = '<li><span>{0}</span><div class="select-check x-check {1}"><i class="icon-blank"></i><span></span></div></li>';
            this.el.userList.empty().toggleClass('empty', Foundation.isEmpty(data));
            Foundation.Array.forEach(data, function (userItem) {
                var selectCls = this._checkUserIsSelected(userItem.id) ? 'select' : '';
                var user = this._formatUserItem(userItem);
                var itemElement = $(Foundation.String.format(itemHtmlFormatString, user.name, selectCls));
                itemElement.data('user', user);
                this.el.userList.append(itemElement);
            }, this);
        },

        _formatUserItem: function (userItem) {
            var options = this.options;
            var userId = userItem[options.userIdKey];
            var userName = userItem[options.userNameKey];
            return {
                id: userId,
                name: userName
            }
        },

        _onUserItemCheckboxClick: function (element) {
            element.toggleClass('select');
            var userItemElement = element.closest('li');
            var user = userItemElement.data('user');

            if (this._checkUserIsSelected(user.id)) {
                this._removeSelectedUser(user.id, false);
            } else {
                this._addSelectedUser(user);
            }
            this._applyCallback(this.options.onUserItemsChanged, this)
        },

        _onSelectedUserItemRemoveBtnClick: function (element, event) {
            var user = element.closest('li').data('user');
            this._removeSelectedUser(user.id, true);
            this._applyCallback(this.options.onUserItemsChanged, this)
        },

        _checkUserIsSelected: function (userId) {
            return !Foundation.isEmpty(this._selectedUserMap[userId])
        },

        _addSelectedUser: function (user) {
            var selectedItemHtml = Foundation.String.format('<li class="select-item"><i class="select-icon icon-member-normal"></i><span>{0}</span><span class="remove-btn"><i class="icon-close-large"></i></span></li>',
                user.name);
            var selectedItemElement = $(selectedItemHtml)
                .data('user', user)
                .appendTo(this.el.selectList);
            this.el.selectList.removeClass('empty');

            this._selectedUserMap[user.id] = {
                user: user,
                element: selectedItemElement
            };
        },

        _removeSelectedUser: function (userId, reloadUserList) {
            if (!this._checkUserIsSelected(userId)) {
                return
            }
            this._selectedUserMap[userId].element.remove();
            delete this._selectedUserMap[userId];

            if (Foundation.isEmpty(this.el.selectList.find('li'))) {
                this.el.selectList.addClass('empty');
            }

            if (reloadUserList) {
                this._syncUserListSelectStatus();
            }
        },

        _syncUserListSelectStatus: function () {
            var self = this;
            this.el.userList.find('li').each(function () {
                var itemElement = $(this);
                var user = itemElement.data('user');
                itemElement.find('.x-check').toggleClass('select', self._checkUserIsSelected(user.id));
            });
        },

        setValue: function (value, reloadUserList) {
            this.el.selectList.empty();
            this.el.selectList.addClass('empty');
            this._selectedUserMap = {};

            Foundation.Array.forEach(value || [], function (userValue) {
                this._addSelectedUser(userValue);
            }, this);
            if (reloadUserList) {
                this._syncUserListSelectStatus();
            }
        },

        getValue: function () {
            var value = [];
            Foundation.Object.each(this._selectedUserMap, function (key, vItem) {
                value.push(Foundation.clone(vItem.user));
            }, this);
            return value
        },

        destroy: function () {
            this.positionTree && this.positionTree.destroy();
            this.departmentTree && this.departmentTree.destroy();
            AssignUserChoosePanelWidget.superclass.destroy.apply(this);
        }

    });

    return AssignUserChoosePanelWidget;
});