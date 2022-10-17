define(function (require, exports, module) {

    var Class = require('Class');
    var Foundation = require('Foundation');
    var components = require('../component/index');
    var HttpAjax = Class.create({
        initialize: function (options) {
            this.codeHanderMap = {};
            this.options = Foundation.clone(options);

            this.satusCodeHandler(404, function () {
                components.Msg.toast({type: "warning", msg: "请求地址错误"});
            })
        },

        send: function () {
            var options = this.options;
            if (options.needLoading) {
                this._loadingLayer = layer.load(2);
            }
            $.ajax({
                url: window.g.ctx + options.url,
                type: options.type || 'POST',
                data: options.data,
                beforeSend: this.onBeforeSend.bind(this),
                complete: this._onAjaxComplete.bind(this)
            })
        },
        onBeforeSend: function (request) {
            var authorization = Foundation.String.format('{0}', getAuthorization());
            request.setRequestHeader("Authorization", authorization);
        },
        _onAjaxComplete: function (xhr, textStatus) {
            this._loadingLayer && layer.close(this._loadingLayer);

            var httpStatusCode = JSON.parse(xhr.responseText).code;
            if (httpStatusCode <= 0) {
                components.Msg.toast({type: "warning", msg: "无法连接服务器"});
                return;
            }
            if (httpStatusCode == 200) {
                Foundation.isFunction(this.successCallback) && this.successCallback.call(this, JSON.parse(xhr.responseText).data);
                return;
            }
            var handler = this.codeHanderMap[httpStatusCode];
            if (Foundation.isFunction(handler)) {
                if (!Foundation.isEmpty(xhr.responseText)) {
                    handler.call(this, JSON.parse(xhr.responseText));
                } else {
                    handler.call(this, {});
                }
            } else {
                components.Msg.toast({type: "warning", msg: "操作失败"});
            }
        },

        successHandler: function (fn) {
            this.successCallback = fn;
        },

        satusCodeHandler: function (code, fn) {
            this.codeHanderMap[code] = fn;
        }

    });

    exports.saveFormData = function (data, success) {
        var httpAjax = new HttpAjax({
            url: 'process/form/rest/save',
            data: {data: JSON.stringify(data)},
            needLoading: true
        });
        httpAjax.successHandler(function () {
            components.Msg.toast({type: "success", msg: "表单数据保存成功"});
            success && success.apply(this, arguments)
        });
        httpAjax.satusCodeHandler(500, function () {
            components.Msg.toast({type: "warning", msg: "表单数据保存失败"});
        });
        httpAjax.send();
    };

    exports.saveFlowData = function (id, data, success) {
        // 验证流程配置，如果有多个创建节点，则提示
        var createNodeSize = 0;
        if (!Foundation.isEmpty(data.nodeSettings)) {
            Foundation.each(data.nodeSettings, function (nodeSetting) {
                var linkType = nodeSetting.linkType;
                if (linkType == 'create') {
                    createNodeSize++;
                }
            })
        }
        if (createNodeSize > 1) {
            components.Msg.toast({type: "warning", msg: "审批节点不能有多个创建环节的节点"});
            return;
        }
        var httpAjax = new HttpAjax({
            url: 'flow/process/rest/process/save',
            data: {data: JSON.stringify(data), id: id},
            needLoading: true
        });
        httpAjax.successHandler(function () {
            components.Msg.toast({type: "success", msg: "流程数据保存成功"});
            success && success.apply(this, arguments)
        });
        httpAjax.satusCodeHandler(500, function (errorMsg) {
            if (!Foundation.isEmpty(errorMsg)) {
                var message = errorMsg.message;
                if (!Foundation.isEmpty(message)) {
                    components.Msg.toast({type: "warning", msg: message});
                    return;
                }
            }
            components.Msg.toast({type: "warning", msg: "流程数据保存失败"});
        });
        httpAjax.send();
    };

    exports.openProcess = function (processId, success) {
        var httpAjax = new HttpAjax({
            url: 'flow/process/rest/open',
            data: {id: processId},
            needLoading: true
        });
        httpAjax.successHandler(function () {
            success && success.apply(this, arguments)
        });
        httpAjax.satusCodeHandler(500, function () {
            components.Msg.toast({type: "warning", msg: "开启流程失败"});
        });
        httpAjax.send();
    };

    exports.closeProcess = function (processId, success) {
        var httpAjax = new HttpAjax({
            url: 'flow/process/rest/closed',
            data: {id: processId},
            needLoading: true
        });
        httpAjax.successHandler(function () {
            success && success.apply(this, arguments)
        });
        httpAjax.satusCodeHandler(500, function () {
            components.Msg.toast({type: "warning", msg: "关闭流程失败"});
        });
        httpAjax.send();
    };

    exports.getOrgsData = function (success) {
        var httpAjax = new HttpAjax({
            url: 'process/rest/orgs',
            data: {},
            type: 'GET'
        });
        httpAjax.successHandler(function () {
            success && success.apply(this, arguments)
        });
        httpAjax.satusCodeHandler(500, function () {
            components.Msg.toast({type: "warning", msg: "获取组织树据失败"});
        });
        httpAjax.send();
    };

    exports.getUsersDataByOrgId = function (id, success) {
        var httpAjax = new HttpAjax({
            url: 'process/rest/org/employee?id=' + id,
            data: {},
            type: 'GET'
        });
        httpAjax.successHandler(function () {
            success && success.apply(this, arguments)
        });
        httpAjax.satusCodeHandler(500, function () {
            components.Msg.toast({type: "warning", msg: "获取组织成员失败"});
        });
        httpAjax.send();
    };

    exports.getUsersDataByPositionId = function (id, success) {
        var httpAjax = new HttpAjax({
            url: 'process/rest/position/employee?id=' + id,
            data: {},
            type: 'GET'
        });
        httpAjax.successHandler(function () {
            success && success.apply(this, arguments)
        });
        httpAjax.satusCodeHandler(500, function () {
            components.Msg.toast({type: "warning", msg: "获取职位成员失败"});
        });
        httpAjax.send();
    };

});