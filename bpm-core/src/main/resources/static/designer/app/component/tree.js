define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var Foundation = require('Foundation');

    function applyFunc(a, b, c, d) {
        return Foundation.isFunction(b) ? b.apply(a, c ? c : []) : d
    }

    var DomTree = {
        setting: {
            treeId: "tree",
            treeObj: null,
            view: {
                addDiyDom: null,
                autoCancelSelected: !0,
                dblClickExpand: !1,
                expandSpeed: "fast",
                fontCss: {},
                nameIsHTML: !1,
                selectedMulti: !1,
                showIcon: !1,
                showLine: !1,
                showTitle: !0,
                txtSelectedEnable: !1
            },
            data: {
                key: {
                    children: "children",
                    name: "name",
                    title: "",
                    url: "url",
                    checked: "checked"
                },
                simpleData: {
                    enable: !1,
                    idKey: "id",
                    pIdKey: "pId",
                    rootPId: null
                },
                keep: {
                    parent: !1,
                    leaf: !1
                }
            },
            async: {
                enable: !1,
                contentType: "application/x-www-form-urlencoded",
                type: "post",
                dataType: "text",
                url: "",
                autoParam: [],
                otherParam: [],
                dataFilter: null
            },
            callback: {
                beforeAsync: null,
                beforeNodeCreate: null,
                beforeClick: null,
                beforeDblClick: null,
                beforeRightClick: null,
                beforeMouseDown: null,
                beforeMouseUp: null,
                beforeExpand: null,
                beforeCollapse: null,
                beforeRemove: null,
                beforeCheck: null,
                onAsyncError: null,
                onAsyncSuccess: null,
                onNodeCreated: null,
                onClick: null,
                onDblClick: null,
                onRightClick: null,
                onMouseDown: null,
                onMouseUp: null,
                onExpand: null,
                onCollapse: null,
                onRemove: null,
                onCheck: null
            },
            consts: {
                className: {
                    BUTTON: "button",
                    LEVEL: "level",
                    ICO_LOADING: "ico_loading",
                    SWITCH: "switch"
                },
                event: {
                    NODECREATED: "tree_nodeCreated",
                    CLICK: "tree_click",
                    EXPAND: "tree_expand",
                    COLLAPSE: "tree_collapse",
                    ASYNC_SUCCESS: "tree_async_success",
                    ASYNC_ERROR: "tree_async_error",
                    CHECK: "tree_check"
                },
                id: {
                    A: "_a",
                    ICON: "_ico",
                    SPAN: "_span",
                    SWITCH: "_switch",
                    UL: "_ul",
                    CHECK: "_check"
                },
                line: {
                    ROOT: "root",
                    ROOTS: "roots",
                    CENTER: "center",
                    BOTTOM: "bottom",
                    NOLINE: "noline",
                    LINE: "line"
                },
                folder: {
                    OPEN: "open",
                    CLOSE: "close",
                    DOCU: "docu"
                },
                node: {
                    CURSELECTED: "curSelectedNode"
                },
                checkbox: {
                    STYLE: "x-check",
                    DEFAULT: "x-tree-check",
                    DISABLED: "disable",
                    FALSE: "",
                    TRUE: "select",
                    FULL: "full",
                    PART: "part",
                    FOCUS: "focus"
                },
                radio: {
                    STYLE: "radio",
                    TYPE_ALL: "all",
                    TYPE_LEVEL: "level"
                }
            },
            check: {
                enable: !1,
                autoCheckTrigger: !1,
                chkStyle: "x-check",
                nocheckInherit: !1,
                chkDisabledInherit: !1,
                radioType: "level",
                chkboxType: {
                    Y: "ps",
                    N: "ps"
                }
            }
        },

        getDOMBySelector: function(selector, idString, content) {
            if (idString && !Foundation.isString(idString)) {
                content = idString;
                idString = "";
            }
            if (Foundation.isString(selector)) {
                return $(selector, content ? content.treeObj.get(0).ownerDocument : null);
            } else {
                return $("#" + selector.tId + idString, content ? content.treeObj : null);
            }
        },

        makeUlLineClass: function(setting, node) {
            return setting.view.showLine && !node.isLastNode ? setting.consts.line.LINE : ""
        },

        makeUlHtml: function(setting, node, htmls, childrensHtml) {
            htmls.push("<ul id='", node.tId, setting.consts.id.UL, "' class='", setting.consts.className.LEVEL, node.level, " ", this.makeUlLineClass(setting, node), "' style='display:", node.open ? "block" : "none", "'>");
            htmls.push(childrensHtml);
            htmls.push("</ul>")
        },

        appendParentULDom: function(setting, node) {
            var htmls = [];
            var dom = this.getDOMBySelector(node, setting);
            if (!Foundation.isEmpty(dom) && node.parentTId) {
                this.appendParentULDom(setting, node.getParentNode());
                dom = this.getDOMBySelector(node, setting);
            }

            var ulElement = this.getDOMBySelector(node, setting.consts.id.UL, setting);
            if (!Foundation.isEmpty(ulElement)) {
                ulElement.remove();
            }

            var children = setting.data.key.children;
            var childrenHtmls = this.appendNodes(setting, node.level + 1, node[children], node, false, true);
            this.makeUlHtml(setting, node, htmls, childrenHtmls.join(''));
            dom.append(htmls.join(''));
        },

        makeNodeIcoStyle: function(setting, node) {
            var styles = [];
            if (!node.isAjaxing) {
                var icon = node.isParent && node.iconOpen && node.iconClose ? (node.open ? node.iconOpen : node.iconClose) : node.icon;
                if (icon) {
                    styles.push("background:url(", icon, ") 0 0 no-repeat;");
                }
                if (setting.view.showIcon) {
                    this._applyCallback(setting.view.showIcon, this, [node]);
                } else {
                    styles.push("width:0px;height:0px;")
                }
            }
            return styles.join("")
        },

        makeNodeLineClass: function(setting, node) {
            var clses = [];
            if (setting.view.showLine) {
                if (0 === node.level && node.isFirstNode && node.isLastNode) {
                    clses.push(setting.consts.line.ROOT);
                } else if (0 === node.level && node.isFirstNode) {
                    clses.push(setting.consts.line.ROOTS)
                } else {
                    node.isLastNode ? clses.push(setting.consts.line.BOTTOM) : clses.push(setting.consts.line.CENTER)
                }
            } else {
                clses.push(setting.consts.line.NOLINE);
            }

            if (node.isParent) {
                clses.push(node.open ? setting.consts.folder.OPEN : setting.consts.folder.CLOSE)
            } else {
                clses.push(setting.consts.folder.DOCU);
            }

            return this.makeNodeLineClassEx(setting, node) + clses.join("_")
        },

        makeNodeLineClassEx: function(setting, node) {
            return setting.consts.className.BUTTON + " " + setting.consts.className.LEVEL + node.level + " " + setting.consts.className.SWITCH + " x-iconfont "
        },

        setNodeLineIcos: function(setting, node) {
            if (node) {
                var switchElement = this.getDOMBySelector(node, setting.consts.id.SWITCH, setting),
                    ulElement = this.getDOMBySelector(node, setting.consts.id.UL, setting),
                    iconElement = this.getDOMBySelector(node, setting.consts.id.ICON, setting),
                    ulLineClass = this.makeUlLineClass(setting, node);

                if (Foundation.isEmpty(ulLineClass)) {
                    ulElement.removeClass(setting.consts.line.LINE)
                } else {
                    ulElement.addClass(ulLineClass);
                }
                switchElement.attr("class", this.makeNodeLineClass(setting, node));
                node.isParent ? switchElement.removeAttr("disabled") : switchElement.attr("disabled", "disabled");
                iconElement.removeAttr("style");
                iconElement.attr("style", this.makeNodeIcoStyle(setting, node));
                iconElement.attr("class", this.makeNodeIcoClass(setting, node))
            }
        },

        cancelPreSelectedNode: function(setting, node) {
            var selectedList = this.root.curSelectedList;
            for (var i = selectedList.length - 1; i >= 0; i--) {
                if (Foundation.isNull(node) || node === selectedList[i]) {
                    this.getDOMBySelector(selectedList[i], setting.consts.id.A, setting).removeClass(setting.consts.node.CURSELECTED);
                    if (node) {
                        this.removeSelectedNode(setting, node);
                        break;
                    }
                }
            }
            if (!node) {
                this.root.curSelectedList = []
            }
        },

        getNodeMainDom: function(a) {
            return $(a).parent("li").get(0) || $(a).parentsUntil("li").parent().get(0)
        },

        getMDom: function(setting, b, c) {
            if (!b) return null;
            for (; b && b.id !== setting.treeId;) {
                for (var d = 0, e = c.length; b.tagName && d < e; d++)
                    if (b.tagName == c[d].tagName && null !== b.getAttribute(c[d].attrName)) return b;
                b = b.parentNode
            }
            return null
        },

        getNodeName: function(a, b) {
            var c = a.data.key.name;
            return "" + b[c]
        },
        getNodeTitle: function(a, b) {
            var c = "" === a.data.key.title ? a.data.key.name : a.data.key.title;
            return "" + b[c]
        },
        makeDOMNodeIcon: function(a, b, c) {
            var d = this.getNodeName(b, c),
                e = b.view.nameIsHTML ? d : d.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            a.push("<i id='", c.tId, b.consts.id.ICON, "' title='' treeNode", b.consts.id.ICON, " class='", this.makeNodeIcoClass(b, c), "' style='", this.makeNodeIcoStyle(b, c), "'></i><span id='", c.tId, b.consts.id.SPAN, "'>", e, "</span>")
        },
        makeDOMNodeLine: function(a, b, c) {
            a.push("<i id='", c.tId, b.consts.id.SWITCH, "' title='' class='", this.makeNodeLineClass(b, c), "' treeNode", b.consts.id.SWITCH, "></i>")
        },
        makeDOMNodeMainAfter: function(a, b, c) {
            a.push("</li>")
        },
        makeDOMNodeMainBefore: function(a, b, c) {
            a.push("<li id='", c.tId, "' class='", b.consts.className.LEVEL, c.level, "' tabindex='0' hidefocus='true' treenode>")
        },
        makeDOMNodeNameAfter: function(a, b, c) {
            a.push("</a>")
        },
        makeDOMNodeNameBefore: function(a, b, c) {
            var d = this.getNodeTitle(b, c),
                e = this.makeNodeUrl(b, c),
                f = this.makeNodeFontCss(b, c),
                g = [];
            for (var h in f) g.push(h, ":", f[h], ";");
            a.push("<a id='", c.tId, b.consts.id.A, "' class='", b.consts.className.LEVEL, c.level, "' treeNode", b.consts.id.A, ' onclick="', c.click || "", '" ', null != e && e.length > 0 ? "href='" + e + "'" : "", " target='", this.makeNodeTarget(c), "' style='", g.join(""), "'");
            applyFunc(this, b.view.showTitle, [c], b.view.showTitle) && d && a.push("title='", d.replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), "'"), a.push(">")
        },
        makeNodeFontCss: function(a, b) {
            var c = applyFunc(this, a.view.fontCss, [b], a.view.fontCss);
            return c && "function" != typeof c ? c : {}
        },
        makeNodeIcoClass: function(a, b) {
            var c = ["ico"];
            return b.isAjaxing || (c[0] = (b.iconSkin ? b.iconSkin + "_" : "") + c[0], b.isParent ? c.push(b.open ? a.consts.folder.OPEN : a.consts.folder.CLOSE) : c.push(a.consts.folder.DOCU)), a.consts.className.BUTTON + " " + c.join("_") + " x-iconfont"
        },
        makeNodeTarget: function(a) {
            return a.target || "_blank"
        },
        makeNodeUrl: function(a, b) {
            var c = a.data.key.url;
            return b[c] ? b[c] : null
        },
        setFirstNode: function(a, b) {
            var c = a.data.key.children,
                d = b[c].length;
            d > 0 && (b[c][0].isFirstNode = !0)
        },
        setLastNode: function(a, b) {
            var c = a.data.key.children,
                d = b[c].length;
            d > 0 && (b[c][d - 1].isLastNode = !0)
        },
        removeNode: function(a, b) {
            var c = a.data.key.children,
                d = b.parentTId ? b.getParentNode() : null;
            if (b.isFirstNode = !1, b.isLastNode = !1, b.getPreNode = function() { return null }, b.getNextNode = function() { return null }, this.getNodeCache(b.tId)) {
                this.removeNodeCache(a, b), this.removeSelectedNode(a, b);
                for (var e = 0, f = d[c].length; e < f; e++)
                    if (d[c][e].tId == b.tId) { d[c].splice(e, 1); break }
                var g = this.getDOMBySelector(b, "");
                g && g.length > 0 && g.remove()
            }
        },
        replaceIcoClass: function(a, b, c) {
            if (b && !a.isAjaxing) {
                var d = b.attr("class");
                if (void 0 != d) {
                    var e = d.split("_"),
                        f = this.options.setting;
                    switch (c) {
                        case f.consts.folder.OPEN:
                        case f.consts.folder.CLOSE:
                        case f.consts.folder.DOCU:
                            e[e.length - 1] = c
                    }
                    b.attr("class", e.join("_") + " x-iconfont")
                }
            }
        },
        replaceSwitchClass: function(a, b, c) {
            if (b) {
                var d = b.attr("class");
                if (void 0 != d) {
                    var e = d.split("_"),
                        f = this.options.setting;
                    switch (c) {
                        case f.consts.line.ROOT:
                        case f.consts.line.ROOTS:
                        case f.consts.line.CENTER:
                        case f.consts.line.BOTTOM:
                        case f.consts.line.NOLINE:
                            e[0] = this.makeNodeLineClassEx(a) + c;
                            break;
                        case f.consts.folder.OPEN:
                        case f.consts.folder.CLOSE:
                        case f.consts.folder.DOCU:
                            e[1] = c
                    }
                    b.attr("class", e.join("_")), c !== f.consts.folder.DOCU ? b.removeAttr("disabled") : b.attr("disabled", "disabled")
                }
            }
        },
        selectNode: function(a, b) {
            var c = this.options.setting;
            b || this.cancelPreSelectedNode(c), this.getDOMBySelector(a, c.consts.id.A, c).addClass(c.consts.node.CURSELECTED), this.addSelectedNode(c, a)
        },
        setNodeFontCss: function(a, b) {
            var c = this.getDOMBySelector(b, a.consts.id.A, a),
                d = this.makeNodeFontCss(a, b);
            d && c.css(d)
        },
        setNodeName: function(a, b) {
            var c = this.getNodeTitle(a, b),
                d = this.getDOMBySelector(b, a.consts.id.SPAN, a);
            if (d.empty(), a.view.nameIsHTML ? d.html(this.getNodeName(a, b)) : d.text(this.getNodeName(a, b)), applyFunc(this, a.view.showTitle, [b], a.view.showTitle)) {
                var e = this.getDOMBySelector(b, a.consts.id.A, a);
                e.attr("title", c ? c : "")
            }
        },
        setNodeTarget: function(a, b) {
            var c = this.getDOMBySelector(b, a.consts.id.A, a);
            c.attr("target", this.makeNodeTarget(b))
        },
        setNodeUrl: function(a, b) {
            var c = this.getDOMBySelector(b, a.consts.id.A, a),
                d = this.makeNodeUrl(a, b);
            null == d || 0 === d.length ? c.removeAttr("href") : c.attr("href", d)
        },
        switchNode: function(a, b) {
            if (b.open || !this.canAsync(a, b)) this.expandCollapseNode(a, b, !b.open);
            else if (a.async.enable) { if (!this.asyncNode(a, b)) return void this.expandCollapseNode(a, b, !b.open) } else b && this.expandCollapseNode(a, b, !b.open)
        }

    };

    var EventTree = {
        bindTree: function(a) {
            var b = this.el.target,
                c = this;
            a.view.txtSelectedEnable || b.bind("selectstart", function(a) { var b = a.originalEvent.srcElement.nodeName.toLowerCase(); return "input" === b || "textarea" === b }).css({ "-mo-user-select": "-mo-none" });
            var d = function(a) {
                var b = c.doProxy(a),
                    d = !0;
                return b && (b.nodeEventCallback && (d = b.nodeEventCallback.apply(c, [a, b.node]) && d), b.treeEventCallback && (d = b.treeEventCallback.apply(c, [a, b.node]) && d)), d
            };
            b.bind("click", d)
                .bind("dblclick", d)
                .bind("mouseover", d)
                .bind("mouseout", d)
                .bind("mousedown", d)
                .bind("mouseup", d)
                .bind("contextmenu", d)
        },
        doProxy: function(a) {
            var b = a.target,
                c = this.options.setting,
                d = "",
                e = null,
                f = "",
                g = "",
                h = null,
                i = null,
                j = null;
            if ("mousedown" == a.type ? g = "mousedown" : "mouseup" == a.type ? g = "mouseup" : "contextmenu" == a.type ? g = "contextmenu" : "click" == a.type ? "I" != b.tagName && "SPAN" != b.tagName || null === b.getAttribute("treeNode" + c.consts.id.SWITCH) ? (j = this.getMDom(c, b, [{ tagName: "A", attrName: "treeNode" + c.consts.id.A }]), j && (d = this.getNodeMainDom(j).id, f = "clickNode")) : (d = this.getNodeMainDom(b).id, f = "switchNode") : "dblclick" == a.type && (g = "dblclick", j = this.getMDom(c, b, [{ tagName: "A", attrName: "treeNode" + c.consts.id.A }]), j && (d = this.getNodeMainDom(j).id, f = "switchNode")), g.length > 0 && 0 === d.length && (j = this.getMDom(c, b, [{ tagName: "A", attrName: "treeNode" + c.consts.id.A }]), j && (d = this.getNodeMainDom(j).id)), d.length > 0) switch (e = this.getNodeCache(d), f) {
                case "switchNode":
                    e.isParent && ("click" == a.type || "dblclick" == a.type && applyFunc(this, c.view.dblClickExpand, [e], c.view.dblClickExpand)) ? h = this.onSwitchNode : f = "";
                    break;
                case "clickNode":
                    h = this.onClickNode
            }
            switch (g) {
                case "mousedown":
                    i = this.onTreeMousedown;
                    break;
                case "mouseup":
                    i = this.onTreeMouseup;
                    break;
                case "dblclick":
                    i = this.onTreeDblclick;
                    break;
                case "contextmenu":
                    i = this.onTreeContextmenu
            }
            var k = { node: e, nodeEventType: f, nodeEventCallback: h, treeEventType: g, treeEventCallback: i };
            return k
        },
        bindEvent: function(a) {
            var b = this.el.target,
                c = a.consts.event,
                d = this;
            b.bind(c.NODECREATED, function(b, c) { applyFunc(d, a.callback.onNodeCreated, [b, c]) }), b.bind(c.CLICK, function(b, c, e, f) { applyFunc(d, a.callback.onClick, [c, e, f]) }), b.bind(c.EXPAND, function(b, c) { applyFunc(d, a.callback.onExpand, [b, c]) }), b.bind(c.COLLAPSE, function(b, c) { applyFunc(d, a.callback.onCollapse, [b, c]) }), b.bind(c.ASYNC_SUCCESS, function(b, c, e) { applyFunc(d, a.callback.onAsyncSuccess, [b, c, e]) }), b.bind(c.ASYNC_ERROR, function(b, c, e, f, g) { applyFunc(d, a.callback.onAsyncError, [b, c, e, f, g]) })
        },
        unbindTree: function() {
            var a = this.el.target,
                b = this.options.setting.consts.event;
            a.unbind("click").unbind("dblclick").unbind("mouseover").unbind("mouseout").unbind("mousedown").unbind("mouseup").unbind("contextmenu").unbind(b.NODECREATED).unbind(b.CLICK).unbind(b.EXPAND).unbind(b.COLLAPSE).unbind(b.ASYNC_SUCCESS).unbind(b.ASYNC_ERROR).unbind(b.CHECK)
        },
        onSwitchNode: function(a, b) { var c = this.options.setting; if (b.open) { if (applyFunc(this, c.callback.beforeCollapse, [b], !0) === !1) return !0 } else if (applyFunc(this, c.callback.beforeExpand, [b], !0) === !1) return !0; return this.root.expandTriggerFlag = !0, this.switchNode(c, b), !0 },
        onClickNode: function(a, b) {
            var c = this.options.setting,
                d = c.view.autoCancelSelected && (a.ctrlKey || a.metaKey) && this.isSelectedNode(c, b) ? 0 : c.view.autoCancelSelected && (a.ctrlKey || a.metaKey) && c.view.selectedMulti ? 2 : 1;
            return applyFunc(this, c.callback.beforeClick, [b, d], !0) === !1 || (0 === d ? this.cancelPreSelectedNode(c, b) : this.selectNode(b, 2 === d), c.treeObj.trigger(c.consts.event.CLICK, [a, b, d]), !0)
        },
        onTreeMousedown: function(a, b) { var c = this.options.setting; return applyFunc(this, c.callback.beforeMouseDown, [b], !0) && applyFunc(this, c.callback.onMouseDown, [a, b]), !0 },
        onTreeMouseup: function(a, b) { var c = this.options.setting; return applyFunc(this, c.callback.beforeMouseUp, [b], !0) && applyFunc(this, c.callback.onMouseUp, [a, b]), !0 },
        onTreeDblclick: function(a, b) { var c = this.options.setting; return applyFunc(this, c.callback.beforeDblClick, [b], !0) && applyFunc(this, c.callback.onDblClick, [a, b]), !0 },
        onTreeContextmenu: function(a, b) { var c = this.options.setting; return applyFunc(this, c.callback.beforeRightClick, [b], !0) && applyFunc(this, c.callback.onRightClick, [a, b]), "function" != typeof c.callback.onRightClick },
        createNodeCallback: function(a) {
            if (a.callback.onNodeCreated || a.view.addDiyDom)
                for (var b = this.root; b.createdNodes.length > 0;) {
                    var c = b.createdNodes.shift();
                    applyFunc(this, a.view.addDiyDom, [c]), a.callback.onNodeCreated && a.treeObj.trigger(a.consts.event.NODECREATED, [c])
                }
        },
        getAfterA: function(a, b, c) { this.afterA && this.afterA.apply(this, arguments) },
        getBeforeA: function(a, b, c) { this.beforeA && this.beforeA.apply(this, arguments) },
        getInnerAfterA: function(a, b, c) { this.innerAfterA && this.innerAfterA.apply(this, arguments) },
        getInnerBeforeA: function(a, b, c) { this.innerBeforeA && this.innerBeforeA.apply(this, arguments) }
    };

    var DataTree = {
        addNodeCache: function(a, b) { this.cache.nodes[this.getNodeCacheId(b.tId)] = b },
        getNodeCacheId: function(a) { return a.substring(a.lastIndexOf("_") + 1) },
        getNodeCache: function(a) { if (!a) return null; var b = this.cache.nodes[this.getNodeCacheId(a)]; return b ? b : null },
        canAsync: function(a, b) { var c = a.data.key.children; return a.async.enable && b && b.isParent && !(b.Async || b[c] && b[c].length > 0) },
        asyncNode: function(setting, node, isSilent, callback) {
            var i, l, self = this;
            if (node && !node.isParent) return applyFunc(this, callback), !1;
            if (node && node.isAjaxing) return !1;
            if (applyFunc(this, setting.callback.beforeasyncNode, [node], !0) === !1) return applyFunc(this, callback), !1;
            if (node) {
                node.isAjaxing = !0;
                var icoObj = this.getDOMBySelector(node, setting.consts.id.ICON, setting);
                icoObj.attr({ style: "", class: setting.consts.className.BUTTON + " " + setting.consts.className.ICO_LOADING + " x-iconfont" })
            }
            var tmpParam = {};
            for (i = 0, l = setting.async.autoParam.length; node && i < l; i++) {
                var pKey = setting.async.autoParam[i].split("="),
                    spKey = pKey;
                pKey.length > 1 && (spKey = pKey[1], pKey = pKey[0]), tmpParam[spKey] = node[pKey]
            }
            if (Foundation.isArray(setting.async.otherParam))
                for (i = 0, l = setting.async.otherParam.length; i < l; i += 2) tmpParam[setting.async.otherParam[i]] = setting.async.otherParam[i + 1];
            else
                for (var p in setting.async.otherParam) tmpParam[p] = setting.async.otherParam[p];
            var _tmpV = this.root._ver;
            // FX.Utils.ajax({
            //     url: applyFunc(this, setting.async.url, [node], setting.async.url),
            //     data: tmpParam
            // }, function(msg) {
            //     if (_tmpV == self.root._ver) {
            //         var newNodes = [];
            //         try { newNodes = msg && 0 !== msg.length ? "string" == typeof msg ? eval("(" + msg + ")") : msg : [] } catch (a) { newNodes = msg }
            //         node && (node.isAjaxing = null, node.Async = !0), self.setNodeLineIcos(setting, node), newNodes && "" !== newNodes ? (newNodes = applyFunc(this, setting.async.dataFilter, [node, newNodes], newNodes), self.addNodes(setting, node, newNodes ? newNodes.slice(0) : [], !!isSilent)) : self.addNodes(setting, node, [], !!isSilent), setting.treeObj.trigger(setting.consts.event.ASYNC_SUCCESS, [node, msg]), applyFunc(this, callback)
            //     }
            // }, function(a, b, c) {
            //     _tmpV == self.root._ver && (node && (node.isAjaxing = null), self.setNodeLineIcos(setting, node), setting.treeObj.trigger(setting.consts.event.ASYNC_ERROR, [node, a, b, c]))
            // });

            return !0
        },
        addNodesData: function(a, b, c) {
            var d = a.data.key.children;
            b[d] || (b[d] = []), b[d].length > 0 && (b[d][b[d].length - 1].isLastNode = !1, this.setNodeLineIcos(a, b[d][b[d].length - 1])), b.isParent = !0, b[d] = b[d].concat(c)
        },
        addSelectedNode: function(a, b) {
            var c = this.root;
            this.isSelectedNode(a, b) || c.curSelectedList.push(b)
        },
        addCreatedNode: function(a, b) {
            (a.callback.onNodeCreated || a.view.addDiyDom) && this.root.createdNodes.push(b)
        },
        fixPIdKeyValue: function(a, b) { a.data.simpleData.enable && (b[a.data.simpleData.pIdKey] = b.parentTId ? b.getParentNode()[a.data.simpleData.idKey] : a.data.simpleData.rootPId) },
        getNextNode: function(a, b) {
            if (!b) return null;
            for (var c = a.data.key.children, d = b.parentTId ? b.getParentNode() : this.root, e = 0, f = d[c].length - 1; e <= f; e++)
                if (d[c][e] === b) return e == f ? null : d[c][e + 1];
            return null
        },
        getNodeByParam: function(a, b, c, d) { if (!b || !c) return null; for (var e = a.data.key.children, f = 0, g = b.length; f < g; f++) { if (b[f][c] == d) return b[f]; var h = this.getNodeByParam(a, b[f][e], c, d); if (h) return h } return null },
        getNodesByParam: function(a, b, c, d) { if (!b || !c) return []; for (var e = a.data.key.children, f = [], g = 0, h = b.length; g < h; g++) b[g][c] == d && f.push(b[g]), f = f.concat(this.getNodesByParam(a, b[g][e], c, d)); return f },
        getNodes: function() { return this.root[this.options.setting.data.key.children] },
        getNodesByParamFuy: function(a, b, c, d) {
            if (!b || !c) return [];
            var e = a.data.key.children,
                f = [];
            d = d.toLowerCase();
            for (var g = 0, h = b.length; g < h; g++) "string" == typeof b[g][c] && b[g][c].toLowerCase().indexOf(d) > -1 && f.push(b[g]), f = f.concat(this.getNodesByParamFuy(a, b[g][e], c, d));
            return f
        },
        getNodesByFilter: function(a, b, c, d, e) {
            if (!b) return d ? null : [];
            for (var f = a.data.key.children, g = d ? null : [], h = 0, i = b.length; h < i; h++) {
                if (applyFunc(this, c, [b[h], e], !1)) {
                    if (d) return b[h];
                    g.push(b[h])
                }
                var j = this.getNodesByFilter(a, b[h][f], c, d, e);
                if (d && j) return j;
                g = d ? j : g.concat(j)
            }
            return g
        },
        getPreNode: function(a, b) {
            if (!b) return null;
            for (var c = a.data.key.children, d = b.parentTId ? b.getParentNode() : this.root, e = 0, f = d[c].length; e < f; e++)
                if (d[c][e] === b) return 0 === e ? null : d[c][e - 1];
            return null
        },
        isSelectedNode: function(a, b) {
            for (var c = this.root, d = 0, e = c.curSelectedList.length; d < e; d++)
                if (b === c.curSelectedList[d]) return !0;
            return !1
        },
        removeNodeCache: function(a, b) {
            var c = a.data.key.children;
            if (b[c])
                for (var d = 0, e = b[c].length; d < e; d++) arguments.callee(a, b[c][d]);
            this.cache.nodes[this.getNodeCacheId(b.tId)] = null
        },
        removeSelectedNode: function(a, b) { for (var c = this.root, d = 0, e = c.curSelectedList.length; d < e; d++) b !== c.curSelectedList[d] && this.getNodeCache(c.curSelectedList[d].tId) || (c.curSelectedList.splice(d, 1), d--, e--) },
        expandAll: function(a) { return a = !!a, this.expandCollapseSonNode(setting, null, a, !0), a },
        expandNode: function(a, b, c, d, e) { var f = this.options.setting; return a && a.isParent ? (b !== !0 && b !== !1 && (b = !a.open), e = !!e, e && b && applyFunc(this, f.callback.beforeExpand, [a], !0) === !1 ? null : e && !b && applyFunc(this, f.callback.beforeCollapse, [a], !0) === !1 ? null : (b && a.parentTId && this.expandCollapseParentNode(f, a.getParentNode(), b, !1), b !== a.open || c ? (this.root.expandTriggerFlag = e, !this.canAsync(f, a) && c ? this.expandCollapseSonNode(f, a, b, !0, function() {}) : (a.open = !b, this.switchNode(this.options.setting, a)), b) : null)) : null },
        getNodeByTId: function(a) { return this.getNodeCache(a) },
        getNodeIndex: function(a) {
            if (!a) return null;
            for (var b = this.options.setting.data.key.children, c = a.parentTId ? a.getParentNode() : this.root, d = 0, e = c[b].length; d < e; d++)
                if (c[b][d] == a) return d;
            return -1
        },
        getSelectedNodes: function() { for (var a = [], b = this.root.curSelectedList, c = 0, d = b.length; c < d; c++) a.push(b[c]); return a },
        reAsyncChildNodes: function(a, b, c) {
            if (this.options.setting.async.enable) {
                var d = !a,
                    e = this.options.setting;
                if (d && (a = this.root), "refresh" == b) {
                    for (var f = this.options.setting.data.key.children, g = 0, h = a[f] ? a[f].length : 0; g < h; g++) this.removeNodeCache(e, a[f][g]);
                    if (this.removeSelectedNode(e), a[f] = [], d) this.options.setting.treeObj.empty();
                    else {
                        var i = this.getDOMBySelector(a, e.consts.id.UL, e);
                        i.empty()
                    }
                }
                this.asyncNode(this.options.setting, d ? null : a, !!c)
            }
        },
        refresh: function() {
            this.options.setting.treeObj.empty();
            var a = this.root,
                b = this.options.setting,
                c = a[b.data.key.children];
            this.initRoot(b), a[b.data.key.children] = c, this.initCache(), this.createNodes(b, 0, a[b.data.key.children])
        },
        updateNode: function(a, b) {
            if (a) {
                var c = this.options.setting,
                    d = this.getDOMBySelector(a, c);
                d.get(0) && (this.setNodeName(c, a), this.setNodeTarget(c, a), this.setNodeUrl(c, a), this.setNodeLineIcos(c, a), this.setNodeFontCss(c, a))
            }
        },
        transformToArrayFormat: function(a, b) {
            if (!b) return [];
            var c = a.data.key.children,
                d = [];
            if (Foundation.isArray(b))
                for (var e = 0, f = b.length; e < f; e++) d.push(b[e]), b[e][c] && (d = d.concat(this.transformToArrayFormat(a, b[e][c])));
            else d.push(b), b[c] && (d = d.concat(this.transformToArrayFormat(a, b[c])));
            return d
        },
        transformToTreeFormat: function(a, b) {
            var c, d, e = a.data.simpleData.idKey,
                f = a.data.simpleData.pIdKey,
                g = a.data.key.children;
            if (!e || "" == e || !b) return [];
            if (Foundation.isArray(b)) {
                var h = [],
                    i = [];
                for (c = 0, d = b.length; c < d; c++) i[b[c][e]] = b[c];
                for (c = 0, d = b.length; c < d; c++) i[b[c][f]] && b[c][e] != b[c][f] ? (i[b[c][f]][g] || (i[b[c][f]][g] = []), i[b[c][f]][g].push(b[c])) : h.push(b[c]);
                return h
            }
            return [b]
        }
    };

    var BaseTree = Class.create({
        extend: Widget,
        implement: [DomTree, EventTree, DataTree],
        _defaultOptions: function() {
            return Foundation.apply(BaseTree.superclass._defaultOptions.apply(this), {
                baseCls: "fui_tree"
            });
        },
        _init: function() {
            BaseTree.superclass._init.apply(this);
            var a = this.options;
            a.setting = this._doSettingConfig(), this._createRoot(a.setting);
            var b = a.setting;
            this.root = this.initRoot(b);
            var c = b.data.key.children,
                d = [];
            a.Nodes && (d = Foundation.isArray(a.Nodes) ? a.Nodes.slice(0) : [a.Nodes].slice(0));
            a.setting.data.simpleData.enable ? this.root[c] = this.transformToTreeFormat(b, d) : this.root[c] = d;
            this.initCache();
            this.bindTree(b);
            this.bindEvent(b);
            this.root[c] && this.root[c].length > 0 ? this.createNodes(b, 0, this.root[c]) : b.async.enable && b.async.url && "" !== b.async.url && this.asyncNode(b)
        },

        _doSettingConfig: function() { var a = this.options; return a.setting = $.extend(!0, {}, this.setting, a.setting), a.setting },
        _createRoot: function(a) {
            var b = $('<ul id="' + a.treeId + '" class="tree"/>').appendTo(this.el.target);
            a.treeObj = b
        },
        initRoot: function(a) {
            var b = a ? this.root : null;
            return b || (b = {}), b[a.data.key.children] = [], b.expandTriggerFlag = !1, b.curSelectedList = [], b.noSelection = !0, b.createdNodes = [], b.radioCheckedList = [], b.Id = 0, b._ver = (new Date).getTime(), b
        },
        initCache: function() { this.cache = this.cache || {}, this.cache.nodes = [], this.cache.doms = [] },
        initNode: function(a, b, c, d, e, f, g) {
            if (c) {
                var h = this.root,
                    i = a.data.key.children,
                    j = this;
                c.level = b;
                c.tId = a.treeId + "_" + ++h.Id;
                c.parentTId = d ? d.tId : null;
                c.open = "string" == typeof c.open ? "true" == c.open.toLowerCase() : !!c.open, c[i] && c[i].length > 0 ? (c.isParent = !0, c.Async = !0) : (c.isParent = "string" == typeof c.isParent ? "true" == c.isParent.toLowerCase() : !!c.isParent, c.open = !(!c.isParent || a.async.enable) && c.open, c.Async = !c.isParent);
                c.isFirstNode = e;
                c.isLastNode = f;
                c.getParentNode = function() {
                    return j.getNodeCache(c.parentTId)
                };
                c.getPreNode = function() {
                    return j.getPreNode(a, c)
                };
                c.getNextNode = function() {
                    return j.getNextNode(a, c)
                };
                c.isAjaxing = !1;
                this.fixPIdKeyValue(a, c)
            }
        },
        addNodes: function(a, b, c, d) {
            if (!a.data.keep.leaf || !b || b.isParent)
                if (Foundation.isArray(c) || (c = [c]), a.data.simpleData.enable && (c = this.transformToTreeFormat(a, c)), b) {
                    var e = this.getDOMBySelector(b, a.consts.id.SWITCH, a),
                        f = this.getDOMBySelector(b, a.consts.id.ICON, a),
                        g = this.getDOMBySelector(b, a.consts.id.UL, a);
                    b.open || (this.replaceSwitchClass(b, e, a.consts.folder.CLOSE), this.replaceIcoClass(b, f, a.consts.folder.CLOSE), b.open = !1, g.css({ display: "none" })), this.addNodesData(a, b, c), this.createNodes(a, b.level + 1, c, b), d || this.expandCollapseParentNode(a, b, !0)
                } else this.addNodesData(a, this.root, c), this.createNodes(a, 0, c, null)
        },
        appendNodes: function(a, b, c, d, e, f) {
            if (!c) return [];
            for (var g = [], h = a.data.key.children, i = 0, j = c.length; i < j; i++) {
                var k = c[i];
                if (applyFunc(this, a.callback.beforeNodeCreate, [k], !0), e) {
                    var l = d ? d : this.root,
                        m = l[h],
                        n = m.length == c.length && 0 === i,
                        o = i == c.length - 1;
                    this.initNode(a, b, k, d, n, o, f), this.addNodeCache(a, k)
                }
                var p = [];
                k[h] && k[h].length > 0 && (p = this.appendNodes(a, b + 1, k[h], k, e, f && k.open)), f && (this.makeDOMNodeMainBefore(g, a, k), this.getBeforeA(a, k, g), this.makeDOMNodeNameBefore(g, a, k), this.makeDOMNodeLine(g, a, k), this.getInnerBeforeA(a, k, g), this.makeDOMNodeIcon(g, a, k), this.getInnerAfterA(a, k, g), this.makeDOMNodeNameAfter(g, a, k), this.getAfterA(a, k, g), k.isParent && k.open && this.makeUlHtml(a, k, g, p.join("")), this.makeDOMNodeMainAfter(g, a, k), this.addCreatedNode(a, k))
            }
            return g
        },
        createNodes: function(a, b, c, d) {
            if (c && 0 !== c.length) {
                var e = this.root,
                    f = a.data.key.children,
                    g = !d || d.open || !!this.getDOMBySelector(d[f][0], a).get(0);
                e.createdNodes = [];
                var h = this.appendNodes(a, b, c, d, !0, g);
                if (d) {
                    var i = this.getDOMBySelector(d, a.consts.id.UL, a);
                    i.get(0) && i.append(h.join(""))
                } else a.treeObj.append(h.join(""));
                this.createNodeCallback(a)
            }
        },
        expandCollapseNode: function(a, b, c, d, e) {
            var f = this.root,
                g = a.data.key.children;
            if (!b) return void applyFunc(this, e, []);
            if (f.expandTriggerFlag) {
                var h = e;
                e = function() { h && h(), b.open ? a.treeObj.trigger(a.consts.event.EXPAND, [b]) : a.treeObj.trigger(a.consts.event.COLLAPSE, [b]) }, f.expandTriggerFlag = !1
            }
            if (!b.open && b.isParent && (!this.getDOMBySelector(b, a.consts.id.UL, a).get(0) || b[g] && b[g].length > 0 && !this.getDOMBySelector(b[g][0], a).get(0)) && (this.appendParentULDom(a, b), this.createNodeCallback(a)), b.open == c) return void applyFunc(this, e, []);
            var i = this.getDOMBySelector(b, a.consts.id.UL, a),
                j = this.getDOMBySelector(b, a.consts.id.SWITCH, a),
                k = this.getDOMBySelector(b, a.consts.id.ICON, a);
            b.isParent ? (b.open = !b.open, b.iconOpen && b.iconClose && k.attr("style", this.makeNodeIcoStyle(a, b)), b.open ? (this.replaceSwitchClass(b, j, a.consts.folder.OPEN), this.replaceIcoClass(b, k, a.consts.folder.OPEN), d === !1 || "" == a.view.expandSpeed ? (i.show(), applyFunc(this, e, [])) : b[g] && b[g].length > 0 ? i.slideDown(a.view.expandSpeed, e) : (i.show(), applyFunc(this, e, []))) : (this.replaceSwitchClass(b, j, a.consts.folder.CLOSE), this.replaceIcoClass(b, k, a.consts.folder.CLOSE), d !== !1 && "" != a.view.expandSpeed && b[g] && b[g].length > 0 ? i.slideUp(a.view.expandSpeed, e) : (i.hide(), applyFunc(this, e, [])))) : applyFunc(this, e, [])
        },
        expandCollapseParentNode: function(a, b, c, d, e) {
            if (b) {
                if (!b.parentTId) return void this.expandCollapseNode(a, b, c, d, e);
                this.expandCollapseNode(a, b, c, d), b.parentTId && this.expandCollapseParentNode(a, b.getParentNode(), c, d, e)
            }
        },
        expandCollapseSonNode: function(a, b, c, d, e) {
            var f = a.data.key.children,
                g = b ? b[f] : this.root[f],
                h = !b && d,
                i = this.root.expandTriggerFlag;
            if (this.root.expandTriggerFlag = !1, g)
                for (var j = 0, k = g.length; j < k; j++) g[j] && this.expandCollapseSonNode(a, g[j], c, h);
            this.root.expandTriggerFlag = i, this.expandCollapseNode(a, b, c, d, e)
        },
        destroy: function(a) { a && (this.initCache(), this.initRoot(a), this.unbindTree(a), a.treeObj.empty(), delete a) }

    });

    var TreeWidget = Class.create({
        extend: BaseTree,

        initRoot: function(a) {
            var b = TreeWidget.superclass.initRoot.apply(this, arguments);
            return b.radioCheckedList = [], b
        },
        bindEvent: function(a) {
            TreeWidget.superclass.bindEvent.apply(this, arguments);
            var b = this.el.target,
                c = a.consts.event,
                d = this;
            b.bind(c.CHECK, function(b, c, e) { applyFunc(d, a.callback.onCheck, [c ? c : b, e]) })
        },
        unbindTree: function(a) {
            TreeWidget.superclass.unbindTree.apply(this, arguments);
            var b = this.el.target,
                c = this.options.setting.consts.event;
            b.unbind(c.CHECK)
        },
        doProxy: function(a) {
            var b = a.target.parentNode,
                c = this.options.setting,
                d = "",
                e = null,
                f = "",
                g = "",
                h = null,
                i = null;
            if (c.check.enable && ("mouseover" == a.type ? "SPAN" == b.tagName && null !== b.getAttribute("treeNode" + c.consts.id.CHECK) && (d = this.getNodeMainDom(b).id, f = "mouseoverCheck") : "mouseout" == a.type ? "SPAN" == b.tagName && null !== b.getAttribute("treeNode" + c.consts.id.CHECK) && (d = this.getNodeMainDom(b).id, f = "mouseoutCheck") : "click" == a.type && "SPAN" == b.tagName && null !== b.getAttribute("treeNode" + c.consts.id.CHECK) && (d = this.getNodeMainDom(b).id, f = "checkNode")), d.length > 0) switch (e = this.getNodeCache(d), f) {
                case "checkNode":
                    h = this.onCheckNode;
                    break;
                case "mouseoverCheck":
                    h = this.onMouseoverCheck;
                    break;
                case "mouseoutCheck":
                    h = this.onMouseoutCheck
            }
            return "" !== f ? { node: e, nodeEventType: f, nodeEventCallback: h, treeEventType: g, treeEventCallback: i } : TreeWidget.superclass.doProxy.apply(this, arguments)
        },
        initNode: function(a, b, c, d, e, f, g) { if (TreeWidget.superclass.initNode.apply(this, arguments), c) { var h = a.data.key.checked; "string" == typeof c[h] && (c[h] = "true" == c[h].toLowerCase()), c[h] = !!c[h], c.checkedOld = c[h], "string" == typeof c.nocheck && (c.nocheck = "true" == c.nocheck.toLowerCase()), c.nocheck = !!c.nocheck || a.check.nocheckInherit && d && !!d.nocheck, "string" == typeof c.chkDisabled && (c.chkDisabled = "true" == c.chkDisabled.toLowerCase()), c.chkDisabled = !!c.chkDisabled || a.check.chkDisabledInherit && d && !!d.chkDisabled, "string" == typeof c.halfCheck && (c.halfCheck = "true" == c.halfCheck.toLowerCase()), c.halfCheck = !!c.halfCheck, c.check_Child_State = -1, c.check_Focus = !1, c.getCheckStatus = function() { return this.getCheckStatus(a, c) }, a.check.chkStyle == a.consts.radio.STYLE && a.check.radioType == a.consts.radio.TYPE_ALL && c[h] && this.root.radioCheckedList.push(c) } },
        makeDOMNodeLine: function(a, b, c) { TreeWidget.superclass.makeDOMNodeLine.apply(this, arguments), b.check.enable && (this.makeChkFlag(b, c), a.push("<span ID='", c.tId, b.consts.id.CHECK, "' class='", this.makeChkClass(b, c), "' treeNode", b.consts.id.CHECK, c.nocheck === !0 ? " style='display:none;'" : "", "><i class='x-iconfont'></i></span>")) },
        getRadioCheckedList: function(a) { for (var b = this.root.radioCheckedList, c = 0, d = b.length; c < d; c++) this.getNodeCache(a, b[c].tId) || (b.splice(c, 1), c--, d--); return b },
        getCheckStatus: function(a, b) { if (!a.check.enable || b.nocheck || b.chkDisabled) return null; var c = a.data.key.checked; return { checked: b[c], half: b.halfCheck ? b.halfCheck : a.check.chkStyle == a.consts.radio.STYLE ? 2 === b.check_Child_State : b[c] ? b.check_Child_State > -1 && b.check_Child_State < 2 : b.check_Child_State > 0 } },
        getTreeCheckedNodes: function(a, b, c, d) {
            if (!b) return [];
            var e = a.data.key.children,
                f = a.data.key.checked,
                g = c && a.check.chkStyle == a.consts.radio.STYLE && a.check.radioType == a.consts.radio.TYPE_ALL;
            d = d ? d : [];
            for (var h = 0, i = b.length; h < i && (b[h].nocheck === !0 || b[h].chkDisabled === !0 || b[h][f] != c || (d.push(b[h]), !g)) && (this.getTreeCheckedNodes(a, b[h][e], c, d), !(g && d.length > 0)); h++);
            return d
        },
        getTreeChangeCheckedNodes: function(a, b, c) {
            if (!b) return [];
            var d = a.data.key.children,
                e = a.data.key.checked;
            c = c ? c : [];
            for (var f = 0, g = b.length; f < g; f++) b[f].nocheck !== !0 && b[f].chkDisabled !== !0 && b[f][e] != b[f].checkedOld && c.push(b[f]), this.getTreeChangeCheckedNodes(a, b[f][d], c);
            return c
        },
        makeChkFlag: function(a, b) {
            if (b) {
                var c = a.data.key.children,
                    d = a.data.key.checked,
                    e = -1;
                if (b[c])
                    for (var f = 0, g = b[c].length; f < g; f++) {
                        var h = b[c][f],
                            i = -1;
                        if (a.check.chkStyle == a.consts.radio.STYLE) {
                            if (i = h.nocheck === !0 || h.chkDisabled === !0 ? h.check_Child_State : h.halfCheck === !0 ? 2 : h[d] ? 2 : h.check_Child_State > 0 ? 2 : 0, 2 === i) { e = 2; break }
                            0 === i && (e = 0)
                        } else if (a.check.chkStyle == a.consts.checkbox.STYLE) {
                            if (i = h.nocheck === !0 || h.chkDisabled === !0 ? h.check_Child_State : h.halfCheck === !0 ? 1 : h[d] ? h.check_Child_State === -1 || 2 === h.check_Child_State ? 2 : 1 : h.check_Child_State > 0 ? 1 : 0, 1 === i) { e = 1; break }
                            if (2 === i && e > -1 && f > 0 && i !== e) { e = 1; break }
                            if (2 === e && i > -1 && i < 2) { e = 1; break }
                            i > -1 && (e = i)
                        }
                    }
                b.check_Child_State = e
            }
        },
        checkNode: function(a, b, c, d) {
            var e = this.options.setting,
                f = e.data.key.checked;
            if (a.chkDisabled !== !0 && (b !== !0 && b !== !1 && (b = !a[f]), d = !!d, (a[f] !== b || c) && (!d || applyFunc(this, e.callback.beforeCheck, [a], !0) !== !1) && e.check.enable && a.nocheck !== !0)) {
                a[f] = b;
                var g = this.getDOMBySelector(a, e.consts.id.CHECK, e);
                (c || e.check.chkStyle === e.consts.radio.STYLE) && this.checkNodeRelation(e, a), this.setChkClass(e, g, a), this.repairParentChkClassWithSelf(e, a), d && e.treeObj.trigger(e.consts.event.CHECK, [null, a])
            }
        },
        checkAllNodes: function(a) { this.repairAllChk(this.options.setting, !!a) },
        getCheckedNodes: function(a) { var b = this.options.setting.data.key.children; return a = a !== !1, this.getTreeCheckedNodes(this.options.setting, this.root[b], a) },
        getChangeCheckedNodes: function() { var a = this.options.setting.data.key.children; return this.getTreeChangeCheckedNodes(this.options.setting, this.root[a]) },
        setChkDisabled: function(a, b, c, d) { b = !!b, c = !!c, d = !!d, this.repairSonChkDisabled(this.options.setting, a, b, d), this.repairParentChkDisabled(this.options.setting, a.getParentNode(), b, c) },
        onCheckNode: function(a, b) {
            if (b.chkDisabled === !0) return !1;
            var c = this.options.setting,
                d = c.data.key.checked;
            if (applyFunc(this, c.callback.beforeCheck, [b], !0) === !1) return !0;
            b[d] = !b[d], this.checkNodeRelation(c, b);
            var e = this.getDOMBySelector(b, c.consts.id.CHECK, c);
            return this.setChkClass(c, e, b), this.repairParentChkClassWithSelf(c, b), c.treeObj.trigger(c.consts.event.CHECK, [a, b]), !0
        },
        onMouseoverCheck: function(a, b) {
            if (b.chkDisabled === !0) return !1;
            var c = this.options.setting,
                d = this.getDOMBySelector(b, c.consts.id.CHECK, c);
            return b.check_Focus = !0, this.setChkClass(c, d, b), !0
        },
        onMouseoutCheck: function(a, b) {
            if (b.chkDisabled === !0) return !1;
            var c = this.options.setting,
                d = this.getDOMBySelector(b, c.consts.id.CHECK, c);
            return b.check_Focus = !1, this.setChkClass(c, d, b), !0
        },
        checkNodeRelation: function(a, b) {
            var c, d, e, f = a.data.key.children,
                g = a.data.key.checked,
                h = a.consts.radio;
            if (a.check.chkStyle == h.STYLE) {
                var i = this.getRadioCheckedList(a);
                if (b[g])
                    if (a.check.radioType == h.TYPE_ALL) {
                        for (d = i.length - 1; d >= 0; d--) c = i[d], c[g] = !1, i.splice(d, 1), this.setChkClass(a, this.getDOMBySelector(c, a.consts.id.CHECK, a), c), c.parentTId != b.parentTId && this.repairParentChkClassWithSelf(a, c);
                        i.push(b)
                    } else { var j = b.parentTId ? b.getParentNode() : this.root; for (d = 0, e = j[f].length; d < e; d++) c = j[f][d], c[g] && c != b && (c[g] = !1, this.setChkClass(a, this.getDOMBySelector(c, a.consts.id.CHECK, a), c)) }
                else if (a.check.radioType == h.TYPE_ALL)
                    for (d = 0, e = i.length; d < e; d++)
                        if (b == i[d]) { i.splice(d, 1); break }
            } else b[g] && (!b[f] || 0 === b[f].length || a.check.chkboxType.Y.indexOf("s") > -1) && this.setSonNodeCheckBox(a, b, !0), b[g] || b[f] && 0 !== b[f].length && !(a.check.chkboxType.N.indexOf("s") > -1) || this.setSonNodeCheckBox(a, b, !1), b[g] && a.check.chkboxType.Y.indexOf("p") > -1 && this.setParentNodeCheckBox(a, b, !0), !b[g] && a.check.chkboxType.N.indexOf("p") > -1 && this.setParentNodeCheckBox(a, b, !1)
        },
        makeChkClass: function(a, b) {
            var c = a.data.key.checked,
                d = a.consts.checkbox,
                e = a.consts.radio,
                f = "";
            f = b.chkDisabled === !0 ? d.DISABLED : b.halfCheck ? d.PART : a.check.chkStyle == e.STYLE ? b.check_Child_State < 1 ? d.FULL : d.PART : b[c] ? 2 === b.check_Child_State || b.check_Child_State === -1 ? d.FULL : d.PART : b.check_Child_State < 1 ? d.FULL : d.PART;
            var g = a.check.chkStyle + " " + (b[c] ? d.TRUE : d.FALSE) + " " + f;
            return g = b.check_Focus && b.chkDisabled !== !0 ? g + "_" + d.FOCUS : g, a.consts.className.BUTTON + " " + d.DEFAULT + " " + g
        },
        repairAllChk: function(a, b) {
            if (a.check.enable && a.check.chkStyle === a.consts.checkbox.STYLE)
                for (var c = a.data.key.checked, d = a.data.key.children, e = this.root, f = 0, g = e[d].length; f < g; f++) {
                    var h = e[d][f];
                    h.nocheck !== !0 && h.chkDisabled !== !0 && (h[c] = b), this.setSonNodeCheckBox(a, h, b)
                }
        },
        repairChkClass: function(a, b) {
            if (b && (this.makeChkFlag(a, b), b.nocheck !== !0)) {
                var c = this.getDOMBySelector(b, a.consts.id.CHECK, a);
                this.setChkClass(a, c, b)
            }
        },
        repairParentChkClass: function(a, b) {
            if (b && b.parentTId) {
                var c = b.getParentNode();
                this.repairChkClass(a, c), this.repairParentChkClass(a, c)
            }
        },
        repairParentChkClassWithSelf: function(a, b) {
            if (b) {
                var c = a.data.key.children;
                b[c] && b[c].length > 0 ? this.repairParentChkClass(a, b[c][0]) : this.repairParentChkClass(a, b)
            }
        },
        repairSonChkDisabled: function(a, b, c, d) {
            if (b) {
                var e = a.data.key.children;
                if (b.chkDisabled != c && (b.chkDisabled = c), this.repairChkClass(a, b), b[e] && d)
                    for (var f = 0, g = b[e].length; f < g; f++) {
                        var h = b[e][f];
                        this.repairSonChkDisabled(a, h, c, d)
                    }
            }
        },
        repairParentChkDisabled: function(a, b, c, d) { b && (b.chkDisabled != c && d && (b.chkDisabled = c), this.repairChkClass(a, b), this.repairParentChkDisabled(a, b.getParentNode(), c, d)) },
        setChkClass: function(a, b, c) { b && (c.nocheck === !0 ? b.hide() : b.show(), b.removeClass(), b.addClass(this.makeChkClass(a, c))) },
        setParentNodeCheckBox: function(a, b, c, d) {
            var e = a.data.key.children,
                f = a.data.key.checked,
                g = this.getDOMBySelector(b, a.consts.id.CHECK, a);
            if (d || (d = b), this.makeChkFlag(a, b), b.nocheck !== !0 && b.chkDisabled !== !0 && (b[f] = c, this.setChkClass(a, g, b), a.check.autoCheckTrigger && b != d && a.treeObj.trigger(a.consts.event.CHECK, [null, b])), b.parentTId) {
                var h = !0;
                if (!c)
                    for (var i = b.getParentNode()[e], j = 0, k = i.length; j < k; j++)
                        if (i[j].nocheck !== !0 && i[j].chkDisabled !== !0 && i[j][f] || (i[j].nocheck === !0 || i[j].chkDisabled === !0) && i[j].check_Child_State > 0) { h = !1; break }
                h && this.setParentNodeCheckBox(a, b.getParentNode(), c, d)
            }
        },
        setSonNodeCheckBox: function(a, b, c, d) {
            if (b) {
                var e = a.data.key.children,
                    f = a.data.key.checked,
                    g = this.getDOMBySelector(b, a.consts.id.CHECK, a);
                d || (d = b);
                var h = !1;
                if (b[e])
                    for (var i = 0, j = b[e].length; i < j && b.chkDisabled !== !0; i++) {
                        var k = b[e][i];
                        this.setSonNodeCheckBox(a, k, c, d), k.chkDisabled === !0 && (h = !0)
                    }
                b != this.root && b.chkDisabled !== !0 && (h && b.nocheck !== !0 && this.makeChkFlag(a, b), b.nocheck !== !0 && b.chkDisabled !== !0 ? (b[f] = c, h || (b.check_Child_State = b[e] && b[e].length > 0 ? c ? 2 : 0 : -1)) : b.check_Child_State = -1, this.setChkClass(a, g, b), a.check.autoCheckTrigger && b != d && b.nocheck !== !0 && b.chkDisabled !== !0 && a.treeObj.trigger(a.consts.event.CHECK, [null, b]))
            }
        },
        updateNode: function(a, b) {
            TreeWidget.superclass.updateNode.apply(this, arguments);
            var c = this.options.setting;
            if (a && c.check.enable) {
                var d = this.getDOMBySelector(a, c);
                if (d.get(0)) {
                    var e = this.getDOMBySelector(a, c.consts.id.CHECK, c);
                    b !== !0 && c.check.chkStyle !== c.consts.radio.STYLE || this.checkNodeRelation(c, a),
                        this.setChkClass(c, e, a), this.repairParentChkClassWithSelf(c, a)
                }
            }
        },
        createNodes: function(a, b, c, d) { TreeWidget.superclass.createNodes.apply(this, arguments), c && this.repairParentChkClassWithSelf(a, d) },
        removeNode: function(a, b) {
            var c = b.getParentNode();
            TreeWidget.superclass.removeNode.apply(this, arguments), b && c && (this.repairChkClass(a, c), this.repairParentChkClass(a, c))
        },
        appendNodes: function(a, b, c, d, e, f) { var g = TreeWidget.superclass.appendNodes.apply(this, arguments); return d && this.makeChkFlag(a, d), g }

    });

    Widget.register('tree', TreeWidget);

    return TreeWidget;
});