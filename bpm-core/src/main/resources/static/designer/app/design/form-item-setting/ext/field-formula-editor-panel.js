define(function(require, exports, module) {
    var Class = require('Class');
    var Foundation = require('Foundation');
    var Widget = require('../../../component/widget');
    var components = require('../../../component/index');
    var Formula = require('./formula');

    var FormulaEditorPanel = Class.create({
        CONST: {
            NAME_FILED_CLS: "cm-field-name",
            VALUE_FIELD_CLS: "cm-field-value",
            INVALID_FIELD_CLS: "cm-field-invalid",
            DEPRECATE_FIELD_CLS: "cm-deprecate"
        },
        extend: Widget,
        _defaultOptions: function() {
            return Foundation.apply(FormulaEditorPanel.superclass._defaultOptions.apply(this), {
                baseCls: "x-formula-editor",
                text: "公式",
                hasFunction: true,
                labelMap: null
            });
        },
        _init: function() {
            FormulaEditorPanel.superclass._init.apply(this);
            var options = this.options;
            var tipHtmls = ["<li>请从左侧面板选择包含的字段名</li>"];

            if (options.hasFunction) {
                tipHtmls.push('<li>支持<span class="x-c-red">英文</span>运算符模式下的基础运算及部分<a target="" href="javascropt:void(0);" class="x-c-key">高级函数</a></li>');
                tipHtmls.push('<li>公式编辑样式举例:<span class="formula-key">SUM</span>(<span class="formula-field">基本工资</span>,<span class="formula-field">加班工资</span>)</li>');
                this.el.target.addClass("has-func")
            }

            this.el.target.append($('<div class="formula-head"/>')
                    .append($('<span class="formula-name"/>').text(options.text))
                    .append($('<span class="formula-equal"/>').text("=")))
                .append($('<div class="formula-foot"><ul>' + tipHtmls.join('') + "</ul></div>"));

            this.editor = CodeMirror(this.el.target[0], {
                keywords: Object.keys(Formula),
                textWrapping: !0,
                lineWrapping: !0,
                lineNumbers: !1,
                specialChars: /[\u0000-\u001f\u007f\u00ad\u200c-\u200f\u2028\u2029\ufeff]/,
                mode: "formula"
            });
            this.editor.on("change", function(a, b) {
                CodeMirror.showHint(a, CodeMirror.formulaHint, {
                    completeSingle: false
                })
            });
            this.editor.addKeyMap({
                Backspace: function(a) {
                    var b = a.getTokenAt(a.getCursor());
                    if ("field" == b.type) {
                        var c = a.getCursor().line;
                        a.setSelection(new CodeMirror.Pos(c, b.start), new CodeMirror.Pos(c, b.end));
                        a.replaceSelection("", null, "+delete")
                    } else {
                        a.execCommand("delCharBefore")
                    }
                }
            })
        },

        insertField: function(field, b) {
            var fromCursor = this.editor.getCursor();
            this.editor.replaceSelection("​" + field.text + "​");
            var toCursor = this.editor.getCursor();
            this._markField({
                from: fromCursor,
                to: toCursor,
                field: field.name
            });
            this.editor.focus()
        },

        _markField: function(option) {
            var calssName = this.CONST.VALUE_FIELD_CLS;
            this.editor.markText(option.from, option.to, {
                className: calssName,
                attr: { "data-field": option.field }
            })
        },

        checkValidate: function() {
            var lineDivElement = $(this.editor.display.lineDiv);
            if (!Foundation.isEmpty(lineDivElement.find('span.' + this.CONST.DEPRECATE_FIELD_CLS))) {
                //this.setInvalidateType("deprecated field");
                return false;
            }
            if (!Foundation.isEmpty(lineDivElement.find('span.' + this.CONST.INVALID_FIELD_CLS))) {
                //this.setInvalidateType("invalid field");
                return false;
            } else {
                //this.setInvalidateType(null)
                return true;
            }
        },

        getValue: function() {
            var self = this;
            var CONST = this.CONST;
            var lineContentElements = $(this.editor.display.lineDiv).find(".CodeMirror-line-content");

            var fields = [],
                b = [];

            lineContentElements.each(function() {
                var g = [];
                var lineElement = $(this);
                lineElement.children('span').each(function() {
                    var spanElement = $(this);
                    var field = spanElement.attr('data-field');
                    if (spanElement.hasClass(CONST.NAME_FILED_CLS)) {
                        g.push("$" + field + "#");
                    } else if (spanElement.hasClass(CONST.VALUE_FIELD_CLS)) {
                        g.push("$" + field + "#");
                        fields.indexOf(field) === -1 && fields.push(field);
                    } else {
                        if (spanElement.hasClass(CONST.DEPRECATE_FIELD_CLS) || spanElement.hasClass(CONST.INVALID_FIELD_CLS)) {
                            return;
                        }
                        g.push(spanElement.text())
                    }
                });
                b.push(g.join("").replace(/\u200b/g, "").replace(/\u00a0/g, " "))
            });

            return {
                value: b.join('\n'),
                widgets: fields
            }
        },

        // setValue: function(value) {
        //     var self = this;
        //     var options = this.options;

        //     if (Foundation.isEmpty(value)) {
        //         return
        //     }
        //     var lineValues = value.split('\n');
        //     var vItems = [];
        //     var tItems = [];

        //     console.log();

        //     Foundation.Array.forEach(lineValues, function(lineValues, i) {
        //         var valueString = "";
        //         var widgetValues = lineValues.split(/(\$[0-9a-zA-Z\._#@]+)/g);

        //         var title = "";
        //         Foundation.Array.forEach(widgetValues, function(widgetValue, j) {
        //             if (/^\$_widget_/.test(widgetValue)) {
        //                 if (!Foundation.isEmpty(options.labelMap)) {
        //                     title = options.labelMap[widgetValue]
        //                 }
        //                 if (Foundation.isEmpty(title)) {
        //                     title = "无效字段"
        //                 }
        //                 var widgetName = widgetValue.replace("$", "").replace("#", "");
        //                 var cp1 = CodeMirror.Pos(i, valueString.length);
        //                 valueString += ("" + title + "");
        //                 var cp2 = CodeMirror.Pos(i, valueString.length);

        //                 console.log(cp1, cp2);

        //                 vItems.push({
        //                     from: cp1,
        //                     to: cp2,
        //                     field: widgetName
        //                 });
        //             } else {
        //                 valueString += widgetValue
        //             }
        //         }, this);
        //         tItems.push(valueString);
        //     }, this);

        //     this.editor.setValue(tItems.join("\n"));
        //     Foundation.Array.forEach(vItems, function(item) {
        //         this._markField(item)
        //     }, this);
        // },

        setValue: function(a) {
            var b = this,
                c = this.options,
                d = [],
                e = [];
            if (a) {
                var f = a.split("\n");
                Foundation.Array.forEach(f, function(b, a) {
                    var f = "",
                        g = b.split(/(\$[0-9a-zA-Z\._#@]+)/g);
                    Foundation.Array.forEach(g, function(d, b) {
                        if (/^\$_widget/.test(d)) {
                            var g;
                            c.labelMap && (g = c.labelMap[d]);
                            var h = !1;
                            Foundation.isEmpty(g) && (g = "无效字段", h = !0);

                            var i = d.replace("$", "").split("#"),
                                j = i[0],
                                k = i[1],
                                l = CodeMirror.Pos(a, f.length);
                            f += "​" + g + "​";
                            var m = CodeMirror.Pos(a, f.length);
                            e.push({ from: l, to: m, field: j, entry: k, invalid: h })
                        } else {
                            f += d
                        }
                    });
                    d.push(f)
                })
            }
            this.editor.setValue(d.join("\n"));
            Foundation.Array.forEach(e, function(c, a) {
                b._markField(c)
            })
        }
    });

    Widget.register('x-formula-editor-panel', FormulaEditorPanel);

    return FormulaEditorPanel;

});