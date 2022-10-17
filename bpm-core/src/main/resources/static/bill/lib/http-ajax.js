define(function (require, exports, module) {

    var Class = require('./class');
    var Event = require('./event');
    var Foundation = require('./foundation');

    return Class.create({

        implement: [Event],

        initialize: function (options) {
            Foundation.apply(this, options || {});

            this.codeHanderMap = {};
            this.initListeners();

            this.satusCodeHandler(401, function () {
                // window.location.href = window.g.ctx + 'login'
            });
            this.satusCodeHandler(404, function () {
                // layer.msg('服务器请求地址不存在，可能已经发生更改了');
            })
        },

        successHandler: function (fn) {
            this.successCallback = fn;
        },

        failureHandler: function (fn) {
            this.failureCallback = fn;
        },

        satusCodeHandler: function (code, fn) {
            this.codeHanderMap[code] = fn;
        },

        send: function (params, url) {
            // this.setParams(params);
            // if (!Foundation.isEmpty(url)) {
            //     this.setUrl(url);
            // }
            return $.ajax({
                url: window.g.ctx + this.url,
                type: this.type || 'POST',
                data: this.params || {},
                cache: false,
                beforeSend: this.onBeforeSend.bind(this),
                complete: this.onAjaxComplete.bind(this)
            })
        },

        onBeforeSend: function (request) {
            this.fireEvent('before-send');
            var authorization = Foundation.String.format('{0}', getAuthorization());
            request.setRequestHeader("Authorization", authorization);
        },

        onAjaxComplete: function (xhr, textStatus) {
            var httpStatusCode = xhr.status;
            if (httpStatusCode <= 0) {
                //layer.msg('网络无法连接');
                return;
            }
            if (httpStatusCode == 200) {
                this.onSuccess(xhr);
            } else {
                this.onFailure(xhr, httpStatusCode);
            }
            this.fireEvent('complete', xhr)
        },

        onSuccess: function (xhr) {
            var result = JSON.parse(xhr.responseText);
            this.fireEvent('success', result.data);
            Foundation.Function.call(this.successCallback, this, [result.data]);
        },

        onFailure: function (xhr, httpStatusCode) {
            var handler = this.codeHanderMap[httpStatusCode];
            if (Foundation.isFunction(handler)) {
                this.fireEvent('failure-on-' + httpStatusCode);
                handler.call(this, xhr);
                return;
            }
            this.fireEvent('failure', httpStatusCode);
            Foundation.Function.call(this.failureCallback, this, [httpStatusCode]);
        },

        setUrl: function (url) {
            this.url = url;
        },

        setParams: function (params) {
            this.params = params || {};
        },

        clearParams: function () {
            this.setParams({})
        }

    })
});