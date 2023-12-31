define(function(require, exports, module) {
    // The base Class implementation.
    function Class(o) {
        //这个判断用来支持 将一个已有普通类转换成 阿拉蕾的类
        if (!(this instanceof Class) && isFunction(o)) {
            //原理是给这个函数增加extend，implement方法
            return classify(o)
        }
    }


    // Create a new Class.
    //
    //  var SuperPig = Class.create({
    //    extend: Animal,
    //    implement: Flyable,
    //    initialize: function() {
    //      SuperPig.superclass.initialize.apply(this, arguments)
    //    },
    //    statics: {
    //      COLOR: 'red'
    //    }
    // })
    //
    //

    //用于创建一个类，
    //第一个参数可选，可以直接创建时就指定继承的父类。
    //第二个参数也可选，用来表明需要混入的类属性。有三个特殊的属性为extend,implement,statics.分别代表要继承的父类，需要混入原型的东西，还有静态属性。
    Class.create = function(parent, properties, after) {
        //创建一个类时可以不指定要继承的父类。直接传入属性对象。
        if (!isFunction(parent)) {
            after = properties;
            properties = parent;
            parent = null
        }

        properties || (properties = {})
            //没有指定父类的话 就查看有没有extend特殊属性，都没有的话就用Class作为父类
        parent || (parent = properties.extend || Class)
        properties.extend = parent;

        // 子类构造函数的定义
        function SubClass() {
            // 自动帮忙调用父类的构造函数
            parent.apply(this, arguments)

            // Only call initialize in self constructor.
            //真正的构造函数放在initialize里面
            if (this.constructor === SubClass && this.initialize) {
                this.initialize.apply(this, arguments)
            }
        }

        // Inherit class (static) properties from parent.
        //parent为Class就没必要混入
        if (parent !== Class) {
            //将父类里面的属性都混入到子类里面这边主要是静态属性
            mix(SubClass, parent, parent.staticsWhiteList)
        }

        // Add instance properties to the subclass.
        //调用implement将自定义的属性混入到子类原型里面。遇到特殊值会单独处理，真正的继承也是发生在这里面
        //这边把属性也都弄到了原型上，因为这边每次create或者extend都会生成一个新的SubClass。所以倒也不会发生属性公用的问题。但是总感觉不大好
        implement.call(SubClass, properties)

        // Make subclass extendable.
        //给生成的子类增加extend和implement方法，可以在类定义完后，再去继承，去混入其他属性。
        var Cls = classify(SubClass);
        after && after(Cls, properties);
        return Cls;
    }

    //用于在类定义之后，往类里面添加方法。提供了之后修改类的可能。类似上面defjs实现的open函数。
    function implement(properties) {
        var key, value

        for (key in properties) {
            value = properties[key]
                //发现属性是特殊的值时，调用对应的处理函数处理
            if (Class.Mutators.hasOwnProperty(key)) {
                Class.Mutators[key].call(this, value)
            } else {
                this.prototype[key] = value
            }
        }
    }


    // Create a sub Class based on `Class`.
    Class.extend = function(properties) {
        properties || (properties = {})
            //定义继承的对象是自己
        properties.extend = this
            //调用Class.create实现继承的流程
        return Class.create(properties)
    }

    //给一个普通的函数 增加extend和implement方法。
    function classify(cls) {
        cls.extend = Class.extend
        cls.implement = implement
        return cls
    }


    // 这里定义了一些特殊的属性，阿拉蕾遍历时发现key是这里面的一个时，会调用这里面的方法处理。
    Class.Mutators = {
        //这个定义了继承的真正操作代码。
        'extend': function(parent) {
            //这边的this指向子类
            var existed = this.prototype
                //生成一个中介原型，就是之前我们实现的objectCreat
            var proto = createProto(parent.prototype)

            //将子类原型有的方法混入到新的中介原型上
            mix(proto, existed)

            // 改变构造函数指向子类
            proto.constructor = this

            // 改变原型 完成继承
            this.prototype = proto

            //为子类增加superclass属性，这样可以调用父类原型的方法。
            this.superclass = parent.prototype
        },
        //这个有点类似组合的概念，支持数组。将其他类的属性混入到子类原型上
        'implement': function(items) {
            isArray(items) || (items = [items])
            var proto = this.prototype,
                item

            while (item = items.shift()) {
                mix(proto, item.prototype || item)
            }
        },
        //传入静态属性
        'statics': function(staticProperties) {
            mix(this, staticProperties);
        }
    }


    // Shared empty constructor function to aid in prototype-chain creation.
    function Ctor() {}

    // 这个方法就是我们之前实现的objectCreat，用来使用一个中介者来处理原型的问题，当浏览器支持`__proto__`时可以直接使用。否则新建一个空函数再将父类的原型赋值给这个空函数，返回这个空函数的实例
    var createProto = Object.__proto__ ?
        function(proto) {
            return { __proto__: proto }
        } :
        function(proto) {
            Ctor.prototype = proto
            return new Ctor()
        }


    // Helpers 下面都是些辅助方法，很简单就不说了
    // ------------

    function mix(r, s, wl) {
        // Copy "all" properties including inherited ones.
        for (var p in s) {
            //过滤掉原型链上面的属性
            if (s.hasOwnProperty(p)) {
                if (wl && indexOf(wl, p) === -1) continue

                // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
                if (p !== 'prototype') {
                    r[p] = s[p]
                }
            }
        }
    }


    var toString = Object.prototype.toString

    var isArray = Array.isArray || function(val) {
        return toString.call(val) === '[object Array]'
    }

    var isFunction = function(val) {
        return toString.call(val) === '[object Function]'
    }

    var indexOf = Array.prototype.indexOf ?
        function(arr, item) {
            return arr.indexOf(item)
        } :
        function(arr, item) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] === item) {
                    return i
                }
            }
            return -1
        }

    return Class;
});