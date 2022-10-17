define(function(require, exports, module) {
    var Class = require('Class');
    var Widget = require('./widget');
    var Button = require('./button');
    var Dialog = require('./dialog');
    var Foundation = require('Foundation');

    var ConfirmDialogWidget = Class.create({
        extend: Dialog,
        _defaultOptions: function() {
            return Foundation.apply(ConfirmDialogWidget.superclass._defaultOptions.apply(this), {
                text4Ok: "确定",
                text4Cancel: "取消",
                btnPosition: "right",
                autoClose: false,
                onOk: null,
                onCancel: null
            });
        },
        _init: function() {
            ConfirmDialogWidget.superclass._init.apply(this);
            this._createButtonGroup()
        },

        _createButtonGroup: function() {
            var self = this;
            var options = this.options;
            var padding = Foundation.isEmpty(options.contentWidget.padding) ? 15 : options.contentWidget.padding;

            var buttonRowElement = this.el.buttonRowElement = $('<div class="dialog-btn-row"/>').css({
                bottom: padding
            }).appendTo(this.el.content);

            var okBtn = this.el.okBtn = $('<div class="dialog-btn ok-btn"/>');
            var cancelBtn = this.el.cancelBtn = $('<div class="dialog-btn cancel-btn"/>');

            if (options.btnPosition == 'right') {
                buttonRowElement.css({
                    right: padding
                });
                cancelBtn.css({
                    "margin-left": padding
                })
            } else if (options.btnPosition == 'left') {
                buttonRowElement.css({
                    left: padding
                });
                okBtn.css({
                    "margin-right": padding
                })
            }

            if (options.text4Ok) {
                this.btnOk = new Button({
                    renderEl: okBtn.appendTo(buttonRowElement),
                    widgetName: "confirmBtnOK",
                    text: options.text4Ok,
                    style: "green",
                    onClick: function() {
                        self._applyCallback(options.onOk, this) !== false && self.close();
                    }
                });
            }

            if (options.text4Cancel) {
                this.btnCancel = new Button({
                    renderEl: cancelBtn.appendTo(buttonRowElement),
                    widgetName: "confirmBtnCancel",
                    text: options.text4Cancel,
                    style: "white",
                    onClick: function() {
                        self._applyCallback(options.onCancel, this) !== false && self.close();
                    }
                })
            }
        },

        getOkBtn: function() {
            return this.el.okBtn
        },
        getCancelBtn: function() {
            return this.el.cancelBtn
        }

    });

    Widget.register('confirmdialog', ConfirmDialogWidget);

    return ConfirmDialogWidget;
});