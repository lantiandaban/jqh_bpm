/*
 * Copyright © 2015-2017, AnHui Mobiao technology co. LTD Inc. All Rights Reserved.
 */

/**
 *
 * @author BOGON
 * @version 1.0
 */
define(function (require, exports, module) {

    var BasePage = require('app/layout/page');
    //获取界面对应的Html字符串, 这里使用的是hbs
    var minePageHtml = require('text!view/approval/mine-page.hbs');
    var MinePage = Class.create({
        statics: {},
        extend: BasePage,
        _getContentElement: function () {
            return $(minePageHtml);
        },
        _beforeInit: function () {
            MinePage.superclass._beforeInit.apply(this);
        },
        _init: function () {
            MinePage.superclass._init.apply(this);
            var httpAjax = new HttpAjax({
                url: 'api/approval/mine',
                needLoading: true,
                type: 'GET'
            });
            httpAjax.successHandler(function (data) {
                console.log(data);
            });
            httpAjax.send();
            layui.laypage.render({
                elem: document.getElementById('mine-approval-pagination'),
                count: 100,
                skin: '#1E9FFF'
            });
        },
        _initEvents: function () {
        }
    });
    return MinePage;
});