define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var Widget = require('./widget');
    var Button = require('./button');

    function applyCallback(callback, scope, args) {
        if (Foundation.isFunction(callback)) {
            return callback.apply(scope, args || []);
        } else {
            return callback
        }
    }

    exports.bubble = function(options) {
        var c = Foundation.apply({
            anchor: null,
            msg: "",
            minWidth: null,
            contentWidget: null,
            contentHTML: null,
            contentPadding: 10,
            onContentCreate: null,
            onCancel: null,
            onOk: null,
            type: "info",
            width4Btn: 100,
            text4Cancel: "取消",
            text4Ok: "确定",
            dockPosition: "left",
            edge: 150,
            onShow: null,
            onClose: null,
            animation: true,
            scrollObj: null,
            hAdjust: 0
        }, options);

        if (Foundation.isEmpty(options.anchor)) {
            return
        }

        var d = $('<div class="x-msg-bubble"/>').addClass(c.type);
        c.animation && d.addClass("animation");
        c.minWidth && d.css({ "min-width": c.minWidth });
        var e, f = $('<div class="content"/>').css({ padding: c.contentPadding }).appendTo(d);

        if (Foundation.isEmpty(c.msg)) {
            if (c.contentWidget) {
                c.contentWidget.renderEl = $("<div/>").appendTo(f);
                e = Widget.create(c.contentWidget)
            } else {
                c.contentHTML && c.contentHTML.appendTo(f)
            }
        } else {
            $("<span/>").text(c.msg).appendTo(f);
        }

        var g = !1;

        if (c.text4Cancel) {
            g = !0;
            new Button({
                renderEl: $("<div/>").appendTo(d),
                extClses: ["navi-btn-cancel"],
                style: "white",
                text: c.text4Cancel,
                width: c.width4Btn,
                onClick: function(a) {
                    if (applyCallback(c.onCancel, this, [e, a]) !== false) {
                        o()
                    }
                }
            })
        }
        if (c.text4Ok) {
            g = !0;
            var h = "green";
            "error" === c.type && (h = "red");
            new Button({
                renderEl: $("<div/>").appendTo(d),
                extClses: ["navi-btn-ok"],
                style: h,
                text: c.text4Ok,
                width: c.width4Btn,
                onClick: function(a) {
                    if (applyCallback(c.onOk, this, [e, a]) !== false) {
                        o()
                    }
                }
            })
        }
        g && f.css({ "padding-bottom": c.contentPadding + 50 });
        var i = $('<div class="triangle-up"/>').appendTo(d),
            j = c.anchor.offset(),
            k = j.top + c.anchor.height() + 8 - $("body").offset().top,
            l = {
                "z-index": Widget.zIndex++
            },
            m = Math.min(c.edge, document.body.clientHeight / 2);

        if (document.body.clientHeight + document.body.scrollTop - k <= m) {
            l.top = "auto";
            l.bottom = document.body.clientHeight - j.top + 8;
            d.addClass("dock-bottom")
        } else {
            l.top = k;
            l.bottom = "auto";
            d.addClass("dock-top")
        }
        var n = c.hAdjust || 0;
        switch (c.dockPosition) {
            case "left":
                d.addClass("dock-left");
                l.left = j.left + c.anchor.width() / 2 - 8 - n;
                i.css({ left: n });
                break;
            case "right":
                d.addClass("dock-right");
                l.right = document.body.clientWidth - j.left - c.anchor.width() / 2 - 8 - n;
                i.css({ right: n })
        }
        var o = function() {
            applyCallback(c.onClose, this, arguments);
            d.removeClass("active");
            $(document).unbind("mousedown.bubble");
            c.scrollObj && $(c.scrollObj).unbind("scroll.bubble");
            setTimeout(function() {
                d.remove()
            }, c.animation ? 500 : 0)
        };

        d.css(l).appendTo("body");
        setTimeout(function() {
            d.addClass("active");
            applyCallback(c.onShow, this, [e]);
            var b = function(b) {
                var c = $(b.target).closest(".x-msg-bubble,.x-dropdown");
                0 === c.length && o()
            };
            $(document).bind("mousedown.bubble", b);
            c.scrollObj && $(c.scrollObj).bind("scroll.bubble", b)
        }, 0)

    };

    exports.toast = function (b) {
        var c = $.extend({ dockPosition: "topcenter", msg: "", type: "info", onShow: null, onClose: null, timeout: 300, duration: 3e3 }, b);
        if (!($(".x-msg-toast").length > 0 || Foundation.isEmpty(c.msg))) {
            var d = $('<div class="x-msg-toast"/>').addClass(c.dockPosition).appendTo("body"),
                e = $('<div class="content"/>').addClass(c.type).appendTo(d),
                f = $('<div class="toast-icon"/>').append($('<i class="icon-toast-type"/>')).appendTo(e);
            $("<div/>").text(c.msg).appendTo(e), f.css("line-height", d.height() + "px"), d.fadeIn(c.timeout, function() {
                var a = setTimeout(function() { d.fadeOut(c.timeout, function() { d.remove() }) }, c.duration);
                d.click(function() { clearTimeout(a), d.fadeOut(c.timeout, function() { d.remove() }) })
            })
        }
    };

});