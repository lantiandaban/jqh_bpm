define(function(require, exports, module) {

    var global = window,
        enumerables = true,
        enumerablesTestObj = {
            toString: 1
        },
        objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        nonWhitespaceRe = /\S/,
        callOverrideParent = function() {
            var method = callOverrideParent.caller.caller;
            return method.$owner.prototype[method.$name].apply(this, arguments);
        },
        name;

    //初始化Foundation对象，赋值为一个空对象
    var Foundation = {};
    //让Hamster对象的global指向全局window/this
    Foundation.global = global;

    //标准浏览器对于for(var i in enumerablesTest){console.log(i)};
    //会输出"toString", 因为toString已经为自定义成员了。所以会遍历这个成员，
    //而IE6却只认名字不认人。它不会输出自定义的toString成员，
    //包括其它系统的成员也不会。因此，在IE6需要主动判断是否定义了toString。
    for (name in enumerablesTestObj) {
        enumerables = !enumerables;
    }

    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
            'toLocaleString', 'toString', 'constructor'
        ];
    }

    Foundation.enumerables = enumerables;

    Foundation.global.window.undefined = window.undefined;

    Foundation.globalEval = Foundation.global.execScript ? function(code) {
        return execScript(code);
    } : function($$code) {
        return (function() {
            var Foundation = this.Foundation;
            return eval($$code);
        }());
    };

    /**
     * 单纯的对象继承覆盖功能
     * @function
     * @param {object} object 待继承对象
     * @param {object} config
     * @param {object} defaults 可选
     * @returns {object} 返回经过覆盖属性/方法后的新object对象
     * */
    Foundation.apply = function(object, config, defaults) {
        if (defaults) {
            Foundation.apply(object, defaults || {});
        }
        if (object && config && typeof config == 'object') {
            var i, j, k;
            for (i in config) {
                if (config[i] !== null && config[i] !== undefined) {
                    object[i] = config[i];
                }
            }
            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }
        return object;
    };

    Foundation.apply(Foundation, {

        name: 'Foundation',

        emptyString: "",

        emptyFn: function() {},

        EMPTY_STRING: "",

        EMPTY_FUNCTION: function() {},

        identityFn: function(o) {
            return o;
        },

        /**
         * 单纯的对象继承覆盖功能，但是和apply有一定的区别，只是拷贝config中在object中没有的成员
         * @function
         * @param {object} object
         * @param {object} config
         * @returns {object}  返回经过覆盖属性/方法后的新object对象
         * */
        applyIf: function(object, config) {
            var property;
            if (object) {
                for (property in config) {
                    if (object[property] === undefined) {
                        object[property] = config[property];
                    }
                }
            }
            return object;
        },

        each: function(object, fn, scope) {
            if (Foundation.isEmpty(object)) {
                return;
            }
            if (Foundation.isNumber(object)) {
                for (var i = 0; i < object; i++) {
                    var ret = fn.call(scope || Foundation.global, i);
                    if (ret === false) {
                        return;
                    }
                }
                return;
            }
            Foundation[Foundation.isIterable(object) ? 'Array' : 'Object'].each.apply(this, arguments);
        }

    });

    Foundation.apply(Foundation, {

        extend: (function() {
            var objectConstructor = objectPrototype.constructor,
                inlineOverrides = function(o) {
                    for (var m in o) {
                        if (!o.hasOwnProperty(m)) {
                            continue;
                        }
                        this[m] = o[m];
                    }
                };

            return function(subclass, superclass, overrides) {
                if (Foundation.isObject(superclass)) {
                    overrides = superclass;
                    superclass = subclass;
                    subclass = overrides.constructor !== objectConstructor ? overrides.constructor : function() {
                        superclass.apply(this, arguments);
                    };
                }

                if (!superclass) {
                    Foundation.Error({
                        className: 'Foundation',
                        methodName: 'extend',
                        msg: 'Attempting to extend from a class which has not been loaded on the page.'
                    });
                }

                var F = function() {},
                    subclassProto, superclassProto = superclass.prototype;

                F.prototype = superclassProto;
                subclassProto = subclass.prototype = new F();
                subclassProto.constructor = subclass;
                subclass.superclass = superclassProto;

                if (superclassProto.constructor === objectConstructor) {
                    superclassProto.constructor = superclass;
                }

                subclass.override = function(overrides) {
                    Foundation.override(subclass, overrides);
                };

                subclassProto.override = inlineOverrides;
                subclassProto.proto = subclassProto;

                subclass.override(overrides);
                subclass.extend = function(o) {
                    return Foundation.extend(subclass, o);
                };

                return subclass;
            };
        }()),

        override: function(target, overrides) {
            if (target.$isClass) {
                target.override(overrides);
            } else if (typeof target == 'function') {
                Foundation.apply(target.prototype, overrides);
            } else {
                var owner = target.self,
                    name, value;

                if (owner && owner.$isClass) {
                    for (name in overrides) {
                        if (overrides.hasOwnProperty(name)) {
                            value = overrides[name];

                            if (typeof value == 'function') {
                                if (owner.$className) {
                                    value.displayName = owner.$className + '#' + name;
                                }

                                value.$name = name;
                                value.$owner = owner;
                                value.$previous = target.hasOwnProperty(name) ?
                                    target[name] :
                                    callOverrideParent;
                            }

                            target[name] = value;
                        }
                    }
                } else {
                    Foundation.apply(target, overrides);
                }
            }
            return target;
        }
    });

    var hasOwn = Object.prototype.hasOwnProperty;

    var iteratesOwnLast;
    (function() {
        var props = [];

        function Ctor() { this.x = 1; }
        Ctor.prototype = { 'valueOf': 1, 'y': 1 };
        for (var prop in new Ctor()) {
            props.push(prop);
        }
        iteratesOwnLast = props[0] !== 'x';
    }());

    function isWindow(o) {
        return o != null && o == o.window;
    }

    Foundation.apply(Foundation, {

        objectPrototype: Object.prototype,

        isEmptyObject: function(object) {
            if (!object || !Foundation.isObject(object)) {
                return false;
            }

            for (var p in object) {
                if (object.hasOwnProperty(p)) {
                    return false;
                }
            }
            return true;
        },

        isEmpty: function(value, allowBlank) {
            return (value === null) ||
                (value === undefined) ||
                (Foundation.isArray(value) && !value.length) ||
                (value.jquery && !value.length) ||
                (!allowBlank ? value === '' : false);
        },

        isNull: function(value) {
            return value === null || value === undefined;
        },

        isArray: function(array) {
            return Foundation.objectPrototype.toString.apply(array) === '[object Array]';
        },

        isObject: function(object) {
            return !!object && !object.tagName && Foundation.objectPrototype.toString.apply(object) === '[object Object]';
        },

        isPlainObject: function(object) {
            if (!Foundation.isObject(object) || object.nodeType || isWindow(object)) {
                return false;
            }

            try {
                if (object.constructor &&
                    !hasOwn.call(object, 'constructor') &&
                    !hasOwn.call(object.constructor.prototype, 'isPrototypeOf')) {
                    return false;
                }
            } catch (e) {
                return false;
            }

            var key;

            if (iteratesOwnLast) {
                for (key in object) {
                    return hasOwn.call(object, key);
                }
            }

            for (key in object) {}

            return key === undefined || hasOwn.call(object, key);
        },

        isFunction: function(fun) {
            return Foundation.objectPrototype.toString.apply(fun) === '[object Function]';
        },

        isString: function(str) {
            return typeof str === 'string';
        },

        isNumber: function(number) {
            return Foundation.objectPrototype.toString.apply(number) === '[object Number]';
        },

        isNumeric: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        isInteger: function(number) {
            return Foundation.isNumeric(number) && (new RegExp(/^\d+$/).test(number));
        },

        isDate: function(date) {
            return Foundation.objectPrototype.toString.apply(date) === '[object Date]';
        },

        isBoolean: function(boo) {
            return Foundation.objectPrototype.toString.apply(boo) === '[object Boolean]';
        },

        //判断对象是否为基本数据（字符串， 数字， 布尔值）类型
        isPrimitive: function(value) {
            return Foundation.isString(value) || Foundation.isNumber(value) || Foundation.isBoolean(value);
        },

        isElement: function(element) {
            if (typeof HTMLElement === 'object') {
                return element instanceof HTMLElement;
            } else {
                return element && typeof element === 'object' && element.nodeType === 1 && typeof element.nodeName === "string";
            }
        },

        isDefined: function(defin) {
            return typeof defin !== 'undefined';
        },

        //判断对象是否为可迭代对象，包括array，节点数组
        isIterable: function(iter) {
            if (!iter) {
                return false;
            }
            //iter.callee成立的话， 说明iter是Function的arguments数组
            //iter.find && iter.filter说明是jQuery对象
            if (Foundation.isArray(iter) || iter.callee || (iter.find && iter.filter)) {
                return true;
            }
            //判断是否为节点数组
            if (/NodeList|HTMLCollection/.test(Foundation.objectPrototype.toString.apply(iter))) {
                return true;
            }

            return ((typeof iter.nextNode !== 'undefined' || iter.item) && Foundation.isNumber(iter.length)) || false;
        },

        isEmail: function(email) {
            return email && email.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) != null
        },

        isRegExp: function(regexp) {
            return regexp && Foundation.objectPrototype.toString.call(regexp) == '[object RegExp]';
        },

        isJQuery: function(object) {
            return !!object.jquery;
        }
    });

    Foundation.apply(Foundation, {

        typeOf: function(value) {
            var type, typeToString;
            if (value === null) {
                return 'null';
            }
            type = typeof value;
            if (type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean') {
                return type;
            }
            typeToString = toString.call(value);

            switch (typeToString) {
                case '[object Array]':
                    return 'array';
                case '[object Date]':
                    return 'date';
                case '[object Boolean]':
                    return 'boolean';
                case '[object Number]':
                    return 'number';
                case '[object RegExp]':
                    return 'regexp';
            }
            if (type === 'function') {
                return 'function';
            }
            if (type === 'object') {
                if (value.nodeType !== undefined) {
                    if (value.nodeType === 3) {
                        return (nonWhitespaceRe).test(value.nodeValue) ? 'textnode' : 'whitespace';
                    } else {
                        return 'element';
                    }
                }

                return 'object';
            }

            Foundation.Error({
                className: 'Foundation',
                methodName: 'typeOf',
                error: 'Failed to determine the type of the specified value "' + value + '". This is most likely a bug.'
            });
        },

        copyTo: function(dest, source, names) {
            if (typeof names == 'string') {
                names = names.split(/[,;\s]/);
            }

            var nLen = names ? names.length : 0,
                n, name;

            for (n = 0; n < nLen; n++) {
                name = names[n];
                if (source.hasOwnProperty(name)) {
                    dest[name] = source[name];
                }
            }
            return dest;
        },

        clone: function(item) {
            if (item === null || item === undefined) {
                return item;
            }

            if (item.nodeType && item.cloneNode) {
                return item.cloneNode(true);
            }

            var type = toString.call(item);

            // Date
            if (type === '[object Date]') {
                return new Date(item.getTime());
            }

            var i, j, k, clone, key;

            // Array
            if (type === '[object Array]') {
                i = item.length;

                clone = [];

                while (i--) {
                    clone[i] = Foundation.clone(item[i]);
                }
            }
            // Object
            else if (type === '[object Object]' && item.constructor === Object) {
                clone = {};

                for (key in item) {
                    clone[key] = Foundation.clone(item[key]);
                }

                if (enumerables) {
                    for (j = enumerables.length; j--;) {
                        k = enumerables[j];
                        clone[k] = item[k];
                    }
                }
            }

            return clone || item;
        },

        isEqual: function(a, b) {
            if (a === b) {
                return true;
            }
            if (Foundation.isEmpty(a) && Foundation.isEmpty(b)) {
                return true;
            }
            var type = Foundation.typeOf(a);
            if (type != Foundation.typeOf(b)) {
                return false
            }
            switch (type) {
                case 'string':
                    return a == String(b);
                case 'number':
                    return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
                case 'date':
                case 'boolean':
                    return +a == +b;
                case 'regexp':
                    return a.source == b.source &&
                        a.global == b.global &&
                        a.multiline == b.multiline &&
                        a.ignoreCase == b.ignoreCase;
                case 'array':
                    var aString = a.toString();
                    var bString = b.toString();

                    return aString.indexOf('[object') === -1 &&
                        bString.indexOf('[object') === -1 &&
                        aString === bString;
            }
            if (typeof a != 'object' || typeof b != 'object') {
                return false;
            }
            if (Foundation.isObject(a) && Foundation.isObject(b)) {
                if (!Foundation.isEqual(Foundation.Object.getKeys(a), Foundation.Object.getKeys(b))) {
                    return false;
                }
                for (var p in a) {
                    if (a[p] !== b[p]) {
                        return false;
                    }
                }
                return true;
            }
        },

        coerce: function(from, to) {
            var fromType = Foundation.typeOf(from),
                toType = to && to.name || Foundation.typeOf(to),
                isString = typeof from === 'string';

            if (Foundation.isEmpty(toType)) {
                return from;
            }

            toType = toType.toLowerCase();

            if (fromType !== toType) {
                switch (toType) {
                    case 'string':
                        return String(from);
                    case 'number':
                        return Number(from);
                    case 'boolean':
                        return isString && (!from || from === 'false') ? false : Boolean(from);
                    case 'null':
                        return isString && (!from || from === 'null') ? null : from;
                    case 'undefined':
                        return isString && (!from || from === 'undefined') ? undefined : from;
                    case 'date':
                        return isString && isNaN(from) ? Foundation.Date.parse(from, Foundation.Date.defaultFormat) : Date(Number(from));
                }
            }
            return from;
        },

        uniqueId: function(prefix) {
            return (prefix || 'Hamster_') + +new Date() + '_' +
                Foundation.Number.randomInt(0, 1000);
        },

        length: function(object) {
            if (Foundation.isIterable(object)) {
                return object.length;
            }

            if (Foundation.isJQuery(object)) {
                return object.length;
            }

            if (object.length) {
                return object.length;
            }

            if (object.count) {
                return object.count;
            }

            if (Foundation.isFunction(object.length)) {
                return object.length();
            }

            if (Foundation.isFunction(object.count)) {
                return object.count();
            }
        },

        value: function(val, defaultValue, allowBlank) {
            return Foundation.isEmpty(val, allowBlank) ? defaultValue : val;
        },

        identityFn: function (arg) {
            return arg;
        }

    });



    var arrayPrototype = Array.prototype,
        slice = arrayPrototype.slice;

    //splice function in IE8 is broken (hack)
    var supportsSplice = (function() {
        var array = [],
            lengthBefore, i = 20;

        if (!array.splice) {
            return false;
        }

        while (i--) {
            array.push("A");
        }

        array.splice(15, 0, "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F");

        lengthBefore = array.length;

        //预期的长度应该是42，实际长度为55
        array.splice(13, 0, "XXX");

        if (lengthBefore + 1 != array.length) {
            return false;
        }

        return true;
    })();

    function fixArrayIndex(array, index) {
        return (index < 0) ? Math.max(0, array.length + index) : Math.min(array.length, index);
    }

    function replaceSim(array, index, removeCount, insert) {
        var add = insert ? insert.length : 0,
            length = array.length,
            pos = fixArrayIndex(array, index),
            remove,
            tailOldPos,
            tailNewPos,
            tailCount,
            lengthAfterRemove,
            i;

        if (pos === length) {
            if (add) {
                array.push.apply(array, insert);
            }
        } else {
            remove = Math.min(removeCount, length - pos);
            tailOldPos = pos + remove;
            tailNewPos = tailOldPos + add - remove;
            tailCount = length - tailOldPos;
            lengthAfterRemove = length - remove;

            if (tailNewPos < tailOldPos) {
                for (i = 0; i < tailCount; ++i) {
                    array[tailNewPos + i] = array[tailOldPos + i];
                }
            } else if (tailNewPos > tailOldPos) {
                for (i = tailCount; i--;) {
                    array[tailNewPos + i] = array[tailOldPos + i];
                }
            }

            if (add && pos === lengthAfterRemove) {
                array.length = lengthAfterRemove;
                array.push.apply(array, insert);
            } else {
                array.length = lengthAfterRemove + add;
                for (i = 0; i < add; ++i) {
                    array[pos + i] = insert[i];
                }
            }
        }

        return array;
    }

    function replaceNative(array, index, removeCount, insert) {
        if (insert && insert.length) {
            if (index < array.length) {
                array.splice.apply(array, [index, removeCount].concat(insert));
            } else {
                array.push.apply(array, insert);
            }
        } else {
            array.splice(index, removeCount);
        }
        return array;
    }

    function eraseSim(array, index, removeCount) {
        return replaceSim(array, index, removeCount);
    }

    function eraseNative(array, index, removeCount) {
        array.splice(index, removeCount);
        return array;
    }

    function spliceSim(array, index, removeCount) {
        var pos = fixArrayIndex(array, index),
            removed = array.slice(index, fixArrayIndex(array, pos + removeCount));

        if (arguments.length < 4) {
            replaceSim(array, pos, removeCount);
        } else {
            replaceSim(array, pos, removeCount, slice.call(arguments, 3));
        }

        return removed;
    }

    function spliceNative(array) {
        return array.splice.apply(array, slice.call(arguments, 1));
    }

    var erase = supportsSplice ? eraseNative : eraseSim;
    var replace = supportsSplice ? replaceNative : replaceSim;
    var splice = supportsSplice ? spliceNative : spliceSim;

    var arrayPrototype = Array.prototype,
        supportsForEach = 'forEach' in arrayPrototype,
        supportsMap = 'map' in arrayPrototype,
        supportsIndexOf = 'indexOf' in arrayPrototype,
        supportsEvery = 'every' in arrayPrototype,
        supportsSome = 'some' in arrayPrototype,
        supportsFilter = 'filter' in arrayPrototype,
        supportsSort = function() {
            var a = [1, 2, 3, 4, 5].sort(function() { return 0; });
            return a[0] === 1 && a[1] === 2 && a[2] === 3 && a[3] === 4 && a[4] === 5;
        }(),
        supportsSliceOnNodeList = true;

    try {
        // IE 6 - 8 will throw an error when using Array.prototype.slice on NodeList
        if (typeof document !== 'undefined') {
            slice.call(document.getElementsByTagName('body'));
        }
    } catch (e) {
        supportsSliceOnNodeList = false;
    }

    /*给HY定义Array对象*/
    Foundation.Array = {

        eachCount: function(count, fn, scope) {
            for (var i = 0; i < count; i++) {
                fn.call(scope || window, i, count);
            }
        },

        mapCount: function(count, fn, scope) {
            var arr = [];
            for (var i = 0; i < count; i++) {
                arr.push(fn.call(scope || window, i, count));
            }
            return arr;
        },

        each: function(array, fn, scope, reverse) {
            //当array不是可迭代数组，或者是基本数据类型的话，那么创建array
            array = Foundation.Array.from(array);

            var i, k, len = array.length;

            if (reverse !== true) {
                for (i = 0; i < len; i++) {
                    k = array[i];
                    //循环执行fn函数，若fn返回false时，直接跳出each循环
                    if (fn.call(scope || k, k, i, array) === false) {
                        return i;
                    }
                }
            } else {
                for (i = len - 1; i > -1; i--) {
                    k = array[i];
                    if (fn.call(scope || k, k, i, array) === false) {
                        return i;
                    }
                }
            }

            return true;
        },

        forEach: function(array, fn, scope) {
            array = Foundation.Array.from(array);
            if (supportsForEach) {
                return array.forEach(fn, scope);
            }
            var i, k, ln = array.length;
            for (i = 0; i < ln; i++) {
                k = array[i];
                fn.call(scope, k, i, array);
            }
        },

        /**
         * 返回(想要找寻值)一样的该值在数组的索引值
         * @function
         * @param {array} array 待检测的数组
         * @param {all} item 需要检测索引值的项
         * @param {number} from 设置从待检测数组开始检测索引
         * @returns {array}
         */
        indexOf: function(array, item, from) {
            from = from || 0;
            if (supportsIndexOf) {
                return array.indexOf(item, from);
            }
            var i, length = array.length;
            //判断from的大小，然后定位起始点
            for (i = (from < 0 ? Math.max(0, length + from) : from || 0); i < length; i++) {
                if (array[i] === item) {
                    return i;
                }
            }
            return -1;
        },

        //查找数组中是否包含item项
        contains: function(array, item) {
            return (Foundation.Array.indexOf(array, item) > -1);
        },

        /**
         * 从一个数组中截取新的数组
         * @function
         * @param {array} array 新数组的母体
         * @param {number} start 截取数组的开始索引
         * @param {number} end 截取数组的结束索引
         * @returns {array}
         */
        subArray: function(array, start, end) {
            return arrayPrototype.slice.call(array || [], start || 0, end || array.length)
        },

        slice: function(array, start, end) {
            return this.subArray(array, start, end)
        },

        /**
         * 遍历数组，执行函数,迭代数组，每个元素作为参数执行callBack方法，
         * 由callBack方法对每个元素进行处理，最后返回处理后的一个数组
         * @function
         * @param {array} array 待遍历的数组
         * @param {function} fn 每次遍历执行的回调函数
         * @param {object} scope 回调函数内部的作用域，即this的指向对象
         * @returns {array}
         */
        map: function(array, fn, scope) {
            if (!fn) {
                Foundation.Error({
                    className: "Foundation.Array",
                    methodName: "map",
                    error: "fn must be a valid callback function"
                })
            }

            array = array || [];

            if (supportsMap) {
                return array.map(fn, scope);
            }

            var results = [],
                i = 0,
                len = array.length;

            for (; i < len; i++) {
                results[i] = fn.call(scope, array[i], i, array);
            }

            return results;
        },

        clean: function(array) {
            var results = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (!Foundation.isEmpty(item)) {
                    results.push(item);
                }
            }

            return results;
        },

        /**
         * 通过自定义规则过滤数组，得到新的数组
         * @function
         * @param {array} array 待过滤的数组
         * @param {function} fn 每次遍历执行的回调函数
         * @param {object} scope 回调函数内部的作用域，即this的指向对象
         * @returns {array}
         */
        filter: function(array, fn, scope) {
            if (!fn) {
                Foundation.Error({
                    className: "Foundation.Array",
                    methodName: "filter",
                    error: "fn must be a valid callback function"
                });
            }

            array = array || [];

            if (supportsFilter) {
                return array.filter(fn, scope);
            }

            var results = [],
                i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                if (fn.call(scope, array[i], i, array) === true) {
                    results.push(array[i]);
                }
            }

            return results;
        },

        /**
         * 给数组去重，得到一个新的数组
         * @function
         * @param {array} array 待去重的数组
         * @returns {array}
         */
        unique: function(array) {
            var clone = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (Foundation.Array.indexOf(clone, item) === -1) {
                    clone.push(item);
                }
            }

            return clone;
        },

        remove: function(array, item) {
            var index = Foundation.Array.indexOf(array, item);
            if (index !== -1) {
                array.splice(index, 1)
            }
            return array;
        },

        /**
         * 向一个数组中添加元素项，但是保持唯一性
         * @function
         * @param {array} array 待添加的数组
         * @param {all} item 待添加到数组中的元素项，需要验证唯一性
         * @returns {array}
         */
        include: function(array, item) {
            if (!Foundation.Array.contains(array, item)) {
                array.push(item)
            }
            return array;
        },

        /**
         * 克隆数组
         * @function
         * @param {array} array 待克隆数组
         * @returns {array}
         */
        clone: function(array) {
            return arrayPrototype.slice.call(array);
        },

        /**
         * 数组合并获得新数组
         * @function
         * @param {array} array 待合并数组
         * @returns {array}
         */
        merge: function() {
            if (arguments.length == 0) {
                return [];
            }

            var me = Foundation.Array,
                source = arguments[0],
                remain = arrayPrototype.slice.call(arguments, 1);

            me.each(remain, function(item, i) {
                me.each(item, function(kitem, k) {
                    source.push(kitem)
                })
            });

            return source;
        },

        uniqueMerge: function() {
            if (arguments.length == 0) {
                return [];
            }

            var me = Foundation.Array,
                source = me.unique(arguments[0]),
                remain = arrayPrototype.slice.call(arguments, 1);

            me.each(remain, function(item, i) {
                me.each(item, function(kitem, k) {
                    me.include(source, kitem)
                })
            });

            return source;
        },

        from: function(value, newReference) {
            if (value === undefined || value === null) {
                return [];
            }

            if (Foundation.isArray(value)) {
                return (newReference) ? slice.call(value) : value;
            }

            if (value && value.length !== undefined && typeof value !== 'string') {
                return Foundation.Array.toArray(value);
            }

            return [value];
        },

        toArray: function(iterable, start, end) {
            if (!iterable || !iterable.length) {
                return [];
            }

            if (typeof iterable === 'string') {
                iterable = iterable.split('');
            }

            if (supportsSliceOnNodeList) {
                return slice.call(iterable, start || 0, end || iterable.length);
            }

            var array = [],
                i;

            start = start || 0;
            end = end ? ((end < 0) ? iterable.length + end : end) : iterable.length;

            for (i = start; i < end; i++) {
                array.push(iterable[i]);
            }
            return array;
        },

        min: function(array, comparisonFn) {
            //debug
            if (!Foundation.isIterable(array)) {
                Foundation.Error({
                    className: "Foundation.Array",
                    methodName: "min",
                    error: "arguments type must be an array"
                });
            }
            //debug
            var min = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(min, item) === -1) {
                        min = item;
                    }
                } else {
                    if (item < min) {
                        min = item;
                    }
                }
            }

            return min;
        },

        max: function(array, comparisonFn) {
            //debug
            if (!Foundation.isIterable(array)) {
                Foundation.Error({
                    className: "Foundation.Array",
                    methodName: "max",
                    error: "arguments type must be an array"
                });
            }
            //debug
            var max = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(max, item) === 1) {
                        max = item;
                    }
                } else {
                    if (item > max) {
                        max = item;
                    }
                }
            }

            return max;
        },

        sum: function(array, name) {
            //debug
            if (!Foundation.isIterable(array)) {
                Foundation.Error({
                    className: "Foundation.Array",
                    methodName: "sum",
                    error: "arguments type must be an array"
                });
            }
            //debug
            var sum = 0,
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                sum += item;
            }

            return sum;
        },

        mean: function(array) {
            return array.length > 0 ? Foundation.Array.sum(array) / array.length : undefined;
        },

        //获取arr中每个对象中的prop属性值，并且放到array中
        pluck: function(arr, prop) {
            var ret = [];
            Foundation.each(arr, function(v) {
                ret.push(v[prop]);
            });
            return ret;
        },

        flatten: function(array) {
            var worker = [];

            function rFlatten(a) {
                var i, ln, v;

                for (i = 0, ln = a.length; i < ln; i++) {
                    v = a[i];

                    if (Foundation.isArray(v)) {
                        rFlatten(v);
                    } else {
                        worker.push(v);
                    }
                }

                return worker;
            }

            return rFlatten(array);
        },

        grep: function(arr, callback, inv) {
            var ret = [],
                retVal;
            inv = !!inv;

            for (var i = 0, length = arr.length; i < length; i++) {
                retVal = !!callback(arr[i], i);
                if (inv !== retVal) {
                    ret.push(arr[i]);
                }
            }
            return ret;
        },

        erase: erase,

        replace: replace,

        splice: splice,

        insert: function(array, index, items) {
            return replace(array, index, 0, items);
        },

        sort: supportsSort ? function(array, sortFn) {
            if (sortFn) {
                return array.sort(sortFn);
            } else {
                return array.sort();
            }
        } : function(array, sortFn) {
            var length = array.length,
                i = 0,
                comparison,
                j, min, tmp;

            for (; i < length; i++) {
                min = i;
                for (j = i + 1; j < length; j++) {
                    if (sortFn) {
                        comparison = sortFn(array[j], array[min]);
                        if (comparison < 0) {
                            min = j;
                        }
                    } else if (array[j] < array[min]) {
                        min = j;
                    }
                }
                if (min !== i) {
                    tmp = array[i];
                    array[i] = array[min];
                    array[min] = tmp;
                }
            }

            return array;
        },

        some: supportsSome ? function(array, fn, scope) {
            if (!fn) {
                Foundation.Error({
                    className: "Foundation.Array",
                    methodName: "some",
                    error: "must have a callback function passed as second argument."
                })
            }
            return array.some(fn, scope);
        } : function(array, fn, scope) {
            if (!fn) {
                Foundation.Error({
                    className: "Foundation.Array",
                    methodName: "some",
                    error: "must have a callback function passed as second argument."
                })
            }
            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (fn.call(scope, array[i], i, array)) {
                    return true;
                }
            }

            return false;
        },

        every: supportsEvery ? function(array, fn, scope) {
            if (!fn) {
                Foundation.Error({
                    className: "Foundation.Array",
                    methodName: "every",
                    error: "must have a callback function passed as second argument."
                })
            }
            return array.every(fn, scope);
        } : function(array, fn, scope) {
            if (!fn) {
                Foundation.Error({
                    className: "Foundation.Array",
                    methodName: "every",
                    error: "must have a callback function passed as second argument."
                })
            }
            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (!fn.call(scope, array[i], i, array)) {
                    return false;
                }
            }

            return true;
        },

        difference: function(arrayA, arrayB) {
            var clone = slice.call(arrayA),
                ln = clone.length,
                i, j, lnB;

            for (i = 0, lnB = arrayB.length; i < lnB; i++) {
                for (j = 0; j < ln; j++) {
                    if (clone[j] === arrayB[i]) {
                        erase(clone, j, 1);
                        j--;
                        ln--;
                    }
                }
            }

            return clone;
        },

        intersect: function() {
            var intersection = [],
                arrays = slice.call(arguments),
                arraysLength,
                array,
                arrayLength,
                minArray,
                minArrayIndex,
                minArrayCandidate,
                minArrayLength,
                element,
                elementCandidate,
                elementCount,
                i, j, k;

            if (!arrays.length) {
                return intersection;
            }

            arraysLength = arrays.length;
            for (i = minArrayIndex = 0; i < arraysLength; i++) {
                minArrayCandidate = arrays[i];
                if (!minArray || minArrayCandidate.length < minArray.length) {
                    minArray = minArrayCandidate;
                    minArrayIndex = i;
                }
            }

            minArray = Foundation.Array.unique(minArray);
            erase(arrays, minArrayIndex, 1);

            minArrayLength = minArray.length;
            arraysLength = arrays.length;
            for (i = 0; i < minArrayLength; i++) {
                element = minArray[i];
                elementCount = 0;

                for (j = 0; j < arraysLength; j++) {
                    array = arrays[j];
                    arrayLength = array.length;
                    for (k = 0; k < arrayLength; k++) {
                        elementCandidate = array[k];
                        if (element === elementCandidate) {
                            elementCount++;
                            break;
                        }
                    }
                }

                if (elementCount === arraysLength) {
                    intersection.push(element);
                }
            }

            return intersection;
        },

        invoke: function(arr, methodName) {
            var ret = [],
                args = Array.prototype.slice.call(arguments, 2),
                a, v,
                aLen = arr.length;

            for (a = 0; a < aLen; a++) {
                v = arr[a];

                if (v && typeof v[methodName] == 'function') {
                    ret.push(v[methodName].apply(v, args));
                } else {
                    ret.push(undefined);
                }
            }

            return ret;
        }

    };

    Foundation.Date = new function() {

        var utilDate = this,
            stripEscapeRe = /(\\.)/g,
            hourInfoRe = /([gGhHisucUOPZ]|MS)/,
            dateInfoRe = /([djzmnYycU]|MS)/,
            slashRe = /\\/gi,
            numberTokenRe = /\{(\d+)\}/g,
            MSFormatRe = new RegExp('\\/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\/'),
            code = [
                "var me = this, dt, y, m, d, h, i, s, ms, o, O, z, zz, u, v, W, year, jan4, week1monday,",
                "def = me.defaults,",
                "from = Foundation.Number.from,",
                "results = String(input).match(me.parseRegexes[{0}]);",

                "if(results){",
                "{1}",

                "if(u != null){",
                "v = new Date(u * 1000);",
                "}else{",

                "dt = me.clearTime(new Date);",

                "y = from(y, from(def.y, dt.getFullYear()));",
                "m = from(m, from(def.m - 1, dt.getMonth()));",
                "d = from(d, from(def.d, dt.getDate()));",

                "h  = from(h, from(def.h, dt.getHours()));",
                "i  = from(i, from(def.i, dt.getMinutes()));",
                "s  = from(s, from(def.s, dt.getSeconds()));",
                "ms = from(ms, from(def.ms, dt.getMilliseconds()));",

                "if(z >= 0 && y >= 0){",

                "v = me.add(new Date(y < 100 ? 100 : y, 0, 1, h, i, s, ms), me.YEAR, y < 100 ? y - 100 : 0);",

                "v = !strict? v : (strict === true && (z <= 364 || (me.isLeapYear(v) && z <= 365))? me.add(v, me.DAY, z) : null);",
                "}else if(strict === true && !me.isValid(y, m + 1, d, h, i, s, ms)){",
                "v = null;",
                "}else{",
                "if (W) {",
                "year = y || (new Date()).getFullYear(),",
                "jan4 = new Date(year, 0, 4, 0, 0, 0),",
                "week1monday = new Date(jan4.getTime() - ((jan4.getDay() - 1) * 86400000));",
                "v = Foundation.Date.clearTime(new Date(week1monday.getTime() + ((W - 1) * 604800000)));",
                "} else {",
                "v = me.add(new Date(y < 100 ? 100 : y, m, d, h, i, s, ms), me.YEAR, y < 100 ? y - 100 : 0);",
                "}",
                "}",
                "}",
                "}",

                "if(v){",
                "if(zz != null){",
                "v = me.add(v, me.SECOND, -v.getTimezoneOffset() * 60 - zz);",
                "}else if(o){",
                "v = me.add(v, me.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn));",
                "}",
                "}",

                "return v;"
            ].join('\n');


        function xf(format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(numberTokenRe, function(m, i) {
                return args[i];
            });
        }

        Foundation.apply(utilDate, {

            now: Date.now || function() {
                return +new Date();
            },

            toString: function(date) {
                var pad = Foundation.String.leftPad;

                return date.getFullYear() + "-" +
                    pad(date.getMonth() + 1, 2, '0') + "-" +
                    pad(date.getDate(), 2, '0') + "T" +
                    pad(date.getHours(), 2, '0') + ":" +
                    pad(date.getMinutes(), 2, '0') + ":" +
                    pad(date.getSeconds(), 2, '0');
            },

            getElapsed: function(dateA, dateB) {
                return Math.abs(dateA - (dateB || new Date()));
            },

            useStrict: false,

            formatCodeToRegex: function(character, currentGroup) {
                var p = utilDate.parseCodes[character];

                if (p) {
                    p = typeof p == 'function' ? p() : p;
                    utilDate.parseCodes[character] = p;
                }

                return p ? Foundation.applyIf({
                    c: p.c ? xf(p.c, currentGroup || "{0}") : p.c
                }, p) : {
                    g: 0,
                    c: null,
                    s: Foundation.String.escapeRegex(character)
                };
            },

            parseFunctions: {
                "MS": function(input, strict) {
                    var r = (input || '').match(MSFormatRe);
                    return r ? new Date(((r[1] || '') + r[2]) * 1) : null;
                },
                "time": function(input, strict) {
                    var num = parseInt(input, 10);
                    if (num || num === 0) {
                        return new Date(num);
                    }
                    return null;
                },
                "timestamp": function(input, strict) {
                    var num = parseInt(input, 10);
                    if (num || num === 0) {
                        return new Date(num * 1000);
                    }
                    return null;
                }
            },
            parseRegexes: [],

            formatFunctions: {
                "MS": function() {
                    return '\\/Date(' + this.getTime() + ')\\/';
                },
                "time": function() {
                    return this.getTime().toString();
                },
                "timestamp": function() {
                    return utilDate.format(this, 'U');
                }
            },

            y2kYear: 50,

            MILLI: "ms",

            SECOND: "s",

            MINUTE: "mi",

            HOUR: "h",

            DAY: "d",

            MONTH: "mo",

            YEAR: "y",

            defaults: {},

            dayNames: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],

            monthNames: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ],

            monthNumbers: {
                January: 0,
                Jan: 0,
                February: 1,
                Feb: 1,
                March: 2,
                Mar: 2,
                April: 3,
                Apr: 3,
                May: 4,
                June: 5,
                Jun: 5,
                July: 6,
                Jul: 6,
                August: 7,
                Aug: 7,
                September: 8,
                Sep: 8,
                October: 9,
                Oct: 9,
                November: 10,
                Nov: 10,
                December: 11,
                Dec: 11
            },

            defaultFormat: "Y-m-d",

            getShortMonthName: function(month) {
                return Foundation.Date.monthNames[month].substring(0, 3);
            },

            getShortDayName: function(day) {
                return Foundation.Date.dayNames[day].substring(0, 3);
            },

            getMonthNumber: function(name) {
                return Foundation.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
            },

            formatContainsHourInfo: function(format) {
                return hourInfoRe.test(format.replace(stripEscapeRe, ''));
            },

            formatContainsDateInfo: function(format) {
                return dateInfoRe.test(format.replace(stripEscapeRe, ''));
            },

            unescapeFormat: function(format) {
                return format.replace(slashRe, '');
            },

            formatCodes: {
                d: "Foundation.String.leftPad(this.getDate(), 2, '0')",
                D: "Foundation.Date.getShortDayName(this.getDay())",
                j: "this.getDate()",
                l: "Foundation.Date.dayNames[this.getDay()]",
                N: "(this.getDay() ? this.getDay() : 7)",
                S: "Foundation.Date.getSuffix(this)",
                w: "this.getDay()",
                z: "Foundation.Date.getDayOfYear(this)",
                W: "Foundation.String.leftPad(Foundation.Date.getWeekOfYear(this), 2, '0')",
                F: "Foundation.Date.monthNames[this.getMonth()]",
                m: "Foundation.String.leftPad(this.getMonth() + 1, 2, '0')",
                M: "Foundation.Date.getShortMonthName(this.getMonth())",
                n: "(this.getMonth() + 1)",
                t: "Foundation.Date.getDaysInMonth(this)",
                L: "(Foundation.Date.isLeapYear(this) ? 1 : 0)",
                o: "(this.getFullYear() + (Foundation.Date.getWeekOfYear(this) == 1 && this.getMonth() > 0 ? +1 : (Foundation.Date.getWeekOfYear(this) >= 52 && this.getMonth() < 11 ? -1 : 0)))",
                Y: "Foundation.String.leftPad(this.getFullYear(), 4, '0')",
                y: "('' + this.getFullYear()).substring(2, 4)",
                a: "(this.getHours() < 12 ? 'am' : 'pm')",
                A: "(this.getHours() < 12 ? 'AM' : 'PM')",
                g: "((this.getHours() % 12) ? this.getHours() % 12 : 12)",
                G: "this.getHours()",
                h: "Foundation.String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",
                H: "Foundation.String.leftPad(this.getHours(), 2, '0')",
                i: "Foundation.String.leftPad(this.getMinutes(), 2, '0')",
                s: "Foundation.String.leftPad(this.getSeconds(), 2, '0')",
                u: "Foundation.String.leftPad(this.getMilliseconds(), 3, '0')",
                O: "Foundation.Date.getGMTOffset(this)",
                P: "Foundation.Date.getGMTOffset(this, true)",
                T: "Foundation.Date.getTimezone(this)",
                Z: "(this.getTimezoneOffset() * -60)",

                c: function() {
                    var c, code, i, l, e;
                    for (c = "Y-m-dTH:i:sP", code = [], i = 0, l = c.length; i < l; ++i) {
                        e = c.charAt(i);
                        code.push(e == "T" ? "'T'" : utilDate.getFormatCode(e));
                    }
                    return code.join(" + ");
                },
                U: "Math.round(this.getTime() / 1000)"
            },

            isValid: function(y, m, d, h, i, s, ms) {
                h = h || 0;
                i = i || 0;
                s = s || 0;
                ms = ms || 0;

                var dt = utilDate.add(new Date(y < 100 ? 100 : y, m - 1, d, h, i, s, ms), utilDate.YEAR, y < 100 ? y - 100 : 0);

                return y == dt.getFullYear() &&
                    m == dt.getMonth() + 1 &&
                    d == dt.getDate() &&
                    h == dt.getHours() &&
                    i == dt.getMinutes() &&
                    s == dt.getSeconds() &&
                    ms == dt.getMilliseconds();
            },

            parse: function(input, format, strict) {
                var p = utilDate.parseFunctions;
                if (p[format] == null) {
                    utilDate.createParser(format);
                }
                return p[format].call(utilDate, input, Foundation.isDefined(strict) ? strict : utilDate.useStrict);
            },

            parseDate: function(input, format, strict) {
                return utilDate.parse(input, format, strict);
            },

            getFormatCode: function(character) {
                var f = utilDate.formatCodes[character];

                if (f) {
                    f = typeof f == 'function' ? f() : f;
                    utilDate.formatCodes[character] = f;
                }

                return f || ("'" + Foundation.String.escape(character) + "'");
            },

            createFormat: function(format) {
                var code = [],
                    special = false,
                    ch = '',
                    i;

                for (i = 0; i < format.length; ++i) {
                    ch = format.charAt(i);
                    if (!special && ch == "\\") {
                        special = true;
                    } else if (special) {
                        special = false;
                        code.push("'" + Foundation.String.escape(ch) + "'");
                    } else {
                        code.push(utilDate.getFormatCode(ch));
                    }
                }
                utilDate.formatFunctions[format] = Foundation.functionFactory("return " + code.join('+'));
            },

            createParser: function(format) {
                var regexNum = utilDate.parseRegexes.length,
                    currentGroup = 1,
                    calc = [],
                    regex = [],
                    special = false,
                    ch = "",
                    i = 0,
                    len = format.length,
                    atEnd = [],
                    obj;

                for (; i < len; ++i) {
                    ch = format.charAt(i);
                    if (!special && ch == "\\") {
                        special = true;
                    } else if (special) {
                        special = false;
                        regex.push(Foundation.String.escape(ch));
                    } else {
                        obj = utilDate.formatCodeToRegex(ch, currentGroup);
                        currentGroup += obj.g;
                        regex.push(obj.s);
                        if (obj.g && obj.c) {
                            if (obj.calcAtEnd) {
                                atEnd.push(obj.c);
                            } else {
                                calc.push(obj.c);
                            }
                        }
                    }
                }

                calc = calc.concat(atEnd);

                utilDate.parseRegexes[regexNum] = new RegExp("^" + regex.join('') + "$", 'i');
                utilDate.parseFunctions[format] = Foundation.functionFactory("input", "strict", xf(code, regexNum, calc.join('')));
            },

            parseCodes: {
                d: {
                    g: 1,
                    c: "d = parseInt(results[{0}], 10);\n",
                    s: "(3[0-1]|[1-2][0-9]|0[1-9])"
                },
                j: {
                    g: 1,
                    c: "d = parseInt(results[{0}], 10);\n",
                    s: "(3[0-1]|[1-2][0-9]|[1-9])"
                },
                D: function() {
                    for (var a = [], i = 0; i < 7; a.push(utilDate.getShortDayName(i)), ++i);
                    return {
                        g: 0,
                        c: null,
                        s: "(?:" + a.join("|") + ")"
                    };
                },
                l: function() {
                    return {
                        g: 0,
                        c: null,
                        s: "(?:" + utilDate.dayNames.join("|") + ")"
                    };
                },
                N: {
                    g: 0,
                    c: null,
                    s: "[1-7]"
                },
                S: {
                    g: 0,
                    c: null,
                    s: "(?:st|nd|rd|th)"
                },
                w: {
                    g: 0,
                    c: null,
                    s: "[0-6]"
                },
                z: {
                    g: 1,
                    c: "z = parseInt(results[{0}], 10);\n",
                    s: "(\\d{1,3})"
                },
                W: {
                    g: 1,
                    c: "W = parseInt(results[{0}], 10);\n",
                    s: "(\\d{2})"
                },
                F: function() {
                    return {
                        g: 1,
                        c: "m = parseInt(me.getMonthNumber(results[{0}]), 10);\n",
                        s: "(" + utilDate.monthNames.join("|") + ")"
                    };
                },
                M: function() {
                    for (var a = [], i = 0; i < 12; a.push(utilDate.getShortMonthName(i)), ++i);
                    return Foundation.applyIf({
                        s: "(" + a.join("|") + ")"
                    }, utilDate.formatCodeToRegex("F"));
                },
                m: {
                    g: 1,
                    c: "m = parseInt(results[{0}], 10) - 1;\n",
                    s: "(1[0-2]|0[1-9])"
                },
                n: {
                    g: 1,
                    c: "m = parseInt(results[{0}], 10) - 1;\n",
                    s: "(1[0-2]|[1-9])"
                },
                t: {
                    g: 0,
                    c: null,
                    s: "(?:\\d{2})"
                },
                L: {
                    g: 0,
                    c: null,
                    s: "(?:1|0)"
                },
                o: {
                    g: 1,
                    c: "y = parseInt(results[{0}], 10);\n",
                    s: "(\\d{4})"

                },
                Y: {
                    g: 1,
                    c: "y = parseInt(results[{0}], 10);\n",
                    s: "(\\d{4})"
                },
                y: {
                    g: 1,
                    c: "var ty = parseInt(results[{0}], 10);\n" +
                        "y = ty > me.y2kYear ? 1900 + ty : 2000 + ty;\n",
                    s: "(\\d{1,2})"
                },
                a: {
                    g: 1,
                    c: "if (/(am)/i.test(results[{0}])) {\n" +
                        "if (!h || h == 12) { h = 0; }\n" +
                        "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
                    s: "(am|pm|AM|PM)",
                    calcAtEnd: true
                },
                A: {
                    g: 1,
                    c: "if (/(am)/i.test(results[{0}])) {\n" +
                        "if (!h || h == 12) { h = 0; }\n" +
                        "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
                    s: "(AM|PM|am|pm)",
                    calcAtEnd: true
                },
                g: {
                    g: 1,
                    c: "h = parseInt(results[{0}], 10);\n",
                    s: "(1[0-2]|[0-9])"
                },
                G: {
                    g: 1,
                    c: "h = parseInt(results[{0}], 10);\n",
                    s: "(2[0-3]|1[0-9]|[0-9])"
                },
                h: {
                    g: 1,
                    c: "h = parseInt(results[{0}], 10);\n",
                    s: "(1[0-2]|0[1-9])"
                },
                H: {
                    g: 1,
                    c: "h = parseInt(results[{0}], 10);\n",
                    s: "(2[0-3]|[0-1][0-9])"
                },
                i: {
                    g: 1,
                    c: "i = parseInt(results[{0}], 10);\n",
                    s: "([0-5][0-9])"
                },
                s: {
                    g: 1,
                    c: "s = parseInt(results[{0}], 10);\n",
                    s: "([0-5][0-9])"
                },
                u: {
                    g: 1,
                    c: "ms = results[{0}]; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n",
                    s: "(\\d+)"
                },
                O: {
                    g: 1,
                    c: [
                        "o = results[{0}];",
                        "var sn = o.substring(0,1),",
                        "hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60),",
                        "mn = o.substring(3,5) % 60;",
                        "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Foundation.String.leftPad(hr, 2, '0') + Foundation.String.leftPad(mn, 2, '0')) : null;\n"
                    ].join("\n"),
                    s: "([+-]\\d{4})"
                },
                P: {
                    g: 1,
                    c: [
                        "o = results[{0}];",
                        "var sn = o.substring(0,1),",
                        "hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60),",
                        "mn = o.substring(4,6) % 60;",
                        "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Foundation.String.leftPad(hr, 2, '0') + Foundation.String.leftPad(mn, 2, '0')) : null;\n"
                    ].join("\n"),
                    s: "([+-]\\d{2}:\\d{2})"
                },
                T: {
                    g: 0,
                    c: null,
                    s: "[A-Z]{1,5}"
                },
                Z: {
                    g: 1,
                    c: "zz = results[{0}] * 1;\n" +
                        "zz = (-43200 <= zz && zz <= 50400)? zz : null;\n",
                    s: "([+-]?\\d{1,5})"
                },
                c: function() {
                    var calc = [],
                        arr = [
                            utilDate.formatCodeToRegex("Y", 1),
                            utilDate.formatCodeToRegex("m", 2),
                            utilDate.formatCodeToRegex("d", 3),
                            utilDate.formatCodeToRegex("H", 4),
                            utilDate.formatCodeToRegex("i", 5),
                            utilDate.formatCodeToRegex("s", 6),
                            { c: "ms = results[7] || '0'; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n" },
                            {
                                c: [
                                    "if(results[8]) {",
                                    "if(results[8] == 'Z'){",
                                    "zz = 0;",
                                    "}else if (results[8].indexOf(':') > -1){",
                                    utilDate.formatCodeToRegex("P", 8).c,
                                    "}else{",
                                    utilDate.formatCodeToRegex("O", 8).c,
                                    "}",
                                    "}"
                                ].join('\n')
                            }
                        ],
                        i,
                        l;

                    for (i = 0, l = arr.length; i < l; ++i) {
                        calc.push(arr[i].c);
                    }

                    return {
                        g: 1,
                        c: calc.join(""),
                        s: [
                            arr[0].s,
                            "(?:", "-", arr[1].s,
                            "(?:", "-", arr[2].s,
                            "(?:",
                            "(?:T| )?",
                            arr[3].s, ":", arr[4].s,
                            "(?::", arr[5].s, ")?",
                            "(?:(?:\\.|,)(\\d+))?",
                            "(Z|(?:[-+]\\d{2}(?::)?\\d{2}))?",
                            ")?",
                            ")?",
                            ")?"
                        ].join("")
                    };
                },
                U: {
                    g: 1,
                    c: "u = parseInt(results[{0}], 10);\n",
                    s: "(-?\\d+)"
                }
            },

            dateFormat: function(date, format) {
                return utilDate.format(date, format);
            },

            isEqual: function(date1, date2) {
                if (date1 && date2) {
                    return (date1.getTime() === date2.getTime());
                }
                return !(date1 || date2);
            },

            format: function(date, format) {
                var formatFunctions = utilDate.formatFunctions;

                if (!Foundation.isDate(date)) {
                    return '';
                }

                if (formatFunctions[format] == null) {
                    utilDate.createFormat(format);
                }

                return formatFunctions[format].call(date) + '';
            },

            getTimezone: function(date) {
                return date.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,5})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
            },

            getGMTOffset: function(date, colon) {
                var offset = date.getTimezoneOffset();
                return (offset > 0 ? "-" : "+") +
                    Foundation.String.leftPad(Math.floor(Math.abs(offset) / 60), 2, "0") +
                    (colon ? ":" : "") +
                    Foundation.String.leftPad(Math.abs(offset % 60), 2, "0");
            },

            getDayOfYear: function(date) {
                var num = 0,
                    d = Foundation.Date.clone(date),
                    m = date.getMonth(),
                    i;

                for (i = 0, d.setDate(1), d.setMonth(0); i < m; d.setMonth(++i)) {
                    num += utilDate.getDaysInMonth(d);
                }
                return num + date.getDate() - 1;
            },

            getWeekOfYear: (function() {
                var ms1d = 864e5,
                    ms7d = 7 * ms1d;

                return function(date) {
                    var DC3 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 3) / ms1d,
                        AWN = Math.floor(DC3 / 7),
                        Wyr = new Date(AWN * ms7d).getUTCFullYear();

                    return AWN - Math.floor(Date.UTC(Wyr, 0, 7) / ms7d) + 1;
                };
            }()),

            isLeapYear: function(date) {
                var year = date.getFullYear();
                return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
            },

            getFirstDayOfMonth: function(date) {
                var day = (date.getDay() - (date.getDate() - 1)) % 7;
                return (day < 0) ? (day + 7) : day;
            },

            getLastDayOfMonth: function(date) {
                return utilDate.getLastDateOfMonth(date).getDay();
            },

            getFirstDateOfMonth: function(date) {
                return new Date(date.getFullYear(), date.getMonth(), 1);
            },

            getLastDateOfMonth: function(date) {
                return new Date(date.getFullYear(), date.getMonth(), utilDate.getDaysInMonth(date));
            },

            getDaysInMonth: (function() {
                var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                return function(date) {
                    var m = date.getMonth();

                    return m == 1 && utilDate.isLeapYear(date) ? 29 : daysInMonth[m];
                };
            }()),

            getSuffix: function(date) {
                switch (date.getDate()) {
                    case 1:
                    case 21:
                    case 31:
                        return "st";
                    case 2:
                    case 22:
                        return "nd";
                    case 3:
                    case 23:
                        return "rd";
                    default:
                        return "th";
                }
            },

            clone: function(date) {
                return new Date(date.getTime());
            },

            isDST: function(date) {
                return new Date(date.getFullYear(), 0, 1).getTimezoneOffset() != date.getTimezoneOffset();
            },

            clearTime: function(date, clone) {
                if (clone) {
                    return Foundation.Date.clearTime(Foundation.Date.clone(date));
                }

                var d = date.getDate(),
                    hr,
                    c;

                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);

                if (date.getDate() != d) {
                    for (hr = 1, c = utilDate.add(date, Foundation.Date.HOUR, hr); c.getDate() != d; hr++, c = utilDate.add(date, Foundation.Date.HOUR, hr));

                    date.setDate(d);
                    date.setHours(c.getHours());
                }

                return date;
            },

            add: function(date, interval, value) {
                var d = Foundation.Date.clone(date),
                    Date = Foundation.Date,
                    day, decimalValue, base = 0;
                if (!interval || value === 0) {
                    return d;
                }

                decimalValue = value - parseInt(value, 10);
                value = parseInt(value, 10);

                if (value) {
                    switch (interval.toLowerCase()) {
                        case Foundation.Date.MILLI:
                            d.setTime(d.getTime() + value);
                            break;
                        case Foundation.Date.SECOND:
                            d.setTime(d.getTime() + value * 1000);
                            break;
                        case Foundation.Date.MINUTE:
                            d.setTime(d.getTime() + value * 60 * 1000);
                            break;
                        case Foundation.Date.HOUR:
                            d.setTime(d.getTime() + value * 60 * 60 * 1000);
                            break;
                        case Foundation.Date.DAY:
                            d.setDate(d.getDate() + value);
                            break;
                        case Foundation.Date.MONTH:
                            day = date.getDate();
                            if (day > 28) {
                                day = Math.min(day, Foundation.Date.getLastDateOfMonth(Foundation.Date.add(Foundation.Date.getFirstDateOfMonth(date), Foundation.Date.MONTH, value)).getDate());
                            }
                            d.setDate(day);
                            d.setMonth(date.getMonth() + value);
                            break;
                        case Foundation.Date.YEAR:
                            day = date.getDate();
                            if (day > 28) {
                                day = Math.min(day, Foundation.Date.getLastDateOfMonth(Foundation.Date.add(Foundation.Date.getFirstDateOfMonth(date), Foundation.Date.YEAR, value)).getDate());
                            }
                            d.setDate(day);
                            d.setFullYear(date.getFullYear() + value);
                            break;
                    }
                }

                if (decimalValue) {
                    switch (interval.toLowerCase()) {
                        case Foundation.Date.MILLI:
                            base = 1;
                            break;
                        case Foundation.Date.SECOND:
                            base = 1000;
                            break;
                        case Foundation.Date.MINUTE:
                            base = 1000 * 60;
                            break;
                        case Foundation.Date.HOUR:
                            base = 1000 * 60 * 60;
                            break;
                        case Foundation.Date.DAY:
                            base = 1000 * 60 * 60 * 24;
                            break;

                        case Foundation.Date.MONTH:
                            day = utilDate.getDaysInMonth(d);
                            base = 1000 * 60 * 60 * 24 * day;
                            break;

                        case Foundation.Date.YEAR:
                            day = (utilDate.isLeapYear(d) ? 366 : 365);
                            base = 1000 * 60 * 60 * 24 * day;
                            break;
                    }
                    if (base) {
                        d.setTime(d.getTime() + base * decimalValue);
                    }
                }

                return d;
            },

            subtract: function(date, interval, value) {
                return utilDate.add(date, interval, -value);
            },

            between: function(date, start, end) {
                var t = date.getTime();
                return start.getTime() <= t && t <= end.getTime();
            },

            compat: function() {
                var nativeDate = window.Date,
                    p,
                    statics = ['useStrict', 'formatCodeToRegex', 'parseFunctions', 'parseRegexes', 'formatFunctions', 'y2kYear', 'MILLI', 'SECOND', 'MINUTE', 'HOUR', 'DAY', 'MONTH', 'YEAR', 'defaults', 'dayNames', 'monthNames', 'monthNumbers', 'getShortMonthName', 'getShortDayName', 'getMonthNumber', 'formatCodes', 'isValid', 'parseDate', 'getFormatCode', 'createFormat', 'createParser', 'parseCodes'],
                    proto = ['dateFormat', 'format', 'getTimezone', 'getGMTOffset', 'getDayOfYear', 'getWeekOfYear', 'isLeapYear', 'getFirstDayOfMonth', 'getLastDayOfMonth', 'getDaysInMonth', 'getSuffix', 'clone', 'isDST', 'clearTime', 'add', 'between'],
                    sLen = statics.length,
                    pLen = proto.length,
                    stat, prot, s;

                for (s = 0; s < sLen; s++) {
                    stat = statics[s];
                    nativeDate[stat] = utilDate[stat];
                }

                for (p = 0; p < pLen; p++) {
                    prot = proto[p];
                    nativeDate.prototype[prot] = function() {
                        var args = Array.prototype.slice.call(arguments);
                        args.unshift(this);
                        return utilDate[prot].apply(utilDate, args);
                    };
                }
            }
        });
    };


    Foundation.Date.monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

    Foundation.Date.dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

    Foundation.Date.formatCodes.a = "(this.getHours() < 12 ? '上午' : '下午')";
    Foundation.Date.formatCodes.A = "(this.getHours() < 12 ? '上午' : '下午')";

    parseCodes = {
        g: 1,
        c: "if (/(上午)/i.test(results[{0}])) {\n" +
            "if (!h || h == 12) { h = 0; }\n" +
            "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
        s: "(上午|下午)",
        calcAtEnd: true
    };

    Foundation.Date.parseCodes.a = Foundation.Date.parseCodes.A = parseCodes;


    Foundation.Function = {
        
        call: function (fn, scope, arguments) {
            if (!Foundation.isFunction(fn)) {
                return
            }
            fn.apply(scope, arguments || []);
        },

        clone: function(method) {
            return function() {
                return method.apply(this, arguments);
            };
        },

        //private
        //给function包装成setting方式
        //fn(obj) ---> fn(key, name) * n
        flexSetter: function(fun) {
            return function(key, value) {
                if (Foundation.isEmpty(key)) {
                    return this;
                }

                var proto, me = this;

                if (typeof key !== 'string') {
                    for (proto in key) {
                        if (key.hasOwnProperty(proto)) {
                            fun.call(this, proto, key[proto]);
                        }
                    }

                    if (Foundation.enumerables) {
                        Foundation.Array.forEach(Foundation.enumerables, function(name, i) {
                            if (key.hasOwnProperty(name)) {
                                fun.call(me, name, key[name])
                            }
                        })
                    }
                } else {
                    fun.call(this, key, value)
                }
                return this;
            }
        },

        //设置别名
        /**
         * var obj = {
         *     fun: function(){}
         * };
         * var fun2 = Foundation.Function.alias(obj, fun);
         */
        alias: function(object, name) {
            return function() {
                return object[name].apply(object, arguments);
            }
        },

        //给一个函数绑定this值和参数集合
        bind: function(fn, scope, args, appendArgs) {
            var method = fn,
                applyArgs,
                slice = Array.prototype.slice;

            return function() {
                var callArgs = args || arguments;
                if (appendArgs === true) {
                    callArgs = slice.call(arguments, 0);
                    callArgs = callArgs.concat(args);
                } else if (typeof appendArgs == 'number') {
                    callArgs = slice.call(arguments, 0);
                    Foundation.Array.insert(callArgs, appendArgs, args);
                }

                return method.apply(scope || window, callArgs);
            }
        },

        /**
         * 在原来的函数参数集合中合并新加参数
         * var testFn = function(a, b){
         *     Foundation.log(a + b);
         * };
         * var testFn2 = function(fn){
         *     fn();
         * };
         * testFn2(Foundation.Function.mergeArgs(testFn, [1, 2], this));
         */
        mergeArgs: function(fn, args, scope) {
            if (args) {
                args = Foundation.Array.toArray(args);
            }

            return function() {
                return fn.apply(scope, Foundation.Array.toArray(arguments).concat(args));
            };
        },

        changeArgs: function(fn, scope, args) {
            var method = fn,
                aargs = arguments,
                alen = aargs.length,
                slice = Array.prototype.slice;

            return function() {
                var callArgs = slice.call(arguments, 0),
                    i = 2;

                for (; i < alen; i++) {
                    callArgs[aargs[i][0]] = aargs[i][1];
                }

                return method.apply(scope || window, callArgs);
            }
        },

        //给一个函数绑定this值和参数集合， 并且可以设置delay(延迟执行)， 主要针对callback回调函数
        callback: function(callback, scope, args, delay) {
            if (Foundation.isFunction(callback)) {
                args = args || [];
                scope = scope || window;
                if (delay) {
                    Foundation.delay(callback, delay, scope, args);
                } else {
                    callback.apply(scope, args);
                }
            }
        },

        //给一个函数设置延迟执行， 并且执行它
        defer: function(fn, delay, scope, args, appendArgs) {
            fn = Foundation.Function.bind(fn, scope, args, appendArgs);
            if (delay > 0) {
                return setTimeout(fn, delay);
            }
            fn();
            return 0;

        },

        //给一个函数创建拦截器
        //当条件在拦截器中通过的话， 那么才可以执行原来的函数origFn， 否则返回一个默认自行设置的值
        createInterceptor: function(origFn, newFn, scope, returnValue) {
            var method = origFn;
            if (!Foundation.isFunction(newFn)) {
                return origFn;
            } else {
                return function() {
                    var me = this,
                        args = arguments;
                    newFn.target = me;
                    newFn.method = origFn;
                    return (newFn.apply(scope || me || window, args) !== false) ? origFn.apply(me || window, args) : returnValue || null;
                };
            }
        },

        createDelayed: function(fn, delay, scope, args, appendArgs) {
            if (scope || args) {
                fn = Foundation.Function.bind(fn, scope, args, appendArgs);
            }
            return function() {
                var me = this,
                    args = Array.prototype.slice.call(arguments);

                setTimeout(function() {
                    fn.apply(me, args);
                }, delay);
            };
        },

        //给一个函数创建缓冲器
        createBuffered: function(fn, buffer, scope, args) {
            var timerId;
            return function() {
                var callArgs = args || Array.prototype.slice.call(arguments, 0),
                    me = scope || this;

                if (timerId) {
                    clearTimeout(timerId);
                }

                timerId = setTimeout(function() {
                    fn.apply(me, callArgs);
                }, buffer);
            };
        },

        //给一个函数创建序列化执行
        createSequence: function(origFn, newFn, scope) {
            if (!Foundation.isFunction(newFn)) {
                return origFn;
            } else {
                return function() {
                    var retval = origFn.apply(this || window, arguments);
                    newFn.apply(scope || this || window, arguments);
                    return retval;
                };
            }
        },

        createThrottled: function(fn, interval, scope) {
            var lastCallTime, elapsed, lastArgs, timer, execute = function() {
                fn.apply(scope || this, lastArgs);
                lastCallTime = new Date().getTime();
            };

            return function() {
                elapsed = new Date().getTime() - lastCallTime;
                lastArgs = arguments;

                clearTimeout(timer);
                if (!lastCallTime || (elapsed >= interval)) {
                    execute();
                } else {
                    timer = setTimeout(execute, interval - elapsed);
                }
            };
        },

        factory: function() {
            var args = Array.prototype.slice.call(arguments);
            return Function.prototype.constructor.apply(Function.prototype, args);
        },

        pass: function(fn, args, scope) {
            if (args) {
                args = Foundation.Array.from(args);
            }

            return function() {
                return fn.apply(scope, args.concat(Foundation.Array.toArray(arguments)));
            };
        },

        before: function(object, methodName, fn, scope) {
            var method = object[methodName] || Foundation.emptyFn;

            return (object[methodName] = function() {
                var ret = fn.apply(scope || this, arguments);
                method.apply(this, arguments);

                return ret;
            });
        },

        after: function(object, methodName, fn, scope) {
            var method = object[methodName] || Foundation.emptyFn;

            return (object[methodName] = function() {
                method.apply(this, arguments);
                return fn.apply(scope || this, arguments);
            });
        }

    };

    Foundation.defer = Foundation.Function.alias(Foundation.Function, 'defer');

    Foundation.pass = Foundation.Function.alias(Foundation.Function, 'pass');

    Foundation.bind = Foundation.Function.alias(Foundation.Function, 'bind');

    Foundation.callback = Foundation.Function.alias(Foundation.Function, 'callback');

    Foundation.functionFactory = Foundation.Function.alias(Foundation.Function, 'factory');


    var math = Math;
    var isToFixedBroken = (0.9).toFixed() !== '1';

    Foundation.Number = {
        //限制一个数字类型的大小范围， 如果小于最小范围， 那么返回最小值
        //如果大于最大范围， 那么返回最大值
        constrain: function(number, min, max) {
            number = parseFloat(number);
            if (!isNaN(min)) {
                number = math.max(number, min);
            }
            if (!isNaN(max)) {
                number = math.min(number, max);
            }
            return number;
        },

        //精确到几位
        toFixed: function(value, precision) {
            if (isToFixedBroken) {
                precision = precision || 0;
                var pow = math.pow(10, precision);
                return (math.round(value * pow) / pow).toFixed(precision);
            }

            return value.toFixed(precision);
        },

        //Foundation.Number.num('1.23', 1); // returns 1.23
        //Foundation.Number.num('abc', 1);  // returns 1
        num: function(value, defaultValue) {
            if (isFinite(value)) {
                value = parseFloat(value);
            }
            return !isNaN(value) ? value : defaultValue;
        },

        from: function(value, defaultValue) {
            return Foundation.Number.num(value, defaultValue)
        },

        randomInt: function(from, to) {
            return math.floor(math.random() * (to - from + 1) + from);
        },

        correctFloat: function(n) {
            return parseFloat(n.toPrecision(14));
        },

        snap: function(value, increment, minValue, maxValue) {
            var m;

            if (value === undefined || value < minValue) {
                return minValue || 0;
            }

            if (increment) {
                m = value % increment;
                if (m !== 0) {
                    value -= m;
                    if (m * 2 >= increment) {
                        value += increment;
                    } else if (m * 2 < -increment) {
                        value -= increment;
                    }
                }
            }
            return Foundation.Number.constrain(value, minValue, maxValue);
        }

    };

    Foundation.num = Foundation.Number.num;


    var TemplateClass = function() {};

    Foundation.Object = {

        chain: Object.create || function(object) {
            TemplateClass.prototype = object;
            var result = new TemplateClass();
            TemplateClass.prototype = null;
            return result;
        },

        //循环迭代对象
        each: function(obj, fn, scope) {
            var prop;
            scope = scope || obj;

            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (fn.call(scope, prop, obj[prop], obj) === false) {
                        return;
                    }
                }
            }
        },

        toQueryObjects: function(name, value, recursive) {
            var self = Foundation.Object.toQueryObjects,
                objects = [],
                i, ln;

            if (Foundation.isArray(value)) {
                for (i = 0, ln = value.length; i < ln; i++) {
                    if (recursive) {
                        objects = objects.concat(self(name + '[' + i + ']', value[i], true));
                    } else {
                        objects.push({
                            name: name,
                            value: value[i]
                        });
                    }
                }
            } else if (Foundation.isObject(value)) {
                for (i in value) {
                    if (value.hasOwnProperty(i)) {
                        if (recursive) {
                            objects = objects.concat(self(name + '[' + i + ']', value[i], true));
                        } else {
                            objects.push({
                                name: name,
                                value: value[i]
                            });
                        }
                    }
                }
            } else {
                objects.push({
                    name: name,
                    value: value
                });
            }

            return objects;
        },


        toQueryString: function(object, recursive) {
            var paramObjects = [],
                params = [],
                i, j, ln, paramObject, value;

            for (i in object) {
                if (object.hasOwnProperty(i)) {
                    paramObjects = paramObjects.concat(Foundation.Object.toQueryObjects(i, object[i], recursive));
                }
            }

            for (j = 0, ln = paramObjects.length; j < ln; j++) {
                paramObject = paramObjects[j];
                value = paramObject.value;

                if (Foundation.isEmpty(value)) {
                    value = '';
                } else if (Foundation.isDate(value)) {
                    value = Foundation.Date.toString(value);
                }

                params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(String(value)));
            }

            return params.join('&');
        },


        fromQueryString: function(queryString, recursive) {
            var parts = queryString.replace(/^\?/, '').split('&'),
                object = {},
                temp, components, name, value, i, ln,
                part, j, subLn, matchedKeys, matchedName,
                keys, key, nextKey;

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (part.length > 0) {
                    components = part.split('=');
                    name = decodeURIComponent(components[0]);
                    value = (components[1] !== undefined) ? decodeURIComponent(components[1]) : '';

                    if (!recursive) {
                        if (object.hasOwnProperty(name)) {
                            if (!Foundation.isArray(object[name])) {
                                object[name] = [object[name]];
                            }

                            object[name].push(value);
                        } else {
                            object[name] = value;
                        }
                    } else {
                        matchedKeys = name.match(/(\[):?([^\]]*)\]/g);
                        matchedName = name.match(/^([^\[]+)/);

                        if (!matchedName) {
                            throw new Error('[Foundation.Object.fromQueryString] Malformed query string given, failed parsing name from "' + part + '"');
                        }

                        name = matchedName[0];
                        keys = [];

                        if (matchedKeys === null) {
                            object[name] = value;
                            continue;
                        }

                        for (j = 0, subLn = matchedKeys.length; j < subLn; j++) {
                            key = matchedKeys[j];
                            key = (key.length === 2) ? '' : key.substring(1, key.length - 1);
                            keys.push(key);
                        }

                        keys.unshift(name);

                        temp = object;

                        for (j = 0, subLn = keys.length; j < subLn; j++) {
                            key = keys[j];

                            if (j === subLn - 1) {
                                if (Foundation.isArray(temp) && key === '') {
                                    temp.push(value);
                                } else {
                                    temp[key] = value;
                                }
                            } else {
                                if (temp[key] === undefined || typeof temp[key] === 'string') {
                                    nextKey = keys[j + 1];

                                    temp[key] = (Foundation.isNumeric(nextKey) || nextKey === '') ? [] : {};
                                }

                                temp = temp[key];
                            }
                        }
                    }
                }
            }

            return object;
        },


        //给一个对象合并其他的值
        merge: function(source, key, value) {
            source = source || {};

            if (Foundation.isString(key)) {
                if (Foundation.isObject(value) && Foundation.isObject(source[key])) {
                    Foundation.Object.merge(source[key], value);
                } else if (Foundation.isObject(value)) {
                    source[key] = value;
                } else {
                    source[key] = value;
                }

                return source;
            }

            var index = 1,
                len = arguments.length,
                i = 0,
                obj, perp;

            for (; i < len; i++) {
                obj = arguments[i] || {};

                var hasProp = false;
                for (perp in obj) {
                    hasProp = true;
                }
                if (hasProp) {
                    for (perp in obj) {
                        if (obj.hasOwnProperty(perp)) {
                            Foundation.Object.merge(source, perp, obj[perp]);
                        }
                    }
                }
            }
            return source;
        },

        mergeIf: function(destination) {
            var i = 1,
                ln = arguments.length,
                cloneFn = Foundation.clone,
                object, key, value;

            for (; i < ln; i++) {
                object = arguments[i];

                for (key in object) {
                    if (!(key in destination)) {
                        value = object[key];

                        if (value && value.constructor === Object) {
                            destination[key] = cloneFn(value);
                        } else {
                            destination[key] = value;
                        }
                    }
                }
            }

            return destination;
        },

        //根据值来获取键
        getKey: function(object, value) {
            for (var property in object) {
                if (object.hasOwnProperty(property) && object[property] === value) {
                    return property;
                }
            }
            return null;
        },

        getValues: function(object) {
            var values = [],
                property;

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    values.push(object[property]);
                }
            }
            return values;
        },

        getKeys: ('keys' in Object.prototype) ? Object.keys : function(object) {
            var keys = [],
                property;

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    keys.push(property);
                }
            }
            return keys;
        },

        getSize: function(object) {
            var size = 0,
                property;
            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    size++;
                }
            }
            return size;
        },

        toStringBy: function(object, by, by2) {
            by = by || ":";
            by2 = by2 || "|";
            var string = [];
            Foundation.each(object, function(name, value) {
                string.push(name + by + value);
            });
            return string.join(by2);
        },

        isEmpty: function(object) {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        },

        equals: (function() {
            var check = function(o1, o2) {
                var key;

                for (key in o1) {
                    if (o1.hasOwnProperty(key)) {
                        if (o1[key] !== o2[key]) {
                            return false;
                        }
                    }
                }
                return true;
            };

            return function(object1, object2) {

                if (object1 === object2) {
                    return true;
                }

                if (object1 && object2) {
                    return check(object1, object2) && check(object2, object1);
                } else if (!object1 && !object2) {
                    return object1 === object2;
                } else {
                    return false;
                }
            };
        })(),

        clone: function(object) {
            return Foundation.clone(object)
        }
    };

    Foundation.merge = Foundation.Object.merge;

    Foundation.mergeIf = Foundation.Object.mergeIf;

    Foundation.urlEncode = function() {
        var args = Foundation.Array.from(arguments),
            prefix = '';

        if ((typeof args[1] === 'string')) {
            prefix = args[1] + '&';
            args[1] = false;
        }

        return prefix + Foundation.Object.toQueryString.apply(Foundation.Object, args);
    };

    Foundation.urlDecode = function() {
        return Foundation.Object.fromQueryString.apply(Foundation.Object, arguments);
    };


    Foundation.String = (function() {

        var trimRegex = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
            escapeRe = /('|\\)/g,
            formatRe = /\{(\d+)\}/g,
            escapeRegexRe = /([-.*+?\^${}()|\[\]\/\\])/g,
            basicTrimRe = /^\s+|\s+$/g,
            whitespaceRe = /\s+/,
            varReplace = /(^[^a-z]*|[^\w])/gi,
            charToEntity,
            entityToChar,
            charToEntityRegex,
            entityToCharRegex,
            htmlEncodeReplaceFn = function(match, capture) {
                return charToEntity[capture];
            },
            htmlDecodeReplaceFn = function(match, capture) {
                return (capture in entityToChar) ? entityToChar[capture] : String.fromCharCode(parseInt(capture.substr(2), 10));
            },
            boundsCheck = function(s, other) {
                if (s === null || s === undefined || other === null || other === undefined) {
                    return false;
                }

                return other.length <= s.length;
            };

        return {

            EMPTY: "",

            has: function(string, chars) {
                return string.indexOf(chars) >= 0;
            },

            //首字母变成大写
            firstUpperCase: function(string) {
                return string.charAt(0).toUpperCase() + string.substr(1);
            },

            insert: function(s, value, index) {
                if (!s) {
                    return value;
                }

                if (!value) {
                    return s;
                }

                var len = s.length;

                if (!index && index !== 0) {
                    index = len;
                }

                if (index < 0) {
                    index *= -1;
                    if (index >= len) {
                        // negative overflow, insert at start
                        index = 0;
                    } else {
                        index = len - index;
                    }
                }

                if (index === 0) {
                    s = value + s;
                } else if (index >= s.length) {
                    s += value;
                } else {
                    s = s.substr(0, index) + value + s.substr(index);
                }
                return s;
            },

            startsWith: function(s, start, ignoreCase) {
                var result = boundsCheck(s, start);

                if (result) {
                    if (ignoreCase) {
                        s = s.toLowerCase();
                        start = start.toLowerCase();
                    }
                    result = s.lastIndexOf(start, 0) === 0;
                }
                return result;
            },

            endsWith: function(s, end, ignoreCase) {
                var result = boundsCheck(s, end);

                if (result) {
                    if (ignoreCase) {
                        s = s.toLowerCase();
                        end = end.toLowerCase();
                    }
                    result = s.indexOf(end, s.length - end.length) !== -1;
                }
                return result;
            },

            createVarName: function(s) {
                return s.replace(varReplace, '');
            },

            htmlEncode: function(value) {
                return (!value) ? value : String(value).replace(charToEntityRegex, htmlEncodeReplaceFn);
            },

            htmlDecode: function(value) {
                return (!value) ? value : String(value).replace(entityToCharRegex, htmlDecodeReplaceFn);
            },

            addCharacterEntities: function(newEntities) {
                var charKeys = [],
                    entityKeys = [],
                    key, echar;
                for (key in newEntities) {
                    echar = newEntities[key];
                    entityToChar[key] = echar;
                    charToEntity[echar] = key;
                    charKeys.push(echar);
                    entityKeys.push(key);
                }
                charToEntityRegex = new RegExp('(' + charKeys.join('|') + ')', 'g');
                entityToCharRegex = new RegExp('(' + entityKeys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
            },

            resetCharacterEntities: function() {
                charToEntity = {};
                entityToChar = {};
                // add the default set
                this.addCharacterEntities({
                    '&amp;': '&',
                    '&gt;': '>',
                    '&lt;': '<',
                    '&quot;': '"',
                    '&#39;': "'"
                });
            },

            urlAppend: function(url, string) {
                if (!Foundation.isEmpty(string)) {
                    return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
                }

                return url;
            },

            trim: function(string) {
                return string.replace(trimRegex, "");
            },

            capitalize: function(string) {
                return string.charAt(0).toUpperCase() + string.substr(1);
            },

            uncapitalize: function(string) {
                return string.charAt(0).toLowerCase() + string.substr(1);
            },

            ellipsis: function(value, len, word) {
                if (value && value.length > len) {
                    if (word) {
                        var vs = value.substr(0, len - 2),
                            index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                        if (index !== -1 && index >= (len - 15)) {
                            return vs.substr(0, index) + "...";
                        }
                    }
                    return value.substr(0, len - 3) + "...";
                }
                return value;
            },

            escapeRegex: function(string) {
                return string.replace(escapeRegexRe, "\\$1");
            },

            escape: function(string) {
                return string.replace(escapeRe, "\\$1");
            },


            toggle: function(string, value, other) {
                return string === value ? other : value;
            },

            leftPad: function(string, size, character) {
                var result = String(string);
                character = character || " ";
                while (result.length < size) {
                    result = character + result;
                }
                return result;
            },

            format: function(format) {
                var args = Foundation.Array.toArray(arguments, 1);
                return format.replace(formatRe, function(m, i) {
                    return args[i];
                });
            },

            repeat: function(pattern, count, sep) {
                if (count < 1) {
                    count = 0;
                }
                for (var buf = [], i = count; i--;) {
                    buf.push(pattern);
                }
                return buf.join(sep || '');
            },

            splitWords: function(words) {
                if (words && typeof words == 'string') {
                    return words.replace(basicTrimRe, '').split(whitespaceRe);
                }
                return words || [];
            },

            parseVersion: function(version) {
                var parts, releaseStartIndex, info = {};

                info.version = info.shortVersion = String(version).toLowerCase().replace(/_/g, '.').replace(/[\-+]/g, '');
                releaseStartIndex = info.version.search(/([^\d\.])/);

                if (releaseStartIndex !== -1) {
                    info.release = info.version.substr(releaseStartIndex, version.length);
                    info.shortVersion = info.version.substr(0, releaseStartIndex);
                }

                info.shortVersion = info.shortVersion.replace(/[^\d]/g, '');
                parts = info.version.split('.');

                info.major = parseInt(parts.shift() || 0, 10);
                info.minor = parseInt(parts.shift() || 0, 10);
                info.patch = parseInt(parts.shift() || 0, 10);
                info.build = parseInt(parts.shift() || 0, 10);

                return info;
            },

            hasHtmlCharacters: function(str) {
                return charToEntityRegex.test(str);
            }
        }
    })();

    Foundation.String.resetCharacterEntities();

    Foundation.htmlEncode = Foundation.String.htmlEncode;

    Foundation.htmlDecode = Foundation.String.htmlDecode;

    return Foundation;

});