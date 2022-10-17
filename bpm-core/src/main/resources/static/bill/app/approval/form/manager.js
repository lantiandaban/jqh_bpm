define(function (require, exports, module) {

    var Hamster = require('lib/index');

    /**
     * 审批表单管理类
     * */
    var ApprovalFormManager = Class.create({

        permissions: [],

        widgetPermissionsMap: {},

        initialize: function (options) {
            Hamster.apply(this, options);
            this.resultWidgets = {};
            this.setPermissions(this.permissions);
        },

        /**
         * 设置权限 (显示和可编辑)
         * */
        setPermissions: function (permissions) {
            this.permissions = permissions;
            this.widgetPermissionsMap = {};
            Hamster.Array.forEach(this.permissions, function (item) {
                this.widgetPermissionsMap[item.widgetName] = {
                    visible: !item.hidden,
                    disable: !item.edit
                }
            }, this);
        },

        /**
         * 获取组件的权限
         * */
        getWidgetPermissions: function (filename) {
            return this.widgetPermissionsMap[filename] || {visible: true, disable: false}
        },

        /**
         *
         * */
        addFormItemWidget: function (widget) {
            this.resultWidgets[widget.getWidgetName()] = widget;
        },


        /**
         * 解析表单组件表达式
         * */
        parseFormula: function (formula) {

            //_widget_name_1501337271161

            //SUM($_widget_1501144216864#,$_widget_1501144216910#)

            //SUM($_widget_name_1501337797205#+$_widget_name_1501337800715#+$_widget_name_1501337802167#+$_widget_name_1501337815386#+$_widget_name_1501337818941#)

            //$_widget_name_1501337797205#

            var i = this,
                n = t.split(/(\$[0-9a-zA-Z\._#@]+)/g),
                a = [];
            FX.Utils.forEach(n, function (t, n) {
                if (FX.Utils.startWith(n, "$_widget_") || FX.Utils.startWith(n, "$ext")) {
                    var s = n.replace("$", "").split("#"),
                        r = s[0],
                        o = s[1];
                    if (FX.Utils.isEmpty(o)) {
                        var l;
                        if (e) {
                            l = e[r];
                        } else {
                            var c = i.getWidgetByName(r);
                            if (FX.Utils.isArray(c)) {
                                l = [];
                                FX.Utils.forEach(c, function (t, e) {
                                    l.push(e.getLinkValue())
                                })
                            } else {
                                c && (l = c.getLinkValue())
                            }
                        }
                        var d = JSON.stringify(l) + "";
                        !isNaN(l) && l < 0 && (d = "(" + d + ")");
                        a.push(d)
                    } else {
                        a.push('"' + n + '"')
                    }
                } else {
                    a.push(n)
                }
            });
            var s;
            try {
                s = FX.Utils.evalFormula(a.join(""))
            } catch (t) {
                s = ""
            }
            return s


            //_calFormula
        },

        getFormItemWidgetByName: function (name, scope) {

        }

    });
    return ApprovalFormManager;
});