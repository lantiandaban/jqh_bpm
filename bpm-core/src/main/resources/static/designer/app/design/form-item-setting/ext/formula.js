define(function (require, exports, module) {

    return {
        AND: function () {
            for (var a = FX.Utils.flatten(arguments), b = 0, c = a.length; b < c; b++)
                if (!a[b]) return !1;
            return !0
        },
        OR: function () {
            for (var a = FX.Utils.flatten(arguments), b = 0, c = a.length; b < c; b++)
                if (a[b]) return !0;
            return !1
        },
        FALSE: function () {
            return !1
        },
        TRUE: function () {
            return !0
        },
        IF: function (a, b, c) {
            return a ? b : c
        },
        NOT: function (a) {
            return !a
        },
        XOR: function () {
            for (var a = 0, b = FX.Utils.flatten(arguments), c = 0, d = b.length; c < d; c++) b[c] && a++;
            return !!(1 & Math.floor(Math.abs(a)))
        },
        CONCATENATE: function () {
            for (var a = FX.Utils.flatten(arguments), b = 0;
                 (b = a.indexOf(!0)) > -1;) a[b] = "TRUE";
            for (var c = 0;
                 (c = a.indexOf(!1)) > -1;) a[c] = "FALSE";
            return a.join("")
        },
        EXACT: function (a, b) {
            return a === b
        },
        LEFT: function (a, b) {
            return b = FX.Utils.isEmpty(b) ? 1 : b, a ? a.substring(0, b) : ""
        },
        LEN: function (a) {
            return FX.Utils.isString(a) ? a ? a.length : 0 : a && a.length ? a.length : 0
        },
        LOWER: function (a) {
            return FX.Utils.isString(a) ? a ? a.toLowerCase() : a : ""
        },
        REPLACE: function (a, b, c, d) {
            return FX.Utils.isNumber(b) && FX.Utils.isNumber(c) ? (a = a || "", d = d || "", a.substr(0, b - 1) + d + a.substr(b - 1 + c)) : a
        },
        REPT: function (a, b) {
            return b = b || 0, new Array(b + 1).join(a)
        },
        RIGHT: function (a, b) {
            return b = void 0 === b ? 1 : b, a ? a.substring(a.length - b) : ""
        },
        SEARCH: function (a, b, c) {
            var d;
            return FX.Utils.isString(a) && FX.Utils.isString(b) ? (c = FX.Utils.isNull(c) ? 0 : c, d = b.toLowerCase().indexOf(a.toLowerCase(), c - 1) + 1) : 0
        },
        SPLIT: function (a, b) {
            return FX.Utils.isString(a) ? a.split(b) : []
        },
        TRIM: function (a) {
            return FX.Utils.isString(a) ? a.replace(/ +/g, " ").trim() : ""
        },
        UPPER: function (a) {
            return FX.Utils.isString(a) ? a.toUpperCase() : ""
        },
        MID: function (a, b, c) {
            return a = a || "", FX.Utils.isNumber(b) && FX.Utils.isNumber(c) ? a.substr(b - 1, c) : a
        },
        AVERAGE: function () {
            for (var a = FX.Utils.flatten(arguments, function (a) {
                return FX.Utils.isNumber(a)
            }), b = a.length, c = 0, d = 0, e = 0; e < b; e++) c += a[e], d += 1;
            return c / d
        },
        COUNT: function () {
            return FX.Utils.flatten(arguments).length
        },
        LARGE: function (a, b) {
            return a = FX.Utils.flatten(a, function (a) {
                return FX.Utils.isNumber(a)
            }), a.sort(function (a, b) {
                return b - a
            })[b - 1]
        },
        MAX: function () {
            var a = FX.Utils.flatten(arguments, function (a) {
                return FX.Utils.isNumber(a)
            });
            return 0 === a.length ? 0 : Math.max.apply(Math, a)
        },
        MIN: function () {
            var a = FX.Utils.flatten(arguments, function (a) {
                return FX.Utils.isNumber(a)
            });
            return 0 === a.length ? 0 : Math.min.apply(Math, a)
        },
        SMALL: function (a, b) {
            return a = FX.Utils.flatten(a, function (a) {
                return FX.Utils.isNumber(a)
            }), a.sort(function (a, b) {
                return a - b
            })[b - 1]
        },
        ABS: function (a) {
            return FX.Utils.isNumber(a) ? Math.abs(a) : 0
        },
        ROUND: function (a, b) {
            return Math.round(a * Math.pow(10, b)) / Math.pow(10, b)
        },
        CEILING: function (a, b) {
            if (0 === b) return 0;
            var c = b < 0 ? -1 : 0;
            b = Math.abs(b);
            var d = b - Math.floor(b),
                e = 0;
            return d > 0 && (e = -Math.floor(Math.log(d) / Math.log(10))), a >= 0 ? FX.Formula.ROUND(Math.ceil(a / b) * b, e) : 0 === c ? -FX.Formula.ROUND(Math.floor(Math.abs(a) / b) * b, e) : -FX.Formula.ROUND(Math.ceil(Math.abs(a) / b) * b, e)
        },
        FLOOR: function (a, b) {
            if (0 === b) return 0;
            if (!(a > 0 && b > 0 || a < 0 && b < 0)) return 0;
            b = Math.abs(b);
            var c = b - Math.floor(b),
                d = 0;
            return c > 0 && (d = -Math.floor(Math.log(c) / Math.log(10))), a >= 0 ? FX.Formula.ROUND(Math.floor(a / b) * b, d) : -FX.Formula.ROUND(Math.floor(Math.abs(a) / b) * b, d)
        },
        INT: function (a) {
            return FX.Utils.isNumber(a) ? Math.floor(a) : 0
        },
        LOG: function (a, b) {
            return b = void 0 === b ? 10 : b, FX.Utils.isNumber(b) ? Math.log(a) / Math.log(b) : 0
        },
        MOD: function (a, b) {
            if (0 === b) return 0;
            var c = Math.abs(a % b);
            return b > 0 ? c : -c
        },
        POWER: function (a, b) {
            var c = Math.pow(a, b);
            return isNaN(c) ? 0 : c
        },
        PRODUCT: function () {
            for (var a = FX.Utils.flatten(arguments, function (a) {
                return FX.Utils.isNumber(a)
            }), b = 1, c = 0; c < a.length; c++) b *= a[c];
            return b
        },
        SQRT: function (a) {
            return a < 0 ? 0 : Math.sqrt(a)
        },
        SUM: function () {
            for (var a = 0, b = FX.Utils.flatten(arguments, function (a) {
                return FX.Utils.isNumber(a)
            }), c = 0, d = b.length; c < d; ++c) a += b[c];
            return a
        },
        SUMPRODUCT: function () {
            for (var a = 0, b = [], c = -1, d = 0; d < arguments.length; d++) arguments[d] instanceof Array && (c = c < 0 ? arguments[d].length : Math.min(arguments[d].length, c), b.push(arguments[d]));
            for (var e, f, g, h = 0; h < c; h++) {
                for (e = 1, f = 0; f < b.length; f++) g = parseFloat(b[f][h]), isNaN(g) && (g = 0), e *= g;
                a += e
            }
            return a
        },
        FIXED: function (a, b) {
            return b = void 0 === b ? 0 : b, FX.Utils.isNumber(b) && b >= 0 ? Number(a).toFixed(b) : ""
        },
        DATE: function () {
            return 6 === arguments.length ? new Date(parseInt(arguments[0], 10), parseInt(arguments[1], 10) - 1, parseInt(arguments[2], 10), parseInt(arguments[3], 10), parseInt(arguments[4], 10), parseInt(arguments[5], 10)) : 3 === arguments.length ? new Date(parseInt(arguments[0], 10), parseInt(arguments[1], 10) - 1, parseInt(arguments[2], 10)) : new Date(arguments[0])
        },
        TIME: function (a, b, c) {
            return (3600 * a + 60 * b + c) / 86400
        },
        TIMESTAMP: function (a) {
            return FX.Utils.isDate(a) ? a.getTime() : 0
        },
        TODAY: function () {
            return new Date
        },
        NOW: function () {
            return new Date
        },
        SYSTIME: function () {
            var a = FX.STATIC._st,
                b = (new Date).getTime() - FX.STATIC._ct;
            return b > 0 && b < 36e5 && (a += b), new Date(a)
        },
        DAY: function (a) {
            return a.getDate()
        },
        MONTH: function (a) {
            return a.getMonth() + 1
        },
        YEAR: function (a) {
            return a.getFullYear()
        },
        HOUR: function (a) {
            return a.getHours()
        },
        MINUTE: function (a) {
            return a.getMinutes()
        },
        SECOND: function (a) {
            return a.getSeconds()
        },
        DAYS: function (a, b) {
            var c = new Date(a.getFullYear(), a.getMonth(), a.getDate()),
                d = new Date(b.getFullYear(), b.getMonth(), b.getDate());
            return (c - d) / 864e5
        },
        DAYS360: function (a, b, c) {
            var d, e, f = b.getMonth(),
                g = a.getMonth();
            if (c) d = 31 === b.getDate() ? 30 : b.getDate(), e = 31 === a.getDate() ? 30 : a.getDate();
            else {
                var h = new Date(b.getFullYear(), f + 1, 0).getDate(),
                    i = new Date(a.getFullYear(), g + 1, 0).getDate();
                d = b.getDate() === h ? 30 : b.getDate(), a.getDate() === i ? d < 30 ? (g++, e = 1) : e = 30 : e = a.getDate()
            }
            return 360 * (a.getFullYear() - b.getFullYear()) + 30 * (g - f) + (e - d)
        },
        DATEDELTA: function (a, b) {
            return FX.Utils.isNumber(b) || (b = 0), new Date(a.getTime() + 864e5 * b)
        },
        ISOWEEKNUM: function (a) {
            a.setHours(0, 0, 0), a.setDate(a.getDate() + 4 - (a.getDay() || 7));
            var b = new Date(a.getFullYear(), 0, 1);
            return Math.ceil(((a - b) / 864e5 + 1) / 7)
        },
        WEEKNUM: function (a, b) {
            var c = 2 === b ? 1 : 0,
                d = new Date(a.getFullYear(), 0, 1),
                e = (c + 7 - d.getDay()) % 7,
                f = e > 0 ? 1 : 0,
                g = d.getTime() + 24 * e * 60 * 60 * 1e3;
            return Math.floor((a.getTime() - g) / 864e5 / 7 + 1) + f
        },
        WEEKDAY: function () {
        },
        WORKSHDURATION: function (start, end, dayDuration) {
        },
        DAYSDIFF: function (start, end) {},

        TEXT: function (a, b) {
            return FX.Utils.isNull(a) ? "" : FX.Utils.isDate(a) && !FX.Utils.isEmpty(b) ? FX.Utils.date2Str(a, b) : FX.Utils.num2Str(a, b)
        },
        VALUE: function (a) {
            return FX.Utils.isEmpty(a) ? 0 : isNaN(a) ? 0 : parseFloat(a)
        },
        UUID: function () {
            return FX.Utils.UUID()
        },
        RECNO: function () {
            return FX.Utils.isNull(FX.STATIC.EntryRecNo) ? FX.STATIC.APPID && FX.STATIC.ENTRYID ? (FX.Utils.dataAjax({
                url: "/data/formula/recno",
                async: !1,
                data: {appId: FX.STATIC.APPID, formId: FX.STATIC.ENTRYID, hasIncLock: FX.STATIC.RecnoLock}
            }, function (a) {
                FX.STATIC.EntryRecNo = a.incId
            }), FX.STATIC.EntryRecNo) : "" : FX.STATIC.EntryRecNo
        },
        ISEMPTY: function (a) {
            return FX.Utils.isObjectEmpty(a)
        },
        MAPX: function (a, b, c, d) {
            var e = null;
            if (FX.Utils.isEmpty(a) || FX.Utils.isObjectEmpty(b)) return e;
            a = a.toLowerCase();
            var f = FX.Utils.getFieldInfoByFormula(c),
                g = FX.Utils.getFieldInfoByFormula(d);
            if (/^sum|avg|max|min|count|first|last$/.test(a) && f.entryId && f.entryId === g.entryId) {
                var h = FX.Utils.isDate(b),
                    i = h ? b.getTime() : b;
                FX.Utils.dataAjax({
                    url: "/data/formula/aggregate",
                    async: !1,
                    data: {
                        op: a,
                        formId: f.entryId,
                        lookup_value: i,
                        lookup_field: f.field,
                        result_field: g.field,
                        date_type: h,
                        refAppId: f.appId
                    }
                }, function (a) {
                    a.result && a.result[0] && (e = a.result[0].result)
                })
            }
            return e
        },
        MAP: function (a, b, c) {
            var d = [];
            if (FX.Utils.isObjectEmpty(a)) return d;
            var e = FX.Utils.getFieldInfoByFormula(b),
                f = FX.Utils.getFieldInfoByFormula(c);
            return e.entryId && e.entryId === f.entryId && FX.Utils.dataAjax({
                url: "/data/formula/map",
                async: !1,
                data: {
                    formId: e.entryId,
                    lookup_value: a,
                    lookup_field: e.field,
                    result_field: f.field,
                    refAppId: e.appId
                }
            }, function (a) {
                FX.Utils.forEach(a.result, function (a, b) {
                    d.push(b[f.field])
                })
            }, function () {
            }), d
        },
        GETUSERNAME: function () {
            return FX.STATIC.user ? FX.STATIC.user.nickname : ""
        }
    }

});