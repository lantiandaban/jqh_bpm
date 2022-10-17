define(function (require, exports, module) {

    var Locale = {};

    Locale.validateError = {

        emptyText: '该字段为必填项',

        minLengthText: '该字段最小长度为{0}',

        maxLengthText: '该字段最大长度为{0}'

    };

    Locale.vTypes = {

        emailText: '请输入正确的email格式! 例如:username@domain.com',

        urlText: '该输入项必须是URL格式，例如 http:/' + '/www.example.com',

        alphaText: '该输入项只允许以字母和下划线组成',

        alphanumText: '该输入项只允许以数字、字母以及下划线组成',

        chineseText: '这个字段只允许输入中文',

        numberText: '这个字段只允许输入数字',

        ageText: '该输入项必须是年龄格式，例如：20',

        postcodeText: '该输入项目必须是邮政编码格式，例如：226001',

        ipText: '该输入项目必须是IP地址格式，例如：222.192.42.12',

        telephoneText: '该输入项目必须是电话号码格式，例如：0513-89500414',

        mobileText: "该输入项目必须是手机号码格式，例如：13485135075",

        IDCardText: '该输入项目必须是身份证号码格式，例如：32082919860817201x'

    };

    return Locale
});

