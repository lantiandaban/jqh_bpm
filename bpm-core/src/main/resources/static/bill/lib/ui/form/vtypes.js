define(function (require, exports, module) {

    var Locale = require('../locale');

    var alpha = /^[a-zA-Z_]+$/,
        alphanum = /^[a-zA-Z0-9_]+$/,
        email = /^(\w+)([\-+.][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/,
        url = /(((^https?)|(^ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;

    return {

        //电子邮件
        email: function (v) {
            return email.test(v);
        },

        emailText: Locale.vTypes.emailText,

        emailMask: /[a-z0-9_\\.\-@\+]/i,


        url: function (v) {
            return url.test(v);
        },

        urlText: Locale.vTypes.urlText,


        //只能输入字母和下划线
        alpha: function (v) {
            return alpha.test(v);
        },

        alphaText: Locale.vTypes.alphaText,

        alphaMask: /[a-z_]/i,


        //只能输入字母和数字和下划线
        alphanum: function (v) {
            return alphanum.test(v);
        },

        alphanumText: Locale.vTypes.alphanumText,

        alphanumMask: /[a-z0-9_]/i,


        //只能输入中文
        chinese: function (v) {
            return /^[\u0391-\uFFE5]+$/.test(v);
        },

        chineseText: Locale.vTypes.chineseText,


        //数字
        number: function (v) {
            return /^[0-9\\.]+$/.test(v);
        },

        numberText: Locale.vTypes.numberText,

        numberMask: /[0-9\\.]/i,


        //年龄
        age: function (v) {
            return /^\d+$/.test(v) && parseInt(v) < 200
        },

        ageText: Locale.vTypes.ageText,

        ageMask: /[0-9]/i,


        // 邮政编码
        postcode: function (v) {
            return /^[1-9]\d{5}$/.test(v);
        },

        postcodeText: Locale.vTypes.postcodeText,

        postcodeMask: /[0-9]/i,


        // IP地址验证
        ip: function (v) {
            return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                .test(v);
        },

        ipText: Locale.vTypes.ipText,

        ipMask: /[0-9\.]/i,


        //固定电话、小灵通
        telephone: function (v) {
            return /(^\d{3}\-\d{7,8}$)|(^\d{4}\-\d{7,8}$)|(^\d{3}\d{7,8}$)|(^\d{4}\d{7,8}$)|(^\d{7,8}$)/
                .test(v);
        },

        telephoneText: Locale.vTypes.telephoneText,

        telephoneMask: /[0-9\-]/i,


        //手机
        mobile: function (v) {
            return /^1[35][0-9]\d{8}$/.test(v);
        },

        mobileText: Locale.vTypes.mobileText,

        mobileMask: /[0-9]/i,


        //身份证
        IDCard: function (v) {
            return /(^[0-9]{17}([0-9]|[Xx])$)|(^[0-9]{17}$)/.test(v);
        },

        IDCardText: Locale.vTypes.IDCardText,

        IDCardMask: /[0-9xX]/i

    }

});

