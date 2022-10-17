define(function (require, exports, module) {

    var Class = require('./class');
    var Foundation = require('./foundation');
    var HttpAjax = require('./http-ajax');
    var Event = require('./event');

    var Utils = {};

    /**
     * 延迟器，延迟执行任务
     * */
    Utils.DelayedTask = function (fn, scope, args) {
        var self = this, id, call = function () {
            clearInterval(id);
            id = null;
            fn.apply(scope, args || []);
        };

        this.delay = function (delay, newFn, newScope, newArgs) {
            self.cancel();
            fn = newFn || fn;
            scope = newScope || scope;
            args = newArgs || args;
            id = setInterval(call, delay);
        };

        this.cancel = function () {
            if (id) {
                //为了避免内存泄漏
                clearInterval(id);
                id = null;
            }
        };
    };


    /**
     * 浏览器情况
     * */
    (function (Utils) {

        var userAgent = navigator.userAgent.toLowerCase();
        var check = function (regex) {
                return regex.test(userAgent);
            },
            docMode = document.documentMode,
            isOpera = check(/opera/),
            isChrome = check(/\bchrome\b/),
            isWebKit = check(/webkit/),
            isSafari = !isChrome && check(/safari/),
            isSafari2 = isSafari && check(/applewebkit\/4/),
            isSafari3 = isSafari && check(/version\/3/),
            isSafari4 = isSafari && check(/version\/4/),
            isIE = !isOpera && check(/msie/),
            isIE7 = isIE && ((check(/msie 7/) && docMode != 8 && docMode != 9) || docMode == 7),
            isIE8 = isIE && ((check(/msie 8/) && docMode != 7 && docMode != 9) || docMode == 8),
            isIE9 = isIE && ((check(/msie 9/) && docMode != 7 && docMode != 8) || docMode == 9),
            isIE6 = isIE && check(/msie 6/),
            isGecko = !isWebKit && check(/gecko/),
            isGecko3 = isGecko && check(/rv:1\.9/),
            isGecko4 = isGecko && check(/rv:2\.0/),
            isWindows = check(/windows|win32/),
            isMac = check(/macintosh|mac os x/),
            isLinux = check(/linux/);

        Utils.browser = {

            isOpera: isOpera,

            isChrome: isChrome,

            isWebKit: isWebKit,

            isSafari: isSafari,

            isSafari2: isSafari2,

            isSafari3: isSafari3,

            isSafari4: isSafari4,

            isIE: isIE,

            isIE7: isIE7,

            isIE8: isIE8,

            isIE9: isIE9,

            isIE6: isIE6,

            isGecko: isGecko,

            isGecko3: isGecko3,

            isGecko4: isGecko4,

            isWindows: isWindows,

            isMac: isMac,

            isLinux: isLinux

        };

    })(Utils);


    /**
     * 数据加载
     * */
    (function (Utils) {

        Utils.DataLoader = {

            getDataLoader: function () {
                var self = this;
                if (!this.dataLoader) {
                    this.dataLoader = new HttpAjax({type: 'GET'});
                    this.dataLoader.successHandler(function (result) {
                        var data = self.formatServerLoaderResult(result);
                        if (!Foundation.isDefined(data)) {
                            data = result
                        }
                        self.setData(data);
                    });

                    this.dataLoader.on('before-send', this.beforeLoad, this);
                    this.dataLoader.on('success', this.successLoad, this);
                    this.dataLoader.on('failure', this.failureLoad, this);
                    this.dataLoader.on('complete', this.afterLoad, this);
                }
                return this.dataLoader;
            },

            load: function(url, data) {
                if (url) {
                    if (!Foundation.isString(url)) {
                        this.localData = url;
                        this.url = false;
                    } else {
                        this.url = url;
                        this.params = data || this.params;
                    }
                }

                if (this.beforeLoad.apply(this, arguments) === false) {
                    return this;
                }

                if (this.url) {
                    this.dataLoader = this.getDataLoader();
                    this.dataLoader.setUrl(this.url);
                    this.dataLoader.setParams(this.params);
                    this.dataLoader.send();
                } else {
                    this.loaclLoad(this.localData, arguments);
                }
            },

            loaclLoad: function(data, args) {
                this.beforeLoad.apply(this, args);
                this.setData(data);
                this.successLoad.apply(this, args);
                this.afterLoad.apply(this, args);
            },

            beforeLoad: Foundation.EMPTY_FUNCTION,

            afterLoad: Foundation.EMPTY_FUNCTION,

            successLoad: Foundation.EMPTY_FUNCTION,

            failureLoad: Foundation.EMPTY_FUNCTION,

            setData: Foundation.EMPTY_FUNCTION,

            formatServerLoaderResult: Foundation.identityFn

        }

    })(Utils);

    /**
     * 数组工具
     * */
    Utils.ArrayList = Class.create({

        isArrayList: true,

        index: 0,

        length: 0,

        initialize: function(keyFn) {
            var me = this;
            me.map = {};
            me.keys = [];
            me.items = [];

            if (keyFn) {
                me.getKey = keyFn;
            }
        },

        push: function(key, obj) {
            var me = this,
                myObj = obj,
                myKey = key,
                old;

            if (arguments.length == 1) {
                myObj = myKey;
                myKey = me.getKey(myObj);
            }

            if (typeof myKey != 'undefined' && myKey !== null) {
                old = me.map[myKey];
                if (typeof old != 'undefined') {
                    return me.replace(myKey, myObj);
                }
                me.map[myKey] = myObj;
            }

            me.index++;
            me.length++;
            me.keys.push(myKey);
            me.items.push(myObj);
            return myObj;
        },

        pushAll: function(items) {
            var me = this,
                i = 0,
                args, len, key;

            if (arguments.length > 1 || Foundation.isArray(items)) {
                args = arguments.length > 1 ? arguments : items;
                for (len = args.length; i < len; i++) {
                    me.push(args[i]);
                }
            } else {
                for (key in items) {
                    if (items.hasOwnProperty(key)) {
                        if (typeof items[key] != 'function') {
                            me.push(key, items[key]);
                        }
                    }
                }
            }
        },

        remove: function(obj) {
            this.index++;
            return this.removeAt(this.indexOf(obj));
        },

        removeAt: function(index) {
            var me = this,
                obj, key;

            if (index < me.length && index >= 0) {
                me.length--;
                key = me.keys[index];
                obj = me.items[index];

                Foundation.Array.erase(me.items, index, 1);
                if (typeof key != 'undefined') {
                    delete me.map[key];
                }
                Foundation.Array.erase(me.keys, index, 1);

                me.index++;
                return obj;
            }
            return false;
        },

        removeAtKey: function(key) {
            return this.removeAt(this.indexOfKey(key));
        },

        removeAll: function(items) {
            items = [].concat(items);
            var i, iLen = items.length;
            for (i = 0; i < iLen; i++) {
                this.remove(items[i]);
            }

            return this;
        },

        getOriginalArray: function () {
            return this.items || []
        },

        replace: function(key, item) {
            var me = this,
                old, index;

            if (arguments.length == 1) {
                item = arguments[0];
                key = me.getKey(item);
            }
            old = me.map[key];
            if (typeof key == 'undefined' || key === null || typeof old == 'undefined') {
                return me.add(key, item);
            }
            me.index++;
            index = me.indexOfKey(key);
            me.map[key] = item;
            me.items[index] = item;
            return item;
        },

        indexOf: function(obj) {
            return Foundation.Array.indexOf(this.items, obj);
        },

        indexOfKey: function(key) {
            return Foundation.Array.indexOf(this.keys, key);
        },

        get: function(key) {
            var me = this,
                mk = me.map[key],
                item = mk !== undefined ? mk : (typeof key == 'number') ? me.items[key] : undefined;
            return typeof item != 'function' ? item : null;
        },

        getAt: function(index) {
            return this.items[index];
        },

        getByKey: function(key) {
            return this.map[key];
        },

        contains: function(item) {
            return typeof this.map[this.getKey(item)] != 'undefined';
        },

        containsKey: function(key) {
            return typeof this.map[key] != 'undefined';
        },

        clear: function() {
            var me = this;
            me.length = 0;
            me.map = {};
            me.keys = [];
            me.items = [];
            me.index++;
        },

        first: function() {
            return this.items[0];
        },

        last: function() {
            return this.items[this.length - 1];
        },

        getCount: function() {
            return this.length;
        },

        each: function(fn, scope) {
            var items = [].concat(this.items),
                i = 0,
                len = items.length,
                item;

            for (; i < len; i++) {
                item = items[i];
                if (fn.call(scope || item, item, i, len) === false) {
                    break;
                }
            }
        },

        eachKey: function(fn, scope) {
            var keys = this.keys,
                items = this.items,
                i = 0,
                len = keys.length;

            for (; i < len; i++) {
                fn.call(scope || window, keys[i], items[i], i, len);
            }
        },

        getKey: function(obj) {
            return obj.id;
        },

        filterBy: function(fn, scope) {
            var me = this,
                newMC = new Utils.ArrayList(),
                keys = me.keys,
                items = me.items,
                length = items.length,
                i;

            newMC.getKey = me.getKey;

            for (i = 0; i < length; i++) {
                if (fn.call(scope || me, items[i], keys[i])) {
                    newMC.push(keys[i], items[i]);
                }
            }

            return newMC;
        },

        findBy: function(fn, scope) {
            var keys = this.keys,
                items = this.items,
                i = 0,
                len = items.length;

            for (; i < len; i++) {
                if (fn.call(scope || window, items[i], keys[i])) {
                    return items[i];
                }
            }
            return null;
        },

        find: function() {
            return this.findBy.apply(this, arguments);
        },

        clone: function() {
            var me = this,
                copy = new this.self(),
                keys = me.keys,
                items = me.items,
                i = 0,
                len = items.length;

            for (; i < len; i++) {
                copy.push(keys[i], items[i]);
            }
            copy.getKey = me.getKey;
            return copy;
        }

    });

    /**
     * HasMap工具
     * */
    Utils.HashMap = Class.create({

        implement: [Event],

        isHashMap: true,

        initialize: function(config) {
            Foundation.apply(this, config);
            this.initListeners.apply(this);
            this.clear(true);
        },

        getCount: function() {
            return this.length;
        },

        getData: function(key, value) {
            if (value === undefined) {
                value = key;
                key = this.getKey(value);
            }

            return [key, value];
        },

        getKey: function(o) {
            return o.id || o.Id;
        },

        push: function(key, value) {
            var me = this,
                data;

            if (arguments.length === 1) {
                value = key;
                key = me.getKey(value);
            }

            if (me.indexOf(key)) {
                me.replace(key, value);
            } else {
                ++me.length;
            }

            data = me.getData(key, value);
            key = data[0];
            value = data[1];

            me.map[key] = value;

            me.fireEvent('push', me, key, value);
            return value;
        },

        getValue: function(key) {
            return this.map[key];
        },

        removeByVal: function(value) {
            var key = this.findKeyByVal(value);
            if (key !== undefined) {
                return this.removeByKey(key);
            }

            return false;
        },

        removeByKey: function(key) {
            var me = this,
                value;

            if (me.indexOf(key)) {
                value = me.map[key];
                delete me.map[key];
                --me.length;
                me.fireEvent('remove', me, key, value);
                return true;
            }
            return false;
        },

        replace: function(key, value) {
            var me = this,
                map = me.map,
                old;
            if (!me.indexOf(key)) {
                me.push(key, value);
            }

            old = map[key];
            map[key] = value;
            me.fireEvent('replace', me, key, value, old);
            return value;
        },

        findKeyByVal: function(value) {
            var key, map = this.map;

            for (key in map) {
                if (map.hasOwnProperty(key) && map[key] === value) {
                    return key;
                }
            }

            return undefined;
        },

        indexOf: function(key) {
            return this.map[key] !== undefined;
        },

        clear: function(init) {
            var me = this;
            me.map = {};
            me.length = 0;
            if (init !== true) {
                me.fireEvent('clear', me);
            }
            return me;
        },

        eq: function(index) {
            var map = this.map,
                key, i = 0;

            index = index || 0;

            for (key in map) {
                if (map.hasOwnProperty(key)) {
                    if (index == i) {
                        return map[key];
                    }
                    i++;
                }
            }
        },

        keySet: function() {
            return this.getArray(true);
        },

        valSet: function() {
            return this.getArray();
        },

        getArray: function(isKey) {
            var arr = [],
                key, map = this.map;
            for (key in map) {
                if (map.hasOwnProperty(key)) {
                    arr.push(isKey ? key : map[key]);
                }
            }

            return arr;
        },

        each: function(fn, scope) {
            //重新拷贝一份map是为了下面each直接对map的操作
            var items = Foundation.apply({}, this.map),
                key, len = this.length,
                i = 0;

            scope = scope || this;
            for (key in items) {
                if (items.hasOwnProperty(key)) {
                    if (fn.call(scope, key, items[key], len, i) === false) {
                        break;
                    }
                    i++;
                }
            }

            return this;
        }

    });


    (function () {

        var stripTagsRE = /<\/?[^>]+>/gi,
            stripScriptsRe = /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig,
            nl2brRe = /\r?\n/g,
            formatCleanRe = /[^\d\.]/g,
            I18NFormatCleanRe;

        Foundation.apply(Utils, {

            singleton: true,

            thousandSeparator: ",",

            //小数分隔符
            decimalSeparator: ".",

            //货币的精确到2位小数
            currencyPrecision: 2,
            //货币符号
            currencySign: '$',

            currencyAtEnd: false,

            undef: function (value) {
                return value !== undefined ? value : "";
            },

            defaultValue: function (value, defaultValue) {
                return value !== undefined && value !== '' ? value : defaultValue;
            },

            substr: 'ab'.substr(-1) != 'b' ? function (value, start, length) {
                var str = String(value);
                return (start < 0) ? str.substr(Math.max(str.length + start, 0), length) : str.substr(start, length);
            } : function (value, start, length) {
                return String(value).substr(start, length);
            },

            lowercase: function (value) {
                return String(value).toLowerCase();
            },

            uppercase: function (value) {
                return String(value).toUpperCase();
            },

            usMoney: function (v) {
                return this.currency(v, '$', 2);
            },

            //格式化一个数字类型的值为货币类型
            currency: function (v, currencySign, decimals, end) {
                //negativeSign：正负标识
                var negativeSign = "",
                    format = ',0',
                    i = 0;

                v = v - 0;
                if (v < 0) {
                    v = -v;
                    negativeSign = '-';
                }

                decimals = decimals || _module.currencyPrecision;
                format += format + (decimals > 0 ? '.' : '');
                for (; i < decimals; i++) {
                    format += '0';
                }
                v = this.number(v, format);
                if ((end || this.currencyAtEnd) === true) {
                    return Foundation.String.format("{0}{1}{2}", negativeSign, v, currencySign || this.currencySign);
                } else {
                    return Foundation.String.format("{0}{1}{2}", negativeSign, currencySign || this.currencySign, v);
                }
            },

            stripTags: function (v) {
                return !v ? v : String(v).replace(stripTagsRE, "");
            },

            stripScripts: function (v) {
                return !v ? v : String(v).replace(stripScriptsRe, "");
            },

            fileSize: function (size) {
                if (size < 1024) {
                    return size + " bytes";
                } else if (size < 1048576) {
                    return (Math.round(((size*10) / 1024))/10) + " KB";
                } else {
                    return (Math.round(((size*10) / 1048576))/10) + " MB";
                }
            },

            math: function () {
                var fns = {};
                return function (v, a) {
                    if (!fns[a]) {
                        fns[a] = Foundation.functionFactory('v', 'return v ' + a + ';');
                    }
                    return fns[a](v);
                };
            }(),

            round: function (value, precision) {
                var result = Number(value);
                if (typeof precision == 'number') {
                    precision = Math.pow(10, precision);
                    result = Math.round(value * precision) / precision;
                }
                return result;
            },

            //format.number(123456.9, '0.0000') --> 123456.9000
            number: function (v, formatString) {
                if (!formatString) {
                    return v;
                }
                v = Foundation.Number.num(v, NaN);
                if (isNaN(v)) {
                    return "";
                }
                var comma = this.thousandSeparator,
                    dec = this.decimalSeparator,
                    i18n = false,
                    neg = v < 0,
                    hasComma, psplit;

                v = Math.abs(v);

                if (formatString.substr(formatString.length - 2) == '/i') {
                    if (!I18NFormatCleanRe) {
                        I18NFormatCleanRe = new RegExp('[^\\d\\' + this.decimalSeparator + ']', 'g');
                    }
                    formatString = formatString.substr(0, formatString.length - 2);
                    i18n = true;
                    hasComma = formatString.indexOf(comma) != -1;
                    psplit = formatString.replace(I18NFormatCleanRe).split(dec);
                } else {
                    hasComma = formatString.indexOf(',') != -1;
                    psplit = formatString.replace(formatCleanRe, '').split('.');
                }

                if (1 < psplit.length) {
                    v = v.toFixed(psplit[1].length);
                } else if (2 < psplit.length) {
                    alert("Invalid number format, should have no more than 1 decimal");
                    return;
                } else {
                    v = v.toFixed(0);
                }

                var fnum = v.toString();
                psplit = fnum.split('.');
                if (hasComma) {
                    var cnum = psplit[0],
                        parr = [],
                        j = cnum.length,
                        m = Math.floor(j / 3),
                        n = cnum.length % 3 || 3,
                        i;

                    for (i = 0; i < j; i += n) {
                        if (i !== 0) {
                            n = 3;
                        }

                        parr[parr.length] = cnum.substr(i, n);
                        m -= 1;
                    }
                    fnum = parr.join(comma);
                    if (psplit[1]) {
                        fnum += dec + psplit[1];
                    }
                } else {
                    if (psplit[1]) {
                        fnum = psplit[0] + dec + psplit[1];
                    }
                }

                return (neg ? '-' : '') + formatString.replace(/[\d,?\.?]+/, fnum);
            },

            numberRenderer: function (format) {
                return function (v) {
                    return this.number(v, format);
                };
            },

            plural: function (v, s, p) {
                return v + ' ' + (v == 1 ? s : (p ? p : s + 's'));
            },

            //把换行转化成html标签br
            nl2br: function (v) {
                return Foundation.isEmpty(v) ? '' : v.replace(nl2brRe, '<br/>')
            },

            //字符串首字母大写
            firstUpperCase: Foundation.String.firstUpperCase,

            //字符串超出长度以省略号代替
            ellipsis: Foundation.String.ellipsis,

            format: Foundation.String.format,

            htmlDecode: Foundation.String.htmlDecode,

            htmlEncode: Foundation.String.htmlEncode,

            leftPad: Foundation.String.leftPad,

            trim: Foundation.String.trim,

            escapeRegex: function (s) {
                return s.replace(/([\-.*+?\^${}()|\[\]\/\\])/g, "\\$1");
            }
        });
    })();


    return Utils;
});


