define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var Foundation = require('Foundation');

    exports.show = function(options) {
        options = Foundation.apply({
            anchor: null,
            position: "topLeft",
            content: null,
            maxWidth: null,
            animation: !0,
            type: "info"
        }, options);

        var popoverElement = $('<div class="x-ui-popover"/>').appendTo("body");

        if (options.maxWidth) {
            popoverElement.css({
                "max-width": options.maxWidth
            });
        }

        if (options.type) {
            popoverElement.addClass(options.type);
        }

        if (options.animation) {
            popoverElement.addClass('animation');
        }

        if (options.content) {
            options.content.appendTo(popoverElement);
        }

        var anchorOffset = options.anchor.offset();
        var styles = {
            'z-index': Widget.zIndex++
        };

        switch (options.position) {
            case "topLeft":
                popoverElement.addClass("top");
                styles.left = Math.max(anchorOffset.left + options.anchor.width() / 2 - popoverElement.width() / 2 - 5, 4)
                styles.bottom = document.body.clientHeight - anchorOffset.top + 8;
                break;
            case "topRight":
                popoverElement.addClass("top");
                styles.right = Math.max(document.body.clientWidth - anchorOffset.left - options.anchor.width() / 2 - popoverElement.width() / 2 - 5, 4);
                styles.bottom = document.body.clientHeight - anchorOffset.top + 8;
                break;
            case "bottomLeft":
                popoverElement.addClass("bottom");
                styles.left = Math.max(anchorOffset.left + options.anchor.width() / 2 - popoverElement.width() / 2 - 5, 4);
                styles.top = anchorOffset.top + options.anchor.height() + 8;
                break;
            case "bottomRight":
        }

        popoverElement.css(styles);
        popoverElement.addClass("fadein")
    }

    exports.close = function() {
        var popoverElement = $(".x-ui-popover");
        if (!Foundation.isEmpty(popoverElement)) {
            popoverElement.remove();
            popoverElement = null;
        }
    }
});