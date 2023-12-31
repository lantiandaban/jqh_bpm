(function(a) { this.CodeMirror = a() }(function() {
    "use strict";

    function a(c, d) {
        if (!(this instanceof a)) return new a(c, d);
        this.options = d = d ? He(d) : {}, He(Vf, d, !1), n(d), a.keywords = d.keywords || [];
        var e = d.value;
        "string" == typeof e && (e = new rg(e, d.mode)), this.doc = e;
        var f = new a.inputStyles[d.inputStyle](this),
            g = this.display = new b(c, e, f);
        g.wrapper.CodeMirror = this, j(this), h(this), d.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap"), d.autofocus && !xf && g.input.focus(), r(this), this.state = { keyMaps: [], overlays: [], modeGen: 0, overwrite: !1, delayingBlurEvent: !1, focused: !1, suppressEdits: !1, pasteIncoming: !1, cutIncoming: !1, draggingText: !1, highlight: new ze, keySeq: null, specialChars: null };
        var i = this;
        nf && of < 11 && setTimeout(function() { i.display.input.reset(!0) }, 20), Pb(this), Te(), tb(this), this.curOp.forceUpdate = !0, Ud(this, e), d.autofocus && !xf || i.hasFocus() ? setTimeout(Ie(nc, this), 20) : oc(this);
        for (var k in Wf) Wf.hasOwnProperty(k) && Wf[k](this, d[k], Xf);
        w(this), d.finishInit && d.finishInit(this);
        for (var l = 0; l < _f.length; ++l) _f[l](this);
        vb(this), pf && d.lineWrapping && "optimizelegibility" == getComputedStyle(g.lineDiv).textRendering && (g.lineDiv.style.textRendering = "auto")
    }

    function b(a, b, c) {
        var d = this;
        this.input = c, d.scrollbarFiller = Me("div", null, "CodeMirror-scrollbar-filler"), d.scrollbarFiller.setAttribute("cm-not-content", "true"), d.gutterFiller = Me("div", null, "CodeMirror-gutter-filler"), d.gutterFiller.setAttribute("cm-not-content", "true"), d.lineDiv = Me("div", null, "CodeMirror-code"), d.selectionDiv = Me("div", null, null, "position: relative; z-index: 1"), d.cursorDiv = Me("div", null, "CodeMirror-cursors"), d.measure = Me("div", null, "CodeMirror-measure"), d.lineMeasure = Me("div", null, "CodeMirror-measure"), d.lineSpace = Me("div", [d.measure, d.lineMeasure, d.selectionDiv, d.cursorDiv, d.lineDiv], null, "position: relative; outline: none"), d.mover = Me("div", [Me("div", [d.lineSpace], "CodeMirror-lines")], null, "position: relative"), d.sizer = Me("div", [d.mover], "CodeMirror-sizer"), d.sizerWidth = null, d.heightForcer = Me("div", null, null, "position: absolute; height: " + Bg + "px; width: 1px;"), d.gutters = Me("div", null, "CodeMirror-gutters"), d.lineGutter = null, d.scroller = Me("div", [d.sizer, d.heightForcer, d.gutters], "CodeMirror-scroll"), d.scroller.setAttribute("tabIndex", "-1"), d.wrapper = Me("div", [d.scrollbarFiller, d.gutterFiller, d.scroller], "CodeMirror"), nf && of < 8 && (d.gutters.style.zIndex = -1, d.scroller.style.paddingRight = 0), pf || kf && xf || (d.scroller.draggable = !0), a && (a.appendChild ? a.appendChild(d.wrapper) : a(d.wrapper)), d.viewFrom = d.viewTo = b.first, d.reportedViewFrom = d.reportedViewTo = b.first, d.view = [], d.renderedView = null, d.externalMeasured = null, d.viewOffset = 0, d.lastWrapHeight = d.lastWrapWidth = 0, d.updateLineNumbers = null, d.nativeBarWidth = d.barHeight = d.barWidth = 0, d.scrollbarsClipped = !1, d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null, d.alignWidgets = !1, d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null, d.maxLine = null, d.maxLineLength = 0, d.maxLineChanged = !1, d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null, d.shift = !1, d.selForContextMenu = null, d.activeTouch = null, c.init(d)
    }

    function c(b) { b.doc.mode = a.getMode(b.options, b.doc.modeOption), d(b) }

    function d(a) { a.doc.iter(function(a) { a.stateAfter && (a.stateAfter = null), a.styles && (a.styles = null) }), a.doc.frontier = a.doc.first, Ma(a, 100), a.state.modeGen++, a.curOp && Ib(a) }

    function e(a) { a.options.lineWrapping ? (Rg(a.display.wrapper, "CodeMirror-wrap"), a.display.sizer.style.minWidth = "", a.display.sizerWidth = null) : (Qg(a.display.wrapper, "CodeMirror-wrap"), m(a)), g(a), Ib(a), gb(a), setTimeout(function() { s(a) }, 100) }

    function f(a) {
        var b = rb(a.display),
            c = a.options.lineWrapping,
            d = c && Math.max(5, a.display.scroller.clientWidth / sb(a.display) - 3);
        return function(e) {
            if (sd(a.doc, e)) return 0;
            var f = 0;
            if (e.widgets)
                for (var g = 0; g < e.widgets.length; g++) e.widgets[g].height && (f += e.widgets[g].height);
            return c ? f + (Math.ceil(e.text.length / d) || 1) * b : f + b
        }
    }

    function g(a) {
        var b = a.doc,
            c = f(a);
        b.iter(function(a) {
            var b = c(a);
            b != a.height && Yd(a, b)
        })
    }

    function h(a) { a.display.wrapper.className = a.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + a.options.theme.replace(/(^|\s)\s*/g, " cm-s-"), gb(a) }

    function i(a) { j(a), Ib(a), setTimeout(function() { v(a) }, 20) }

    function j(a) {
        var b = a.display.gutters,
            c = a.options.gutters;
        Ne(b);
        for (var d = 0; d < c.length; ++d) {
            var e = c[d],
                f = b.appendChild(Me("div", null, "CodeMirror-gutter " + e));
            "CodeMirror-linenumbers" == e && (a.display.lineGutter = f, f.style.width = (a.display.lineNumWidth || 1) + "px")
        }
        b.style.display = d ? "" : "none", k(a)
    }

    function k(a) {
        var b = a.display.gutters.offsetWidth;
        a.display.sizer.style.marginLeft = b + "px"
    }

    function l(a) {
        if (0 == a.height) return 0;
        for (var b, c = a.text.length, d = a; b = ld(d);) {
            var e = b.find(0, !0);
            d = e.from.line, c += e.from.ch - e.to.ch
        }
        for (d = a; b = md(d);) {
            var e = b.find(0, !0);
            c -= d.text.length - e.from.ch, d = e.to.line, c += d.text.length - e.to.ch
        }
        return c
    }

    function m(a) {
        var b = a.display,
            c = a.doc;
        b.maxLine = Vd(c, c.first), b.maxLineLength = l(b.maxLine), b.maxLineChanged = !0, c.iter(function(a) {
            var c = l(a);
            c > b.maxLineLength && (b.maxLineLength = c, b.maxLine = a)
        })
    }

    function n(a) {
        var b = De(a.gutters, "CodeMirror-linenumbers");
        b == -1 && a.lineNumbers ? a.gutters = a.gutters.concat(["CodeMirror-linenumbers"]) : b > -1 && !a.lineNumbers && (a.gutters = a.gutters.slice(0), a.gutters.splice(b, 1))
    }

    function o(a) {
        var b = a.display,
            c = b.gutters.offsetWidth,
            d = Math.round(a.doc.height + Ra(a.display));
        return { clientHeight: b.scroller.clientHeight, viewHeight: b.wrapper.clientHeight, scrollWidth: b.scroller.scrollWidth, clientWidth: b.scroller.clientWidth, viewWidth: b.wrapper.clientWidth, barLeft: a.options.fixedGutter ? c : 0, docHeight: d, scrollHeight: d + Ta(a) + b.barHeight, nativeBarWidth: b.nativeBarWidth, gutterWidth: c }
    }

    function p(a, b, c) {
        this.cm = c;
        var d = this.vert = Me("div", [Me("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar"),
            e = this.horiz = Me("div", [Me("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
        a(d), a(e), xg(d, "scroll", function() { d.clientHeight && b(d.scrollTop, "vertical") }), xg(e, "scroll", function() { e.clientWidth && b(e.scrollLeft, "horizontal") }), this.checkedOverlay = !1, nf && of < 8 && (this.horiz.style.minHeight = this.vert.style.minWidth = "18px")
    }

    function q() {}

    function r(b) { b.display.scrollbars && (b.display.scrollbars.clear(), b.display.scrollbars.addClass && Qg(b.display.wrapper, b.display.scrollbars.addClass)), b.display.scrollbars = new a.scrollbarModel[b.options.scrollbarStyle](function(a) { b.display.wrapper.insertBefore(a, b.display.scrollbarFiller), xg(a, "mousedown", function() { b.state.focused && setTimeout(function() { b.display.input.focus() }, 0) }), a.setAttribute("cm-not-content", "true") }, function(a, c) { "horizontal" == c ? bc(b, a) : ac(b, a) }, b), b.display.scrollbars.addClass && Rg(b.display.wrapper, b.display.scrollbars.addClass) }

    function s(a, b) {
        b || (b = o(a));
        var c = a.display.barWidth,
            d = a.display.barHeight;
        t(a, b);
        for (var e = 0; e < 4 && c != a.display.barWidth || d != a.display.barHeight; e++) c != a.display.barWidth && a.options.lineWrapping && F(a), t(a, o(a)), c = a.display.barWidth, d = a.display.barHeight
    }

    function t(a, b) {
        var c = a.display,
            d = c.scrollbars.update(b);
        c.sizer.style.paddingRight = (c.barWidth = d.right) + "px", c.sizer.style.paddingBottom = (c.barHeight = d.bottom) + "px", d.right && d.bottom ? (c.scrollbarFiller.style.display = "block", c.scrollbarFiller.style.height = d.bottom + "px", c.scrollbarFiller.style.width = d.right + "px") : c.scrollbarFiller.style.display = "", d.bottom && a.options.coverGutterNextToScrollbar && a.options.fixedGutter ? (c.gutterFiller.style.display = "block", c.gutterFiller.style.height = d.bottom + "px", c.gutterFiller.style.width = b.gutterWidth + "px") : c.gutterFiller.style.display = ""
    }

    function u(a, b, c) {
        var d = c && null != c.top ? Math.max(0, c.top) : a.scroller.scrollTop;
        d = Math.floor(d - Qa(a));
        var e = c && null != c.bottom ? c.bottom : d + a.wrapper.clientHeight,
            f = $d(b, d),
            g = $d(b, e);
        if (c && c.ensure) {
            var h = c.ensure.from.line,
                i = c.ensure.to.line;
            h < f ? (f = h, g = $d(b, _d(Vd(b, h)) + a.wrapper.clientHeight)) : Math.min(i, b.lastLine()) >= g && (f = $d(b, _d(Vd(b, i)) - a.wrapper.clientHeight), g = i)
        }
        return { from: f, to: Math.max(g, f + 1) }
    }

    function v(a) {
        var b = a.display,
            c = b.view;
        if (b.alignWidgets || b.gutters.firstChild && a.options.fixedGutter) {
            for (var d = y(b) - b.scroller.scrollLeft + a.doc.scrollLeft, e = b.gutters.offsetWidth, f = d + "px", g = 0; g < c.length; g++)
                if (!c[g].hidden) {
                    a.options.fixedGutter && c[g].gutter && (c[g].gutter.style.left = f);
                    var h = c[g].alignable;
                    if (h)
                        for (var i = 0; i < h.length; i++) h[i].style.left = f
                }
            a.options.fixedGutter && (b.gutters.style.left = d + e + "px")
        }
    }

    function w(a) {
        if (!a.options.lineNumbers) return !1;
        var b = a.doc,
            c = x(a.options, b.first + b.size - 1),
            d = a.display;
        if (c.length != d.lineNumChars) {
            var e = d.measure.appendChild(Me("div", [Me("div", c)], "CodeMirror-linenumber CodeMirror-gutter-elt")),
                f = e.firstChild.offsetWidth,
                g = e.offsetWidth - f;
            return d.lineGutter.style.width = "", d.lineNumInnerWidth = Math.max(f, d.lineGutter.offsetWidth - g) + 1, d.lineNumWidth = d.lineNumInnerWidth + g, d.lineNumChars = d.lineNumInnerWidth ? c.length : -1, d.lineGutter.style.width = d.lineNumWidth + "px", k(a), !0
        }
        return !1
    }

    function x(a, b) { return String(a.lineNumberFormatter(b + a.firstLineNumber)) }

    function y(a) { return a.scroller.getBoundingClientRect().left - a.sizer.getBoundingClientRect().left }

    function z(a, b, c) {
        var d = a.display;
        this.viewport = b, this.visible = u(d, a.doc, b), this.editorIsHidden = !d.wrapper.offsetWidth, this.wrapperHeight = d.wrapper.clientHeight, this.wrapperWidth = d.wrapper.clientWidth, this.oldDisplayWidth = Ua(a), this.force = c, this.dims = H(a), this.events = []
    }

    function A(a) { var b = a.display;!b.scrollbarsClipped && b.scroller.offsetWidth && (b.nativeBarWidth = b.scroller.offsetWidth - b.scroller.clientWidth, b.heightForcer.style.height = Ta(a) + "px", b.sizer.style.marginBottom = -b.nativeBarWidth + "px", b.sizer.style.borderRightWidth = Ta(a) + "px", b.scrollbarsClipped = !0) }

    function B(a, b) {
        var c = a.display,
            d = a.doc;
        if (b.editorIsHidden) return Kb(a), !1;
        if (!b.force && b.visible.from >= c.viewFrom && b.visible.to <= c.viewTo && (null == c.updateLineNumbers || c.updateLineNumbers >= c.viewTo) && c.renderedView == c.view && 0 == Ob(a)) return !1;
        w(a) && (Kb(a), b.dims = H(a));
        var e = d.first + d.size,
            f = Math.max(b.visible.from - a.options.viewportMargin, d.first),
            g = Math.min(e, b.visible.to + a.options.viewportMargin);
        c.viewFrom < f && f - c.viewFrom < 20 && (f = Math.max(d.first, c.viewFrom)), c.viewTo > g && c.viewTo - g < 20 && (g = Math.min(e, c.viewTo)), Ef && (f = qd(a.doc, f), g = rd(a.doc, g));
        var h = f != c.viewFrom || g != c.viewTo || c.lastWrapHeight != b.wrapperHeight || c.lastWrapWidth != b.wrapperWidth;
        Nb(a, f, g), c.viewOffset = _d(Vd(a.doc, c.viewFrom)), a.display.mover.style.top = c.viewOffset + "px";
        var i = Ob(a);
        if (!h && 0 == i && !b.force && c.renderedView == c.view && (null == c.updateLineNumbers || c.updateLineNumbers >= c.viewTo)) return !1;
        var j = Pe();
        return i > 4 && (c.lineDiv.style.display = "none"), I(a, c.updateLineNumbers, b.dims), i > 4 && (c.lineDiv.style.display = ""), c.renderedView = c.view, j && Pe() != j && j.offsetHeight && j.focus(), Ne(c.cursorDiv), Ne(c.selectionDiv),
            c.gutters.style.height = 0, h && (c.lastWrapHeight = b.wrapperHeight, c.lastWrapWidth = b.wrapperWidth, Ma(a, 400)), c.updateLineNumbers = null, !0
    }

    function C(a, b) {
        for (var c = b.viewport, d = !0;
            (d && a.options.lineWrapping && b.oldDisplayWidth != Ua(a) || (c && null != c.top && (c = { top: Math.min(a.doc.height + Ra(a.display) - Va(a), c.top) }), b.visible = u(a.display, a.doc, c), !(b.visible.from >= a.display.viewFrom && b.visible.to <= a.display.viewTo))) && B(a, b); d = !1) {
            F(a);
            var e = o(a);
            Ha(a), E(a, e), s(a, e)
        }
        b.signal(a, "update", a), a.display.viewFrom == a.display.reportedViewFrom && a.display.viewTo == a.display.reportedViewTo || (b.signal(a, "viewportChange", a, a.display.viewFrom, a.display.viewTo), a.display.reportedViewFrom = a.display.viewFrom, a.display.reportedViewTo = a.display.viewTo)
    }

    function D(a, b) {
        var c = new z(a, b);
        if (B(a, c)) {
            F(a), C(a, c);
            var d = o(a);
            Ha(a), E(a, d), s(a, d), c.finish()
        }
    }

    function E(a, b) {
        a.display.sizer.style.minHeight = b.docHeight + "px";
        var c = b.docHeight + a.display.barHeight;
        a.display.heightForcer.style.top = c + "px", a.display.gutters.style.height = Math.max(c + Ta(a), b.clientHeight) + "px"
    }

    function F(a) {
        for (var b = a.display, c = b.lineDiv.offsetTop, d = 0; d < b.view.length; d++) {
            var e, f = b.view[d];
            if (!f.hidden) {
                if (nf && of < 8) {
                    var g = f.node.offsetTop + f.node.offsetHeight;
                    e = g - c, c = g
                } else {
                    var h = f.node.getBoundingClientRect();
                    e = h.bottom - h.top
                }
                var i = f.line.height - e;
                if (e < 2 && (e = rb(b)), (i > .001 || i < -.001) && (Yd(f.line, e), G(f.line), f.rest))
                    for (var j = 0; j < f.rest.length; j++) G(f.rest[j])
            }
        }
    }

    function G(a) {
        if (a.widgets)
            for (var b = 0; b < a.widgets.length; ++b) a.widgets[b].height = a.widgets[b].node.offsetHeight
    }

    function H(a) { for (var b = a.display, c = {}, d = {}, e = b.gutters.clientLeft, f = b.gutters.firstChild, g = 0; f; f = f.nextSibling, ++g) c[a.options.gutters[g]] = f.offsetLeft + f.clientLeft + e, d[a.options.gutters[g]] = f.clientWidth; return { fixedPos: y(b), gutterTotalWidth: b.gutters.offsetWidth, gutterLeft: c, gutterWidth: d, wrapperWidth: b.wrapper.clientWidth } }

    function I(a, b, c) {
        function d(b) { var c = b.nextSibling; return pf && yf && a.display.currentWheelTarget == b ? b.style.display = "none" : b.parentNode.removeChild(b), c }
        for (var e = a.display, f = a.options.lineNumbers, g = e.lineDiv, h = g.firstChild, i = e.view, j = e.viewFrom, k = 0; k < i.length; k++) {
            var l = i[k];
            if (l.hidden);
            else if (l.node && l.node.parentNode == g) {
                for (; h != l.node;) h = d(h);
                var m = f && null != b && b <= j && l.lineNumber;
                l.changes && (De(l.changes, "gutter") > -1 && (m = !1), J(a, l, j, c)), m && (Ne(l.lineNumber), l.lineNumber.appendChild(document.createTextNode(x(a.options, j)))), h = l.node.nextSibling
            } else {
                var n = R(a, l, j, c);
                g.insertBefore(n, h)
            }
            j += l.size
        }
        for (; h;) h = d(h)
    }

    function J(a, b, c, d) {
        for (var e = 0; e < b.changes.length; e++) { var f = b.changes[e]; "text" == f ? N(a, b) : "gutter" == f ? P(a, b, c, d) : "class" == f ? O(b) : "widget" == f && Q(a, b, d) }
        b.changes = null
    }

    function K(a) { return a.node == a.text && (a.node = Me("div", null, null, "position: relative"), a.text.parentNode && a.text.parentNode.replaceChild(a.node, a.text), a.node.appendChild(a.text), nf && of < 8 && (a.node.style.zIndex = 2)), a.node }

    function L(a) {
        var b = a.bgClass ? a.bgClass + " " + (a.line.bgClass || "") : a.line.bgClass;
        if (b && (b += " CodeMirror-linebackground"), a.background) b ? a.background.className = b : (a.background.parentNode.removeChild(a.background), a.background = null);
        else if (b) {
            var c = K(a);
            a.background = c.insertBefore(Me("div", null, b), c.firstChild)
        }
    }

    function M(a, b) { var c = a.display.externalMeasured; return c && c.line == b.line ? (a.display.externalMeasured = null, b.measure = c.measure, c.built) : Id(a, b) }

    function N(a, b) {
        var c = b.text.className,
            d = M(a, b);
        b.text == b.node && (b.node = d.pre), b.text.parentNode.replaceChild(d.pre, b.text), b.text = d.pre, d.bgClass != b.bgClass || d.textClass != b.textClass ? (b.bgClass = d.bgClass, b.textClass = d.textClass, O(b)) : c && (b.text.className = c)
    }

    function O(a) {
        L(a), a.line.wrapClass ? K(a).className = a.line.wrapClass : a.node != a.text && (a.node.className = "");
        var b = a.textClass ? a.textClass + " " + (a.line.textClass || "") : a.line.textClass;
        a.text.className = b || ""
    }

    function P(a, b, c, d) {
        b.gutter && (b.node.removeChild(b.gutter), b.gutter = null);
        var e = b.line.gutterMarkers;
        if (a.options.lineNumbers || e) {
            var f = K(b),
                g = b.gutter = Me("div", null, "CodeMirror-gutter-wrapper", "left: " + (a.options.fixedGutter ? d.fixedPos : -d.gutterTotalWidth) + "px; width: " + d.gutterTotalWidth + "px");
            if (a.display.input.setUneditable(g), f.insertBefore(g, b.text), b.line.gutterClass && (g.className += " " + b.line.gutterClass), !a.options.lineNumbers || e && e["CodeMirror-linenumbers"] || (b.lineNumber = g.appendChild(Me("div", x(a.options, c), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + d.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + a.display.lineNumInnerWidth + "px"))), e)
                for (var h = 0; h < a.options.gutters.length; ++h) {
                    var i = a.options.gutters[h],
                        j = e.hasOwnProperty(i) && e[i];
                    j && g.appendChild(Me("div", [j], "CodeMirror-gutter-elt", "left: " + d.gutterLeft[i] + "px; width: " + d.gutterWidth[i] + "px"))
                }
        }
    }

    function Q(a, b, c) {
        b.alignable && (b.alignable = null);
        for (var d, e = b.node.firstChild; e; e = d) { var d = e.nextSibling; "CodeMirror-linewidget" == e.className && b.node.removeChild(e) }
        S(a, b, c)
    }

    function R(a, b, c, d) { var e = M(a, b); return b.text = b.node = e.pre, e.bgClass && (b.bgClass = e.bgClass), e.textClass && (b.textClass = e.textClass), O(b), P(a, b, c, d), S(a, b, d), b.node }

    function S(a, b, c) {
        if (T(a, b.line, b, c, !0), b.rest)
            for (var d = 0; d < b.rest.length; d++) T(a, b.rest[d], b, c, !1)
    }

    function T(a, b, c, d, e) {
        if (b.widgets)
            for (var f = K(c), g = 0, h = b.widgets; g < h.length; ++g) {
                var i = h[g],
                    j = Me("div", [i.node], "CodeMirror-linewidget");
                i.handleMouseEvents || j.setAttribute("cm-ignore-events", "true"), U(i, j, c, d), a.display.input.setUneditable(j), e && i.above ? f.insertBefore(j, c.gutter || c.text) : f.appendChild(j), te(i, "redraw")
            }
    }

    function U(a, b, c, d) {
        if (a.noHScroll) {
            (c.alignable || (c.alignable = [])).push(b);
            var e = d.wrapperWidth;
            b.style.left = d.fixedPos + "px", a.coverGutter || (e -= d.gutterTotalWidth, b.style.paddingLeft = d.gutterTotalWidth + "px"), b.style.width = e + "px"
        }
        a.coverGutter && (b.style.zIndex = 5, b.style.position = "relative", a.noHScroll || (b.style.marginLeft = -d.gutterTotalWidth + "px"))
    }

    function V(a) { return Ff(a.line, a.ch) }

    function W(a, b) { return Gf(a, b) < 0 ? b : a }

    function X(a, b) { return Gf(a, b) < 0 ? a : b }

    function Y(a) { a.state.focused || (a.display.input.focus(), nc(a)) }

    function Z(a) { return a.options.readOnly || a.doc.cantEdit }

    function $(a, b, c, d, e) {
        var f = a.doc;
        a.display.shift = !1, d || (d = f.sel);
        var g = a.state.pasteIncoming || "paste" == e,
            h = Ug(b),
            i = null;
        g && d.ranges.length > 1 && (Hf && Hf.join("\n") == b ? i = d.ranges.length % Hf.length == 0 && Ee(Hf, Ug) : h.length == d.ranges.length && (i = Ee(h, function(a) { return [a] })));
        for (var j = d.ranges.length - 1; j >= 0; j--) {
            var k = d.ranges[j],
                l = k.from(),
                m = k.to();
            k.empty() && (c && c > 0 ? l = Ff(l.line, l.ch - c) : a.state.overwrite && !g && (m = Ff(m.line, Math.min(Vd(f, m.line).text.length, m.ch + Ce(h).length))));
            var n = a.curOp.updateInput,
                o = { from: l, to: m, text: i ? i[j % i.length] : h, origin: e || (g ? "paste" : a.state.cutIncoming ? "cut" : "+input") };
            wc(a.doc, o), te(a, "inputRead", a, o)
        }
        b && !g && aa(a, b), Ic(a), a.curOp.updateInput = n, a.curOp.typing = !0, a.state.pasteIncoming = a.state.cutIncoming = !1
    }

    function _(a, b) { var c = a.clipboardData && a.clipboardData.getData("text/plain"); if (c) return a.preventDefault(), Cb(b, function() { $(b, c, 0, null, "paste") }), !0 }

    function aa(a, b) {
        if (a.options.electricChars && a.options.smartIndent)
            for (var c = a.doc.sel, d = c.ranges.length - 1; d >= 0; d--) {
                var e = c.ranges[d];
                if (!(e.head.ch > 100 || d && c.ranges[d - 1].head.line == e.head.line)) {
                    var f = a.getModeAt(e.head),
                        g = !1;
                    if (f.electricChars) {
                        for (var h = 0; h < f.electricChars.length; h++)
                            if (b.indexOf(f.electricChars.charAt(h)) > -1) { g = Kc(a, e.head.line, "smart"); break }
                    } else f.electricInput && f.electricInput.test(Vd(a.doc, e.head.line).text.slice(0, e.head.ch)) && (g = Kc(a, e.head.line, "smart"));
                    g && te(a, "electricInput", a, e.head.line)
                }
            }
    }

    function ba(a) {
        for (var b = [], c = [], d = 0; d < a.doc.sel.ranges.length; d++) {
            var e = a.doc.sel.ranges[d].head.line,
                f = { anchor: Ff(e, 0), head: Ff(e + 1, 0) };
            c.push(f), b.push(a.getRange(f.anchor, f.head))
        }
        return { text: b, ranges: c }
    }

    function ca(a) { a.setAttribute("autocorrect", "off"), a.setAttribute("autocapitalize", "off"), a.setAttribute("spellcheck", "false") }

    function da(a) { this.cm = a, this.prevInput = "", this.pollingFast = !1, this.polling = new ze, this.inaccurateSelection = !1, this.hasSelection = !1, this.composing = null }

    function ea() {
        var a = Me("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none"),
            b = Me("div", [a], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
        return pf ? a.style.width = "1000px" : a.setAttribute("wrap", "off"), wf && (a.style.border = "1px solid black"), ca(a), b
    }

    function fa(a) { this.cm = a, this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null, this.polling = new ze, this.gracePeriod = !1 }

    function ga(a, b) {
        var c = $a(a, b.line);
        if (!c || c.hidden) return null;
        var d = Vd(a.doc, b.line),
            e = Xa(c, d, b.line),
            f = ae(d),
            g = "left";
        if (f) {
            var h = ff(f, b.ch);
            g = h % 2 ? "right" : "left"
        }
        var i = bb(e.map, b.ch, g);
        return i.offset = "right" == i.collapse ? i.end : i.start, i
    }

    function ha(a, b) { return b && (a.bad = !0), a }

    function ia(a, b, c) {
        var d;
        if (b == a.display.lineDiv) {
            if (d = a.display.lineDiv.childNodes[c], !d) return ha(a.clipPos(Ff(a.display.viewTo - 1)), !0);
            b = null, c = 0
        } else
            for (d = b;; d = d.parentNode) { if (!d || d == a.display.lineDiv) return null; if (d.parentNode && d.parentNode == a.display.lineDiv) break }
        for (var e = 0; e < a.display.view.length; e++) { var f = a.display.view[e]; if (f.node == d) return ja(f, b, c) }
    }

    function ja(a, b, c) {
        function d(b, c, d) {
            for (var e = -1; e < (k ? k.length : 0); e++)
                for (var f = e < 0 ? j.map : k[e], g = 0; g < f.length; g += 3) {
                    var h = f[g + 2];
                    if (h == b || h == c) {
                        var i = Zd(e < 0 ? a.line : a.rest[e]),
                            l = f[g] + d;
                        return (d < 0 || h != b) && (l = f[g + (d ? 1 : 0)]), Ff(i, l)
                    }
                }
        }
        var e = a.text.firstChild,
            f = !1;
        if (!b || !Ng(e, b)) return ha(Ff(Zd(a.line), 0), !0);
        if (b == e && (f = !0, b = e.childNodes[c], c = 0, !b)) { var g = a.rest ? Ce(a.rest) : a.line; return ha(Ff(Zd(g), g.text.length), f) }
        var h = 3 == b.nodeType ? b : null,
            i = b;
        for (h || 1 != b.childNodes.length || 3 != b.firstChild.nodeType || (h = b.firstChild, c && (c = h.nodeValue.length)); i.parentNode != e;) i = i.parentNode;
        var j = a.measure,
            k = j.maps,
            l = d(h, i, c);
        if (l) return ha(l, f);
        for (var m = i.nextSibling, n = h ? h.nodeValue.length - c : 0; m; m = m.nextSibling) {
            if (l = d(m, m.firstChild, 0)) return ha(Ff(l.line, l.ch - n), f);
            n += m.textContent.length
        }
        for (var o = i.previousSibling, n = c; o; o = o.previousSibling) {
            if (l = d(o, o.firstChild, -1)) return ha(Ff(l.line, l.ch + n), f);
            n += m.textContent.length
        }
    }

    function ka(a, b, c, d, e) {
        function f(a) { return function(b) { return b.id == a } }

        function g(b) {
            if (1 == b.nodeType) { var c = b.getAttribute("cm-text"); if (null != c) return "" == c && (c = b.textContent.replace(/\u200b/g, "")), void(h += c); var j, k = b.getAttribute("cm-marker"); if (k) { var l = a.findMarks(Ff(d, 0), Ff(e + 1, 0), f(+k)); return void(l.length && (j = l[0].find()) && (h += Wd(a.doc, j.from, j.to).join("\n"))) } if ("false" == b.getAttribute("contenteditable")) return; for (var m = 0; m < b.childNodes.length; m++) g(b.childNodes[m]); /^(pre|div|p)$/i.test(b.nodeName) && (i = !0) } else if (3 == b.nodeType) {
                var n = b.nodeValue;
                if (!n) return;
                i && (h += "\n", i = !1), h += n
            }
        }
        for (var h = "", i = !1; g(b), b != c;) b = b.nextSibling;
        return h
    }

    function la(a, b) { this.ranges = a, this.primIndex = b }

    function ma(a, b) { this.anchor = a, this.head = b }

    function na(a, b) {
        var c = a[b];
        a.sort(function(a, b) { return Gf(a.from(), b.from()) }), b = De(a, c);
        for (var d = 1; d < a.length; d++) {
            var e = a[d],
                f = a[d - 1];
            if (Gf(f.to(), e.from()) >= 0) {
                var g = X(f.from(), e.from()),
                    h = W(f.to(), e.to()),
                    i = f.empty() ? e.from() == e.head : f.from() == f.head;
                d <= b && --b, a.splice(--d, 2, new ma(i ? h : g, i ? g : h))
            }
        }
        return new la(a, b)
    }

    function oa(a, b) { return new la([new ma(a, b || a)], 0) }

    function pa(a, b) { return Math.max(a.first, Math.min(b, a.first + a.size - 1)) }

    function qa(a, b) { if (b.line < a.first) return Ff(a.first, 0); var c = a.first + a.size - 1; return b.line > c ? Ff(c, Vd(a, c).text.length) : ra(b, Vd(a, b.line).text.length) }

    function ra(a, b) { var c = a.ch; return null == c || c > b ? Ff(a.line, b) : c < 0 ? Ff(a.line, 0) : a }

    function sa(a, b) { return b >= a.first && b < a.first + a.size }

    function ta(a, b) { for (var c = [], d = 0; d < b.length; d++) c[d] = qa(a, b[d]); return c }

    function ua(a, b, c, d) {
        if (a.cm && a.cm.display.shift || a.extend) {
            var e = b.anchor;
            if (d) {
                var f = Gf(c, e) < 0;
                f != Gf(d, e) < 0 ? (e = c, c = d) : f != Gf(c, d) < 0 && (c = d)
            }
            return new ma(e, c)
        }
        return new ma(d || c, c)
    }

    function va(a, b, c, d) { Ba(a, new la([ua(a, a.sel.primary(), b, c)], 0), d) }

    function wa(a, b, c) {
        for (var d = [], e = 0; e < a.sel.ranges.length; e++) d[e] = ua(a, a.sel.ranges[e], b[e], null);
        var f = na(d, a.sel.primIndex);
        Ba(a, f, c)
    }

    function xa(a, b, c, d) {
        var e = a.sel.ranges.slice(0);
        e[b] = c, Ba(a, na(e, a.sel.primIndex), d)
    }

    function ya(a, b, c, d) { Ba(a, oa(b, c), d) }

    function za(a, b) { var c = { ranges: b.ranges, update: function(b) { this.ranges = []; for (var c = 0; c < b.length; c++) this.ranges[c] = new ma(qa(a, b[c].anchor), qa(a, b[c].head)) } }; return zg(a, "beforeSelectionChange", a, c), a.cm && zg(a.cm, "beforeSelectionChange", a.cm, c), c.ranges != b.ranges ? na(c.ranges, c.ranges.length - 1) : b }

    function Aa(a, b, c) {
        var d = a.history.done,
            e = Ce(d);
        e && e.ranges ? (d[d.length - 1] = b, Ca(a, b, c)) : Ba(a, b, c)
    }

    function Ba(a, b, c) { Ca(a, b, c), he(a, a.sel, a.cm ? a.cm.curOp.id : NaN, c) }

    function Ca(a, b, c) {
        (xe(a, "beforeSelectionChange") || a.cm && xe(a.cm, "beforeSelectionChange")) && (b = za(a, b));
        var d = c && c.bias || (Gf(b.primary().head, a.sel.primary().head) < 0 ? -1 : 1);
        Da(a, Fa(a, b, d, !0)), c && c.scroll === !1 || !a.cm || Ic(a.cm)
    }

    function Da(a, b) { b.equals(a.sel) || (a.sel = b, a.cm && (a.cm.curOp.updateInput = a.cm.curOp.selectionChanged = !0, we(a.cm)), te(a, "cursorActivity", a)) }

    function Ea(a) { Da(a, Fa(a, a.sel, null, !1), Dg) }

    function Fa(a, b, c, d) {
        for (var e, f = 0; f < b.ranges.length; f++) {
            var g = b.ranges[f],
                h = Ga(a, g.anchor, c, d),
                i = Ga(a, g.head, c, d);
            (e || h != g.anchor || i != g.head) && (e || (e = b.ranges.slice(0, f)), e[f] = new ma(h, i))
        }
        return e ? na(e, b.primIndex) : b
    }

    function Ga(a, b, c, d) {
        var e = !1,
            f = b,
            g = c || 1;
        a.cantEdit = !1;
        a: for (;;) {
            var h = Vd(a, f.line);
            if (h.markedSpans)
                for (var i = 0; i < h.markedSpans.length; ++i) {
                    var j = h.markedSpans[i],
                        k = j.marker;
                    if ((null == j.from || (k.inclusiveLeft ? j.from <= f.ch : j.from < f.ch)) && (null == j.to || (k.inclusiveRight ? j.to >= f.ch : j.to > f.ch))) {
                        if (d && (zg(k, "beforeCursorEnter"), k.explicitlyCleared)) { if (h.markedSpans) {--i; continue } break }
                        if (!k.atomic) continue;
                        var l = k.find(g < 0 ? -1 : 1);
                        if (0 == Gf(l, f) && (l.ch += g, l.ch < 0 ? l = l.line > a.first ? qa(a, Ff(l.line - 1)) : null : l.ch > h.text.length && (l = l.line < a.first + a.size - 1 ? Ff(l.line + 1, 0) : null), !l)) {
                            if (e) return d ? (a.cantEdit = !0, Ff(a.first, 0)) : Ga(a, b, c, !0);
                            e = !0, l = b, g = -g
                        }
                        f = l;
                        continue a
                    }
                }
            return f
        }
    }

    function Ha(a) { a.display.input.showSelection(a.display.input.prepareSelection()) }

    function Ia(a, b) {
        for (var c = a.doc, d = {}, e = d.cursors = document.createDocumentFragment(), f = d.selection = document.createDocumentFragment(), g = 0; g < c.sel.ranges.length; g++)
            if (b !== !1 || g != c.sel.primIndex) {
                var h = c.sel.ranges[g],
                    i = h.empty();
                (i || a.options.showCursorWhenSelecting) && Ja(a, h, e), i || Ka(a, h, f)
            }
        return d
    }

    function Ja(a, b, c) {
        var d = mb(a, b.head, "div", null, null, !a.options.singleCursorHeightPerLine),
            e = c.appendChild(Me("div", " ", "CodeMirror-cursor"));
        if (e.style.left = d.left + "px", e.style.top = d.top + "px", e.style.height = Math.max(0, d.bottom - d.top) * a.options.cursorHeight + "px", d.other) {
            var f = c.appendChild(Me("div", " ", "CodeMirror-cursor CodeMirror-secondarycursor"));
            f.style.display = "", f.style.left = d.other.left + "px", f.style.top = d.other.top + "px", f.style.height = .85 * (d.other.bottom - d.other.top) + "px"
        }
    }

    function Ka(a, b, c) {
        function d(a, b, c, d) { b < 0 && (b = 0), b = Math.round(b), d = Math.round(d), h.appendChild(Me("div", null, "CodeMirror-selected", "position: absolute; left: " + a + "px; top: " + b + "px; width: " + (null == c ? k - a : c) + "px; height: " + (d - b) + "px")) }

        function e(b, c, e) {
            function f(c, d) { return lb(a, Ff(b, c), "div", l, d) }
            var h, i, l = Vd(g, b),
                m = l.text.length;
            return Ye(ae(l), c || 0, null == e ? m : e, function(a, b, g) {
                var l, n, o, p = f(a, "left");
                if (a == b) l = p, n = o = p.left;
                else {
                    if (l = f(b - 1, "right"), "rtl" == g) {
                        var q = p;
                        p = l, l = q
                    }
                    n = p.left, o = l.right
                }
                null == c && 0 == a && (n = j), l.top - p.top > 3 && (d(n, p.top, null, p.bottom), n = j, p.bottom < l.top && d(n, p.bottom, null, l.top)), null == e && b == m && (o = k), (!h || p.top < h.top || p.top == h.top && p.left < h.left) && (h = p), (!i || l.bottom > i.bottom || l.bottom == i.bottom && l.right > i.right) && (i = l), n < j + 1 && (n = j), d(n, l.top, o - n, l.bottom)
            }), { start: h, end: i }
        }
        var f = a.display,
            g = a.doc,
            h = document.createDocumentFragment(),
            i = Sa(a.display),
            j = i.left,
            k = Math.max(f.sizerWidth, Ua(a) - f.sizer.offsetLeft) - i.right,
            l = b.from(),
            m = b.to();
        if (l.line == m.line) e(l.line, l.ch, m.ch);
        else {
            var n = Vd(g, l.line),
                o = Vd(g, m.line),
                p = od(n) == od(o),
                q = e(l.line, l.ch, p ? n.text.length + 1 : null).end,
                r = e(m.line, p ? 0 : null, m.ch).start;
            p && (q.top < r.top - 2 ? (d(q.right, q.top, null, q.bottom), d(j, r.top, r.left, r.bottom)) : d(q.right, q.top, r.left - q.right, q.bottom)), q.bottom < r.top && d(j, q.bottom, null, r.top)
        }
        c.appendChild(h)
    }

    function La(a) {
        if (a.state.focused) {
            var b = a.display;
            clearInterval(b.blinker);
            var c = !0;
            b.cursorDiv.style.visibility = "", a.options.cursorBlinkRate > 0 ? b.blinker = setInterval(function() { b.cursorDiv.style.visibility = (c = !c) ? "" : "hidden" }, a.options.cursorBlinkRate) : a.options.cursorBlinkRate < 0 && (b.cursorDiv.style.visibility = "hidden")
        }
    }

    function Ma(a, b) { a.doc.mode.startState && a.doc.frontier < a.display.viewTo && a.state.highlight.set(b, Ie(Na, a)) }

    function Na(a) {
        var b = a.doc;
        if (b.frontier < b.first && (b.frontier = b.first), !(b.frontier >= a.display.viewTo)) {
            var c = +new Date + a.options.workTime,
                d = bg(b.mode, Pa(a, b.frontier)),
                e = [];
            b.iter(b.frontier, Math.min(b.first + b.size, a.display.viewTo + 500), function(f) {
                if (b.frontier >= a.display.viewFrom) {
                    var g = f.styles,
                        h = Ed(a, f, d, !0);
                    f.styles = h.styles;
                    var i = f.styleClasses,
                        j = h.classes;
                    j ? f.styleClasses = j : i && (f.styleClasses = null);
                    for (var k = !g || g.length != f.styles.length || i != j && (!i || !j || i.bgClass != j.bgClass || i.textClass != j.textClass), l = 0; !k && l < g.length; ++l) k = g[l] != f.styles[l];
                    k && e.push(b.frontier), f.stateAfter = bg(b.mode, d)
                } else Gd(a, f.text, d), f.stateAfter = b.frontier % 5 == 0 ? bg(b.mode, d) : null;
                if (++b.frontier, +new Date > c) return Ma(a, a.options.workDelay), !0
            }), e.length && Cb(a, function() { for (var b = 0; b < e.length; b++) Jb(a, e[b], "text") })
        }
    }

    function Oa(a, b, c) {
        for (var d, e, f = a.doc, g = c ? -1 : b - (a.doc.mode.innerMode ? 1e3 : 100), h = b; h > g; --h) {
            if (h <= f.first) return f.first;
            var i = Vd(f, h - 1);
            if (i.stateAfter && (!c || h <= f.frontier)) return h;
            var j = Gg(i.text, null, a.options.tabSize);
            (null == e || d > j) && (e = h - 1, d = j)
        }
        return e
    }

    function Pa(a, b, c) {
        var d = a.doc,
            e = a.display;
        if (!d.mode.startState) return !0;
        var f = Oa(a, b, c),
            g = f > d.first && Vd(d, f - 1).stateAfter;
        return g = g ? bg(d.mode, g) : cg(d.mode), d.iter(f, b, function(c) {
            Gd(a, c.text, g);
            var h = f == b - 1 || f % 5 == 0 || f >= e.viewFrom && f < e.viewTo;
            c.stateAfter = h ? bg(d.mode, g) : null, ++f
        }), c && (d.frontier = f), g
    }

    function Qa(a) { return a.lineSpace.offsetTop }

    function Ra(a) { return a.mover.offsetHeight - a.lineSpace.offsetHeight }

    function Sa(a) {
        if (a.cachedPaddingH) return a.cachedPaddingH;
        var b = Oe(a.measure, Me("pre", "x")),
            c = window.getComputedStyle ? window.getComputedStyle(b) : b.currentStyle,
            d = { left: parseInt(c.paddingLeft), right: parseInt(c.paddingRight) };
        return isNaN(d.left) || isNaN(d.right) || (a.cachedPaddingH = d), d
    }

    function Ta(a) { return Bg - a.display.nativeBarWidth }

    function Ua(a) { return a.display.scroller.clientWidth - Ta(a) - a.display.barWidth }

    function Va(a) { return a.display.scroller.clientHeight - Ta(a) - a.display.barHeight }

    function Wa(a, b, c) {
        var d = a.options.lineWrapping,
            e = d && Ua(a);
        if (!b.measure.heights || d && b.measure.width != e) {
            var f = b.measure.heights = [];
            if (d) {
                b.measure.width = e;
                for (var g = b.text.firstChild.getClientRects(), h = 0; h < g.length - 1; h++) {
                    var i = g[h],
                        j = g[h + 1];
                    Math.abs(i.bottom - j.bottom) > 2 && f.push((i.bottom + j.top) / 2 - c.top)
                }
            }
            f.push(c.bottom - c.top)
        }
    }

    function Xa(a, b, c) {
        if (a.line == b) return { map: a.measure.map, cache: a.measure.cache };
        for (var d = 0; d < a.rest.length; d++)
            if (a.rest[d] == b) return { map: a.measure.maps[d], cache: a.measure.caches[d] };
        for (var d = 0; d < a.rest.length; d++)
            if (Zd(a.rest[d]) > c) return { map: a.measure.maps[d], cache: a.measure.caches[d], before: !0 }
    }

    function Ya(a, b) {
        b = od(b);
        var c = Zd(b),
            d = a.display.externalMeasured = new Gb(a.doc, b, c);
        d.lineN = c;
        var e = d.built = Id(a, d);
        return d.text = e.pre, Oe(a.display.lineMeasure, e.pre), d
    }

    function Za(a, b, c, d) { return ab(a, _a(a, b), c, d) }

    function $a(a, b) { if (b >= a.display.viewFrom && b < a.display.viewTo) return a.display.view[Lb(a, b)]; var c = a.display.externalMeasured; return c && b >= c.lineN && b < c.lineN + c.size ? c : void 0 }

    function _a(a, b) {
        var c = Zd(b),
            d = $a(a, c);
        d && !d.text ? d = null : d && d.changes && J(a, d, c, H(a)), d || (d = Ya(a, b));
        var e = Xa(d, b, c);
        return { line: b, view: d, rect: null, map: e.map, cache: e.cache, before: e.before, hasHeights: !1 }
    }

    function ab(a, b, c, d, e) { b.before && (c = -1); var f, g = c + (d || ""); return b.cache.hasOwnProperty(g) ? f = b.cache[g] : (b.rect || (b.rect = b.view.text.getBoundingClientRect()), b.hasHeights || (Wa(a, b.view, b.rect), b.hasHeights = !0), f = cb(a, b, c, d), f.bogus || (b.cache[g] = f)), { left: f.left, right: f.right, top: e ? f.rtop : f.top, bottom: e ? f.rbottom : f.bottom } }

    function bb(a, b, c) {
        for (var d, e, f, g, h = 0; h < a.length; h += 3) {
            var i = a[h],
                j = a[h + 1];
            if (b < i ? (e = 0, f = 1, g = "left") : b < j ? (e = b - i, f = e + 1) : (h == a.length - 3 || b == j && a[h + 3] > b) && (f = j - i, e = f - 1, b >= j && (g = "right")), null != e) {
                if (d = a[h + 2], i == j && c == (d.insertLeft ? "left" : "right") && (g = c), "left" == c && 0 == e)
                    for (; h && a[h - 2] == a[h - 3] && a[h - 1].insertLeft;) d = a[(h -= 3) + 2], g = "left";
                if ("right" == c && e == j - i)
                    for (; h < a.length - 3 && a[h + 3] == a[h + 4] && !a[h + 5].insertLeft;) d = a[(h += 3) + 2], g = "right";
                break
            }
        }
        return { node: d, start: e, end: f, collapse: g, coverStart: i, coverEnd: j }
    }

    function cb(a, b, c, d) {
        var e, f = bb(b.map, c, d),
            g = f.node,
            h = f.start,
            i = f.end,
            j = f.collapse;
        if (3 == g.nodeType) {
            for (var k = 0; k < 4; k++) {
                for (; h && Le(b.line.text.charAt(f.coverStart + h));) --h;
                for (; f.coverStart + i < f.coverEnd && Le(b.line.text.charAt(f.coverStart + i));) ++i;
                if (nf && of < 9 && 0 == h && i == f.coverEnd - f.coverStart) e = g.parentNode.getBoundingClientRect();
                else if (nf && a.options.lineWrapping) {
                    var l = Jg(g, h, i).getClientRects();
                    e = l.length ? l["right" == d ? l.length - 1 : 0] : Lf
                } else e = Jg(g, h, i).getBoundingClientRect() || Lf;
                if (e.left || e.right || 0 == h) break;
                i = h, h -= 1, j = "right"
            }
            nf && of < 11 && (e = db(a.display.measure, e))
        } else {
            h > 0 && (j = d = "right");
            var l;
            e = a.options.lineWrapping && (l = g.getClientRects()).length > 1 ? l["right" == d ? l.length - 1 : 0] : g.getBoundingClientRect()
        }
        if (nf && of < 9 && !h && (!e || !e.left && !e.right)) {
            var m = g.parentNode.getClientRects()[0];
            e = m ? { left: m.left, right: m.left + sb(a.display), top: m.top, bottom: m.bottom } : Lf
        }
        for (var n = e.top - b.rect.top, o = e.bottom - b.rect.top, p = (n + o) / 2, q = b.view.measure.heights, k = 0; k < q.length - 1 && !(p < q[k]); k++);
        var r = k ? q[k - 1] : 0,
            s = q[k],
            t = { left: ("right" == j ? e.right : e.left) - b.rect.left, right: ("left" == j ? e.left : e.right) - b.rect.left, top: r, bottom: s };
        return e.left || e.right || (t.bogus = !0), a.options.singleCursorHeightPerLine || (t.rtop = n, t.rbottom = o), t
    }

    function db(a, b) {
        if (!window.screen || null == screen.logicalXDPI || screen.logicalXDPI == screen.deviceXDPI || !Xe(a)) return b;
        var c = screen.logicalXDPI / screen.deviceXDPI,
            d = screen.logicalYDPI / screen.deviceYDPI;
        return { left: b.left * c, right: b.right * c, top: b.top * d, bottom: b.bottom * d }
    }

    function eb(a) {
        if (a.measure && (a.measure.cache = {}, a.measure.heights = null, a.rest))
            for (var b = 0; b < a.rest.length; b++) a.measure.caches[b] = {}
    }

    function fb(a) { a.display.externalMeasure = null, Ne(a.display.lineMeasure); for (var b = 0; b < a.display.view.length; b++) eb(a.display.view[b]) }

    function gb(a) { fb(a), a.display.cachedCharWidth = a.display.cachedTextHeight = a.display.cachedPaddingH = null, a.options.lineWrapping || (a.display.maxLineChanged = !0), a.display.lineNumChars = null }

    function hb() { return window.pageXOffset || (document.documentElement || document.body).scrollLeft }

    function ib() { return window.pageYOffset || (document.documentElement || document.body).scrollTop }

    function jb(a, b, c, d) {
        if (b.widgets)
            for (var e = 0; e < b.widgets.length; ++e)
                if (b.widgets[e].above) {
                    var f = vd(b.widgets[e]);
                    c.top += f, c.bottom += f
                }
        if ("line" == d) return c;
        d || (d = "local");
        var g = _d(b);
        if ("local" == d ? g += Qa(a.display) : g -= a.display.viewOffset, "page" == d || "window" == d) {
            var h = a.display.lineSpace.getBoundingClientRect();
            g += h.top + ("window" == d ? 0 : ib());
            var i = h.left + ("window" == d ? 0 : hb());
            c.left += i, c.right += i
        }
        return c.top += g, c.bottom += g, c
    }

    function kb(a, b, c) {
        if ("div" == c) return b;
        var d = b.left,
            e = b.top;
        if ("page" == c) d -= hb(), e -= ib();
        else if ("local" == c || !c) {
            var f = a.display.sizer.getBoundingClientRect();
            d += f.left, e += f.top
        }
        var g = a.display.lineSpace.getBoundingClientRect();
        return { left: d - g.left, top: e - g.top }
    }

    function lb(a, b, c, d, e) { return d || (d = Vd(a.doc, b.line)), jb(a, d, Za(a, d, b.ch, e), c) }

    function mb(a, b, c, d, e, f) {
        function g(b, g) { var h = ab(a, e, b, g ? "right" : "left", f); return g ? h.left = h.right : h.right = h.left, jb(a, d, h, c) }

        function h(a, b) {
            var c = i[b],
                d = c.level % 2;
            return a == Ze(c) && b && c.level < i[b - 1].level ? (c = i[--b], a = $e(c) - (c.level % 2 ? 0 : 1), d = !0) : a == $e(c) && b < i.length - 1 && c.level < i[b + 1].level && (c = i[++b], a = Ze(c) - c.level % 2, d = !1), d && a == c.to && a > c.from ? g(a - 1) : g(a, d)
        }
        d = d || Vd(a.doc, b.line), e || (e = _a(a, d));
        var i = ae(d),
            j = b.ch;
        if (!i) return g(j);
        var k = ff(i, j),
            l = h(j, k);
        return null != Zg && (l.other = h(j, Zg)), l
    }

    function nb(a, b) {
        var c = 0,
            b = qa(a.doc, b);
        a.options.lineWrapping || (c = sb(a.display) * b.ch);
        var d = Vd(a.doc, b.line),
            e = _d(d) + Qa(a.display);
        return { left: c, right: c, top: e, bottom: e + d.height }
    }

    function ob(a, b, c, d) { var e = Ff(a, b); return e.xRel = d, c && (e.outside = !0), e }

    function pb(a, b, c) {
        var d = a.doc;
        if (c += a.display.viewOffset, c < 0) return ob(d.first, 0, !0, -1);
        var e = $d(d, c),
            f = d.first + d.size - 1;
        if (e > f) return ob(d.first + d.size - 1, Vd(d, f).text.length, !0, 1);
        b < 0 && (b = 0);
        for (var g = Vd(d, e);;) {
            var h = qb(a, g, e, b, c),
                i = md(g),
                j = i && i.find(0, !0);
            if (!i || !(h.ch > j.from.ch || h.ch == j.from.ch && h.xRel > 0)) return h;
            e = Zd(g = j.to.line)
        }
    }

    function qb(a, b, c, d, e) {
        function f(d) { var e = mb(a, Ff(c, d), "line", b, j); return h = !0, g > e.bottom ? e.left - i : g < e.top ? e.left + i : (h = !1, e.left) }
        var g = e - _d(b),
            h = !1,
            i = 2 * a.display.wrapper.clientWidth,
            j = _a(a, b),
            k = ae(b),
            l = b.text.length,
            m = _e(b),
            n = af(b),
            o = f(m),
            p = h,
            q = f(n),
            r = h;
        if (d > q) return ob(c, n, r, 1);
        for (;;) {
            if (k ? n == m || n == hf(b, m, 1) : n - m <= 1) { for (var s = d < o || d - o <= q - d ? m : n, t = d - (s == m ? o : q); Le(b.text.charAt(s));) ++s; var u = ob(c, s, s == m ? p : r, t < -1 ? -1 : t > 1 ? 1 : 0); return u }
            var v = Math.ceil(l / 2),
                w = m + v;
            if (k) { w = m; for (var x = 0; x < v; ++x) w = hf(b, w, 1) }
            var y = f(w);
            y > d ? (n = w, q = y, (r = h) && (q += 1e3), l = v) : (m = w, o = y, p = h, l -= v)
        }
    }

    function rb(a) {
        if (null != a.cachedTextHeight) return a.cachedTextHeight;
        if (null == If) {
            If = Me("pre");
            for (var b = 0; b < 49; ++b) If.appendChild(document.createTextNode("x")), If.appendChild(Me("br"));
            If.appendChild(document.createTextNode("x"))
        }
        Oe(a.measure, If);
        var c = If.offsetHeight / 50;
        return c > 3 && (a.cachedTextHeight = c), Ne(a.measure), c || 1
    }

    function sb(a) {
        if (null != a.cachedCharWidth) return a.cachedCharWidth;
        var b = Me("span", "xxxxxxxxxx"),
            c = Me("pre", [b]);
        Oe(a.measure, c);
        var d = b.getBoundingClientRect(),
            e = (d.right - d.left) / 10;
        return e > 2 && (a.cachedCharWidth = e), e || 10
    }

    function tb(a) { a.curOp = { cm: a, viewChanged: !1, startHeight: a.doc.height, forceUpdate: !1, updateInput: null, typing: !1, changeObjs: null, cursorActivityHandlers: null, cursorActivityCalled: 0, selectionChanged: !1, updateMaxLine: !1, scrollLeft: null, scrollTop: null, scrollToPos: null, focus: !1, id: ++Nf }, Mf ? Mf.ops.push(a.curOp) : a.curOp.ownsGroup = Mf = { ops: [a.curOp], delayedCallbacks: [] } }

    function ub(a) {
        var b = a.delayedCallbacks,
            c = 0;
        do {
            for (; c < b.length; c++) b[c]();
            for (var d = 0; d < a.ops.length; d++) {
                var e = a.ops[d];
                if (e.cursorActivityHandlers)
                    for (; e.cursorActivityCalled < e.cursorActivityHandlers.length;) e.cursorActivityHandlers[e.cursorActivityCalled++](e.cm)
            }
        } while (c < b.length)
    }

    function vb(a) {
        var b = a.curOp,
            c = b.ownsGroup;
        if (c) try { ub(c) } finally {
            Mf = null;
            for (var d = 0; d < c.ops.length; d++) c.ops[d].cm.curOp = null;
            wb(c)
        }
    }

    function wb(a) { for (var b = a.ops, c = 0; c < b.length; c++) xb(b[c]); for (var c = 0; c < b.length; c++) yb(b[c]); for (var c = 0; c < b.length; c++) zb(b[c]); for (var c = 0; c < b.length; c++) Ab(b[c]); for (var c = 0; c < b.length; c++) Bb(b[c]) }

    function xb(a) {
        var b = a.cm,
            c = b.display;
        A(b), a.updateMaxLine && m(b), a.mustUpdate = a.viewChanged || a.forceUpdate || null != a.scrollTop || a.scrollToPos && (a.scrollToPos.from.line < c.viewFrom || a.scrollToPos.to.line >= c.viewTo) || c.maxLineChanged && b.options.lineWrapping, a.update = a.mustUpdate && new z(b, a.mustUpdate && { top: a.scrollTop, ensure: a.scrollToPos }, a.forceUpdate)
    }

    function yb(a) { a.updatedDisplay = a.mustUpdate && B(a.cm, a.update) }

    function zb(a) {
        var b = a.cm,
            c = b.display;
        a.updatedDisplay && F(b), a.barMeasure = o(b), c.maxLineChanged && !b.options.lineWrapping && (a.adjustWidthTo = Za(b, c.maxLine, c.maxLine.text.length).left + 3, b.display.sizerWidth = a.adjustWidthTo, a.barMeasure.scrollWidth = Math.max(c.scroller.clientWidth, c.sizer.offsetLeft + a.adjustWidthTo + Ta(b) + b.display.barWidth), a.maxScrollLeft = Math.max(0, c.sizer.offsetLeft + a.adjustWidthTo - Ua(b))), (a.updatedDisplay || a.selectionChanged) && (a.preparedSelection = c.input.prepareSelection())
    }

    function Ab(a) {
        var b = a.cm;
        null != a.adjustWidthTo && (b.display.sizer.style.minWidth = a.adjustWidthTo + "px", a.maxScrollLeft < b.doc.scrollLeft && bc(b, Math.min(b.display.scroller.scrollLeft, a.maxScrollLeft), !0), b.display.maxLineChanged = !1), a.preparedSelection && b.display.input.showSelection(a.preparedSelection), a.updatedDisplay && E(b, a.barMeasure), (a.updatedDisplay || a.startHeight != b.doc.height) && s(b, a.barMeasure), a.selectionChanged && La(b), b.state.focused && a.updateInput && b.display.input.reset(a.typing), a.focus && a.focus == Pe() && Y(a.cm)
    }

    function Bb(a) {
        var b = a.cm,
            c = b.display,
            d = b.doc;
        if (a.updatedDisplay && C(b, a.update), null == c.wheelStartX || null == a.scrollTop && null == a.scrollLeft && !a.scrollToPos || (c.wheelStartX = c.wheelStartY = null), null == a.scrollTop || c.scroller.scrollTop == a.scrollTop && !a.forceScroll || (d.scrollTop = Math.max(0, Math.min(c.scroller.scrollHeight - c.scroller.clientHeight, a.scrollTop)), c.scrollbars.setScrollTop(d.scrollTop), c.scroller.scrollTop = d.scrollTop), null == a.scrollLeft || c.scroller.scrollLeft == a.scrollLeft && !a.forceScroll || (d.scrollLeft = Math.max(0, Math.min(c.scroller.scrollWidth - Ua(b), a.scrollLeft)), c.scrollbars.setScrollLeft(d.scrollLeft), c.scroller.scrollLeft = d.scrollLeft, v(b)), a.scrollToPos) {
            var e = Ec(b, qa(d, a.scrollToPos.from), qa(d, a.scrollToPos.to), a.scrollToPos.margin);
            a.scrollToPos.isCursor && b.state.focused && Dc(b, e)
        }
        var f = a.maybeHiddenMarkers,
            g = a.maybeUnhiddenMarkers;
        if (f)
            for (var h = 0; h < f.length; ++h) f[h].lines.length || zg(f[h], "hide");
        if (g)
            for (var h = 0; h < g.length; ++h) g[h].lines.length && zg(g[h], "unhide");
        c.wrapper.offsetHeight && (d.scrollTop = b.display.scroller.scrollTop), a.changeObjs && zg(b, "changes", b, a.changeObjs), a.update && a.update.finish()
    }

    function Cb(a, b) {
        if (a.curOp) return b();
        tb(a);
        try { return b() } finally { vb(a) }
    }

    function Db(a, b) {
        return function() {
            if (a.curOp) return b.apply(a, arguments);
            tb(a);
            try { return b.apply(a, arguments) } finally { vb(a) }
        }
    }

    function Eb(a) {
        return function() {
            if (this.curOp) return a.apply(this, arguments);
            tb(this);
            try { return a.apply(this, arguments) } finally { vb(this) }
        }
    }

    function Fb(a) {
        return function() {
            var b = this.cm;
            if (!b || b.curOp) return a.apply(this, arguments);
            tb(b);
            try { return a.apply(this, arguments) } finally { vb(b) }
        }
    }

    function Gb(a, b, c) { this.line = b, this.rest = pd(b), this.size = this.rest ? Zd(Ce(this.rest)) - c + 1 : 1, this.node = this.text = null, this.hidden = sd(a, b) }

    function Hb(a, b, c) {
        for (var d, e = [], f = b; f < c; f = d) {
            var g = new Gb(a.doc, Vd(a.doc, f), f);
            d = f + g.size, e.push(g)
        }
        return e
    }

    function Ib(a, b, c, d) {
        null == b && (b = a.doc.first), null == c && (c = a.doc.first + a.doc.size), d || (d = 0);
        var e = a.display;
        if (d && c < e.viewTo && (null == e.updateLineNumbers || e.updateLineNumbers > b) && (e.updateLineNumbers = b), a.curOp.viewChanged = !0, b >= e.viewTo) Ef && qd(a.doc, b) < e.viewTo && Kb(a);
        else if (c <= e.viewFrom) Ef && rd(a.doc, c + d) > e.viewFrom ? Kb(a) : (e.viewFrom += d, e.viewTo += d);
        else if (b <= e.viewFrom && c >= e.viewTo) Kb(a);
        else if (b <= e.viewFrom) {
            var f = Mb(a, c, c + d, 1);
            f ? (e.view = e.view.slice(f.index), e.viewFrom = f.lineN, e.viewTo += d) : Kb(a)
        } else if (c >= e.viewTo) {
            var f = Mb(a, b, b, -1);
            f ? (e.view = e.view.slice(0, f.index), e.viewTo = f.lineN) : Kb(a)
        } else {
            var g = Mb(a, b, b, -1),
                h = Mb(a, c, c + d, 1);
            g && h ? (e.view = e.view.slice(0, g.index).concat(Hb(a, g.lineN, h.lineN)).concat(e.view.slice(h.index)), e.viewTo += d) : Kb(a)
        }
        var i = e.externalMeasured;
        i && (c < i.lineN ? i.lineN += d : b < i.lineN + i.size && (e.externalMeasured = null))
    }

    function Jb(a, b, c) {
        a.curOp.viewChanged = !0;
        var d = a.display,
            e = a.display.externalMeasured;
        if (e && b >= e.lineN && b < e.lineN + e.size && (d.externalMeasured = null), !(b < d.viewFrom || b >= d.viewTo)) {
            var f = d.view[Lb(a, b)];
            if (null != f.node) {
                var g = f.changes || (f.changes = []);
                De(g, c) == -1 && g.push(c)
            }
        }
    }

    function Kb(a) { a.display.viewFrom = a.display.viewTo = a.doc.first, a.display.view = [], a.display.viewOffset = 0 }

    function Lb(a, b) {
        if (b >= a.display.viewTo) return null;
        if (b -= a.display.viewFrom, b < 0) return null;
        for (var c = a.display.view, d = 0; d < c.length; d++)
            if (b -= c[d].size, b < 0) return d
    }

    function Mb(a, b, c, d) {
        var e, f = Lb(a, b),
            g = a.display.view;
        if (!Ef || c == a.doc.first + a.doc.size) return { index: f, lineN: c };
        for (var h = 0, i = a.display.viewFrom; h < f; h++) i += g[h].size;
        if (i != b) {
            if (d > 0) {
                if (f == g.length - 1) return null;
                e = i + g[f].size - b, f++
            } else e = i - b;
            b += e, c += e
        }
        for (; qd(a.doc, c) != c;) {
            if (f == (d < 0 ? 0 : g.length - 1)) return null;
            c += d * g[f - (d < 0 ? 1 : 0)].size, f += d
        }
        return { index: f, lineN: c }
    }

    function Nb(a, b, c) {
        var d = a.display,
            e = d.view;
        0 == e.length || b >= d.viewTo || c <= d.viewFrom ? (d.view = Hb(a, b, c), d.viewFrom = b) : (d.viewFrom > b ? d.view = Hb(a, b, d.viewFrom).concat(d.view) : d.viewFrom < b && (d.view = d.view.slice(Lb(a, b))), d.viewFrom = b, d.viewTo < c ? d.view = d.view.concat(Hb(a, d.viewTo, c)) : d.viewTo > c && (d.view = d.view.slice(0, Lb(a, c)))), d.viewTo = c
    }

    function Ob(a) {
        for (var b = a.display.view, c = 0, d = 0; d < b.length; d++) {
            var e = b[d];
            e.hidden || e.node && !e.changes || ++c
        }
        return c
    }

    function Pb(a) {
        function b() { e.activeTouch && (f = setTimeout(function() { e.activeTouch = null }, 1e3), g = e.activeTouch, g.end = +new Date) }

        function c(a) { if (1 != a.touches.length) return !1; var b = a.touches[0]; return b.radiusX <= 1 && b.radiusY <= 1 }

        function d(a, b) {
            if (null == b.left) return !0;
            var c = b.left - a.left,
                d = b.top - a.top;
            return c * c + d * d > 400
        }
        var e = a.display;
        xg(e.scroller, "mousedown", Db(a, Ub)), nf && of < 11 ? xg(e.scroller, "dblclick", Db(a, function(b) {
            if (!ve(a, b)) {
                var c = Tb(a, b);
                if (c && !Zb(a, b) && !Sb(a.display, b)) {
                    ug(b);
                    var d = a.findWordAt(c);
                    va(a.doc, d.anchor, d.head)
                }
            }
        })) : xg(e.scroller, "dblclick", function(b) { ve(a, b) || ug(b) }), Cf || xg(e.scroller, "contextmenu", function(b) { pc(a, b) });
        var f, g = { end: 0 };
        xg(e.scroller, "touchstart", function(a) {
            if (!c(a)) {
                clearTimeout(f);
                var b = +new Date;
                e.activeTouch = { start: b, moved: !1, prev: b - g.end <= 300 ? g : null }, 1 == a.touches.length && (e.activeTouch.left = a.touches[0].pageX, e.activeTouch.top = a.touches[0].pageY)
            }
        }), xg(e.scroller, "touchmove", function() { e.activeTouch && (e.activeTouch.moved = !0) }), xg(e.scroller, "touchend", function(c) {
            var f = e.activeTouch;
            if (f && !Sb(e, c) && null != f.left && !f.moved && new Date - f.start < 300) {
                var g, h = a.coordsChar(e.activeTouch, "page");
                g = !f.prev || d(f, f.prev) ? new ma(h, h) : !f.prev.prev || d(f, f.prev.prev) ? a.findWordAt(h) : new ma(Ff(h.line, 0), qa(a.doc, Ff(h.line + 1, 0))), a.setSelection(g.anchor, g.head), a.focus(), ug(c)
            }
            b()
        }), xg(e.scroller, "touchcancel", b), xg(e.scroller, "scroll", function() { e.scroller.clientHeight && (ac(a, e.scroller.scrollTop), bc(a, e.scroller.scrollLeft, !0), zg(a, "scroll", a)) }), xg(e.scroller, "mousewheel", function(b) { cc(a, b) }), xg(e.scroller, "DOMMouseScroll", function(b) { cc(a, b) }), xg(e.wrapper, "scroll", function() { e.wrapper.scrollTop = e.wrapper.scrollLeft = 0 }), e.dragFunctions = { simple: function(b) { ve(a, b) || wg(b) }, start: function(b) { _b(a, b) }, drop: Db(a, $b) };
        var h = e.input.getField();
        xg(h, "keyup", function(b) { kc.call(a, b) }), xg(h, "keydown", Db(a, ic)), xg(h, "keypress", Db(a, lc)), xg(h, "focus", Ie(nc, a)), xg(h, "blur", Ie(oc, a))
    }

    function Qb(b, c, d) {
        var e = d && d != a.Init;
        if (!c != !e) {
            var f = b.display.dragFunctions,
                g = c ? xg : yg;
            g(b.display.scroller, "dragstart", f.start), g(b.display.scroller, "dragenter", f.simple), g(b.display.scroller, "dragover", f.simple), g(b.display.scroller, "drop", f.drop)
        }
    }

    function Rb(a) {
        var b = a.display;
        b.lastWrapHeight == b.wrapper.clientHeight && b.lastWrapWidth == b.wrapper.clientWidth || (b.cachedCharWidth = b.cachedTextHeight = b.cachedPaddingH = null, b.scrollbarsClipped = !1, a.setSize())
    }

    function Sb(a, b) {
        for (var c = re(b); c != a.wrapper; c = c.parentNode)
            if (!c || 1 == c.nodeType && "true" == c.getAttribute("cm-ignore-events") || c.parentNode == a.sizer && c != a.mover) return !0
    }

    function Tb(a, b, c, d) {
        var e = a.display;
        if (!c && "true" == re(b).getAttribute("cm-not-content")) return null;
        var f, g, h = e.lineSpace.getBoundingClientRect();
        try { f = b.clientX - h.left, g = b.clientY - h.top } catch (a) { return null }
        var i, j = pb(a, f, g);
        if (d && 1 == j.xRel && (i = Vd(a.doc, j.line).text).length == j.ch) {
            var k = Gg(i, i.length, a.options.tabSize) - i.length;
            j = Ff(j.line, Math.max(0, Math.round((f - Sa(a.display).left) / sb(a.display)) - k))
        }
        return j
    }

    function Ub(a) {
        var b = this,
            c = b.display;
        if (!(c.activeTouch && c.input.supportsTouch() || ve(b, a))) {
            if (c.shift = a.shiftKey, Sb(c, a)) return void(pf || (c.scroller.draggable = !1, setTimeout(function() { c.scroller.draggable = !0 }, 100)));
            if (!Zb(b, a)) {
                var d = Tb(b, a);
                switch (window.focus(), se(a)) {
                    case 1:
                        d ? Vb(b, a, d) : re(a) == c.scroller && ug(a);
                        break;
                    case 2:
                        pf && (b.state.lastMiddleDown = +new Date), d && va(b.doc, d), setTimeout(function() { c.input.focus() }, 20), ug(a);
                        break;
                    case 3:
                        Cf ? pc(b, a) : mc(b)
                }
            }
        }
    }

    function Vb(a, b, c) {
        nf ? setTimeout(Ie(Y, a), 0) : a.curOp.focus = Pe();
        var d, e = +new Date;
        Kf && Kf.time > e - 400 && 0 == Gf(Kf.pos, c) ? d = "triple" : Jf && Jf.time > e - 400 && 0 == Gf(Jf.pos, c) ? (d = "double", Kf = { time: e, pos: c }) : (d = "single", Jf = { time: e, pos: c });
        var f, g = a.doc.sel,
            h = yf ? b.metaKey : b.ctrlKey;
        a.options.dragDrop && Tg && !Z(a) && "single" == d && (f = g.contains(c)) > -1 && (Gf((f = g.ranges[f]).from(), c) < 0 || c.xRel > 0) && (Gf(f.to(), c) > 0 || c.xRel < 0) ? Wb(a, b, c, h) : Xb(a, b, c, d, h)
    }

    function Wb(a, b, c, d) {
        var e = a.display,
            f = +new Date,
            g = Db(a, function(h) { pf && (e.scroller.draggable = !1), a.state.draggingText = !1, yg(document, "mouseup", g), yg(e.scroller, "drop", g), Math.abs(b.clientX - h.clientX) + Math.abs(b.clientY - h.clientY) < 10 && (ug(h), !d && +new Date - 200 < f && va(a.doc, c), pf || nf && 9 == of ? setTimeout(function() { document.body.focus(), e.input.focus() }, 20) : e.input.focus()) });
        pf && (e.scroller.draggable = !0), a.state.draggingText = g, e.scroller.dragDrop && e.scroller.dragDrop(), xg(document, "mouseup", g), xg(e.scroller, "drop", g)
    }

    function Xb(a, b, c, d, e) {
        function f(b) {
            if (0 != Gf(q, b))
                if (q = b, "rect" == d) {
                    for (var e = [], f = a.options.tabSize, g = Gg(Vd(j, c.line).text, c.ch, f), h = Gg(Vd(j, b.line).text, b.ch, f), i = Math.min(g, h), n = Math.max(g, h), o = Math.min(c.line, b.line), p = Math.min(a.lastLine(), Math.max(c.line, b.line)); o <= p; o++) {
                        var r = Vd(j, o).text,
                            s = Ae(r, i, f);
                        i == n ? e.push(new ma(Ff(o, s), Ff(o, s))) : r.length > s && e.push(new ma(Ff(o, s), Ff(o, Ae(r, n, f))))
                    }
                    e.length || e.push(new ma(c, c)), Ba(j, na(m.ranges.slice(0, l).concat(e), l), { origin: "*mouse", scroll: !1 }), a.scrollIntoView(b)
                } else {
                    var t = k,
                        u = t.anchor,
                        v = b;
                    if ("single" != d) {
                        if ("double" == d) var w = a.findWordAt(b);
                        else var w = new ma(Ff(b.line, 0), qa(j, Ff(b.line + 1, 0)));
                        Gf(w.anchor, u) > 0 ? (v = w.head, u = X(t.from(), w.anchor)) : (v = w.anchor, u = W(t.to(), w.head))
                    }
                    var e = m.ranges.slice(0);
                    e[l] = new ma(qa(j, u), v), Ba(j, na(e, l), Eg)
                }
        }

        function g(b) {
            var c = ++s,
                e = Tb(a, b, !0, "rect" == d);
            if (e)
                if (0 != Gf(e, q)) {
                    a.curOp.focus = Pe(), f(e);
                    var h = u(i, j);
                    (e.line >= h.to || e.line < h.from) && setTimeout(Db(a, function() { s == c && g(b) }), 150)
                } else {
                    var k = b.clientY < r.top ? -20 : b.clientY > r.bottom ? 20 : 0;
                    k && setTimeout(Db(a, function() { s == c && (i.scroller.scrollTop += k, g(b)) }), 50)
                }
        }

        function h(a) { s = 1 / 0, ug(a), i.input.focus(), yg(document, "mousemove", t), yg(document, "mouseup", v), j.history.lastSelOrigin = null }
        var i = a.display,
            j = a.doc;
        ug(b);
        var k, l, m = j.sel,
            n = m.ranges;
        if (e && !b.shiftKey ? (l = j.sel.contains(c), k = l > -1 ? n[l] : new ma(c, c)) : (k = j.sel.primary(), l = j.sel.primIndex), b.altKey) d = "rect", e || (k = new ma(c, c)), c = Tb(a, b, !0, !0), l = -1;
        else if ("double" == d) {
            var o = a.findWordAt(c);
            k = a.display.shift || j.extend ? ua(j, k, o.anchor, o.head) : o
        } else if ("triple" == d) {
            var p = new ma(Ff(c.line, 0), qa(j, Ff(c.line + 1, 0)));
            k = a.display.shift || j.extend ? ua(j, k, p.anchor, p.head) : p
        } else k = ua(j, k, c);
        e ? l == -1 ? (l = n.length, Ba(j, na(n.concat([k]), l), { scroll: !1, origin: "*mouse" })) : n.length > 1 && n[l].empty() && "single" == d && !b.shiftKey ? (Ba(j, na(n.slice(0, l).concat(n.slice(l + 1)), 0)), m = j.sel) : xa(j, l, k, Eg) : (l = 0, Ba(j, new la([k], 0), Eg), m = j.sel);
        var q = c,
            r = i.wrapper.getBoundingClientRect(),
            s = 0,
            t = Db(a, function(a) { se(a) ? g(a) : h(a) }),
            v = Db(a, h);
        xg(document, "mousemove", t), xg(document, "mouseup", v)
    }

    function Yb(a, b, c, d, e) {
        try {
            var f = b.clientX,
                g = b.clientY
        } catch (a) { return !1 }
        if (f >= Math.floor(a.display.gutters.getBoundingClientRect().right)) return !1;
        d && ug(b);
        var h = a.display,
            i = h.lineDiv.getBoundingClientRect();
        if (g > i.bottom || !xe(a, c)) return qe(b);
        g -= i.top - h.viewOffset;
        for (var j = 0; j < a.options.gutters.length; ++j) {
            var k = h.gutters.childNodes[j];
            if (k && k.getBoundingClientRect().right >= f) {
                var l = $d(a.doc, g),
                    m = a.options.gutters[j];
                return e(a, c, a, l, m, b), qe(b)
            }
        }
    }

    function Zb(a, b) { return Yb(a, b, "gutterClick", !0, te) }

    function $b(a) {
        var b = this;
        if (!ve(b, a) && !Sb(b.display, a)) {
            ug(a), nf && (Of = +new Date);
            var c = Tb(b, a, !0),
                d = a.dataTransfer.files;
            if (c && !Z(b))
                if (d && d.length && window.FileReader && window.File)
                    for (var e = d.length, f = Array(e), g = 0, h = function(a, d) {
                            var h = new FileReader;
                            h.onload = Db(b, function() {
                                if (f[d] = h.result, ++g == e) {
                                    c = qa(b.doc, c);
                                    var a = { from: c, to: c, text: Ug(f.join("\n")), origin: "paste" };
                                    wc(b.doc, a), Aa(b.doc, oa(c, Uf(a)))
                                }
                            }), h.readAsText(a)
                        }, i = 0; i < e; ++i) h(d[i], i);
                else {
                    if (b.state.draggingText && b.doc.sel.contains(c) > -1) return b.state.draggingText(a), void setTimeout(function() { b.display.input.focus() }, 20);
                    try {
                        var f = a.dataTransfer.getData("Text");
                        if (f) {
                            if (b.state.draggingText && !(yf ? a.altKey : a.ctrlKey)) var j = b.listSelections();
                            if (Ca(b.doc, oa(c, c)), j)
                                for (var i = 0; i < j.length; ++i) Cc(b.doc, "", j[i].anchor, j[i].head, "drag");
                            b.replaceSelection(f, "around", "paste"), b.display.input.focus()
                        }
                    } catch (a) {}
                }
        }
    }

    function _b(a, b) {
        if (nf && (!a.state.draggingText || +new Date - Of < 100)) return void wg(b);
        if (!ve(a, b) && !Sb(a.display, b) && (b.dataTransfer.setData("Text", a.getSelection()), b.dataTransfer.setDragImage && !tf)) {
            var c = Me("img", null, null, "position: fixed; left: 0; top: 0;");
            c.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", sf && (c.width = c.height = 1, a.display.wrapper.appendChild(c), c._top = c.offsetTop), b.dataTransfer.setDragImage(c, 0, 0), sf && c.parentNode.removeChild(c)
        }
    }

    function ac(a, b) { Math.abs(a.doc.scrollTop - b) < 2 || (a.doc.scrollTop = b, kf || D(a, { top: b }), a.display.scroller.scrollTop != b && (a.display.scroller.scrollTop = b), a.display.scrollbars.setScrollTop(b), kf && D(a), Ma(a, 100)) }

    function bc(a, b, c) {
        (c ? b == a.doc.scrollLeft : Math.abs(a.doc.scrollLeft - b) < 2) || (b = Math.min(b, a.display.scroller.scrollWidth - a.display.scroller.clientWidth), a.doc.scrollLeft = b, v(a), a.display.scroller.scrollLeft != b && (a.display.scroller.scrollLeft = b), a.display.scrollbars.setScrollLeft(b))
    }

    function cc(a, b) {
        var c = Rf(b),
            d = c.x,
            e = c.y,
            f = a.display,
            g = f.scroller;
        if (d && g.scrollWidth > g.clientWidth || e && g.scrollHeight > g.clientHeight) {
            if (e && yf && pf) a: for (var h = b.target, i = f.view; h != g; h = h.parentNode)
                for (var j = 0; j < i.length; j++)
                    if (i[j].node == h) { a.display.currentWheelTarget = h; break a }
            if (d && !kf && !sf && null != Qf) return e && ac(a, Math.max(0, Math.min(g.scrollTop + e * Qf, g.scrollHeight - g.clientHeight))), bc(a, Math.max(0, Math.min(g.scrollLeft + d * Qf, g.scrollWidth - g.clientWidth))), ug(b), void(f.wheelStartX = null);
            if (e && null != Qf) {
                var k = e * Qf,
                    l = a.doc.scrollTop,
                    m = l + f.wrapper.clientHeight;
                k < 0 ? l = Math.max(0, l + k - 50) : m = Math.min(a.doc.height, m + k + 50), D(a, { top: l, bottom: m })
            }
            Pf < 20 && (null == f.wheelStartX ? (f.wheelStartX = g.scrollLeft, f.wheelStartY = g.scrollTop, f.wheelDX = d, f.wheelDY = e, setTimeout(function() {
                if (null != f.wheelStartX) {
                    var a = g.scrollLeft - f.wheelStartX,
                        b = g.scrollTop - f.wheelStartY,
                        c = b && f.wheelDY && b / f.wheelDY || a && f.wheelDX && a / f.wheelDX;
                    f.wheelStartX = f.wheelStartY = null, c && (Qf = (Qf * Pf + c) / (Pf + 1), ++Pf)
                }
            }, 200)) : (f.wheelDX += d, f.wheelDY += e))
        }
    }

    function dc(a, b, c) {
        if ("string" == typeof b && (b = dg[b], !b)) return !1;
        a.display.input.ensurePolled();
        var d = a.display.shift,
            e = !1;
        try { Z(a) && (a.state.suppressEdits = !0), c && (a.display.shift = !1), e = b(a) != Cg } finally { a.display.shift = d, a.state.suppressEdits = !1 }
        return e
    }

    function ec(a, b, c) { for (var d = 0; d < a.state.keyMaps.length; d++) { var e = fg(b, a.state.keyMaps[d], c, a); if (e) return e } return a.options.extraKeys && fg(b, a.options.extraKeys, c, a) || fg(b, a.options.keyMap, c, a) }

    function fc(a, b, c, d) {
        var e = a.state.keySeq;
        if (e) {
            if (gg(b)) return "handled";
            Sf.set(50, function() { a.state.keySeq == e && (a.state.keySeq = null, a.display.input.reset()) }), b = e + " " + b
        }
        var f = ec(a, b, d);
        return "multi" == f && (a.state.keySeq = b), "handled" == f && te(a, "keyHandled", a, b, c), "handled" != f && "multi" != f || (ug(c), La(a)), e && !f && /\'$/.test(b) ? (ug(c), !0) : !!f
    }

    function gc(a, b) { var c = hg(b, !0); return !!c && (b.shiftKey && !a.state.keySeq ? fc(a, "Shift-" + c, b, function(b) { return dc(a, b, !0) }) || fc(a, c, b, function(b) { if ("string" == typeof b ? /^go[A-Z]/.test(b) : b.motion) return dc(a, b) }) : fc(a, c, b, function(b) { return dc(a, b) })) }

    function hc(a, b, c) { return fc(a, "'" + c + "'", b, function(b) { return dc(a, b, !0) }) }

    function ic(a) {
        var b = this;
        if (b.curOp.focus = Pe(), !ve(b, a)) {
            nf && of < 11 && 27 == a.keyCode && (a.returnValue = !1);
            var c = a.keyCode;
            b.display.shift = 16 == c || a.shiftKey;
            var d = gc(b, a);
            sf && (Tf = d ? c : null, !d && 88 == c && !Wg && (yf ? a.metaKey : a.ctrlKey) && b.replaceSelection("", null, "cut")), 18 != c || /\bCodeMirror-crosshair\b/.test(b.display.lineDiv.className) || jc(b)
        }
    }

    function jc(a) {
        function b(a) { 18 != a.keyCode && a.altKey || (Qg(c, "CodeMirror-crosshair"), yg(document, "keyup", b), yg(document, "mouseover", b)) }
        var c = a.display.lineDiv;
        Rg(c, "CodeMirror-crosshair"), xg(document, "keyup", b), xg(document, "mouseover", b)
    }

    function kc(a) { 16 == a.keyCode && (this.doc.sel.shift = !1), ve(this, a) }

    function lc(a) {
        var b = this;
        if (!(Sb(b.display, a) || ve(b, a) || a.ctrlKey && !a.altKey || yf && a.metaKey)) {
            var c = a.keyCode,
                d = a.charCode;
            if (sf && c == Tf) return Tf = null, void ug(a);
            if (!sf || a.which && !(a.which < 10) || !gc(b, a)) {
                var e = String.fromCharCode(null == d ? c : d);
                hc(b, a, e) || b.display.input.onKeyPress(a)
            }
        }
    }

    function mc(a) { a.state.delayingBlurEvent = !0, setTimeout(function() { a.state.delayingBlurEvent && (a.state.delayingBlurEvent = !1, oc(a)) }, 100) }

    function nc(a) { a.state.delayingBlurEvent && (a.state.delayingBlurEvent = !1), "nocursor" != a.options.readOnly && (a.state.focused || (zg(a, "focus", a), a.state.focused = !0, Rg(a.display.wrapper, "CodeMirror-focused"), a.curOp || a.display.selForContextMenu == a.doc.sel || (a.display.input.reset(), pf && setTimeout(function() { a.display.input.reset(!0) }, 20)), a.display.input.receivedFocus()), La(a)) }

    function oc(a) { a.state.delayingBlurEvent || (a.state.focused && (zg(a, "blur", a), a.state.focused = !1, Qg(a.display.wrapper, "CodeMirror-focused")), clearInterval(a.display.blinker), setTimeout(function() { a.state.focused || (a.display.shift = !1) }, 150)) }

    function pc(a, b) { Sb(a.display, b) || qc(a, b) || a.display.input.onContextMenu(b) }

    function qc(a, b) { return !!xe(a, "gutterContextMenu") && Yb(a, b, "gutterContextMenu", !1, zg) }

    function rc(a, b) {
        if (Gf(a, b.from) < 0) return a;
        if (Gf(a, b.to) <= 0) return Uf(b);
        var c = a.line + b.text.length - (b.to.line - b.from.line) - 1,
            d = a.ch;
        return a.line == b.to.line && (d += Uf(b).ch - b.to.ch), Ff(c, d)
    }

    function sc(a, b) {
        for (var c = [], d = 0; d < a.sel.ranges.length; d++) {
            var e = a.sel.ranges[d];
            c.push(new ma(rc(e.anchor, b), rc(e.head, b)))
        }
        return na(c, a.sel.primIndex)
    }

    function tc(a, b, c) { return a.line == b.line ? Ff(c.line, a.ch - b.ch + c.ch) : Ff(c.line + (a.line - b.line), a.ch) }

    function uc(a, b, c) {
        for (var d = [], e = Ff(a.first, 0), f = e, g = 0; g < b.length; g++) {
            var h = b[g],
                i = tc(h.from, e, f),
                j = tc(Uf(h), e, f);
            if (e = h.to, f = j, "around" == c) {
                var k = a.sel.ranges[g],
                    l = Gf(k.head, k.anchor) < 0;
                d[g] = new ma(l ? j : i, l ? i : j)
            } else d[g] = new ma(i, i)
        }
        return new la(d, a.sel.primIndex)
    }

    function vc(a, b, c) { var d = { canceled: !1, from: b.from, to: b.to, text: b.text, origin: b.origin, cancel: function() { this.canceled = !0 } }; return c && (d.update = function(b, c, d, e) { b && (this.from = qa(a, b)), c && (this.to = qa(a, c)), d && (this.text = d), void 0 !== e && (this.origin = e) }), zg(a, "beforeChange", a, d), a.cm && zg(a.cm, "beforeChange", a.cm, d), d.canceled ? null : { from: d.from, to: d.to, text: d.text, origin: d.origin } }

    function wc(a, b, c) {
        if (a.cm) { if (!a.cm.curOp) return Db(a.cm, wc)(a, b, c); if (a.cm.state.suppressEdits) return }
        if (!(xe(a, "beforeChange") || a.cm && xe(a.cm, "beforeChange")) || (b = vc(a, b, !0))) {
            var d = Df && !c && ed(a, b.from, b.to);
            if (d)
                for (var e = d.length - 1; e >= 0; --e) xc(a, { from: d[e].from, to: d[e].to, text: e ? [""] : b.text });
            else xc(a, b)
        }
    }

    function xc(a, b) {
        if (1 != b.text.length || "" != b.text[0] || 0 != Gf(b.from, b.to)) {
            var c = sc(a, b);
            fe(a, b, c, a.cm ? a.cm.curOp.id : NaN), Ac(a, b, c, bd(a, b));
            var d = [];
            Td(a, function(a, c) { c || De(d, a.history) != -1 || (pe(a.history, b), d.push(a.history)), Ac(a, b, null, bd(a, b)) })
        }
    }

    function yc(a, b, c) {
        if (!a.cm || !a.cm.state.suppressEdits) {
            for (var d, e = a.history, f = a.sel, g = "undo" == b ? e.done : e.undone, h = "undo" == b ? e.undone : e.done, i = 0; i < g.length && (d = g[i], c ? !d.ranges || d.equals(a.sel) : d.ranges); i++);
            if (i != g.length) {
                for (e.lastOrigin = e.lastSelOrigin = null; d = g.pop(), d.ranges;) {
                    if (ie(d, h), c && !d.equals(a.sel)) return void Ba(a, d, { clearRedo: !1 });
                    f = d
                }
                var j = [];
                ie(f, h), h.push({ changes: j, generation: e.generation }), e.generation = d.generation || ++e.maxGeneration;
                for (var k = xe(a, "beforeChange") || a.cm && xe(a.cm, "beforeChange"), i = d.changes.length - 1; i >= 0; --i) {
                    var l = d.changes[i];
                    if (l.origin = b, k && !vc(a, l, !1)) return void(g.length = 0);
                    j.push(ce(a, l));
                    var m = i ? sc(a, l) : Ce(g);
                    Ac(a, l, m, dd(a, l)), !i && a.cm && a.cm.scrollIntoView({ from: l.from, to: Uf(l) });
                    var n = [];
                    Td(a, function(a, b) { b || De(n, a.history) != -1 || (pe(a.history, l), n.push(a.history)), Ac(a, l, null, dd(a, l)) })
                }
            }
        }
    }

    function zc(a, b) { if (0 != b && (a.first += b, a.sel = new la(Ee(a.sel.ranges, function(a) { return new ma(Ff(a.anchor.line + b, a.anchor.ch), Ff(a.head.line + b, a.head.ch)) }), a.sel.primIndex), a.cm)) { Ib(a.cm, a.first, a.first - b, b); for (var c = a.cm.display, d = c.viewFrom; d < c.viewTo; d++) Jb(a.cm, d, "gutter") } }

    function Ac(a, b, c, d) {
        if (a.cm && !a.cm.curOp) return Db(a.cm, Ac)(a, b, c, d);
        if (b.to.line < a.first) return void zc(a, b.text.length - 1 - (b.to.line - b.from.line));
        if (!(b.from.line > a.lastLine())) {
            if (b.from.line < a.first) {
                var e = b.text.length - 1 - (a.first - b.from.line);
                zc(a, e), b = { from: Ff(a.first, 0), to: Ff(b.to.line + e, b.to.ch), text: [Ce(b.text)], origin: b.origin }
            }
            var f = a.lastLine();
            b.to.line > f && (b = { from: b.from, to: Ff(f, Vd(a, f).text.length), text: [b.text[0]], origin: b.origin }), b.removed = Wd(a, b.from, b.to), c || (c = sc(a, b)), a.cm ? Bc(a.cm, b, d) : Qd(a, b, d), Ca(a, c, Dg)
        }
    }

    function Bc(a, b, c) {
        var d = a.doc,
            e = a.display,
            g = b.from,
            h = b.to,
            i = !1,
            j = g.line;
        a.options.lineWrapping || (j = Zd(od(Vd(d, g.line))), d.iter(j, h.line + 1, function(a) { if (a == e.maxLine) return i = !0, !0 })), d.sel.contains(b.from, b.to) > -1 && we(a), Qd(d, b, c, f(a)), a.options.lineWrapping || (d.iter(j, g.line + b.text.length, function(a) {
            var b = l(a);
            b > e.maxLineLength && (e.maxLine = a, e.maxLineLength = b, e.maxLineChanged = !0, i = !1)
        }), i && (a.curOp.updateMaxLine = !0)), d.frontier = Math.min(d.frontier, g.line), Ma(a, 400);
        var k = b.text.length - (h.line - g.line) - 1;
        b.full ? Ib(a) : g.line != h.line || 1 != b.text.length || Pd(a.doc, b) ? Ib(a, g.line, h.line + 1, k) : Jb(a, g.line, "text");
        var m = xe(a, "changes"),
            n = xe(a, "change");
        if (n || m) {
            var o = { from: g, to: h, text: b.text, removed: b.removed, origin: b.origin };
            n && te(a, "change", a, o), m && (a.curOp.changeObjs || (a.curOp.changeObjs = [])).push(o)
        }
        a.display.selForContextMenu = null
    }

    function Cc(a, b, c, d, e) {
        if (d || (d = c), Gf(d, c) < 0) {
            var f = d;
            d = c, c = f
        }
        "string" == typeof b && (b = Ug(b)), wc(a, { from: c, to: d, text: b, origin: e })
    }

    function Dc(a, b) {
        if (!ve(a, "scrollCursorIntoView")) {
            var c = a.display,
                d = c.sizer.getBoundingClientRect(),
                e = null;
            if (b.top + d.top < 0 ? e = !0 : b.bottom + d.top > (window.innerHeight || document.documentElement.clientHeight) && (e = !1), null != e && !vf) {
                var f = Me("div", "​", null, "position: absolute; top: " + (b.top - c.viewOffset - Qa(a.display)) + "px; height: " + (b.bottom - b.top + Ta(a) + c.barHeight) + "px; left: " + b.left + "px; width: 2px;");
                a.display.lineSpace.appendChild(f), f.scrollIntoView(e), a.display.lineSpace.removeChild(f)
            }
        }
    }

    function Ec(a, b, c, d) {
        null == d && (d = 0);
        for (var e = 0; e < 5; e++) {
            var f = !1,
                g = mb(a, b),
                h = c && c != b ? mb(a, c) : g,
                i = Gc(a, Math.min(g.left, h.left), Math.min(g.top, h.top) - d, Math.max(g.left, h.left), Math.max(g.bottom, h.bottom) + d),
                j = a.doc.scrollTop,
                k = a.doc.scrollLeft;
            if (null != i.scrollTop && (ac(a, i.scrollTop), Math.abs(a.doc.scrollTop - j) > 1 && (f = !0)), null != i.scrollLeft && (bc(a, i.scrollLeft), Math.abs(a.doc.scrollLeft - k) > 1 && (f = !0)), !f) break
        }
        return g
    }

    function Fc(a, b, c, d, e) {
        var f = Gc(a, b, c, d, e);
        null != f.scrollTop && ac(a, f.scrollTop), null != f.scrollLeft && bc(a, f.scrollLeft)
    }

    function Gc(a, b, c, d, e) {
        var f = a.display,
            g = rb(a.display);
        c < 0 && (c = 0);
        var h = a.curOp && null != a.curOp.scrollTop ? a.curOp.scrollTop : f.scroller.scrollTop,
            i = Va(a),
            j = {};
        e - c > i && (e = c + i);
        var k = a.doc.height + Ra(f),
            l = c < g,
            m = e > k - g;
        if (c < h) j.scrollTop = l ? 0 : c;
        else if (e > h + i) {
            var n = Math.min(c, (m ? k : e) - i);
            n != h && (j.scrollTop = n)
        }
        var o = a.curOp && null != a.curOp.scrollLeft ? a.curOp.scrollLeft : f.scroller.scrollLeft,
            p = Ua(a) - (a.options.fixedGutter ? f.gutters.offsetWidth : 0),
            q = d - b > p;
        return q && (d = b + p), b < 10 ? j.scrollLeft = 0 : b < o ? j.scrollLeft = Math.max(0, b - (q ? 0 : 10)) : d > p + o - 3 && (j.scrollLeft = d + (q ? 0 : 10) - p), j
    }

    function Hc(a, b, c) { null == b && null == c || Jc(a), null != b && (a.curOp.scrollLeft = (null == a.curOp.scrollLeft ? a.doc.scrollLeft : a.curOp.scrollLeft) + b), null != c && (a.curOp.scrollTop = (null == a.curOp.scrollTop ? a.doc.scrollTop : a.curOp.scrollTop) + c) }

    function Ic(a) {
        Jc(a);
        var b = a.getCursor(),
            c = b,
            d = b;
        a.options.lineWrapping || (c = b.ch ? Ff(b.line, b.ch - 1) : b, d = Ff(b.line, b.ch + 1)), a.curOp.scrollToPos = { from: c, to: d, margin: a.options.cursorScrollMargin, isCursor: !0 }
    }

    function Jc(a) {
        var b = a.curOp.scrollToPos;
        if (b) {
            a.curOp.scrollToPos = null;
            var c = nb(a, b.from),
                d = nb(a, b.to),
                e = Gc(a, Math.min(c.left, d.left), Math.min(c.top, d.top) - b.margin, Math.max(c.right, d.right), Math.max(c.bottom, d.bottom) + b.margin);
            a.scrollTo(e.scrollLeft, e.scrollTop)
        }
    }

    function Kc(a, b, c, d) {
        var e, f = a.doc;
        null == c && (c = "add"), "smart" == c && (f.mode.indent ? e = Pa(a, b) : c = "prev");
        var g = a.options.tabSize,
            h = Vd(f, b),
            i = Gg(h.text, null, g);
        h.stateAfter && (h.stateAfter = null);
        var j, k = h.text.match(/^\s*/)[0];
        if (d || /\S/.test(h.text)) {
            if ("smart" == c && (j = f.mode.indent(e, h.text.slice(k.length), h.text), j == Cg || j > 150)) {
                if (!d) return;
                c = "prev"
            }
        } else j = 0, c = "not";
        "prev" == c ? j = b > f.first ? Gg(Vd(f, b - 1).text, null, g) : 0 : "add" == c ? j = i + a.options.indentUnit : "subtract" == c ? j = i - a.options.indentUnit : "number" == typeof c && (j = i + c), j = Math.max(0, j);
        var l = "",
            m = 0;
        if (a.options.indentWithTabs)
            for (var n = Math.floor(j / g); n; --n) m += g, l += "\t";
        if (m < j && (l += Be(j - m)), l != k) return Cc(f, l, Ff(b, 0), Ff(b, k.length), "+input"), h.stateAfter = null, !0;
        for (var n = 0; n < f.sel.ranges.length; n++) {
            var o = f.sel.ranges[n];
            if (o.head.line == b && o.head.ch < k.length) {
                var m = Ff(b, k.length);
                xa(f, n, new ma(m, m));
                break
            }
        }
    }

    function Lc(a, b, c, d) {
        var e = b,
            f = b;
        return "number" == typeof b ? f = Vd(a, pa(a, b)) : e = Zd(b), null == e ? null : (d(f, e) && a.cm && Jb(a.cm, e, c), f)
    }

    function Mc(a, b) {
        for (var c = a.doc.sel.ranges, d = [], e = 0; e < c.length; e++) {
            for (var f = b(c[e]); d.length && Gf(f.from, Ce(d).to) <= 0;) { var g = d.pop(); if (Gf(g.from, f.from) < 0) { f.from = g.from; break } }
            d.push(f)
        }
        Cb(a, function() {
            for (var b = d.length - 1; b >= 0; b--) Cc(a.doc, "", d[b].from, d[b].to, "+delete");
            Ic(a)
        })
    }

    function Nc(a, b, c, d, e) {
        function f() { var b = h + c; return b < a.first || b >= a.first + a.size ? l = !1 : (h = b, k = Vd(a, b)) }

        function g(a) {
            var b = (e ? hf : jf)(k, i, c, !0);
            if (null == b) {
                if (a || !f()) return l = !1;
                i = e ? (c < 0 ? af : _e)(k) : c < 0 ? k.text.length : 0
            } else i = b;
            return !0
        }
        var h = b.line,
            i = b.ch,
            j = c,
            k = Vd(a, h),
            l = !0;
        if ("char" == d) g();
        else if ("column" == d) g(!0);
        else if ("word" == d || "group" == d)
            for (var m = null, n = "group" == d, o = a.cm && a.cm.getHelper(b, "wordChars"), p = !0; !(c < 0) || g(!p); p = !1) {
                var q = k.text.charAt(i) || "\n",
                    r = Je(q, o) ? "w" : n && "\n" == q ? "n" : !n || /\s/.test(q) ? null : "p";
                if (!n || p || r || (r = "s"), m && m != r) { c < 0 && (c = 1, g()); break }
                if (r && (m = r), c > 0 && !g(!p)) break
            }
        var s = Ga(a, Ff(h, i), j, !0);
        return l || (s.hitSide = !0), s
    }

    function Oc(a, b, c, d) {
        var e, f = a.doc,
            g = b.left;
        if ("page" == d) {
            var h = Math.min(a.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
            e = b.top + c * (h - (c < 0 ? 1.5 : .5) * rb(a.display))
        } else "line" == d && (e = c > 0 ? b.bottom + 3 : b.top - 3);
        for (;;) {
            var i = pb(a, g, e);
            if (!i.outside) break;
            if (c < 0 ? e <= 0 : e >= f.height) { i.hitSide = !0; break }
            e += 5 * c
        }
        return i
    }

    function Pc(b, c, d, e) { a.defaults[b] = c, d && (Wf[b] = e ? function(a, b, c) { c != Xf && d(a, b, c) } : d) }

    function Qc(a) {
        for (var b, c, d, e, f = a.split(/-(?!$)/), a = f[f.length - 1], g = 0; g < f.length - 1; g++) {
            var h = f[g];
            if (/^(cmd|meta|m)$/i.test(h)) e = !0;
            else if (/^a(lt)?$/i.test(h)) b = !0;
            else if (/^(c|ctrl|control)$/i.test(h)) c = !0;
            else {
                if (!/^s(hift)$/i.test(h)) throw new Error("Unrecognized modifier name: " + h);
                d = !0
            }
        }
        return b && (a = "Alt-" + a), c && (a = "Ctrl-" + a), e && (a = "Cmd-" + a), d && (a = "Shift-" + a), a
    }

    function Rc(a) { return "string" == typeof a ? eg[a] : a }

    function Sc(a, b, c, d, e) {
        if (d && d.shared) return Tc(a, b, c, d, e);
        if (a.cm && !a.cm.curOp) return Db(a.cm, Sc)(a, b, c, d, e);
        var f = new kg(a, e),
            g = Gf(b, c);
        if (d && He(d, f, !1), g > 0 || 0 == g && f.clearWhenEmpty !== !1) return f;
        if (f.replacedWith && (f.collapsed = !0, f.widgetNode = Me("span", [f.replacedWith], "CodeMirror-widget"), d.handleMouseEvents || f.widgetNode.setAttribute("cm-ignore-events", "true"), d.insertLeft && (f.widgetNode.insertLeft = !0)), f.collapsed) {
            if (nd(a, b.line, b, c, f) || b.line != c.line && nd(a, c.line, b, c, f)) throw new Error("Inserting collapsed marker partially overlapping an existing one");
            Ef = !0
        }
        f.addToHistory && fe(a, { from: b, to: c, origin: "markText" }, a.sel, NaN);
        var h, i = b.line,
            j = a.cm;
        if (a.iter(i, c.line + 1, function(a) { j && f.collapsed && !j.options.lineWrapping && od(a) == j.display.maxLine && (h = !0), f.collapsed && i != b.line && Yd(a, 0), $c(a, new Xc(f, i == b.line ? b.ch : null, i == c.line ? c.ch : null)), ++i }), f.collapsed && a.iter(b.line, c.line + 1, function(b) { sd(a, b) && Yd(b, 0) }), f.clearOnEnter && xg(f, "beforeCursorEnter", function() { f.clear() }), f.readOnly && (Df = !0, (a.history.done.length || a.history.undone.length) && a.clearHistory()), f.collapsed && (f.id = ++jg, f.atomic = !0), j) {
            if (h && (j.curOp.updateMaxLine = !0), f.collapsed) Ib(j, b.line, c.line + 1);
            else if (f.className || f.title || f.startStyle || f.endStyle || f.css)
                for (var k = b.line; k <= c.line; k++) Jb(j, k, "text");
            f.atomic && Ea(j.doc), te(j, "markerAdded", j, f)
        }
        return f
    }

    function Tc(a, b, c, d, e) {
        d = He(d), d.shared = !1;
        var f = [Sc(a, b, c, d, e)],
            g = f[0],
            h = d.widgetNode;
        return Td(a, function(a) {
            h && (d.widgetNode = h.cloneNode(!0)), f.push(Sc(a, qa(a, b), qa(a, c), d, e));
            for (var i = 0; i < a.linked.length; ++i)
                if (a.linked[i].isParent) return;
            g = Ce(f)
        }), new lg(f, g)
    }

    function Uc(a) { return a.findMarks(Ff(a.first, 0), a.clipPos(Ff(a.lastLine())), function(a) { return a.parent }) }

    function Vc(a, b) {
        for (var c = 0; c < b.length; c++) {
            var d = b[c],
                e = d.find(),
                f = a.clipPos(e.from),
                g = a.clipPos(e.to);
            if (Gf(f, g)) {
                var h = Sc(a, f, g, d.primary, d.primary.type);
                d.markers.push(h), h.parent = d
            }
        }
    }

    function Wc(a) {
        for (var b = 0; b < a.length; b++) {
            var c = a[b],
                d = [c.primary.doc];
            Td(c.primary.doc, function(a) { d.push(a) });
            for (var e = 0; e < c.markers.length; e++) {
                var f = c.markers[e];
                De(d, f.doc) == -1 && (f.parent = null, c.markers.splice(e--, 1))
            }
        }
    }

    function Xc(a, b, c) { this.marker = a, this.from = b, this.to = c }

    function Yc(a, b) {
        if (a)
            for (var c = 0; c < a.length; ++c) { var d = a[c]; if (d.marker == b) return d }
    }

    function Zc(a, b) { for (var c, d = 0; d < a.length; ++d) a[d] != b && (c || (c = [])).push(a[d]); return c }

    function $c(a, b) { a.markedSpans = a.markedSpans ? a.markedSpans.concat([b]) : [b], b.marker.attachLine(a) }

    function _c(a, b, c) {
        if (a)
            for (var d, e = 0; e < a.length; ++e) {
                var f = a[e],
                    g = f.marker,
                    h = null == f.from || (g.inclusiveLeft ? f.from <= b : f.from < b);
                if (h || f.from == b && "bookmark" == g.type && (!c || !f.marker.insertLeft)) {
                    var i = null == f.to || (g.inclusiveRight ? f.to >= b : f.to > b);
                    (d || (d = [])).push(new Xc(g, f.from, i ? null : f.to))
                }
            }
        return d
    }

    function ad(a, b, c) {
        if (a)
            for (var d, e = 0; e < a.length; ++e) {
                var f = a[e],
                    g = f.marker,
                    h = null == f.to || (g.inclusiveRight ? f.to >= b : f.to > b);
                if (h || f.from == b && "bookmark" == g.type && (!c || f.marker.insertLeft)) {
                    var i = null == f.from || (g.inclusiveLeft ? f.from <= b : f.from < b);
                    (d || (d = [])).push(new Xc(g, i ? null : f.from - b, null == f.to ? null : f.to - b))
                }
            }
        return d
    }

    function bd(a, b) {
        if (b.full) return null;
        var c = sa(a, b.from.line) && Vd(a, b.from.line).markedSpans,
            d = sa(a, b.to.line) && Vd(a, b.to.line).markedSpans;
        if (!c && !d) return null;
        var e = b.from.ch,
            f = b.to.ch,
            g = 0 == Gf(b.from, b.to),
            h = _c(c, e, g),
            i = ad(d, f, g),
            j = 1 == b.text.length,
            k = Ce(b.text).length + (j ? e : 0);
        if (h)
            for (var l = 0; l < h.length; ++l) {
                var m = h[l];
                if (null == m.to) {
                    var n = Yc(i, m.marker);
                    n ? j && (m.to = null == n.to ? null : n.to + k) : m.to = e
                }
            }
        if (i)
            for (var l = 0; l < i.length; ++l) {
                var m = i[l];
                if (null != m.to && (m.to += k), null == m.from) {
                    var n = Yc(h, m.marker);
                    n || (m.from = k, j && (h || (h = [])).push(m))
                } else m.from += k, j && (h || (h = [])).push(m)
            }
        h && (h = cd(h)), i && i != h && (i = cd(i));
        var o = [h];
        if (!j) {
            var p, q = b.text.length - 2;
            if (q > 0 && h)
                for (var l = 0; l < h.length; ++l) null == h[l].to && (p || (p = [])).push(new Xc(h[l].marker, null, null));
            for (var l = 0; l < q; ++l) o.push(p);
            o.push(i)
        }
        return o
    }

    function cd(a) {
        for (var b = 0; b < a.length; ++b) {
            var c = a[b];
            null != c.from && c.from == c.to && c.marker.clearWhenEmpty !== !1 && a.splice(b--, 1)
        }
        return a.length ? a : null
    }

    function dd(a, b) {
        var c = le(a, b),
            d = bd(a, b);
        if (!c) return d;
        if (!d) return c;
        for (var e = 0; e < c.length; ++e) {
            var f = c[e],
                g = d[e];
            if (f && g) a: for (var h = 0; h < g.length; ++h) {
                for (var i = g[h], j = 0; j < f.length; ++j)
                    if (f[j].marker == i.marker) continue a;
                f.push(i)
            } else g && (c[e] = g)
        }
        return c
    }

    function ed(a, b, c) {
        var d = null;
        if (a.iter(b.line, c.line + 1, function(a) {
                if (a.markedSpans)
                    for (var b = 0; b < a.markedSpans.length; ++b) { var c = a.markedSpans[b].marker;!c.readOnly || d && De(d, c) != -1 || (d || (d = [])).push(c) }
            }), !d) return null;
        for (var e = [{ from: b, to: c }], f = 0; f < d.length; ++f)
            for (var g = d[f], h = g.find(0), i = 0; i < e.length; ++i) {
                var j = e[i];
                if (!(Gf(j.to, h.from) < 0 || Gf(j.from, h.to) > 0)) {
                    var k = [i, 1],
                        l = Gf(j.from, h.from),
                        m = Gf(j.to, h.to);
                    (l < 0 || !g.inclusiveLeft && !l) && k.push({ from: j.from, to: h.from }), (m > 0 || !g.inclusiveRight && !m) && k.push({ from: h.to, to: j.to }), e.splice.apply(e, k), i += k.length - 1
                }
            }
        return e
    }

    function fd(a) {
        var b = a.markedSpans;
        if (b) {
            for (var c = 0; c < b.length; ++c) b[c].marker.detachLine(a);
            a.markedSpans = null
        }
    }

    function gd(a, b) {
        if (b) {
            for (var c = 0; c < b.length; ++c) b[c].marker.attachLine(a);
            a.markedSpans = b
        }
    }

    function hd(a) { return a.inclusiveLeft ? -1 : 0 }

    function id(a) { return a.inclusiveRight ? 1 : 0 }

    function jd(a, b) {
        var c = a.lines.length - b.lines.length;
        if (0 != c) return c;
        var d = a.find(),
            e = b.find(),
            f = Gf(d.from, e.from) || hd(a) - hd(b);
        if (f) return -f;
        var g = Gf(d.to, e.to) || id(a) - id(b);
        return g ? g : b.id - a.id
    }

    function kd(a, b) {
        var c, d = Ef && a.markedSpans;
        if (d)
            for (var e, f = 0; f < d.length; ++f) e = d[f], e.marker.collapsed && null == (b ? e.from : e.to) && (!c || jd(c, e.marker) < 0) && (c = e.marker);
        return c
    }

    function ld(a) { return kd(a, !0) }

    function md(a) { return kd(a, !1) }

    function nd(a, b, c, d, e) {
        var f = Vd(a, b),
            g = Ef && f.markedSpans;
        if (g)
            for (var h = 0; h < g.length; ++h) {
                var i = g[h];
                if (i.marker.collapsed) {
                    var j = i.marker.find(0),
                        k = Gf(j.from, c) || hd(i.marker) - hd(e),
                        l = Gf(j.to, d) || id(i.marker) - id(e);
                    if (!(k >= 0 && l <= 0 || k <= 0 && l >= 0) && (k <= 0 && (Gf(j.to, c) > 0 || i.marker.inclusiveRight && e.inclusiveLeft) || k >= 0 && (Gf(j.from, d) < 0 || i.marker.inclusiveLeft && e.inclusiveRight))) return !0
                }
            }
    }

    function od(a) { for (var b; b = ld(a);) a = b.find(-1, !0).line; return a }

    function pd(a) { for (var b, c; b = md(a);) a = b.find(1, !0).line, (c || (c = [])).push(a); return c }

    function qd(a, b) {
        var c = Vd(a, b),
            d = od(c);
        return c == d ? b : Zd(d)
    }

    function rd(a, b) { if (b > a.lastLine()) return b; var c, d = Vd(a, b); if (!sd(a, d)) return b; for (; c = md(d);) d = c.find(1, !0).line; return Zd(d) + 1 }

    function sd(a, b) {
        var c = Ef && b.markedSpans;
        if (c)
            for (var d, e = 0; e < c.length; ++e)
                if (d = c[e], d.marker.collapsed) { if (null == d.from) return !0; if (!d.marker.widgetNode && 0 == d.from && d.marker.inclusiveLeft && td(a, b, d)) return !0 }
    }

    function td(a, b, c) {
        if (null == c.to) { var d = c.marker.find(1, !0); return td(a, d.line, Yc(d.line.markedSpans, c.marker)) }
        if (c.marker.inclusiveRight && c.to == b.text.length) return !0;
        for (var e, f = 0; f < b.markedSpans.length; ++f)
            if (e = b.markedSpans[f], e.marker.collapsed && !e.marker.widgetNode && e.from == c.to && (null == e.to || e.to != c.from) && (e.marker.inclusiveLeft || c.marker.inclusiveRight) && td(a, b, e)) return !0
    }

    function ud(a, b, c) { _d(b) < (a.curOp && a.curOp.scrollTop || a.doc.scrollTop) && Hc(a, null, c) }

    function vd(a) {
        if (null != a.height) return a.height;
        var b = a.doc.cm;
        if (!b) return 0;
        if (!Ng(document.body, a.node)) {
            var c = "position: relative;";
            a.coverGutter && (c += "margin-left: -" + b.display.gutters.offsetWidth + "px;"), a.noHScroll && (c += "width: " + b.display.wrapper.clientWidth + "px;"), Oe(b.display.measure, Me("div", [a.node], null, c))
        }
        return a.height = a.node.offsetHeight
    }

    function wd(a, b, c, d) {
        var e = new mg(a, c, d),
            f = a.cm;
        return f && e.noHScroll && (f.display.alignWidgets = !0), Lc(a, b, "widget", function(b) {
            var c = b.widgets || (b.widgets = []);
            if (null == e.insertAt ? c.push(e) : c.splice(Math.min(c.length - 1, Math.max(0, e.insertAt)), 0, e), e.line = b, f && !sd(a, b)) {
                var d = _d(b) < a.scrollTop;
                Yd(b, b.height + vd(e)), d && Hc(f, null, e.height), f.curOp.forceUpdate = !0
            }
            return !0
        }), e
    }

    function xd(a, b, c, d) {
        a.text = b, a.stateAfter && (a.stateAfter = null), a.styles && (a.styles = null), null != a.order && (a.order = null), fd(a), gd(a, c);
        var e = d ? d(a) : 1;
        e != a.height && Yd(a, e)
    }

    function yd(a) { a.parent = null, fd(a) }

    function zd(a, b) {
        if (a)
            for (;;) {
                var c = a.match(/(?:^|\s+)line-(background-)?(\S+)/);
                if (!c) break;
                a = a.slice(0, c.index) + a.slice(c.index + c[0].length);
                var d = c[1] ? "bgClass" : "textClass";
                null == b[d] ? b[d] = c[2] : new RegExp("(?:^|s)" + c[2] + "(?:$|s)").test(b[d]) || (b[d] += " " + c[2])
            }
        return a
    }

    function Ad(b, c) { if (b.blankLine) return b.blankLine(c); if (b.innerMode) { var d = a.innerMode(b, c); return d.mode.blankLine ? d.mode.blankLine(d.state) : void 0 } }

    function Bd(b, c, d, e) { for (var f = 0; f < 10; f++) { e && (e[0] = a.innerMode(b, d).mode); var g = b.token(c, d); if (c.pos > c.start) return g } throw new Error("Mode " + b.name + " failed to advance stream.") }

    function Cd(a, b, c, d) {
        function e(a) { return { start: l.start, end: l.pos, string: l.current(), type: f || null, state: a ? bg(g.mode, k) : k } }
        var f, g = a.doc,
            h = g.mode;
        b = qa(g, b);
        var i, j = Vd(g, b.line),
            k = Pa(a, b.line, c),
            l = new ig(j.text, a.options.tabSize);
        for (d && (i = []);
            (d || l.pos < b.ch) && !l.eol();) l.start = l.pos, f = Bd(h, l, k), d && i.push(e(!0));
        return d ? i : e()
    }

    function Dd(a, b, c, d, e, f, g) {
        var h = c.flattenSpans;
        null == h && (h = a.options.flattenSpans);
        var i, j = 0,
            k = null,
            l = new ig(b, a.options.tabSize),
            m = a.options.addModeClass && [null];
        for ("" == b && zd(Ad(c, d), f); !l.eol();) {
            if (l.pos > a.options.maxHighlightLength ? (h = !1, g && Gd(a, b, d, l.pos), l.pos = b.length, i = null) : i = zd(Bd(c, l, d, m), f), m) {
                var n = m[0].name;
                n && (i = "m-" + (i ? n + " " + i : n))
            }
            if (!h || k != i) {
                for (; j < l.start;) j = Math.min(l.start, j + 5e4), e(j, k);
                k = i
            }
            l.start = l.pos
        }
        for (; j < l.pos;) {
            var o = Math.min(l.pos, j + 5e4);
            e(o, k), j = o
        }
    }

    function Ed(a, b, c, d) {
        var e = [a.state.modeGen],
            f = {};
        Dd(a, b.text, a.doc.mode, c, function(a, b) { e.push(a, b) }, f, d);
        for (var g = 0; g < a.state.overlays.length; ++g) {
            var h = a.state.overlays[g],
                i = 1,
                j = 0;
            Dd(a, b.text, h.mode, !0, function(a, b) {
                for (var c = i; j < a;) {
                    var d = e[i];
                    d > a && e.splice(i, 1, a, e[i + 1], d), i += 2, j = Math.min(a, d)
                }
                if (b)
                    if (h.opaque) e.splice(c, i - c, a, "cm-overlay " + b), i = c + 2;
                    else
                        for (; c < i; c += 2) {
                            var f = e[c + 1];
                            e[c + 1] = (f ? f + " " : "") + "cm-overlay " + b;
                        }
            }, f)
        }
        return { styles: e, classes: f.bgClass || f.textClass ? f : null }
    }

    function Fd(a, b, c) {
        if (!b.styles || b.styles[0] != a.state.modeGen) {
            var d = Ed(a, b, b.stateAfter = Pa(a, Zd(b)));
            b.styles = d.styles, d.classes ? b.styleClasses = d.classes : b.styleClasses && (b.styleClasses = null), c === a.doc.frontier && a.doc.frontier++
        }
        return b.styles
    }

    function Gd(a, b, c, d) {
        var e = a.doc.mode,
            f = new ig(b, a.options.tabSize);
        for (f.start = f.pos = d || 0, "" == b && Ad(e, c); !f.eol() && f.pos <= a.options.maxHighlightLength;) Bd(e, f, c), f.start = f.pos
    }

    function Hd(a, b) { if (!a || /^\s*$/.test(a)) return null; var c = b.addModeClass ? pg : og; return c[a] || (c[a] = a.replace(/\S+/g, "cm-$&")) }

    function Id(a, b) {
        var c = Me("span", null, "CodeMirror-line-content", pf ? "padding-right: .1px" : null),
            d = { pre: Me("pre", [c], "CodeMirror-line"), content: c, col: 0, pos: 0, cm: a, splitSpaces: (nf || pf) && a.getOption("lineWrapping") };
        b.measure = {};
        for (var e = 0; e <= (b.rest ? b.rest.length : 0); e++) {
            var f, g = e ? b.rest[e - 1] : b.line;
            d.pos = 0, d.addToken = Kd, We(a.display.measure) && (f = ae(g)) && (d.addToken = Md(d.addToken, f)), d.map = [];
            var h = b != a.display.externalMeasured && Zd(g);
            Od(g, d, Fd(a, g, h)), g.styleClasses && (g.styleClasses.bgClass && (d.bgClass = Re(g.styleClasses.bgClass, d.bgClass || "")), g.styleClasses.textClass && (d.textClass = Re(g.styleClasses.textClass, d.textClass || ""))), 0 == d.map.length && d.map.push(0, 0, d.content.appendChild(Ve(a.display.measure))), 0 == e ? (b.measure.map = d.map, b.measure.cache = {}) : ((b.measure.maps || (b.measure.maps = [])).push(d.map), (b.measure.caches || (b.measure.caches = [])).push({}))
        }
        return pf && /\bcm-tab\b/.test(d.content.lastChild.className) && (d.content.className = "cm-tab-wrap-hack"), zg(a, "renderLine", a, b.line, d.pre), d.pre.className && (d.textClass = Re(d.pre.className, d.textClass || "")), d
    }

    function Jd(a) { var b = Me("span", "•", "cm-invalidchar"); return b.title = "\\u" + a.charCodeAt(0).toString(16), b.setAttribute("aria-label", b.title), b }

    function Kd(a, b, c, d, e, f, g, h) {
        if (b) {
            var i = a.splitSpaces ? b.replace(/ {3,}/g, Ld) : b,
                j = a.cm.state.specialChars,
                k = !1;
            if (j.test(b))
                for (var l = document.createDocumentFragment(), m = 0;;) {
                    j.lastIndex = m;
                    var n = j.exec(b),
                        o = n ? n.index - m : b.length - m;
                    if (o) {
                        var p = document.createTextNode(i.slice(m, m + o));
                        nf && of < 9 ? l.appendChild(Me("span", [p])) : l.appendChild(p), a.map.push(a.pos, a.pos + o, p), a.col += o, a.pos += o
                    }
                    if (!n) break;
                    if (m += o + 1, "\t" == n[0]) {
                        var q = a.cm.options.tabSize,
                            r = q - a.col % q,
                            p = l.appendChild(Me("span", Be(r), "cm-tab"));
                        p.setAttribute("role", "presentation"), p.setAttribute("cm-text", "\t"), a.col += r
                    } else {
                        var p = a.cm.options.specialCharPlaceholder(n[0]);
                        p.setAttribute("cm-text", n[0]), nf && of < 9 ? l.appendChild(Me("span", [p])) : l.appendChild(p), a.col += 1
                    }
                    a.map.push(a.pos, a.pos + 1, p), a.pos++
                } else {
                    a.col += b.length;
                    var l = document.createTextNode(i);
                    a.map.push(a.pos, a.pos + b.length, l), nf && of < 9 && (k = !0), a.pos += b.length
                }
            if (c || d || e || k || g || h) {
                var s = c || "";
                d && (s += d), e && (s += e);
                var t = Me("span", [l], s, g, h);
                return f && (t.title = f), a.content.appendChild(t)
            }
            a.content.appendChild(l)
        }
    }

    function Ld(a) { for (var b = " ", c = 0; c < a.length - 2; ++c) b += c % 2 ? " " : " "; return b += " " }

    function Md(a, b) {
        return function(c, d, e, f, g, h, i) {
            e = e ? e + " cm-force-border" : "cm-force-border";
            for (var j = c.pos, k = j + d.length;;) {
                for (var l = 0; l < b.length; l++) { var m = b[l]; if (m.to > j && m.from <= j) break }
                if (m.to >= k) return a(c, d, e, f, g, h, i);
                a(c, d.slice(0, m.to - j), e, f, null, h, i), f = null, d = d.slice(m.to - j), j = m.to
            }
        }
    }

    function Nd(a, b, c, d) {
        var e = !d && c.widgetNode;
        e && a.map.push(a.pos, a.pos + b, e), !d && a.cm.display.input.needsContentAttribute && (e || (e = a.content.appendChild(document.createElement("span"))), e.setAttribute("cm-marker", c.id)), e && (a.cm.display.input.setUneditable(e), a.content.appendChild(e)), a.pos += b
    }

    function Od(a, b, c) {
        var d = a.markedSpans,
            e = a.text,
            f = 0;
        if (d)
            for (var g, h, i, j, k, l, m, n, o = e.length, p = 0, q = 1, r = "", s = 0;;) {
                if (s == p) {
                    j = k = l = m = h = "", i = null, n = null, s = 1 / 0;
                    for (var t = [], u = 0; u < d.length; ++u) {
                        var v = d[u],
                            w = v.marker;
                        "bookmark" == w.type && v.from == p && w.widgetNode ? t.push(w) : v.from <= p && (null == v.to || v.to > p || w.collapsed && v.to == p && v.from == p) ? (null != v.to && v.to != p && s > v.to && (s = v.to, k = ""), w.className && (j += " " + w.className), w.attr && (i = w.attr), w.css && (h = w.css), w.startStyle && v.from == p && (l += " " + w.startStyle), w.endStyle && v.to == s && (k += " " + w.endStyle), w.title && !m && (m = w.title), w.collapsed && (!n || jd(n.marker, w) < 0) && (n = v)) : v.from > p && s > v.from && (s = v.from)
                    }
                    if (n && (n.from || 0) == p) {
                        if (Nd(b, (null == n.to ? o + 1 : n.to) - p, n.marker, null == n.from), null == n.to) return;
                        n.to == p && (n = !1)
                    }
                    if (!n && t.length)
                        for (var u = 0; u < t.length; ++u) Nd(b, 0, t[u])
                }
                if (p >= o) break;
                for (var x = Math.min(o, s);;) {
                    if (r) {
                        var y = p + r.length;
                        if (!n) {
                            var z = y > x ? r.slice(0, x - p) : r;
                            b.addToken(b, z, g ? g + j : j, l, p + z.length == s ? k : "", m, h, i)
                        }
                        if (y >= x) { r = r.slice(x - p), p = x; break }
                        p = y, l = ""
                    }
                    r = e.slice(f, f = c[q++]), g = Hd(c[q++], b.cm.options)
                }
            } else
                for (var q = 1; q < c.length; q += 2) b.addToken(b, e.slice(f, f = c[q]), Hd(c[q + 1], b.cm.options))
    }

    function Pd(a, b) { return 0 == b.from.ch && 0 == b.to.ch && "" == Ce(b.text) && (!a.cm || a.cm.options.wholeLineUpdateBefore) }

    function Qd(a, b, c, d) {
        function e(a) { return c ? c[a] : null }

        function f(a, c, e) { xd(a, c, e, d), te(a, "change", a, b) }

        function g(a, b) { for (var c = a, f = []; c < b; ++c) f.push(new ng(j[c], e(c), d)); return f }
        var h = b.from,
            i = b.to,
            j = b.text,
            k = Vd(a, h.line),
            l = Vd(a, i.line),
            m = Ce(j),
            n = e(j.length - 1),
            o = i.line - h.line;
        if (b.full) a.insert(0, g(0, j.length)), a.remove(j.length, a.size - j.length);
        else if (Pd(a, b)) {
            var p = g(0, j.length - 1);
            f(l, l.text, n), o && a.remove(h.line, o), p.length && a.insert(h.line, p)
        } else if (k == l)
            if (1 == j.length) f(k, k.text.slice(0, h.ch) + m + k.text.slice(i.ch), n);
            else {
                var p = g(1, j.length - 1);
                p.push(new ng(m + k.text.slice(i.ch), n, d)), f(k, k.text.slice(0, h.ch) + j[0], e(0)), a.insert(h.line + 1, p)
            }
        else if (1 == j.length) f(k, k.text.slice(0, h.ch) + j[0] + l.text.slice(i.ch), e(0)), a.remove(h.line + 1, o);
        else {
            f(k, k.text.slice(0, h.ch) + j[0], e(0)), f(l, m + l.text.slice(i.ch), n);
            var p = g(1, j.length - 1);
            o > 1 && a.remove(h.line + 1, o - 1), a.insert(h.line + 1, p)
        }
        te(a, "change", a, b)
    }

    function Rd(a) {
        this.lines = a, this.parent = null;
        for (var b = 0, c = 0; b < a.length; ++b) a[b].parent = this, c += a[b].height;
        this.height = c
    }

    function Sd(a) {
        this.children = a;
        for (var b = 0, c = 0, d = 0; d < a.length; ++d) {
            var e = a[d];
            b += e.chunkSize(), c += e.height, e.parent = this
        }
        this.size = b, this.height = c, this.parent = null
    }

    function Td(a, b, c) {
        function d(a, e, f) {
            if (a.linked)
                for (var g = 0; g < a.linked.length; ++g) {
                    var h = a.linked[g];
                    if (h.doc != e) {
                        var i = f && h.sharedHist;
                        c && !i || (b(h.doc, i), d(h.doc, a, i))
                    }
                }
        }
        d(a, null, !0)
    }

    function Ud(a, b) {
        if (b.cm) throw new Error("This document is already in use.");
        a.doc = b, b.cm = a, g(a), c(a), a.options.lineWrapping || m(a), a.options.mode = b.modeOption, Ib(a)
    }

    function Vd(a, b) {
        if (b -= a.first, b < 0 || b >= a.size) throw new Error("There is no line " + (b + a.first) + " in the document.");
        for (var c = a; !c.lines;)
            for (var d = 0;; ++d) {
                var e = c.children[d],
                    f = e.chunkSize();
                if (b < f) { c = e; break }
                b -= f
            }
        return c.lines[b]
    }

    function Wd(a, b, c) {
        var d = [],
            e = b.line;
        return a.iter(b.line, c.line + 1, function(a) {
            var f = a.text;
            e == c.line && (f = f.slice(0, c.ch)), e == b.line && (f = f.slice(b.ch)), d.push(f), ++e
        }), d
    }

    function Xd(a, b, c) { var d = []; return a.iter(b, c, function(a) { d.push(a.text) }), d }

    function Yd(a, b) {
        var c = b - a.height;
        if (c)
            for (var d = a; d; d = d.parent) d.height += c
    }

    function Zd(a) {
        if (null == a.parent) return null;
        for (var b = a.parent, c = De(b.lines, a), d = b.parent; d; b = d, d = d.parent)
            for (var e = 0; d.children[e] != b; ++e) c += d.children[e].chunkSize();
        return c + b.first
    }

    function $d(a, b) {
        var c = a.first;
        a: do {
            for (var d = 0; d < a.children.length; ++d) {
                var e = a.children[d],
                    f = e.height;
                if (b < f) { a = e; continue a }
                b -= f, c += e.chunkSize()
            }
            return c
        } while (!a.lines);
        for (var d = 0; d < a.lines.length; ++d) {
            var g = a.lines[d],
                h = g.height;
            if (b < h) break;
            b -= h
        }
        return c + d
    }

    function _d(a) {
        a = od(a);
        for (var b = 0, c = a.parent, d = 0; d < c.lines.length; ++d) {
            var e = c.lines[d];
            if (e == a) break;
            b += e.height
        }
        for (var f = c.parent; f; c = f, f = c.parent)
            for (var d = 0; d < f.children.length; ++d) {
                var g = f.children[d];
                if (g == c) break;
                b += g.height
            }
        return b
    }

    function ae(a) { var b = a.order; return null == b && (b = a.order = $g(a.text)), b }

    function be(a) { this.done = [], this.undone = [], this.undoDepth = 1 / 0, this.lastModTime = this.lastSelTime = 0, this.lastOp = this.lastSelOp = null, this.lastOrigin = this.lastSelOrigin = null, this.generation = this.maxGeneration = a || 1 }

    function ce(a, b) { var c = { from: V(b.from), to: Uf(b), text: Wd(a, b.from, b.to) }; return je(a, c, b.from.line, b.to.line + 1), Td(a, function(a) { je(a, c, b.from.line, b.to.line + 1) }, !0), c }

    function de(a) {
        for (; a.length;) {
            var b = Ce(a);
            if (!b.ranges) break;
            a.pop()
        }
    }

    function ee(a, b) { return b ? (de(a.done), Ce(a.done)) : a.done.length && !Ce(a.done).ranges ? Ce(a.done) : a.done.length > 1 && !a.done[a.done.length - 2].ranges ? (a.done.pop(), Ce(a.done)) : void 0 }

    function fe(a, b, c, d) {
        var e = a.history;
        e.undone.length = 0;
        var f, g = +new Date;
        if ((e.lastOp == d || e.lastOrigin == b.origin && b.origin && ("+" == b.origin.charAt(0) && a.cm && e.lastModTime > g - a.cm.options.historyEventDelay || "*" == b.origin.charAt(0))) && (f = ee(e, e.lastOp == d))) {
            var h = Ce(f.changes);
            0 == Gf(b.from, b.to) && 0 == Gf(b.from, h.to) ? h.to = Uf(b) : f.changes.push(ce(a, b))
        } else { var i = Ce(e.done); for (i && i.ranges || ie(a.sel, e.done), f = { changes: [ce(a, b)], generation: e.generation }, e.done.push(f); e.done.length > e.undoDepth;) e.done.shift(), e.done[0].ranges || e.done.shift() }
        e.done.push(c), e.generation = ++e.maxGeneration, e.lastModTime = e.lastSelTime = g, e.lastOp = e.lastSelOp = d, e.lastOrigin = e.lastSelOrigin = b.origin, h || zg(a, "historyAdded")
    }

    function ge(a, b, c, d) { var e = b.charAt(0); return "*" == e || "+" == e && c.ranges.length == d.ranges.length && c.somethingSelected() == d.somethingSelected() && new Date - a.history.lastSelTime <= (a.cm ? a.cm.options.historyEventDelay : 500) }

    function he(a, b, c, d) {
        var e = a.history,
            f = d && d.origin;
        c == e.lastSelOp || f && e.lastSelOrigin == f && (e.lastModTime == e.lastSelTime && e.lastOrigin == f || ge(a, f, Ce(e.done), b)) ? e.done[e.done.length - 1] = b : ie(b, e.done), e.lastSelTime = +new Date, e.lastSelOrigin = f, e.lastSelOp = c, d && d.clearRedo !== !1 && de(e.undone)
    }

    function ie(a, b) {
        var c = Ce(b);
        c && c.ranges && c.equals(a) || b.push(a)
    }

    function je(a, b, c, d) {
        var e = b["spans_" + a.id],
            f = 0;
        a.iter(Math.max(a.first, c), Math.min(a.first + a.size, d), function(c) { c.markedSpans && ((e || (e = b["spans_" + a.id] = {}))[f] = c.markedSpans), ++f })
    }

    function ke(a) { if (!a) return null; for (var b, c = 0; c < a.length; ++c) a[c].marker.explicitlyCleared ? b || (b = a.slice(0, c)) : b && b.push(a[c]); return b ? b.length ? b : null : a }

    function le(a, b) { var c = b["spans_" + a.id]; if (!c) return null; for (var d = 0, e = []; d < b.text.length; ++d) e.push(ke(c[d])); return e }

    function me(a, b, c) {
        for (var d = 0, e = []; d < a.length; ++d) {
            var f = a[d];
            if (f.ranges) e.push(c ? la.prototype.deepCopy.call(f) : f);
            else {
                var g = f.changes,
                    h = [];
                e.push({ changes: h });
                for (var i = 0; i < g.length; ++i) {
                    var j, k = g[i];
                    if (h.push({ from: k.from, to: k.to, text: k.text }), b)
                        for (var l in k)(j = l.match(/^spans_(\d+)$/)) && De(b, Number(j[1])) > -1 && (Ce(h)[l] = k[l], delete k[l])
                }
            }
        }
        return e
    }

    function ne(a, b, c, d) { c < a.line ? a.line += d : b < a.line && (a.line = b, a.ch = 0) }

    function oe(a, b, c, d) {
        for (var e = 0; e < a.length; ++e) {
            var f = a[e],
                g = !0;
            if (f.ranges) { f.copied || (f = a[e] = f.deepCopy(), f.copied = !0); for (var h = 0; h < f.ranges.length; h++) ne(f.ranges[h].anchor, b, c, d), ne(f.ranges[h].head, b, c, d) } else {
                for (var h = 0; h < f.changes.length; ++h) {
                    var i = f.changes[h];
                    if (c < i.from.line) i.from = Ff(i.from.line + d, i.from.ch), i.to = Ff(i.to.line + d, i.to.ch);
                    else if (b <= i.to.line) { g = !1; break }
                }
                g || (a.splice(0, e + 1), e = 0)
            }
        }
    }

    function pe(a, b) {
        var c = b.from.line,
            d = b.to.line,
            e = b.text.length - (d - c) - 1;
        oe(a.done, c, d, e), oe(a.undone, c, d, e)
    }

    function qe(a) { return null != a.defaultPrevented ? a.defaultPrevented : 0 == a.returnValue }

    function re(a) { return a.target || a.srcElement }

    function se(a) { var b = a.which; return null == b && (1 & a.button ? b = 1 : 2 & a.button ? b = 3 : 4 & a.button && (b = 2)), yf && a.ctrlKey && 1 == b && (b = 3), b }

    function te(a, b) {
        function c(a) { return function() { a.apply(null, f) } }
        var d = a._handlers && a._handlers[b];
        if (d) {
            var e, f = Array.prototype.slice.call(arguments, 2);
            Mf ? e = Mf.delayedCallbacks : Ag ? e = Ag : (e = Ag = [], setTimeout(ue, 0));
            for (var g = 0; g < d.length; ++g) e.push(c(d[g]))
        }
    }

    function ue() {
        var a = Ag;
        Ag = null;
        for (var b = 0; b < a.length; ++b) a[b]()
    }

    function ve(a, b, c) { return "string" == typeof b && (b = { type: b, preventDefault: function() { this.defaultPrevented = !0 } }), zg(a, c || b.type, a, b), qe(b) || b.codemirrorIgnore }

    function we(a) {
        var b = a._handlers && a._handlers.cursorActivity;
        if (b)
            for (var c = a.curOp.cursorActivityHandlers || (a.curOp.cursorActivityHandlers = []), d = 0; d < b.length; ++d) De(c, b[d]) == -1 && c.push(b[d])
    }

    function xe(a, b) { var c = a._handlers && a._handlers[b]; return c && c.length > 0 }

    function ye(a) { a.prototype.on = function(a, b) { xg(this, a, b) }, a.prototype.off = function(a, b) { yg(this, a, b) } }

    function ze() { this.id = null }

    function Ae(a, b, c) {
        for (var d = 0, e = 0;;) {
            var f = a.indexOf("\t", d);
            f == -1 && (f = a.length);
            var g = f - d;
            if (f == a.length || e + g >= b) return d + Math.min(g, b - e);
            if (e += f - d, e += c - e % c, d = f + 1, e >= b) return d
        }
    }

    function Be(a) { for (; Hg.length <= a;) Hg.push(Ce(Hg) + " "); return Hg[a] }

    function Ce(a) { return a[a.length - 1] }

    function De(a, b) {
        for (var c = 0; c < a.length; ++c)
            if (a[c] == b) return c;
        return -1
    }

    function Ee(a, b) { for (var c = [], d = 0; d < a.length; d++) c[d] = b(a[d], d); return c }

    function Fe() {}

    function Ge(a, b) { var c; return Object.create ? c = Object.create(a) : (Fe.prototype = a, c = new Fe), b && He(b, c), c }

    function He(a, b, c) { b || (b = {}); for (var d in a) !a.hasOwnProperty(d) || c === !1 && b.hasOwnProperty(d) || (b[d] = a[d]); return b }

    function Ie(a) { var b = Array.prototype.slice.call(arguments, 1); return function() { return a.apply(null, b) } }

    function Je(a, b) { return b ? !!(b.source.indexOf("\\w") > -1 && Lg(a)) || b.test(a) : Lg(a) }

    function Ke(a) {
        for (var b in a)
            if (a.hasOwnProperty(b) && a[b]) return !1;
        return !0
    }

    function Le(a) { return a.charCodeAt(0) >= 768 && Mg.test(a) }

    function Me(a, b, c, d, e) {
        var f = document.createElement(a);
        if (c && (f.className = c), d && (f.style.cssText = d), "string" == typeof b) f.appendChild(document.createTextNode(b));
        else if (b)
            for (var g = 0; g < b.length; ++g) f.appendChild(b[g]);
        if (e)
            for (var h in e) f.setAttribute(h, e[h]);
        return f
    }

    function Ne(a) { for (var b = a.childNodes.length; b > 0; --b) a.removeChild(a.firstChild); return a }

    function Oe(a, b) { return Ne(a).appendChild(b) }

    function Pe() { return document.activeElement }

    function Qe(a) { return new RegExp("(^|\\s)" + a + "(?:$|\\s)\\s*") }

    function Re(a, b) { for (var c = a.split(" "), d = 0; d < c.length; d++) c[d] && !Qe(c[d]).test(b) && (b += " " + c[d]); return b }

    function Se(a) {
        if (document.body.getElementsByClassName)
            for (var b = document.body.getElementsByClassName("CodeMirror"), c = 0; c < b.length; c++) {
                var d = b[c].CodeMirror;
                d && a(d)
            }
    }

    function Te() { Sg || (Ue(), Sg = !0) }

    function Ue() {
        var a;
        xg(window, "resize", function() { null == a && (a = setTimeout(function() { a = null, Se(Rb) }, 100)) }), xg(window, "blur", function() { Se(oc) })
    }

    function Ve(a) {
        if (null == Og) {
            var b = Me("span", "​");
            Oe(a, Me("span", [b, document.createTextNode("x")])), 0 != a.firstChild.offsetHeight && (Og = b.offsetWidth <= 1 && b.offsetHeight > 2 && !(nf && of < 8))
        }
        var c = Og ? Me("span", "​") : Me("span", " ", null, "display: inline-block; width: 1px; margin-right: -1px");
        return c.setAttribute("cm-text", ""), c
    }

    function We(a) {
        if (null != Pg) return Pg;
        var b = Oe(a, document.createTextNode("AخA")),
            c = Jg(b, 0, 1).getBoundingClientRect();
        if (!c || c.left == c.right) return !1;
        var d = Jg(b, 1, 2).getBoundingClientRect();
        return Pg = d.right - c.right < 3
    }

    function Xe(a) {
        if (null != Xg) return Xg;
        var b = Oe(a, Me("span", "x")),
            c = b.getBoundingClientRect(),
            d = Jg(b, 0, 1).getBoundingClientRect();
        return Xg = Math.abs(c.left - d.left) > 1
    }

    function Ye(a, b, c, d) {
        if (!a) return d(b, c, "ltr");
        for (var e = !1, f = 0; f < a.length; ++f) {
            var g = a[f];
            (g.from < c && g.to > b || b == c && g.to == b) && (d(Math.max(g.from, b), Math.min(g.to, c), 1 == g.level ? "rtl" : "ltr"), e = !0)
        }
        e || d(b, c, "ltr")
    }

    function Ze(a) { return a.level % 2 ? a.to : a.from }

    function $e(a) { return a.level % 2 ? a.from : a.to }

    function _e(a) { var b = ae(a); return b ? Ze(b[0]) : 0 }

    function af(a) { var b = ae(a); return b ? $e(Ce(b)) : a.text.length }

    function bf(a, b) {
        var c = Vd(a.doc, b),
            d = od(c);
        d != c && (b = Zd(d));
        var e = ae(d),
            f = e ? e[0].level % 2 ? af(d) : _e(d) : 0;
        return Ff(b, f)
    }

    function cf(a, b) {
        for (var c, d = Vd(a.doc, b); c = md(d);) d = c.find(1, !0).line, b = null;
        var e = ae(d),
            f = e ? e[0].level % 2 ? _e(d) : af(d) : d.text.length;
        return Ff(null == b ? Zd(d) : b, f)
    }

    function df(a, b) {
        var c = bf(a, b.line),
            d = Vd(a.doc, c.line),
            e = ae(d);
        if (!e || 0 == e[0].level) {
            var f = Math.max(0, d.text.search(/\S/)),
                g = b.line == c.line && b.ch <= f && b.ch;
            return Ff(c.line, g ? 0 : f)
        }
        return c
    }

    function ef(a, b, c) { var d = a[0].level; return b == d || c != d && b < c }

    function ff(a, b) {
        Zg = null;
        for (var c, d = 0; d < a.length; ++d) {
            var e = a[d];
            if (e.from < b && e.to > b) return d;
            if (e.from == b || e.to == b) {
                if (null != c) return ef(a, e.level, a[c].level) ? (e.from != e.to && (Zg = c), d) : (e.from != e.to && (Zg = d), c);
                c = d
            }
        }
        return c
    }

    function gf(a, b, c, d) {
        if (!d) return b + c;
        do b += c; while (b > 0 && Le(a.text.charAt(b)));
        return b
    }

    function hf(a, b, c, d) {
        var e = ae(a);
        if (!e) return jf(a, b, c, d);
        for (var f = ff(e, b), g = e[f], h = gf(a, b, g.level % 2 ? -c : c, d);;) {
            if (h > g.from && h < g.to) return h;
            if (h == g.from || h == g.to) return ff(e, h) == f ? h : (g = e[f += c], c > 0 == g.level % 2 ? g.to : g.from);
            if (g = e[f += c], !g) return null;
            h = c > 0 == g.level % 2 ? gf(a, g.to, -1, d) : gf(a, g.from, 1, d)
        }
    }

    function jf(a, b, c, d) {
        var e = b + c;
        if (d)
            for (; e > 0 && Le(a.text.charAt(e));) e += c;
        return e < 0 || e > a.text.length ? null : e
    }
    var kf = /gecko\/\d/i.test(navigator.userAgent),
        lf = /MSIE \d/.test(navigator.userAgent),
        mf = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent),
        nf = lf || mf,
        of = nf && (lf ? document.documentMode || 6 : mf[1]),
        pf = /WebKit\//.test(navigator.userAgent),
        qf = pf && /Qt\/\d+\.\d+/.test(navigator.userAgent),
        rf = /Chrome\//.test(navigator.userAgent),
        sf = /Opera\//.test(navigator.userAgent),
        tf = /Apple Computer/.test(navigator.vendor),
        uf = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent),
        vf = /PhantomJS/.test(navigator.userAgent),
        wf = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent),
        xf = wf || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent),
        yf = wf || /Mac/.test(navigator.platform),
        zf = /win/i.test(navigator.platform),
        Af = sf && navigator.userAgent.match(/Version\/(\d*\.\d*)/);
    Af && (Af = Number(Af[1])), Af && Af >= 15 && (sf = !1, pf = !0);
    var Bf = yf && (qf || sf && (null == Af || Af < 12.11)),
        Cf = kf || nf && of >= 9,
        Df = !1,
        Ef = !1;
    p.prototype = He({
        update: function(a) {
            var b = a.scrollWidth > a.clientWidth + 1,
                c = a.scrollHeight > a.clientHeight + 1,
                d = a.nativeBarWidth;
            if (c) {
                this.vert.style.display = "block", this.vert.style.bottom = b ? d + "px" : "0";
                var e = a.viewHeight - (b ? d : 0);
                this.vert.firstChild.style.height = Math.max(0, a.scrollHeight - a.clientHeight + e) + "px"
            } else this.vert.style.display = "", this.vert.firstChild.style.height = "0";
            if (b) {
                this.horiz.style.display = "block", this.horiz.style.right = c ? d + "px" : "0", this.horiz.style.left = a.barLeft + "px";
                var f = a.viewWidth - a.barLeft - (c ? d : 0);
                this.horiz.firstChild.style.width = a.scrollWidth - a.clientWidth + f + "px"
            } else this.horiz.style.display = "", this.horiz.firstChild.style.width = "0";
            return !this.checkedOverlay && a.clientHeight > 0 && (0 == d && this.overlayHack(), this.checkedOverlay = !0), { right: c ? d : 0, bottom: b ? d : 0 }
        },
        setScrollLeft: function(a) { this.horiz.scrollLeft != a && (this.horiz.scrollLeft = a) },
        setScrollTop: function(a) { this.vert.scrollTop != a && (this.vert.scrollTop = a) },
        overlayHack: function() {
            var a = yf && !uf ? "12px" : "18px";
            this.horiz.style.minHeight = this.vert.style.minWidth = a;
            var b = this,
                c = function(a) { re(a) != b.vert && re(a) != b.horiz && Db(b.cm, Ub)(a) };
            xg(this.vert, "mousedown", c), xg(this.horiz, "mousedown", c)
        },
        clear: function() {
            var a = this.horiz.parentNode;
            a.removeChild(this.horiz), a.removeChild(this.vert)
        }
    }, p.prototype), q.prototype = He({ update: function() { return { bottom: 0, right: 0 } }, setScrollLeft: function() {}, setScrollTop: function() {}, clear: function() {} }, q.prototype), a.scrollbarModel = { native: p, null: q }, z.prototype.signal = function(a, b) { xe(a, b) && this.events.push(arguments) }, z.prototype.finish = function() { for (var a = 0; a < this.events.length; a++) zg.apply(null, this.events[a]) };
    var Ff = a.Pos = function(a, b) { return this instanceof Ff ? (this.line = a, void(this.ch = b)) : new Ff(a, b) },
        Gf = a.cmpPos = function(a, b) { return a.line - b.line || a.ch - b.ch },
        Hf = null;
    da.prototype = He({
        init: function(a) {
            function b(a) {
                if (d.somethingSelected()) Hf = d.getSelections(), c.inaccurateSelection && (c.prevInput = "", c.inaccurateSelection = !1, f.value = Hf.join("\n"), Ig(f));
                else {
                    if (!d.options.lineWiseCopyCut) return;
                    var b = ba(d);
                    Hf = b.text, "cut" == a.type ? d.setSelections(b.ranges, null, Dg) : (c.prevInput = "", f.value = b.text.join("\n"), Ig(f))
                }
                "cut" == a.type && (d.state.cutIncoming = !0)
            }
            var c = this,
                d = this.cm,
                e = this.wrapper = ea(),
                f = this.textarea = e.firstChild;
            a.wrapper.insertBefore(e, a.wrapper.firstChild), wf && (f.style.width = "0px"), xg(f, "input", function() { nf && of >= 9 && c.hasSelection && (c.hasSelection = null), c.poll() }), xg(f, "paste", function(a) { return !!_(a, d) || (d.state.pasteIncoming = !0, void c.fastPoll()) }), xg(f, "cut", b), xg(f, "copy", b), xg(a.scroller, "paste", function(b) { Sb(a, b) || (d.state.pasteIncoming = !0, c.focus()) }), xg(a.lineSpace, "selectstart", function(b) { Sb(a, b) || ug(b) }), xg(f, "compositionstart", function() {
                var a = d.getCursor("from");
                c.composing = { start: a, range: d.markText(a, d.getCursor("to"), { className: "CodeMirror-composing" }) }
            }), xg(f, "compositionend", function() { c.composing && (c.poll(), c.composing.range.clear(), c.composing = null) })
        },
        prepareSelection: function() {
            var a = this.cm,
                b = a.display,
                c = a.doc,
                d = Ia(a);
            if (a.options.moveInputWithCursor) {
                var e = mb(a, c.sel.primary().head, "div"),
                    f = b.wrapper.getBoundingClientRect(),
                    g = b.lineDiv.getBoundingClientRect();
                d.teTop = Math.max(0, Math.min(b.wrapper.clientHeight - 10, e.top + g.top - f.top)), d.teLeft = Math.max(0, Math.min(b.wrapper.clientWidth - 10, e.left + g.left - f.left))
            }
            return d
        },
        showSelection: function(a) {
            var b = this.cm,
                c = b.display;
            Oe(c.cursorDiv, a.cursors), Oe(c.selectionDiv, a.selection), null != a.teTop && (this.wrapper.style.top = a.teTop + "px", this.wrapper.style.left = a.teLeft + "px")
        },
        reset: function(a) {
            if (!this.contextMenuPending) {
                var b, c, d = this.cm,
                    e = d.doc;
                if (d.somethingSelected()) {
                    this.prevInput = "";
                    var f = e.sel.primary();
                    b = Wg && (f.to().line - f.from().line > 100 || (c = d.getSelection()).length > 1e3);
                    var g = b ? "-" : c || d.getSelection();
                    this.textarea.value = g, d.state.focused && Ig(this.textarea), nf && of >= 9 && (this.hasSelection = g)
                } else a || (this.prevInput = this.textarea.value = "", nf && of >= 9 && (this.hasSelection = null));
                this.inaccurateSelection = b
            }
        },
        getField: function() { return this.textarea },
        supportsTouch: function() { return !1 },
        focus: function() { if ("nocursor" != this.cm.options.readOnly && (!xf || Pe() != this.textarea)) try { this.textarea.focus() } catch (a) {} },
        blur: function() { this.textarea.blur() },
        resetPosition: function() { this.wrapper.style.top = this.wrapper.style.left = 0 },
        receivedFocus: function() { this.slowPoll() },
        slowPoll: function() {
            var a = this;
            a.pollingFast || a.polling.set(this.cm.options.pollInterval, function() { a.poll(), a.cm.state.focused && a.slowPoll() })
        },
        fastPoll: function() {
            function a() {
                var d = c.poll();
                d || b ? (c.pollingFast = !1, c.slowPoll()) : (b = !0, c.polling.set(60, a))
            }
            var b = !1,
                c = this;
            c.pollingFast = !0, c.polling.set(20, a)
        },
        poll: function() {
            var a = this.cm,
                b = this.textarea,
                c = this.prevInput;
            if (this.contextMenuPending || !a.state.focused || Vg(b) && !c || Z(a) || a.options.disableInput || a.state.keySeq) return !1;
            var d = b.value;
            if (d == c && !a.somethingSelected()) return !1;
            if (nf && of >= 9 && this.hasSelection === d || yf && /[\uf700-\uf7ff]/.test(d)) return a.display.input.reset(), !1;
            if (a.doc.sel == a.display.selForContextMenu) { var e = d.charCodeAt(0); if (8203 != e || c || (c = "​"), 8666 == e) return this.reset(), this.cm.execCommand("undo") }
            for (var f = 0, g = Math.min(c.length, d.length); f < g && c.charCodeAt(f) == d.charCodeAt(f);) ++f;
            var h = this;
            return Cb(a, function() { $(a, d.slice(f), c.length - f, null, h.composing ? "*compose" : null), d.length > 1e3 || d.indexOf("\n") > -1 ? b.value = h.prevInput = "" : h.prevInput = d, h.composing && (h.composing.range.clear(), h.composing.range = a.markText(h.composing.start, a.getCursor("to"), { className: "CodeMirror-composing" })) }), !0
        },
        ensurePolled: function() { this.pollingFast && this.poll() && (this.pollingFast = !1) },
        onKeyPress: function() { nf && of >= 9 && (this.hasSelection = null), this.fastPoll() },
        onContextMenu: function(a) {
            function b() {
                if (null != g.selectionStart) {
                    var a = e.somethingSelected(),
                        b = "​" + (a ? g.value : "");
                    g.value = "⇚", g.value = b, d.prevInput = a ? "" : "​", g.selectionStart = 1, g.selectionEnd = b.length, f.selForContextMenu = e.doc.sel
                }
            }

            function c() {
                if (d.contextMenuPending = !1, d.wrapper.style.position = "relative", g.style.cssText = k, nf && of < 9 && f.scrollbars.setScrollTop(f.scroller.scrollTop = i), null != g.selectionStart) {
                    (!nf || nf && of < 9) && b();
                    var a = 0,
                        c = function() { f.selForContextMenu == e.doc.sel && 0 == g.selectionStart && g.selectionEnd > 0 && "​" == d.prevInput ? Db(e, dg.selectAll)(e) : a++ < 10 ? f.detectingSelectAll = setTimeout(c, 500) : f.input.reset() };
                    f.detectingSelectAll = setTimeout(c, 200)
                }
            }
            var d = this,
                e = d.cm,
                f = e.display,
                g = d.textarea,
                h = Tb(e, a),
                i = f.scroller.scrollTop;
            if (h && !sf) {
                var j = e.options.resetSelectionOnContextMenu;
                j && e.doc.sel.contains(h) == -1 && Db(e, Ba)(e.doc, oa(h), Dg);
                var k = g.style.cssText;
                if (d.wrapper.style.position = "absolute", g.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (a.clientY - 5) + "px; left: " + (a.clientX - 5) + "px; z-index: 1000; background: " + (nf ? "rgba(255, 255, 255, .05)" : "transparent") + "; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);", pf) var l = window.scrollY;
                if (f.input.focus(), pf && window.scrollTo(null, l), f.input.reset(), e.somethingSelected() || (g.value = d.prevInput = " "), d.contextMenuPending = !0, f.selForContextMenu = e.doc.sel, clearTimeout(f.detectingSelectAll), nf && of >= 9 && b(), Cf) {
                    wg(a);
                    var m = function() { yg(window, "mouseup", m), setTimeout(c, 20) };
                    xg(window, "mouseup", m)
                } else setTimeout(c, 50)
            }
        },
        setUneditable: Fe,
        needsContentAttribute: !1
    }, da.prototype), fa.prototype = He({
        init: function(a) {
            function b(a) {
                if (d.somethingSelected()) Hf = d.getSelections(), "cut" == a.type && d.replaceSelection("", null, "cut");
                else {
                    if (!d.options.lineWiseCopyCut) return;
                    var b = ba(d);
                    Hf = b.text, "cut" == a.type && d.operation(function() { d.setSelections(b.ranges, 0, Dg), d.replaceSelection("", null, "cut") })
                }
                if (a.clipboardData && !wf) a.preventDefault(), a.clipboardData.clearData(), a.clipboardData.setData("text/plain", Hf.join("\n"));
                else {
                    var c = ea(),
                        e = c.firstChild;
                    d.display.lineSpace.insertBefore(c, d.display.lineSpace.firstChild), e.value = Hf.join("\n");
                    var f = document.activeElement;
                    Ig(e), setTimeout(function() { d.display.lineSpace.removeChild(c), f.focus() }, 50)
                }
            }
            var c = this,
                d = c.cm,
                e = c.div = a.lineDiv;
            e.contentEditable = "true", ca(e), xg(e, "paste", function(a) { _(a, d) }), xg(e, "compositionstart", function(a) {
                var b = a.data;
                if (c.composing = { sel: d.doc.sel, data: b, startData: b }, b) {
                    var e = d.doc.sel.primary(),
                        f = d.getLine(e.head.line),
                        g = f.indexOf(b, Math.max(0, e.head.ch - b.length));
                    g > -1 && g <= e.head.ch && (c.composing.sel = oa(Ff(e.head.line, g), Ff(e.head.line, g + b.length)))
                }
            }), xg(e, "compositionupdate", function(a) { c.composing.data = a.data }), xg(e, "compositionend", function(a) {
                var b = c.composing;
                b && (a.data == b.startData || /\u200b/.test(a.data) || (b.data = a.data), setTimeout(function() { b.handled || c.applyComposition(b), c.composing == b && (c.composing = null) }, 50))
            }), xg(e, "touchstart", function() { c.forceCompositionEnd() }), xg(e, "input", function() { c.composing || c.pollContent() || Cb(c.cm, function() { Ib(d) }) }), xg(e, "copy", b), xg(e, "cut", b)
        },
        prepareSelection: function() { var a = Ia(this.cm, !1); return a.focus = this.cm.state.focused, a },
        showSelection: function(a) { a && this.cm.display.view.length && (a.focus && this.showPrimarySelection(), this.showMultipleSelections(a)) },
        showPrimarySelection: function() {
            var a = window.getSelection(),
                b = this.cm.doc.sel.primary(),
                c = ia(this.cm, a.anchorNode, a.anchorOffset),
                d = ia(this.cm, a.focusNode, a.focusOffset);
            if (!c || c.bad || !d || d.bad || 0 != Gf(X(c, d), b.from()) || 0 != Gf(W(c, d), b.to())) {
                var e = ga(this.cm, b.from()),
                    f = ga(this.cm, b.to());
                if (e || f) {
                    var g = this.cm.display.view,
                        h = a.rangeCount && a.getRangeAt(0);
                    if (e) {
                        if (!f) {
                            var i = g[g.length - 1].measure,
                                j = i.maps ? i.maps[i.maps.length - 1] : i.map;
                            f = { node: j[j.length - 1], offset: j[j.length - 2] - j[j.length - 3] }
                        }
                    } else e = { node: g[0].measure.map[2], offset: 0 };
                    try { var k = Jg(e.node, e.offset, f.offset, f.node) } catch (a) {}
                    k && (a.removeAllRanges(), a.addRange(k), h && null == a.anchorNode ? a.addRange(h) : kf && this.startGracePeriod()), this.rememberSelection()
                }
            }
        },
        startGracePeriod: function() {
            var a = this;
            clearTimeout(this.gracePeriod), this.gracePeriod = setTimeout(function() { a.gracePeriod = !1, a.selectionChanged() && a.cm.operation(function() { a.cm.curOp.selectionChanged = !0 }) }, 20)
        },
        showMultipleSelections: function(a) { Oe(this.cm.display.cursorDiv, a.cursors), Oe(this.cm.display.selectionDiv, a.selection) },
        rememberSelection: function() {
            var a = window.getSelection();
            this.lastAnchorNode = a.anchorNode, this.lastAnchorOffset = a.anchorOffset, this.lastFocusNode = a.focusNode, this.lastFocusOffset = a.focusOffset
        },
        selectionInEditor: function() { var a = window.getSelection(); if (!a.rangeCount) return !1; var b = a.getRangeAt(0).commonAncestorContainer; return Ng(this.div, b) },
        focus: function() { "nocursor" != this.cm.options.readOnly && this.div.focus() },
        blur: function() { this.div.blur() },
        getField: function() { return this.div },
        supportsTouch: function() { return !0 },
        receivedFocus: function() {
            function a() { b.cm.state.focused && (b.pollSelection(), b.polling.set(b.cm.options.pollInterval, a)) }
            var b = this;
            this.selectionInEditor() ? this.pollSelection() : Cb(this.cm, function() { b.cm.curOp.selectionChanged = !0 }), this.polling.set(this.cm.options.pollInterval, a)
        },
        selectionChanged: function() { var a = window.getSelection(); return a.anchorNode != this.lastAnchorNode || a.anchorOffset != this.lastAnchorOffset || a.focusNode != this.lastFocusNode || a.focusOffset != this.lastFocusOffset },
        pollSelection: function() {
            if (!this.composing && !this.gracePeriod && this.selectionChanged()) {
                var a = window.getSelection(),
                    b = this.cm;
                this.rememberSelection();
                var c = ia(b, a.anchorNode, a.anchorOffset),
                    d = ia(b, a.focusNode, a.focusOffset);
                c && d && Cb(b, function() { Ba(b.doc, oa(c, d), Dg), (c.bad || d.bad) && (b.curOp.selectionChanged = !0) })
            }
        },
        pollContent: function() {
            var a = this.cm,
                b = a.display,
                c = a.doc.sel.primary(),
                d = c.from(),
                e = c.to();
            if (d.line < b.viewFrom || e.line > b.viewTo - 1) return !1;
            var f;
            if (d.line == b.viewFrom || 0 == (f = Lb(a, d.line))) var g = Zd(b.view[0].line),
                h = b.view[0].node;
            else var g = Zd(b.view[f].line),
                h = b.view[f - 1].node.nextSibling;
            var i = Lb(a, e.line);
            if (i == b.view.length - 1) var j = b.viewTo - 1,
                k = b.lineDiv.lastChild;
            else var j = Zd(b.view[i + 1].line) - 1,
                k = b.view[i + 1].node.previousSibling;
            for (var l = Ug(ka(a, h, k, g, j)), m = Wd(a.doc, Ff(g, 0), Ff(j, Vd(a.doc, j).text.length)); l.length > 1 && m.length > 1;)
                if (Ce(l) == Ce(m)) l.pop(), m.pop(), j--;
                else {
                    if (l[0] != m[0]) break;
                    l.shift(), m.shift(), g++
                }
            for (var n = 0, o = 0, p = l[0], q = m[0], r = Math.min(p.length, q.length); n < r && p.charCodeAt(n) == q.charCodeAt(n);) ++n;
            for (var s = Ce(l), t = Ce(m), u = Math.min(s.length - (1 == l.length ? n : 0), t.length - (1 == m.length ? n : 0)); o < u && s.charCodeAt(s.length - o - 1) == t.charCodeAt(t.length - o - 1);) ++o;
            l[l.length - 1] = s.slice(0, s.length - o), l[0] = l[0].slice(n);
            var v = Ff(g, n),
                w = Ff(j, m.length ? Ce(m).length - o : 0);
            return l.length > 1 || l[0] || Gf(v, w) ? (Cc(a.doc, l, v, w, "+input"), !0) : void 0
        },
        ensurePolled: function() { this.forceCompositionEnd() },
        reset: function() { this.forceCompositionEnd() },
        forceCompositionEnd: function() { this.composing && !this.composing.handled && (this.applyComposition(this.composing), this.composing.handled = !0, this.div.blur(), this.div.focus()) },
        applyComposition: function(a) { a.data && a.data != a.startData && Db(this.cm, $)(this.cm, a.data, 0, a.sel) },
        setUneditable: function(a) { a.setAttribute("contenteditable", "false") },
        onKeyPress: function(a) { a.preventDefault(), Db(this.cm, $)(this.cm, String.fromCharCode(null == a.charCode ? a.keyCode : a.charCode), 0) },
        onContextMenu: Fe,
        resetPosition: Fe,
        needsContentAttribute: !0
    }, fa.prototype), a.inputStyles = { textarea: da, contenteditable: fa }, la.prototype = {
        primary: function() { return this.ranges[this.primIndex] },
        equals: function(a) {
            if (a == this) return !0;
            if (a.primIndex != this.primIndex || a.ranges.length != this.ranges.length) return !1;
            for (var b = 0; b < this.ranges.length; b++) {
                var c = this.ranges[b],
                    d = a.ranges[b];
                if (0 != Gf(c.anchor, d.anchor) || 0 != Gf(c.head, d.head)) return !1
            }
            return !0
        },
        deepCopy: function() { for (var a = [], b = 0; b < this.ranges.length; b++) a[b] = new ma(V(this.ranges[b].anchor), V(this.ranges[b].head)); return new la(a, this.primIndex) },
        somethingSelected: function() {
            for (var a = 0; a < this.ranges.length; a++)
                if (!this.ranges[a].empty()) return !0;
            return !1
        },
        contains: function(a, b) { b || (b = a); for (var c = 0; c < this.ranges.length; c++) { var d = this.ranges[c]; if (Gf(b, d.from()) >= 0 && Gf(a, d.to()) <= 0) return c } return -1 }
    }, ma.prototype = { from: function() { return X(this.anchor, this.head) }, to: function() { return W(this.anchor, this.head) }, empty: function() { return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch } };
    var If, Jf, Kf, Lf = { left: 0, right: 0, top: 0, bottom: 0 },
        Mf = null,
        Nf = 0,
        Of = 0,
        Pf = 0,
        Qf = null;
    nf ? Qf = -.53 : kf ? Qf = 15 : rf ? Qf = -.7 : tf && (Qf = -1 / 3);
    var Rf = function(a) {
        var b = a.wheelDeltaX,
            c = a.wheelDeltaY;
        return null == b && a.detail && a.axis == a.HORIZONTAL_AXIS && (b = a.detail), null == c && a.detail && a.axis == a.VERTICAL_AXIS ? c = a.detail : null == c && (c = a.wheelDelta), { x: b, y: c }
    };
    a.wheelEventPixels = function(a) { var b = Rf(a); return b.x *= Qf, b.y *= Qf, b };
    var Sf = new ze,
        Tf = null,
        Uf = a.changeEnd = function(a) { return a.text ? Ff(a.from.line + a.text.length - 1, Ce(a.text).length + (1 == a.text.length ? a.from.ch : 0)) : a.to };
    a.prototype = {
        constructor: a,
        focus: function() { window.focus(), this.display.input.focus() },
        setOption: function(a, b) {
            var c = this.options,
                d = c[a];
            c[a] == b && "mode" != a || (c[a] = b, Wf.hasOwnProperty(a) && Db(this, Wf[a])(this, b, d))
        },
        getOption: function(a) { return this.options[a] },
        getDoc: function() { return this.doc },
        addKeyMap: function(a, b) { this.state.keyMaps[b ? "push" : "unshift"](Rc(a)) },
        removeKeyMap: function(a) {
            for (var b = this.state.keyMaps, c = 0; c < b.length; ++c)
                if (b[c] == a || b[c].name == a) return b.splice(c, 1), !0
        },
        addOverlay: Eb(function(b, c) {
            var d = b.token ? b : a.getMode(this.options, b);
            if (d.startState) throw new Error("Overlays may not be stateful.");
            this.state.overlays.push({ mode: d, modeSpec: b, opaque: c && c.opaque }), this.state.modeGen++, Ib(this)
        }),
        removeOverlay: Eb(function(a) { for (var b = this.state.overlays, c = 0; c < b.length; ++c) { var d = b[c].modeSpec; if (d == a || "string" == typeof a && d.name == a) return b.splice(c, 1), this.state.modeGen++, void Ib(this) } }),
        indentLine: Eb(function(a, b, c) { "string" != typeof b && "number" != typeof b && (b = null == b ? this.options.smartIndent ? "smart" : "prev" : b ? "add" : "subtract"), sa(this.doc, a) && Kc(this, a, b, c) }),
        indentSelection: Eb(function(a) {
            for (var b = this.doc.sel.ranges, c = -1, d = 0; d < b.length; d++) {
                var e = b[d];
                if (e.empty()) e.head.line > c && (Kc(this, e.head.line, a, !0), c = e.head.line, d == this.doc.sel.primIndex && Ic(this));
                else {
                    var f = e.from(),
                        g = e.to(),
                        h = Math.max(c, f.line);
                    c = Math.min(this.lastLine(), g.line - (g.ch ? 0 : 1)) + 1;
                    for (var i = h; i < c; ++i) Kc(this, i, a);
                    var j = this.doc.sel.ranges;
                    0 == f.ch && b.length == j.length && j[d].from().ch > 0 && xa(this.doc, d, new ma(f, j[d].to()), Dg)
                }
            }
        }),
        getTokenAt: function(a, b) { return Cd(this, a, b) },
        getLineTokens: function(a, b) { return Cd(this, Ff(a), b, !0) },
        getTokenTypeAt: function(a) {
            a = qa(this.doc, a);
            var b, c = Fd(this, Vd(this.doc, a.line)),
                d = 0,
                e = (c.length - 1) / 2,
                f = a.ch;
            if (0 == f) b = c[2];
            else
                for (;;) {
                    var g = d + e >> 1;
                    if ((g ? c[2 * g - 1] : 0) >= f) e = g;
                    else {
                        if (!(c[2 * g + 1] < f)) { b = c[2 * g + 2]; break }
                        d = g + 1
                    }
                }
            var h = b ? b.indexOf("cm-overlay ") : -1;
            return h < 0 ? b : 0 == h ? null : b.slice(0, h - 1)
        },
        getModeAt: function(b) { var c = this.doc.mode; return c.innerMode ? a.innerMode(c, this.getTokenAt(b).state).mode : c },
        getHelper: function(a, b) { return this.getHelpers(a, b)[0] },
        getHelpers: function(a, b) {
            var c = [];
            if (!ag.hasOwnProperty(b)) return c;
            var d = ag[b],
                e = this.getModeAt(a);
            if ("string" == typeof e[b]) d[e[b]] && c.push(d[e[b]]);
            else if (e[b])
                for (var f = 0; f < e[b].length; f++) {
                    var g = d[e[b][f]];
                    g && c.push(g)
                } else e.helperType && d[e.helperType] ? c.push(d[e.helperType]) : d[e.name] && c.push(d[e.name]);
            for (var f = 0; f < d._global.length; f++) {
                var h = d._global[f];
                h.pred(e, this) && De(c, h.val) == -1 && c.push(h.val)
            }
            return c
        },
        getStateAfter: function(a, b) { var c = this.doc; return a = pa(c, null == a ? c.first + c.size - 1 : a), Pa(this, a + 1, b) },
        cursorCoords: function(a, b) { var c, d = this.doc.sel.primary(); return c = null == a ? d.head : "object" == typeof a ? qa(this.doc, a) : a ? d.from() : d.to(), mb(this, c, b || "page") },
        charCoords: function(a, b) { return lb(this, qa(this.doc, a), b || "page") },
        coordsChar: function(a, b) { return a = kb(this, a, b || "page"), pb(this, a.left, a.top) },
        lineAtHeight: function(a, b) { return a = kb(this, { top: a, left: 0 }, b || "page").top, $d(this.doc, a + this.display.viewOffset) },
        heightAtLine: function(a, b) {
            var c, d = !1;
            if ("number" == typeof a) {
                var e = this.doc.first + this.doc.size - 1;
                a < this.doc.first ? a = this.doc.first : a > e && (a = e, d = !0), c = Vd(this.doc, a)
            } else c = a;
            return jb(this, c, { top: 0, left: 0 }, b || "page").top + (d ? this.doc.height - _d(c) : 0)
        },
        defaultTextHeight: function() { return rb(this.display) },
        defaultCharWidth: function() { return sb(this.display) },
        setGutterMarker: Eb(function(a, b, c) { return Lc(this.doc, a, "gutter", function(a) { var d = a.gutterMarkers || (a.gutterMarkers = {}); return d[b] = c, !c && Ke(d) && (a.gutterMarkers = null), !0 }) }),
        clearGutter: Eb(function(a) {
            var b = this,
                c = b.doc,
                d = c.first;
            c.iter(function(c) { c.gutterMarkers && c.gutterMarkers[a] && (c.gutterMarkers[a] = null, Jb(b, d, "gutter"), Ke(c.gutterMarkers) && (c.gutterMarkers = null)), ++d })
        }),
        lineInfo: function(a) { if ("number" == typeof a) { if (!sa(this.doc, a)) return null; var b = a; if (a = Vd(this.doc, a), !a) return null } else { var b = Zd(a); if (null == b) return null } return { line: b, handle: a, text: a.text, gutterMarkers: a.gutterMarkers, textClass: a.textClass, bgClass: a.bgClass, wrapClass: a.wrapClass, widgets: a.widgets } },
        getViewport: function() { return { from: this.display.viewFrom, to: this.display.viewTo } },
        addWidget: function(a, b, c, d, e) {
            var f = this.display;
            a = mb(this, qa(this.doc, a));
            var g = a.bottom,
                h = a.left;
            if (b.style.position = "absolute", b.setAttribute("cm-ignore-events", "true"), this.display.input.setUneditable(b), f.sizer.appendChild(b), "over" == d) g = a.top;
            else if ("above" == d || "near" == d) {
                var i = Math.max(f.wrapper.clientHeight, this.doc.height),
                    j = Math.max(f.sizer.clientWidth, f.lineSpace.clientWidth);
                ("above" == d || a.bottom + b.offsetHeight > i) && a.top > b.offsetHeight ? g = a.top - b.offsetHeight : a.bottom + b.offsetHeight <= i && (g = a.bottom), h + b.offsetWidth > j && (h = j - b.offsetWidth)
            }
            b.style.top = g + "px", b.style.left = b.style.right = "", "right" == e ? (h = f.sizer.clientWidth - b.offsetWidth, b.style.right = "0px") : ("left" == e ? h = 0 : "middle" == e && (h = (f.sizer.clientWidth - b.offsetWidth) / 2), b.style.left = h + "px"), c && Fc(this, h, g, h + b.offsetWidth, g + b.offsetHeight)
        },
        triggerOnKeyDown: Eb(ic),
        triggerOnKeyPress: Eb(lc),
        triggerOnKeyUp: kc,
        execCommand: function(a) { if (dg.hasOwnProperty(a)) return dg[a](this) },
        triggerElectric: Eb(function(a) { aa(this, a) }),
        findPosH: function(a, b, c, d) {
            var e = 1;
            b < 0 && (e = -1, b = -b);
            for (var f = 0, g = qa(this.doc, a); f < b && (g = Nc(this.doc, g, e, c, d), !g.hitSide); ++f);
            return g
        },
        moveH: Eb(function(a, b) {
            var c = this;
            c.extendSelectionsBy(function(d) { return c.display.shift || c.doc.extend || d.empty() ? Nc(c.doc, d.head, a, b, c.options.rtlMoveVisually) : a < 0 ? d.from() : d.to() }, Fg)
        }),
        deleteH: Eb(function(a, b) {
            var c = this.doc.sel,
                d = this.doc;
            c.somethingSelected() ? d.replaceSelection("", null, "+delete") : Mc(this, function(c) { var e = Nc(d, c.head, a, b, !1); return a < 0 ? { from: e, to: c.head } : { from: c.head, to: e } })
        }),
        findPosV: function(a, b, c, d) {
            var e = 1,
                f = d;
            b < 0 && (e = -1, b = -b);
            for (var g = 0, h = qa(this.doc, a); g < b; ++g) { var i = mb(this, h, "div"); if (null == f ? f = i.left : i.left = f, h = Oc(this, i, e, c), h.hitSide) break }
            return h
        },
        moveV: Eb(function(a, b) {
            var c = this,
                d = this.doc,
                e = [],
                f = !c.display.shift && !d.extend && d.sel.somethingSelected();
            if (d.extendSelectionsBy(function(g) {
                    if (f) return a < 0 ? g.from() : g.to();
                    var h = mb(c, g.head, "div");
                    null != g.goalColumn && (h.left = g.goalColumn), e.push(h.left);
                    var i = Oc(c, h, a, b);
                    return "page" == b && g == d.sel.primary() && Hc(c, null, lb(c, i, "div").top - h.top), i
                }, Fg), e.length)
                for (var g = 0; g < d.sel.ranges.length; g++) d.sel.ranges[g].goalColumn = e[g]
        }),
        findWordAt: function(a) {
            var b = this.doc,
                c = Vd(b, a.line).text,
                d = a.ch,
                e = a.ch;
            if (c) {
                var f = this.getHelper(a, "wordChars");
                (a.xRel < 0 || e == c.length) && d ? --d : ++e;
                for (var g = c.charAt(d), h = Je(g, f) ? function(a) { return Je(a, f) } : /\s/.test(g) ? function(a) { return /\s/.test(a) } : function(a) { return !/\s/.test(a) && !Je(a) }; d > 0 && h(c.charAt(d - 1));) --d;
                for (; e < c.length && h(c.charAt(e));) ++e
            }
            return new ma(Ff(a.line, d), Ff(a.line, e))
        },
        toggleOverwrite: function(a) { null != a && a == this.state.overwrite || ((this.state.overwrite = !this.state.overwrite) ? Rg(this.display.cursorDiv, "CodeMirror-overwrite") : Qg(this.display.cursorDiv, "CodeMirror-overwrite"), zg(this, "overwriteToggle", this, this.state.overwrite)) },
        hasFocus: function() { return this.display.input.getField() == Pe() },
        scrollTo: Eb(function(a, b) { null == a && null == b || Jc(this), null != a && (this.curOp.scrollLeft = a), null != b && (this.curOp.scrollTop = b) }),
        getScrollInfo: function() { var a = this.display.scroller; return { left: a.scrollLeft, top: a.scrollTop, height: a.scrollHeight - Ta(this) - this.display.barHeight, width: a.scrollWidth - Ta(this) - this.display.barWidth, clientHeight: Va(this), clientWidth: Ua(this) } },
        scrollIntoView: Eb(function(a, b) {
            if (null == a ? (a = { from: this.doc.sel.primary().head, to: null }, null == b && (b = this.options.cursorScrollMargin)) : "number" == typeof a ? a = { from: Ff(a, 0), to: null } : null == a.from && (a = { from: a, to: null }), a.to || (a.to = a.from), a.margin = b || 0, null != a.from.line) Jc(this), this.curOp.scrollToPos = a;
            else {
                var c = Gc(this, Math.min(a.from.left, a.to.left), Math.min(a.from.top, a.to.top) - a.margin, Math.max(a.from.right, a.to.right), Math.max(a.from.bottom, a.to.bottom) + a.margin);
                this.scrollTo(c.scrollLeft, c.scrollTop)
            }
        }),
        setSize: Eb(function(a, b) {
            function c(a) { return "number" == typeof a || /^\d+$/.test(String(a)) ? a + "px" : a }
            var d = this;
            null != a && (d.display.wrapper.style.width = c(a)), null != b && (d.display.wrapper.style.height = c(b)), d.options.lineWrapping && fb(this);
            var e = d.display.viewFrom;
            d.doc.iter(e, d.display.viewTo, function(a) {
                if (a.widgets)
                    for (var b = 0; b < a.widgets.length; b++)
                        if (a.widgets[b].noHScroll) { Jb(d, e, "widget"); break }++e
            }), d.curOp.forceUpdate = !0, zg(d, "refresh", this)
        }),
        operation: function(a) { return Cb(this, a) },
        refresh: Eb(function() {
            var a = this.display.cachedTextHeight;
            Ib(this), this.curOp.forceUpdate = !0, gb(this), this.scrollTo(this.doc.scrollLeft, this.doc.scrollTop), k(this), (null == a || Math.abs(a - rb(this.display)) > .5) && g(this), zg(this, "refresh", this)
        }),
        swapDoc: Eb(function(a) { var b = this.doc; return b.cm = null, Ud(this, a), gb(this), this.display.input.reset(), this.scrollTo(a.scrollLeft, a.scrollTop), this.curOp.forceScroll = !0, te(this, "swapDoc", this, b), b }),
        getInputField: function() { return this.display.input.getField() },
        getWrapperElement: function() { return this.display.wrapper },
        getScrollerElement: function() { return this.display.scroller },
        getGutterElement: function() { return this.display.gutters }
    }, ye(a);
    var Vf = a.defaults = {},
        Wf = a.optionHandlers = {},
        Xf = a.Init = { toString: function() { return "CodeMirror.Init" } };
    Pc("value", "", function(a, b) { a.setValue(b) }, !0), Pc("mode", null, function(a, b) { a.doc.modeOption = b, c(a) }, !0), Pc("indentUnit", 2, c, !0), Pc("indentWithTabs", !1), Pc("smartIndent", !0), Pc("tabSize", 4, function(a) { d(a), gb(a), Ib(a) }, !0), Pc("specialChars", /[\t\u0000-\u0019\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g, function(b, c, d) { b.state.specialChars = new RegExp(c.source + (c.test("\t") ? "" : "|\t"), "g"), d != a.Init && b.refresh() }), Pc("specialCharPlaceholder", Jd, function(a) { a.refresh() }, !0), Pc("electricChars", !0), Pc("inputStyle", xf ? "contenteditable" : "textarea", function() { throw new Error("inputStyle can not (yet) be changed in a running editor") }, !0), Pc("rtlMoveVisually", !zf), Pc("wholeLineUpdateBefore", !0), Pc("theme", "default", function(a) { h(a), i(a) }, !0), Pc("keyMap", "default", function(b, c, d) {
        var e = Rc(c),
            f = d != a.Init && Rc(d);
        f && f.detach && f.detach(b, e), e.attach && e.attach(b, f || null)
    }), Pc("extraKeys", null), Pc("lineWrapping", !1, e, !0), Pc("gutters", [], function(a) { n(a.options), i(a) }, !0), Pc("fixedGutter", !0, function(a, b) { a.display.gutters.style.left = b ? y(a.display) + "px" : "0", a.refresh() }, !0), Pc("coverGutterNextToScrollbar", !1, function(a) { s(a) }, !0), Pc("scrollbarStyle", "native", function(a) { r(a), s(a), a.display.scrollbars.setScrollTop(a.doc.scrollTop), a.display.scrollbars.setScrollLeft(a.doc.scrollLeft) }, !0), Pc("lineNumbers", !1, function(a) { n(a.options), i(a) }, !0), Pc("firstLineNumber", 1, i, !0), Pc("lineNumberFormatter", function(a) { return a }, i, !0), Pc("showCursorWhenSelecting", !1, Ha, !0), Pc("resetSelectionOnContextMenu", !0), Pc("lineWiseCopyCut", !0), Pc("readOnly", !1, function(a, b) { "nocursor" == b ? (oc(a), a.display.input.blur(), a.display.disabled = !0) : (a.display.disabled = !1, b || a.display.input.reset()) }), Pc("disableInput", !1, function(a, b) { b || a.display.input.reset() }, !0), Pc("dragDrop", !0, Qb), Pc("cursorBlinkRate", 530), Pc("cursorScrollMargin", 0), Pc("cursorHeight", 1, Ha, !0), Pc("singleCursorHeightPerLine", !0, Ha, !0), Pc("workTime", 100), Pc("workDelay", 100), Pc("flattenSpans", !0, d, !0), Pc("addModeClass", !1, d, !0), Pc("pollInterval", 100), Pc("undoDepth", 200, function(a, b) { a.doc.history.undoDepth = b }), Pc("historyEventDelay", 1250), Pc("viewportMargin", 10, function(a) { a.refresh() }, !0), Pc("maxHighlightLength", 1e4, d, !0), Pc("moveInputWithCursor", !0, function(a, b) { b || a.display.input.resetPosition() }), Pc("tabindex", null, function(a, b) { a.display.input.getField().tabIndex = b || "" }), Pc("autofocus", null);
    var Yf = a.modes = {},
        Zf = a.mimeModes = {};
    a.defineMode = function(b, c) { a.defaults.mode || "null" == b || (a.defaults.mode = b), arguments.length > 2 && (c.dependencies = Array.prototype.slice.call(arguments, 2)), Yf[b] = c }, a.defineMIME = function(a, b) { Zf[a] = b }, a.resolveMode = function(b) {
        if ("string" == typeof b && Zf.hasOwnProperty(b)) b = Zf[b];
        else if (b && "string" == typeof b.name && Zf.hasOwnProperty(b.name)) { var c = Zf[b.name]; "string" == typeof c && (c = { name: c }), b = Ge(c, b), b.name = c.name } else if ("string" == typeof b && /^[\w\-]+\/[\w\-]+\+xml$/.test(b)) return a.resolveMode("application/xml");
        return "string" == typeof b ? { name: b } : b || { name: "null" }
    }, a.getMode = function(b, c) {
        var c = a.resolveMode(c),
            d = Yf[c.name];
        if (!d) return a.getMode(b, "text/plain");
        var e = d(b, c);
        if ($f.hasOwnProperty(c.name)) { var f = $f[c.name]; for (var g in f) f.hasOwnProperty(g) && (e.hasOwnProperty(g) && (e["_" + g] = e[g]), e[g] = f[g]) }
        if (e.name = c.name, c.helperType && (e.helperType = c.helperType), c.modeProps)
            for (var g in c.modeProps) e[g] = c.modeProps[g];
        return e
    }, a.defineMode("null", function() { return { token: function(a) { a.skipToEnd() } } }), a.defineMIME("text/plain", "null");
    var $f = a.modeExtensions = {};
    a.extendMode = function(a, b) {
        var c = $f.hasOwnProperty(a) ? $f[a] : $f[a] = {};
        He(b, c)
    }, a.defineExtension = function(b, c) { a.prototype[b] = c }, a.defineDocExtension = function(a, b) { rg.prototype[a] = b }, a.defineOption = Pc;
    var _f = [];
    a.defineInitHook = function(a) { _f.push(a) };
    var ag = a.helpers = {};
    a.registerHelper = function(b, c, d) { ag.hasOwnProperty(b) || (ag[b] = a[b] = { _global: [] }), ag[b][c] = d }, a.registerGlobalHelper = function(b, c, d, e) { a.registerHelper(b, c, e), ag[b]._global.push({ pred: d, val: e }) };
    var bg = a.copyState = function(a, b) {
            if (b === !0) return b;
            if (a.copyState) return a.copyState(b);
            var c = {};
            for (var d in b) {
                var e = b[d];
                e instanceof Array && (e = e.concat([])), c[d] = e
            }
            return c
        },
        cg = a.startState = function(a, b, c) { return !a.startState || a.startState(b, c) };
    a.innerMode = function(a, b) {
        for (; a.innerMode;) {
            var c = a.innerMode(b);
            if (!c || c.mode == a) break;
            b = c.state, a = c.mode
        }
        return c || { mode: a, state: b }
    };
    var dg = a.commands = {
            selectAll: function(a) { a.setSelection(Ff(a.firstLine(), 0), Ff(a.lastLine()), Dg) },
            singleSelection: function(a) { a.setSelection(a.getCursor("anchor"), a.getCursor("head"), Dg) },
            killLine: function(a) { Mc(a, function(b) { if (b.empty()) { var c = Vd(a.doc, b.head.line).text.length; return b.head.ch == c && b.head.line < a.lastLine() ? { from: b.head, to: Ff(b.head.line + 1, 0) } : { from: b.head, to: Ff(b.head.line, c) } } return { from: b.from(), to: b.to() } }) },
            deleteLine: function(a) { Mc(a, function(b) { return { from: Ff(b.from().line, 0), to: qa(a.doc, Ff(b.to().line + 1, 0)) } }) },
            delLineLeft: function(a) { Mc(a, function(a) { return { from: Ff(a.from().line, 0), to: a.from() } }) },
            delWrappedLineLeft: function(a) {
                Mc(a, function(b) {
                    var c = a.charCoords(b.head, "div").top + 5,
                        d = a.coordsChar({ left: 0, top: c }, "div");
                    return { from: d, to: b.from() }
                })
            },
            delWrappedLineRight: function(a) {
                Mc(a, function(b) {
                    var c = a.charCoords(b.head, "div").top + 5,
                        d = a.coordsChar({ left: a.display.lineDiv.offsetWidth + 100, top: c }, "div");
                    return { from: b.from(), to: d }
                })
            },
            undo: function(a) { a.undo() },
            redo: function(a) { a.redo() },
            undoSelection: function(a) { a.undoSelection() },
            redoSelection: function(a) { a.redoSelection() },
            goDocStart: function(a) { a.extendSelection(Ff(a.firstLine(), 0)) },
            goDocEnd: function(a) { a.extendSelection(Ff(a.lastLine())) },
            goLineStart: function(a) { a.extendSelectionsBy(function(b) { return bf(a, b.head.line) }, { origin: "+move", bias: 1 }) },
            goLineStartSmart: function(a) { a.extendSelectionsBy(function(b) { return df(a, b.head) }, { origin: "+move", bias: 1 }) },
            goLineEnd: function(a) { a.extendSelectionsBy(function(b) { return cf(a, b.head.line) }, { origin: "+move", bias: -1 }) },
            goLineRight: function(a) { a.extendSelectionsBy(function(b) { var c = a.charCoords(b.head, "div").top + 5; return a.coordsChar({ left: a.display.lineDiv.offsetWidth + 100, top: c }, "div") }, Fg) },
            goLineLeft: function(a) { a.extendSelectionsBy(function(b) { var c = a.charCoords(b.head, "div").top + 5; return a.coordsChar({ left: 0, top: c }, "div") }, Fg) },
            goLineLeftSmart: function(a) {
                a.extendSelectionsBy(function(b) {
                    var c = a.charCoords(b.head, "div").top + 5,
                        d = a.coordsChar({ left: 0, top: c }, "div");
                    return d.ch < a.getLine(d.line).search(/\S/) ? df(a, b.head) : d
                }, Fg)
            },
            goLineUp: function(a) { a.moveV(-1, "line") },
            goLineDown: function(a) { a.moveV(1, "line") },
            goPageUp: function(a) { a.moveV(-1, "page") },
            goPageDown: function(a) { a.moveV(1, "page") },
            goCharLeft: function(a) { a.moveH(-1, "char") },
            goCharRight: function(a) { a.moveH(1, "char") },
            goColumnLeft: function(a) { a.moveH(-1, "column") },
            goColumnRight: function(a) { a.moveH(1, "column") },
            goWordLeft: function(a) { a.moveH(-1, "word") },
            goGroupRight: function(a) { a.moveH(1, "group") },
            goGroupLeft: function(a) { a.moveH(-1, "group") },
            goWordRight: function(a) { a.moveH(1, "word") },
            delCharBefore: function(a) { a.deleteH(-1, "char") },
            delCharAfter: function(a) { a.deleteH(1, "char") },
            delWordBefore: function(a) { a.deleteH(-1, "word") },
            delWordAfter: function(a) { a.deleteH(1, "word") },
            delGroupBefore: function(a) { a.deleteH(-1, "group") },
            delGroupAfter: function(a) { a.deleteH(1, "group") },
            indentAuto: function(a) { a.indentSelection("smart") },
            indentMore: function(a) { a.indentSelection("add") },
            indentLess: function(a) { a.indentSelection("subtract") },
            insertTab: function(a) { a.replaceSelection("\t") },
            insertSoftTab: function(a) {
                for (var b = [], c = a.listSelections(), d = a.options.tabSize, e = 0; e < c.length; e++) {
                    var f = c[e].from(),
                        g = Gg(a.getLine(f.line), f.ch, d);
                    b.push(new Array(d - g % d + 1).join(" "))
                }
                a.replaceSelections(b)
            },
            defaultTab: function(a) { a.somethingSelected() ? a.indentSelection("add") : a.execCommand("insertTab") },
            transposeChars: function(a) {
                Cb(a, function() {
                    for (var b = a.listSelections(), c = [], d = 0; d < b.length; d++) {
                        var e = b[d].head,
                            f = Vd(a.doc, e.line).text;
                        if (f)
                            if (e.ch == f.length && (e = new Ff(e.line, e.ch - 1)), e.ch > 0) e = new Ff(e.line, e.ch + 1), a.replaceRange(f.charAt(e.ch - 1) + f.charAt(e.ch - 2), Ff(e.line, e.ch - 2), e, "+transpose");
                            else if (e.line > a.doc.first) {
                            var g = Vd(a.doc, e.line - 1).text;
                            g && a.replaceRange(f.charAt(0) + "\n" + g.charAt(g.length - 1), Ff(e.line - 1, g.length - 1), Ff(e.line, 1), "+transpose")
                        }
                        c.push(new ma(e, e))
                    }
                    a.setSelections(c)
                })
            },
            newlineAndIndent: function(a) {
                Cb(a, function() {
                    for (var b = a.listSelections().length, c = 0; c < b; c++) {
                        var d = a.listSelections()[c];
                        a.replaceRange("\n", d.anchor, d.head, "+input"), a.indentLine(d.from().line + 1, null, !0), Ic(a)
                    }
                })
            },
            toggleOverwrite: function(a) { a.toggleOverwrite() }
        },
        eg = a.keyMap = {};
    eg.basic = { Left: "goCharLeft", Right: "goCharRight", Up: "goLineUp", Down: "goLineDown", End: "goLineEnd", Home: "goLineStartSmart", PageUp: "goPageUp", PageDown: "goPageDown", Delete: "delCharAfter", Backspace: "delCharBefore", "Shift-Backspace": "delCharBefore", Tab: "defaultTab", "Shift-Tab": "indentAuto", Enter: "newlineAndIndent", Insert: "toggleOverwrite", Esc: "singleSelection" }, eg.pcDefault = { "Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo", "Ctrl-Home": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Up": "goLineUp", "Ctrl-Down": "goLineDown", "Ctrl-Left": "goGroupLeft", "Ctrl-Right": "goGroupRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd", "Ctrl-Backspace": "delGroupBefore", "Ctrl-Delete": "delGroupAfter", "Ctrl-S": "save", "Ctrl-F": "find", "Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll", "Ctrl-[": "indentLess", "Ctrl-]": "indentMore", "Ctrl-U": "undoSelection", "Shift-Ctrl-U": "redoSelection", "Alt-U": "redoSelection", fallthrough: "basic" }, eg.emacsy = { "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown", "Alt-F": "goWordRight", "Alt-B": "goWordLeft", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd", "Ctrl-V": "goPageDown", "Shift-Ctrl-V": "goPageUp", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore", "Alt-D": "delWordAfter", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars" }, eg.macDefault = { "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo", "Cmd-Home": "goDocStart", "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goGroupLeft", "Alt-Right": "goGroupRight", "Cmd-Left": "goLineLeft", "Cmd-Right": "goLineRight", "Alt-Backspace": "delGroupBefore", "Ctrl-Alt-Backspace": "delGroupAfter", "Alt-Delete": "delGroupAfter", "Cmd-S": "save", "Cmd-F": "find", "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll", "Cmd-[": "indentLess", "Cmd-]": "indentMore", "Cmd-Backspace": "delWrappedLineLeft", "Cmd-Delete": "delWrappedLineRight", "Cmd-U": "undoSelection", "Shift-Cmd-U": "redoSelection", "Ctrl-Up": "goDocStart", "Ctrl-Down": "goDocEnd", fallthrough: ["basic", "emacsy"] }, eg.default = yf ? eg.macDefault : eg.pcDefault, a.normalizeKeyMap = function(a) {
        var b = {};
        for (var c in a)
            if (a.hasOwnProperty(c)) {
                var d = a[c];
                if (/^(name|fallthrough|(de|at)tach)$/.test(c)) continue;
                if ("..." == d) { delete a[c]; continue }
                for (var e = Ee(c.split(" "), Qc), f = 0; f < e.length; f++) {
                    var g, h;
                    f == e.length - 1 ? (h = e.join(" "), g = d) : (h = e.slice(0, f + 1).join(" "), g = "...");
                    var i = b[h];
                    if (i) { if (i != g) throw new Error("Inconsistent bindings for " + h) } else b[h] = g
                }
                delete a[c]
            }
        for (var j in b) a[j] = b[j];
        return a
    };
    var fg = a.lookupKey = function(a, b, c, d) { b = Rc(b); var e = b.call ? b.call(a, d) : b[a]; if (e === !1) return "nothing"; if ("..." === e) return "multi"; if (null != e && c(e)) return "handled"; if (b.fallthrough) { if ("[object Array]" != Object.prototype.toString.call(b.fallthrough)) return fg(a, b.fallthrough, c, d); for (var f = 0; f < b.fallthrough.length; f++) { var g = fg(a, b.fallthrough[f], c, d); if (g) return g } } },
        gg = a.isModifierKey = function(a) { var b = "string" == typeof a ? a : Yg[a.keyCode]; return "Ctrl" == b || "Alt" == b || "Shift" == b || "Mod" == b },
        hg = a.keyName = function(a, b) {
            if (sf && 34 == a.keyCode && a.char) return !1;
            var c = Yg[a.keyCode],
                d = c;
            return null != d && !a.altGraphKey && (a.altKey && "Alt" != c && (d = "Alt-" + d), (Bf ? a.metaKey : a.ctrlKey) && "Ctrl" != c && (d = "Ctrl-" + d), (Bf ? a.ctrlKey : a.metaKey) && "Cmd" != c && (d = "Cmd-" + d), !b && a.shiftKey && "Shift" != c && (d = "Shift-" + d), d)
        };
    a.fromTextArea = function(b, c) {
        function d() { b.value = i.getValue() }
        if (c = c ? He(c) : {}, c.value = b.value, !c.tabindex && b.tabIndex && (c.tabindex = b.tabIndex), !c.placeholder && b.placeholder && (c.placeholder = b.placeholder), null == c.autofocus) {
            var e = Pe();
            c.autofocus = e == b || null != b.getAttribute("autofocus") && e == document.body
        }
        if (b.form && (xg(b.form, "submit", d), !c.leaveSubmitMethodAlone)) {
            var f = b.form,
                g = f.submit;
            try { var h = f.submit = function() { d(), f.submit = g, f.submit(), f.submit = h } } catch (a) {}
        }
        c.finishInit = function(a) { a.save = d, a.getTextArea = function() { return b }, a.toTextArea = function() { a.toTextArea = isNaN, d(), b.parentNode.removeChild(a.getWrapperElement()), b.style.display = "", b.form && (yg(b.form, "submit", d), "function" == typeof b.form.submit && (b.form.submit = g)) } }, b.style.display = "none";
        var i = a(function(a) { b.parentNode.insertBefore(a, b.nextSibling) }, c);
        return i
    };
    var ig = a.StringStream = function(a, b) { this.pos = this.start = 0, this.string = a, this.tabSize = b || 8, this.lastColumnPos = this.lastColumnValue = 0, this.lineStart = 0 };
    ig.prototype = {
        eol: function() { return this.pos >= this.string.length },
        sol: function() { return this.pos == this.lineStart },
        peek: function() { return this.string.charAt(this.pos) || void 0 },
        next: function() { if (this.pos < this.string.length) return this.string.charAt(this.pos++) },
        eat: function(a) {
            var b = this.string.charAt(this.pos);
            if ("string" == typeof a) var c = b == a;
            else var c = b && (a.test ? a.test(b) : a(b));
            if (c) return ++this.pos, b
        },
        eatWhile: function(a) { for (var b = this.pos; this.eat(a);); return this.pos > b },
        eatSpace: function() {
            for (var a = this.pos;
                /[\s\u00a0]/.test(this.string.charAt(this.pos));) ++this.pos;
            return this.pos > a
        },
        skipToEnd: function() { this.pos = this.string.length },
        skipTo: function(a) { var b = this.string.indexOf(a, this.pos); if (b > -1) return this.pos = b, !0 },
        backUp: function(a) { this.pos -= a },
        column: function() { return this.lastColumnPos < this.start && (this.lastColumnValue = Gg(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue - (this.lineStart ? Gg(this.string, this.lineStart, this.tabSize) : 0) },
        indentation: function() { return Gg(this.string, null, this.tabSize) - (this.lineStart ? Gg(this.string, this.lineStart, this.tabSize) : 0) },
        match: function(a, b, c) {
            if ("string" != typeof a) { var d = this.string.slice(this.pos).match(a); return d && d.index > 0 ? null : (d && b !== !1 && (this.pos += d[0].length), d) }
            var e = function(a) { return c ? a.toLowerCase() : a },
                f = this.string.substr(this.pos, a.length);
            if (e(f) == e(a)) return b !== !1 && (this.pos += a.length), !0
        },
        current: function() { return this.string.slice(this.start, this.pos) },
        hideFirstChars: function(a, b) { this.lineStart += a; try { return b() } finally { this.lineStart -= a } }
    };
    var jg = 0,
        kg = a.TextMarker = function(a, b) { this.lines = [], this.type = b, this.doc = a, this.id = ++jg };
    ye(kg), kg.prototype.clear = function() {
        if (!this.explicitlyCleared) {
            var a = this.doc.cm,
                b = a && !a.curOp;
            if (b && tb(a), xe(this, "clear")) {
                var c = this.find();
                c && te(this, "clear", c.from, c.to)
            }
            for (var d = null, e = null, f = 0; f < this.lines.length; ++f) {
                var g = this.lines[f],
                    h = Yc(g.markedSpans, this);
                a && !this.collapsed ? Jb(a, Zd(g), "text") : a && (null != h.to && (e = Zd(g)), null != h.from && (d = Zd(g))), g.markedSpans = Zc(g.markedSpans, h), null == h.from && this.collapsed && !sd(this.doc, g) && a && Yd(g, rb(a.display))
            }
            if (a && this.collapsed && !a.options.lineWrapping)
                for (var f = 0; f < this.lines.length; ++f) {
                    var i = od(this.lines[f]),
                        j = l(i);
                    j > a.display.maxLineLength && (a.display.maxLine = i, a.display.maxLineLength = j, a.display.maxLineChanged = !0)
                }
            null != d && a && this.collapsed && Ib(a, d, e + 1), this.lines.length = 0, this.explicitlyCleared = !0, this.atomic && this.doc.cantEdit && (this.doc.cantEdit = !1, a && Ea(a.doc)), a && te(a, "markerCleared", a, this), b && vb(a), this.parent && this.parent.clear()
        }
    }, kg.prototype.find = function(a, b) {
        null == a && "bookmark" == this.type && (a = 1);
        for (var c, d, e = 0; e < this.lines.length; ++e) {
            var f = this.lines[e],
                g = Yc(f.markedSpans, this);
            if (null != g.from && (c = Ff(b ? f : Zd(f), g.from), a == -1)) return c;
            if (null != g.to && (d = Ff(b ? f : Zd(f), g.to), 1 == a)) return d
        }
        return c && { from: c, to: d }
    }, kg.prototype.changed = function() {
        var a = this.find(-1, !0),
            b = this,
            c = this.doc.cm;
        a && c && Cb(c, function() {
            var d = a.line,
                e = Zd(a.line),
                f = $a(c, e);
            if (f && (eb(f), c.curOp.selectionChanged = c.curOp.forceUpdate = !0), c.curOp.updateMaxLine = !0, !sd(b.doc, d) && null != b.height) {
                var g = b.height;
                b.height = null;
                var h = vd(b) - g;
                h && Yd(d, d.height + h)
            }
        })
    }, kg.prototype.attachLine = function(a) {
        if (!this.lines.length && this.doc.cm) {
            var b = this.doc.cm.curOp;
            b.maybeHiddenMarkers && De(b.maybeHiddenMarkers, this) != -1 || (b.maybeUnhiddenMarkers || (b.maybeUnhiddenMarkers = [])).push(this)
        }
        this.lines.push(a)
    }, kg.prototype.detachLine = function(a) {
        if (this.lines.splice(De(this.lines, a), 1), !this.lines.length && this.doc.cm) {
            var b = this.doc.cm.curOp;
            (b.maybeHiddenMarkers || (b.maybeHiddenMarkers = [])).push(this)
        }
    };
    var jg = 0,
        lg = a.SharedTextMarker = function(a, b) { this.markers = a, this.primary = b; for (var c = 0; c < a.length; ++c) a[c].parent = this };
    ye(lg), lg.prototype.clear = function() {
        if (!this.explicitlyCleared) {
            this.explicitlyCleared = !0;
            for (var a = 0; a < this.markers.length; ++a) this.markers[a].clear();
            te(this, "clear")
        }
    }, lg.prototype.find = function(a, b) { return this.primary.find(a, b) };
    var mg = a.LineWidget = function(a, b, c) {
        if (c)
            for (var d in c) c.hasOwnProperty(d) && (this[d] = c[d]);
        this.doc = a, this.node = b
    };
    ye(mg), mg.prototype.clear = function() {
        var a = this.doc.cm,
            b = this.line.widgets,
            c = this.line,
            d = Zd(c);
        if (null != d && b) {
            for (var e = 0; e < b.length; ++e) b[e] == this && b.splice(e--, 1);
            b.length || (c.widgets = null);
            var f = vd(this);
            Yd(c, Math.max(0, c.height - f)), a && Cb(a, function() { ud(a, c, -f), Jb(a, d, "widget") })
        }
    }, mg.prototype.changed = function() {
        var a = this.height,
            b = this.doc.cm,
            c = this.line;
        this.height = null;
        var d = vd(this) - a;
        d && (Yd(c, c.height + d), b && Cb(b, function() { b.curOp.forceUpdate = !0, ud(b, c, d) }))
    };
    var ng = a.Line = function(a, b, c) { this.text = a, gd(this, b), this.height = c ? c(this) : 1 };
    ye(ng), ng.prototype.lineNo = function() { return Zd(this) };
    var og = {},
        pg = {};
    Rd.prototype = {
        chunkSize: function() { return this.lines.length },
        removeInner: function(a, b) {
            for (var c = a, d = a + b; c < d; ++c) {
                var e = this.lines[c];
                this.height -= e.height, yd(e), te(e, "delete")
            }
            this.lines.splice(a, b)
        },
        collapse: function(a) { a.push.apply(a, this.lines) },
        insertInner: function(a, b, c) { this.height += c, this.lines = this.lines.slice(0, a).concat(b).concat(this.lines.slice(a)); for (var d = 0; d < b.length; ++d) b[d].parent = this },
        iterN: function(a, b, c) {
            for (var d = a + b; a < d; ++a)
                if (c(this.lines[a])) return !0
        }
    }, Sd.prototype = {
        chunkSize: function() { return this.size },
        removeInner: function(a, b) {
            this.size -= b;
            for (var c = 0; c < this.children.length; ++c) {
                var d = this.children[c],
                    e = d.chunkSize();
                if (a < e) {
                    var f = Math.min(b, e - a),
                        g = d.height;
                    if (d.removeInner(a, f), this.height -= g - d.height, e == f && (this.children.splice(c--, 1), d.parent = null), 0 == (b -= f)) break;
                    a = 0
                } else a -= e
            }
            if (this.size - b < 25 && (this.children.length > 1 || !(this.children[0] instanceof Rd))) {
                var h = [];
                this.collapse(h), this.children = [new Rd(h)], this.children[0].parent = this
            }
        },
        collapse: function(a) { for (var b = 0; b < this.children.length; ++b) this.children[b].collapse(a) },
        insertInner: function(a, b, c) {
            this.size += b.length, this.height += c;
            for (var d = 0; d < this.children.length; ++d) {
                var e = this.children[d],
                    f = e.chunkSize();
                if (a <= f) {
                    if (e.insertInner(a, b, c), e.lines && e.lines.length > 50) {
                        for (; e.lines.length > 50;) {
                            var g = e.lines.splice(e.lines.length - 25, 25),
                                h = new Rd(g);
                            e.height -= h.height, this.children.splice(d + 1, 0, h), h.parent = this
                        }
                        this.maybeSpill()
                    }
                    break
                }
                a -= f
            }
        },
        maybeSpill: function() {
            if (!(this.children.length <= 10)) {
                var a = this;
                do {
                    var b = a.children.splice(a.children.length - 5, 5),
                        c = new Sd(b);
                    if (a.parent) {
                        a.size -= c.size, a.height -= c.height;
                        var d = De(a.parent.children, a);
                        a.parent.children.splice(d + 1, 0, c)
                    } else {
                        var e = new Sd(a.children);
                        e.parent = a, a.children = [e, c], a = e
                    }
                    c.parent = a.parent
                } while (a.children.length > 10);
                a.parent.maybeSpill()
            }
        },
        iterN: function(a, b, c) {
            for (var d = 0; d < this.children.length; ++d) {
                var e = this.children[d],
                    f = e.chunkSize();
                if (a < f) {
                    var g = Math.min(b, f - a);
                    if (e.iterN(a, g, c)) return !0;
                    if (0 == (b -= g)) break;
                    a = 0
                } else a -= f
            }
        }
    };
    var qg = 0,
        rg = a.Doc = function(a, b, c) {
            if (!(this instanceof rg)) return new rg(a, b, c);
            null == c && (c = 0), Sd.call(this, [new Rd([new ng("", null)])]), this.first = c, this.scrollTop = this.scrollLeft = 0, this.cantEdit = !1, this.cleanGeneration = 1, this.frontier = c;
            var d = Ff(c, 0);
            this.sel = oa(d), this.history = new be(null), this.id = ++qg, this.modeOption = b, "string" == typeof a && (a = Ug(a)), Qd(this, { from: d, to: d, text: a }), Ba(this, oa(d), Dg)
        };
    rg.prototype = Ge(Sd.prototype, {
        constructor: rg,
        iter: function(a, b, c) { c ? this.iterN(a - this.first, b - a, c) : this.iterN(this.first, this.first + this.size, a) },
        insert: function(a, b) {
            for (var c = 0, d = 0; d < b.length; ++d) c += b[d].height;
            this.insertInner(a - this.first, b, c)
        },
        remove: function(a, b) { this.removeInner(a - this.first, b) },
        getValue: function(a) { var b = Xd(this, this.first, this.first + this.size); return a === !1 ? b : b.join(a || "\n") },
        setValue: Fb(function(a) {
            var b = Ff(this.first, 0),
                c = this.first + this.size - 1;
            wc(this, { from: b, to: Ff(c, Vd(this, c).text.length), text: Ug(a), origin: "setValue", full: !0 }, !0), Ba(this, oa(b))
        }),
        replaceRange: function(a, b, c, d) { b = qa(this, b), c = c ? qa(this, c) : b, Cc(this, a, b, c, d) },
        getRange: function(a, b, c) { var d = Wd(this, qa(this, a), qa(this, b)); return c === !1 ? d : d.join(c || "\n") },
        getLine: function(a) { var b = this.getLineHandle(a); return b && b.text },
        getLineHandle: function(a) { if (sa(this, a)) return Vd(this, a) },
        getLineNumber: function(a) { return Zd(a) },
        getLineHandleVisualStart: function(a) { return "number" == typeof a && (a = Vd(this, a)), od(a) },
        lineCount: function() { return this.size },
        firstLine: function() { return this.first },
        lastLine: function() { return this.first + this.size - 1 },
        clipPos: function(a) { return qa(this, a) },
        getCursor: function(a) { var b, c = this.sel.primary(); return b = null == a || "head" == a ? c.head : "anchor" == a ? c.anchor : "end" == a || "to" == a || a === !1 ? c.to() : c.from() },
        listSelections: function() { return this.sel.ranges },
        somethingSelected: function() { return this.sel.somethingSelected() },
        setCursor: Fb(function(a, b, c) { ya(this, qa(this, "number" == typeof a ? Ff(a, b || 0) : a), null, c) }),
        setSelection: Fb(function(a, b, c) { ya(this, qa(this, a), qa(this, b || a), c) }),
        extendSelection: Fb(function(a, b, c) { va(this, qa(this, a), b && qa(this, b), c) }),
        extendSelections: Fb(function(a, b) { wa(this, ta(this, a, b)) }),
        extendSelectionsBy: Fb(function(a, b) { wa(this, Ee(this.sel.ranges, a), b) }),
        setSelections: Fb(function(a, b, c) {
            if (a.length) {
                for (var d = 0, e = []; d < a.length; d++) e[d] = new ma(qa(this, a[d].anchor), qa(this, a[d].head));
                null == b && (b = Math.min(a.length - 1, this.sel.primIndex)), Ba(this, na(e, b), c)
            }
        }),
        addSelection: Fb(function(a, b, c) {
            var d = this.sel.ranges.slice(0);
            d.push(new ma(qa(this, a), qa(this, b || a))), Ba(this, na(d, d.length - 1), c)
        }),
        getSelection: function(a) {
            for (var b, c = this.sel.ranges, d = 0; d < c.length; d++) {
                var e = Wd(this, c[d].from(), c[d].to());
                b = b ? b.concat(e) : e
            }
            return a === !1 ? b : b.join(a || "\n")
        },
        getSelections: function(a) {
            for (var b = [], c = this.sel.ranges, d = 0; d < c.length; d++) {
                var e = Wd(this, c[d].from(), c[d].to());
                a !== !1 && (e = e.join(a || "\n")), b[d] = e
            }
            return b
        },
        replaceSelection: function(a, b, c) {
            for (var d = [], e = 0; e < this.sel.ranges.length; e++) d[e] = a;
            this.replaceSelections(d, b, c || "+input")
        },
        replaceSelections: Fb(function(a, b, c) {
            for (var d = [], e = this.sel, f = 0; f < e.ranges.length; f++) {
                var g = e.ranges[f];
                d[f] = { from: g.from(), to: g.to(), text: Ug(a[f]), origin: c }
            }
            for (var h = b && "end" != b && uc(this, d, b), f = d.length - 1; f >= 0; f--) wc(this, d[f]);
            h ? Aa(this, h) : this.cm && Ic(this.cm)
        }),
        undo: Fb(function() { yc(this, "undo") }),
        redo: Fb(function() { yc(this, "redo") }),
        undoSelection: Fb(function() { yc(this, "undo", !0) }),
        redoSelection: Fb(function() { yc(this, "redo", !0) }),
        setExtending: function(a) { this.extend = a },
        getExtending: function() { return this.extend },
        historySize: function() { for (var a = this.history, b = 0, c = 0, d = 0; d < a.done.length; d++) a.done[d].ranges || ++b; for (var d = 0; d < a.undone.length; d++) a.undone[d].ranges || ++c; return { undo: b, redo: c } },
        clearHistory: function() { this.history = new be(this.history.maxGeneration) },
        markClean: function() { this.cleanGeneration = this.changeGeneration(!0) },
        changeGeneration: function(a) { return a && (this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null), this.history.generation },
        isClean: function(a) { return this.history.generation == (a || this.cleanGeneration) },
        getHistory: function() { return { done: me(this.history.done), undone: me(this.history.undone) } },
        setHistory: function(a) {
            var b = this.history = new be(this.history.maxGeneration);
            b.done = me(a.done.slice(0), null, !0), b.undone = me(a.undone.slice(0), null, !0)
        },
        addLineClass: Fb(function(a, b, c) {
            return Lc(this, a, "gutter" == b ? "gutter" : "class", function(a) {
                var d = "text" == b ? "textClass" : "background" == b ? "bgClass" : "gutter" == b ? "gutterClass" : "wrapClass";
                if (a[d]) {
                    if (Qe(c).test(a[d])) return !1;
                    a[d] += " " + c
                } else a[d] = c;
                return !0
            })
        }),
        removeLineClass: Fb(function(a, b, c) {
            return Lc(this, a, "gutter" == b ? "gutter" : "class", function(a) {
                var d = "text" == b ? "textClass" : "background" == b ? "bgClass" : "gutter" == b ? "gutterClass" : "wrapClass",
                    e = a[d];
                if (!e) return !1;
                if (null == c) a[d] = null;
                else {
                    var f = e.match(Qe(c));
                    if (!f) return !1;
                    var g = f.index + f[0].length;
                    a[d] = e.slice(0, f.index) + (f.index && g != e.length ? " " : "") + e.slice(g) || null
                }
                return !0
            })
        }),
        addLineWidget: Fb(function(a, b, c) { return wd(this, a, b, c) }),
        removeLineWidget: function(a) { a.clear() },
        markText: function(a, b, c) { return Sc(this, qa(this, a), qa(this, b), c, "range") },
        setBookmark: function(a, b) { var c = { replacedWith: b && (null == b.nodeType ? b.widget : b), insertLeft: b && b.insertLeft, clearWhenEmpty: !1, shared: b && b.shared, handleMouseEvents: b && b.handleMouseEvents }; return a = qa(this, a), Sc(this, a, a, c, "bookmark") },
        findMarksAt: function(a) {
            a = qa(this, a);
            var b = [],
                c = Vd(this, a.line).markedSpans;
            if (c)
                for (var d = 0; d < c.length; ++d) {
                    var e = c[d];
                    (null == e.from || e.from <= a.ch) && (null == e.to || e.to >= a.ch) && b.push(e.marker.parent || e.marker)
                }
            return b
        },
        findMarks: function(a, b, c) {
            a = qa(this, a), b = qa(this, b);
            var d = [],
                e = a.line;
            return this.iter(a.line, b.line + 1, function(f) {
                var g = f.markedSpans;
                if (g)
                    for (var h = 0; h < g.length; h++) {
                        var i = g[h];
                        e == a.line && a.ch > i.to || null == i.from && e != a.line || e == b.line && i.from > b.ch || c && !c(i.marker) || d.push(i.marker.parent || i.marker)
                    }++e
            }), d
        },
        getAllMarks: function() {
            var a = [];
            return this.iter(function(b) {
                var c = b.markedSpans;
                if (c)
                    for (var d = 0; d < c.length; ++d) null != c[d].from && a.push(c[d].marker)
            }), a
        },
        posFromIndex: function(a) { var b, c = this.first; return this.iter(function(d) { var e = d.text.length + 1; return e > a ? (b = a, !0) : (a -= e, void++c) }), qa(this, Ff(c, b)) },
        indexFromPos: function(a) { a = qa(this, a); var b = a.ch; return a.line < this.first || a.ch < 0 ? 0 : (this.iter(this.first, a.line, function(a) { b += a.text.length + 1 }), b) },
        copy: function(a) { var b = new rg(Xd(this, this.first, this.first + this.size), this.modeOption, this.first); return b.scrollTop = this.scrollTop, b.scrollLeft = this.scrollLeft, b.sel = this.sel, b.extend = !1, a && (b.history.undoDepth = this.history.undoDepth, b.setHistory(this.getHistory())), b },
        linkedDoc: function(a) {
            a || (a = {});
            var b = this.first,
                c = this.first + this.size;
            null != a.from && a.from > b && (b = a.from), null != a.to && a.to < c && (c = a.to);
            var d = new rg(Xd(this, b, c), a.mode || this.modeOption, b);
            return a.sharedHist && (d.history = this.history), (this.linked || (this.linked = [])).push({ doc: d, sharedHist: a.sharedHist }), d.linked = [{ doc: this, isParent: !0, sharedHist: a.sharedHist }], Vc(d, Uc(this)), d
        },
        unlinkDoc: function(b) {
            if (b instanceof a && (b = b.doc), this.linked)
                for (var c = 0; c < this.linked.length; ++c) { var d = this.linked[c]; if (d.doc == b) { this.linked.splice(c, 1), b.unlinkDoc(this), Wc(Uc(this)); break } }
            if (b.history == this.history) {
                var e = [b.id];
                Td(b, function(a) { e.push(a.id) }, !0), b.history = new be(null), b.history.done = me(this.history.done, e), b.history.undone = me(this.history.undone, e)
            }
        },
        iterLinkedDocs: function(a) { Td(this, a) },
        getMode: function() { return this.mode },
        getEditor: function() { return this.cm }
    }), rg.prototype.eachLine = rg.prototype.iter;
    var sg = "iter insert remove copy getEditor constructor".split(" ");
    for (var tg in rg.prototype) rg.prototype.hasOwnProperty(tg) && De(sg, tg) < 0 && (a.prototype[tg] = function(a) { return function() { return a.apply(this.doc, arguments) } }(rg.prototype[tg]));
    ye(rg);
    var ug = a.e_preventDefault = function(a) { a.preventDefault ? a.preventDefault() : a.returnValue = !1 },
        vg = a.e_stopPropagation = function(a) { a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0 },
        wg = a.e_stop = function(a) { ug(a), vg(a) },
        xg = a.on = function(a, b, c) {
            if (a.addEventListener) a.addEventListener(b, c, !1);
            else if (a.attachEvent) a.attachEvent("on" + b, c);
            else {
                var d = a._handlers || (a._handlers = {}),
                    e = d[b] || (d[b] = []);
                e.push(c)
            }
        },
        yg = a.off = function(a, b, c) {
            if (a.removeEventListener) a.removeEventListener(b, c, !1);
            else if (a.detachEvent) a.detachEvent("on" + b, c);
            else {
                var d = a._handlers && a._handlers[b];
                if (!d) return;
                for (var e = 0; e < d.length; ++e)
                    if (d[e] == c) { d.splice(e, 1); break }
            }
        },
        zg = a.signal = function(a, b) {
            var c = a._handlers && a._handlers[b];
            if (c)
                for (var d = Array.prototype.slice.call(arguments, 2), e = 0; e < c.length; ++e) c[e].apply(null, d)
        },
        Ag = null,
        Bg = 30,
        Cg = a.Pass = { toString: function() { return "CodeMirror.Pass" } },
        Dg = { scroll: !1 },
        Eg = { origin: "*mouse" },
        Fg = { origin: "+move" };
    ze.prototype.set = function(a, b) { clearTimeout(this.id), this.id = setTimeout(b, a) };
    var Gg = a.countColumn = function(a, b, c, d, e) {
            null == b && (b = a.search(/[^\s\u00a0]/), b == -1 && (b = a.length));
            for (var f = d || 0, g = e || 0;;) {
                var h = a.indexOf("\t", f);
                if (h < 0 || h >= b) return g + (b - f);
                g += h - f, g += c - g % c, f = h + 1
            }
        },
        Hg = [""],
        Ig = function(a) { a.select() };
    wf ? Ig = function(a) { a.selectionStart = 0, a.selectionEnd = a.value.length } : nf && (Ig = function(a) { try { a.select() } catch (a) {} });
    var Jg, Kg = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,
        Lg = a.isWordChar = function(a) { return /\w/.test(a) || a > "" && (a.toUpperCase() != a.toLowerCase() || Kg.test(a)) },
        Mg = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
    Jg = document.createRange ? function(a, b, c, d) { var e = document.createRange(); return e.setEnd(d || a, c), e.setStart(a, b), e } : function(a, b, c) { var d = document.body.createTextRange(); try { d.moveToElementText(a.parentNode) } catch (a) { return d } return d.collapse(!0), d.moveEnd("character", c), d.moveStart("character", b), d };
    var Ng = a.contains = function(a, b) {
        if (3 == b.nodeType && (b = b.parentNode), a.contains) return a.contains(b);
        do
            if (11 == b.nodeType && (b = b.host), b == a) return !0;
        while (b = b.parentNode)
    };
    nf && of < 11 && (Pe = function() { try { return document.activeElement } catch (a) { return document.body } });
    var Og, Pg, Qg = a.rmClass = function(a, b) {
            var c = a.className,
                d = Qe(b).exec(c);
            if (d) {
                var e = c.slice(d.index + d[0].length);
                a.className = c.slice(0, d.index) + (e ? d[1] + e : "")
            }
        },
        Rg = a.addClass = function(a, b) {
            var c = a.className;
            Qe(b).test(c) || (a.className += (c ? " " : "") + b)
        },
        Sg = !1,
        Tg = function() { if (nf && of < 9) return !1; var a = Me("div"); return "draggable" in a || "dragDrop" in a }(),
        Ug = a.splitLines = 3 != "\n\nb".split(/\n/).length ? function(a) {
            for (var b = 0, c = [], d = a.length; b <= d;) {
                var e = a.indexOf("\n", b);
                e == -1 && (e = a.length);
                var f = a.slice(b, "\r" == a.charAt(e - 1) ? e - 1 : e),
                    g = f.indexOf("\r");
                g != -1 ? (c.push(f.slice(0, g)), b += g + 1) : (c.push(f), b = e + 1)
            }
            return c
        } : function(a) { return a.split(/\r\n?|\n/) },
        Vg = window.getSelection ? function(a) { try { return a.selectionStart != a.selectionEnd } catch (a) { return !1 } } : function(a) { try { var b = a.ownerDocument.selection.createRange() } catch (a) {} return !(!b || b.parentElement() != a) && 0 != b.compareEndPoints("StartToEnd", b) },
        Wg = function() { var a = Me("div"); return "oncopy" in a || (a.setAttribute("oncopy", "return;"), "function" == typeof a.oncopy) }(),
        Xg = null,
        Yg = { 3: "Enter", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt", 19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert", 46: "Delete", 59: ";", 61: "=", 91: "Mod", 92: "Mod", 93: "Mod", 107: "=", 109: "-", 127: "Delete", 173: "-", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'", 63232: "Up", 63233: "Down", 63234: "Left", 63235: "Right", 63272: "Delete", 63273: "Home", 63275: "End", 63276: "PageUp", 63277: "PageDown", 63302: "Insert" };
    a.keyNames = Yg,
        function() { for (var a = 0; a < 10; a++) Yg[a + 48] = Yg[a + 96] = String(a); for (var a = 65; a <= 90; a++) Yg[a] = String.fromCharCode(a); for (var a = 1; a <= 12; a++) Yg[a + 111] = Yg[a + 63235] = "F" + a }();
    var Zg, $g = function() {
        function a(a) { return a <= 247 ? c.charAt(a) : 1424 <= a && a <= 1524 ? "R" : 1536 <= a && a <= 1773 ? d.charAt(a - 1536) : 1774 <= a && a <= 2220 ? "r" : 8192 <= a && a <= 8203 ? "w" : 8204 == a ? "b" : "L" }

        function b(a, b, c) { this.level = a, this.from = b, this.to = c }
        var c = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN",
            d = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm",
            e = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,
            f = /[stwN]/,
            g = /[LRr]/,
            h = /[Lb1n]/,
            i = /[1n]/,
            j = "L";
        return function(c) {
            if (!e.test(c)) return !1;
            for (var d, k = c.length, l = [], m = 0; m < k; ++m) l.push(d = a(c.charCodeAt(m)));
            for (var m = 0, n = j; m < k; ++m) { var d = l[m]; "m" == d ? l[m] = n : n = d }
            for (var m = 0, o = j; m < k; ++m) { var d = l[m]; "1" == d && "r" == o ? l[m] = "n" : g.test(d) && (o = d, "r" == d && (l[m] = "R")) }
            for (var m = 1, n = l[0]; m < k - 1; ++m) { var d = l[m]; "+" == d && "1" == n && "1" == l[m + 1] ? l[m] = "1" : "," != d || n != l[m + 1] || "1" != n && "n" != n || (l[m] = n), n = d }
            for (var m = 0; m < k; ++m) {
                var d = l[m];
                if ("," == d) l[m] = "N";
                else if ("%" == d) {
                    for (var p = m + 1; p < k && "%" == l[p]; ++p);
                    for (var q = m && "!" == l[m - 1] || p < k && "1" == l[p] ? "1" : "N", r = m; r < p; ++r) l[r] = q;
                    m = p - 1
                }
            }
            for (var m = 0, o = j; m < k; ++m) { var d = l[m]; "L" == o && "1" == d ? l[m] = "L" : g.test(d) && (o = d) }
            for (var m = 0; m < k; ++m)
                if (f.test(l[m])) {
                    for (var p = m + 1; p < k && f.test(l[p]); ++p);
                    for (var s = "L" == (m ? l[m - 1] : j), t = "L" == (p < k ? l[p] : j), q = s || t ? "L" : "R", r = m; r < p; ++r) l[r] = q;
                    m = p - 1
                }
            for (var u, v = [], m = 0; m < k;)
                if (h.test(l[m])) {
                    var w = m;
                    for (++m; m < k && h.test(l[m]); ++m);
                    v.push(new b(0, w, m))
                } else {
                    var x = m,
                        y = v.length;
                    for (++m; m < k && "L" != l[m]; ++m);
                    for (var r = x; r < m;)
                        if (i.test(l[r])) {
                            x < r && v.splice(y, 0, new b(1, x, r));
                            var z = r;
                            for (++r; r < m && i.test(l[r]); ++r);
                            v.splice(y, 0, new b(2, z, r)), x = r
                        } else ++r;
                    x < m && v.splice(y, 0, new b(1, x, m))
                }
            return 1 == v[0].level && (u = c.match(/^\s+/)) && (v[0].from = u[0].length, v.unshift(new b(0, 0, u[0].length))), 1 == Ce(v).level && (u = c.match(/\s+$/)) && (Ce(v).to -= u[0].length, v.push(new b(0, k - u[0].length, k))), 2 == v[0].level && v.unshift(new b(1, v[0].to, v[0].to)), v[0].level != Ce(v).level && v.push(new b(v[0].level, k, k)), v
        }
    }();
    return a.version = "5.4.1", a
}));




(function(a) { a(CodeMirror) }(function(a) {
    "use strict";

    function b(a, b) {
        this.cm = a, this.options = this.buildOptions(b), this.widget = null, this.debounce = 0, this.tick = 0, this.startPos = this.cm.getCursor(), this.startLen = this.cm.getLine(this.startPos.line).length;
        var c = this;
        a.on("cursorActivity", this.activityFunc = function() { c.cursorActivity() })
    }

    function c(a) { return "string" == typeof a ? a : a.text }

    function d(a, b) {
        function c(a, c) {
            var e;
            e = "string" != typeof c ? function(a) { return c(a, b) } : d.hasOwnProperty(c) ? d[c] : c, f[a] = e
        }
        var d = { Up: function() { b.moveFocus(-1) }, Down: function() { b.moveFocus(1) }, PageUp: function() { b.moveFocus(-b.menuSize() + 1, !0) }, PageDown: function() { b.moveFocus(b.menuSize() - 1, !0) }, Home: function() { b.setFocus(0) }, End: function() { b.setFocus(b.length - 1) }, Enter: b.pick, Tab: b.pick, Esc: b.close },
            e = a.options.customKeys,
            f = e ? {} : d;
        if (e)
            for (var g in e) e.hasOwnProperty(g) && c(g, e[g]);
        var h = a.options.extraKeys;
        if (h)
            for (var g in h) h.hasOwnProperty(g) && c(g, h[g]);
        return f
    }

    function e(a, b) {
        for (; b && b != a;) {
            if ("LI" === b.nodeName.toUpperCase() && b.parentNode == a) return b;
            b = b.parentNode
        }
    }

    function f(b, f) {
        this.completion = b, this.data = f, this.picked = !1;
        var i = this,
            j = b.cm,
            k = this.hints = document.createElement("ul");
        k.className = "CodeMirror-hints", this.selectedHint = f.selectedHint || 0;
        for (var l = f.list, m = 0; m < l.length; ++m) {
            var n = k.appendChild(document.createElement("li")),
                o = l[m],
                p = g + (m != this.selectedHint ? "" : " " + h);
            null != o.className && (p = o.className + " " + p), n.className = p, o.render ? o.render(n, f, o) : n.appendChild(document.createTextNode(o.displayText || c(o))), n.hintId = m
        }
        var q = j.cursorCoords(b.options.alignWithWord ? f.from : null),
            r = q.left,
            s = q.bottom,
            t = !0;
        k.style.left = r + "px", k.style.top = s + "px";
        var u = window.innerWidth || Math.max(document.body.offsetWidth, document.documentElement.offsetWidth),
            v = window.innerHeight || Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
        (b.options.container || document.body).appendChild(k);
        var w = k.getBoundingClientRect(),
            x = w.bottom - v;
        if (x > 0) {
            var y = w.bottom - w.top,
                z = q.top - (q.bottom - w.top);
            if (z - y > 0) k.style.top = (s = q.top - y) + "px", t = !1;
            else if (y > v) {
                k.style.height = v - 5 + "px", k.style.top = (s = q.bottom - w.top) + "px";
                var A = j.getCursor();
                f.from.ch != A.ch && (q = j.cursorCoords(A), k.style.left = (r = q.left) + "px", w = k.getBoundingClientRect())
            }
        }
        var B = w.right - u;
        if (B > 0 && (w.right - w.left > u && (k.style.width = u - 5 + "px", B -= w.right - w.left - u), k.style.left = (r = q.left - B) + "px"), j.addKeyMap(this.keyMap = d(b, { moveFocus: function(a, b) { i.changeActive(i.selectedHint + a, b) }, setFocus: function(a) { i.changeActive(a) }, menuSize: function() { return i.screenAmount() }, length: l.length, close: function() { b.close() }, pick: function() { i.pick() }, data: f })), b.options.closeOnUnfocus) {
            var C;
            j.on("blur", this.onBlur = function() { C = setTimeout(function() { b.close() }, 100) }), j.on("focus", this.onFocus = function() { clearTimeout(C) })
        }
        var D = j.getScrollInfo();
        return j.on("scroll", this.onScroll = function() {
            var a = j.getScrollInfo(),
                c = j.getWrapperElement().getBoundingClientRect(),
                d = s + D.top - a.top,
                e = d - (window.pageYOffset || (document.documentElement || document.body).scrollTop);
            return t || (e += k.offsetHeight), e <= c.top || e >= c.bottom ? b.close() : (k.style.top = d + "px", void(k.style.left = r + D.left - a.left + "px"))
        }), a.on(k, "dblclick", function(a) {
            var b = e(k, a.target || a.srcElement);
            b && null != b.hintId && (i.changeActive(b.hintId), i.pick())
        }), a.on(k, "click", function(a) {
            var c = e(k, a.target || a.srcElement);
            c && null != c.hintId && (i.changeActive(c.hintId), b.options.completeOnSingleClick && i.pick())
        }), a.on(k, "mousedown", function() { setTimeout(function() { j.focus() }, 20) }), a.signal(f, "select", l[0], k.firstChild), !0
    }
    var g = "CodeMirror-hint",
        h = "CodeMirror-hint-active";
    a.showHint = function(a, b, c) {
        if (!b) return a.showHint(c);
        c && c.async && (b.async = !0);
        var d = { hint: b };
        if (c)
            for (var e in c) d[e] = c[e];
        return a.showHint(d)
    }, a.defineExtension("showHint", function(c) {
        if (!(this.listSelections().length > 1 || this.somethingSelected())) {
            this.state.completionActive && this.state.completionActive.close();
            var d = this.state.completionActive = new b(this, c);
            d.options.hint && (a.signal(this, "startCompletion", this), d.update(!0))
        }
    });
    var i = window.requestAnimationFrame || function(a) { return setTimeout(a, 1e3 / 60) },
        j = window.cancelAnimationFrame || clearTimeout;
    b.prototype = {
        close: function() { this.active() && (this.cm.state.completionActive = null, this.tick = null, this.cm.off("cursorActivity", this.activityFunc), this.widget && this.data && a.signal(this.data, "close"), this.widget && this.widget.close(), a.signal(this.cm, "endCompletion", this.cm)) },
        active: function() { return this.cm.state.completionActive == this },
        pick: function(b, d) {
            var e = b.list[d];
            e.hint ? e.hint(this.cm, b, e) : this.cm.replaceRange(c(e), e.from || b.from, e.to || b.to, "complete"), a.signal(b, "pick", e), this.close()
        },
        cursorActivity: function() {
            this.debounce && (j(this.debounce), this.debounce = 0);
            var a = this.cm.getCursor(),
                b = this.cm.getLine(a.line);
            if (a.line != this.startPos.line || b.length - a.ch != this.startLen - this.startPos.ch || a.ch < this.startPos.ch || this.cm.somethingSelected() || a.ch && this.options.closeCharacters.test(b.charAt(a.ch - 1))) this.close();
            else {
                var c = this;
                this.debounce = i(function() { c.update() }), this.widget && this.widget.disable()
            }
        },
        update: function(b) {
            if (null != this.tick)
                if (this.data && a.signal(this.data, "update"), this.options.hint.async) {
                    var c = ++this.tick,
                        d = this;
                    this.options.hint(this.cm, function(a) { d.tick == c && d.finishUpdate(a, b) }, this.options)
                } else this.finishUpdate(this.options.hint(this.cm, this.options), b)
        },
        finishUpdate: function(b, c) {
            this.data = b;
            var d = this.widget && this.widget.picked || c && this.options.completeSingle;
            this.widget && this.widget.close(), b && b.list.length && (d && 1 == b.list.length ? this.pick(b, 0) : (this.widget = new f(this, b), a.signal(b, "shown")))
        },
        buildOptions: function(a) {
            var b = this.cm.options.hintOptions,
                c = {};
            for (var d in k) c[d] = k[d];
            if (b)
                for (var d in b) void 0 !== b[d] && (c[d] = b[d]);
            if (a)
                for (var d in a) void 0 !== a[d] && (c[d] = a[d]);
            return c
        }
    }, f.prototype = {
        close: function() {
            if (this.completion.widget == this) {
                this.completion.widget = null, this.hints.parentNode.removeChild(this.hints), this.completion.cm.removeKeyMap(this.keyMap);
                var a = this.completion.cm;
                this.completion.options.closeOnUnfocus && (a.off("blur", this.onBlur), a.off("focus", this.onFocus)), a.off("scroll", this.onScroll)
            }
        },
        disable: function() {
            this.completion.cm.removeKeyMap(this.keyMap);
            var a = this;
            this.keyMap = { Enter: function() { a.picked = !0 } }, this.completion.cm.addKeyMap(this.keyMap)
        },
        pick: function() { this.completion.pick(this.data, this.selectedHint) },
        changeActive: function(b, c) {
            if (b >= this.data.list.length ? b = c ? this.data.list.length - 1 : 0 : b < 0 && (b = c ? 0 : this.data.list.length - 1), this.selectedHint != b) {
                var d = this.hints.childNodes[this.selectedHint];
                d.className = d.className.replace(" " + h, ""), d = this.hints.childNodes[this.selectedHint = b], d.className += " " + h, d.offsetTop < this.hints.scrollTop ? this.hints.scrollTop = d.offsetTop - 3 : d.offsetTop + d.offsetHeight > this.hints.scrollTop + this.hints.clientHeight && (this.hints.scrollTop = d.offsetTop + d.offsetHeight - this.hints.clientHeight + 3), a.signal(this.data, "select", this.data.list[this.selectedHint], d)
            }
        },
        screenAmount: function() { return Math.floor(this.hints.clientHeight / this.hints.firstChild.offsetHeight) || 1 }
    }, a.registerHelper("hint", "auto", function(b, c) {
        var d, e = b.getHelpers(b.getCursor(), "hint");
        if (e.length)
            for (var f = 0; f < e.length; f++) { var g = e[f](b, c); if (g && g.list.length) return g } else if (d = b.getHelper(b.getCursor(), "hintWords")) { if (d) return a.hint.fromList(b, { words: d }) } else if (a.hint.anyword) return a.hint.anyword(b, c)
    }), a.registerHelper("hint", "fromList", function(b, c) {
        for (var d = b.getCursor(), e = b.getTokenAt(d), f = [], g = 0; g < c.words.length; g++) {
            var h = c.words[g];
            h.slice(0, e.string.length) == e.string && f.push(h)
        }
        if (f.length) return { list: f, from: a.Pos(d.line, e.start), to: a.Pos(d.line, e.end) }
    }), a.commands.autocomplete = a.showHint;
    var k = { hint: a.hint.auto, completeSingle: !0, alignWithWord: !0, closeCharacters: /[\s()\[\]{};:>,]/, closeOnUnfocus: !0, completeOnSingleClick: !1, container: null, customKeys: null, extraKeys: null };
    a.defineOption("hintOptions", null)
}));
(function(a) { a(CodeMirror) }(function(a) {
    function b(a, b) { for (var c = 0, d = a.length; c < d; ++c) b(a[c]) }

    function c(a, b) {
        if (!Array.prototype.indexOf) {
            for (var c = a.length; c--;)
                if (a[c] === b) return !0;
            return !1
        }
        return a.indexOf(b) != -1
    }

    function d(b, c, d, e) {
        var h = b.getCursor(),
            i = d(b, h);
        if (!/\b(?:string)\b/.test(i.type)) {
            i.state = a.innerMode(b.getMode(), i.state).state, /^[\w$_]*$/.test(i.string) ? i.end > h.ch && (i.end = h.ch, i.string = i.string.slice(0, h.ch - i.start)) : i = { start: h.ch, end: h.ch, string: "", state: i.state, type: "." == i.string ? "property" : null };
            for (var j = i;
                "property" == j.type;) {
                if (j = d(b, g(h.line, j.start)), "." != j.string) return;
                if (j = d(b, g(h.line, j.start)), !k) var k = [];
                k.push(j)
            }
            return { list: f(i, k, c, e), from: g(h.line, i.start), to: g(h.line, i.end) }
        }
    }

    function e(b, c) { return d(b, a.keywords, function(a, b) { return a.getTokenAt(b) }, c) }

    function f(a, d, e, f) {
        function g(a) { 0 != a.lastIndexOf(i, 0) || c(h, a) || h.push(a) }
        var h = [],
            i = a.string.toUpperCase();
        return i ? (d && d.length ? d.pop() : b(e, g), h) : h
    }
    var g = a.Pos;
    a.registerHelper("hint", "formula", e)
}));
(function(a) { a(CodeMirror) }(function(a) {
    "use strict";
    a.defineMode("formula", function() {
        function b(a) { for (var b = {}, c = 0, d = a.length; c < d; ++c) b[a[c]] = !0; return b }

        function c(a, b) {
            if (a.eatSpace()) return null;
            var c = a.next();
            if ('"' === c || "'" === c) return d(a, c), "string";
            if ("​" === c) return d(a, c), "field";
            if (/[\[\],\(\)]/.test(c)) return "bracket";
            if (/[+\-*\/=<>!&|]/.test(c)) return "operator";
            if (/\d/.test(c)) return a.eatWhile(/[\d\.]/), "number";
            a.eatWhile(/[\w]/);
            var e = a.current();
            return f.hasOwnProperty(e) ? "atom" : g.hasOwnProperty(e) ? "keyword" : h.hasOwnProperty(e) ? "deprecate" : null
        }

        function d(a, b) {
            for (var c, d = !1; null != (c = a.next());) {
                if (c === b && !d) return !1;
                d = !d && "\\" === c
            }
            return d
        }

        function e(a, b) { return (b.tokens[0] || c)(a, b) }
        var f = b(["false", "true"]),
            g = b(a.keywords),
            h = b(["MAP"]);
        return { startState: function() { return { tokens: [] } }, token: function(a, b) { return e(a, b) }, fold: "brace" }
    }), a.defineMIME("text/fx-formula", "formula")
}));