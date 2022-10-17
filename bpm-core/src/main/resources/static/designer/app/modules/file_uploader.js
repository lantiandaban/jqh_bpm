/**
 * 文件上传工具类
 * @author tao.ding
 * @version 1.0
 */
define(function (require, exports, module) {
    var multipleFileFunc = Handlebars.compile(require('text!view/uploader/multiple_file.hbs'));

    var defaultOptions = {		//options 默认值设置
        fileNumLimit: 1,
        fileSizeLimit: 200 * 1024 * 1024, // 最大200M
        fileSingleSizeLimit: 100 * 1024 * 1024, // 单个文件最大100M
        uploaderId: 'Uploader',
        btnId: 'btn_upload',
        pick: 'filePicker',
        method: 'POST',
        chunked: false,
        swf: g.ctx + 'static/vendor/plugins/webuploader/Uploader.swf',
        label: '文件',
        formData: {}							//其他参数
    };

    $('#file_upload').on('click', '.removeFile', function () {
        var self = $(this);
        var remove = layer.confirm("确定移除该文件?", function () {
            self.parents(".file-li").remove();
            layer.alert("删除成功");
            layer.close(remove);
        });
    });

    return function () {

        var fileOptions = $.extend({}, defaultOptions, {
            server: g.ctx + 'sys/file/upload',
            fileNumLimit: 1
        });

        // 检测是否安装了Flash插件
        var flashVersion = (function () {
            var version;

            try {
                version = navigator.plugins['Shockwave Flash'];
                version = version.description;
            } catch (ex) {
                try {
                    version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                        .GetVariable('$version');
                } catch (ex2) {
                    version = '0.0';
                }
            }
            version = version.match(/\d+/g);
            return parseFloat(version[0] + '.' + version[1], 10);
        })();

        var checkSupport = function ($wrap) {
            if (!WebUploader.Uploader.support('flash') && WebUploader.browser.ie) {
                if (flashVersion) {
                    (function (container) {

                        window['expressinstallcallback'] = function (state) {
                            switch (state) {
                                case "Download.Cancelled" :
                                    alert("安装被取消");
                                    break;
                                case "Download.Failed" :
                                    alert("安装失败");
                                    break;
                                default:
                                    alert('安装已成功，请刷新！');
                                    break;
                            }
                            delete window['expressinstallcallback'];
                        };

                        var swf = dOptions.srpp + '/plugins/webupload/expressInstall.swf';

                        var html = '<object type="application/x-shockwave-flash" data="' +
                            swf + '" ';

                        if (WebUploader.browser.ie) {
                            html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                        }

                        html += 'width="100%" height="100%" style="outline:0">' +
                            '<param name="movie" value="' + swf + '" />' +
                            '<param name="wmode" value="transparent" />' +
                            '<param name="allowscriptaccess" value="always" />' +
                            '</object>';

                        container.html(html);

                    })($wrap);
                } else {
                    $wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" ' +
                        'border="0"><img alt="get flash player" src="http://www.adobe.com/' +
                        'macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
                }
                return false;
            } else if (!WebUploader.Uploader.support()) {
                alert('Web Uploader 不支持您的浏览器！');
                return false;
            }
            return true;
        };

        var _multipleFile = function (options) {
            var fileCount = 0;			//添加文件总数
            var dOptions = $.extend({}, fileOptions, options);
            dOptions.auto = true;

            var $wrap = $('#' + dOptions.wrapId);		//上传容器对象

            var wrapHtml = multipleFileFunc();
            $wrap.html(wrapHtml);

            dOptions.pick = $('#' + dOptions.wrapId + ' .trdc-file');
            //判断是否支持Flash
            if (!checkSupport($wrap)) {
                layer.msg('上传控件无法运行在您的浏览器上');
                return;
            }

            var uploader = WebUploader.create(dOptions)
                .on('fileQueued', function (file) {
                }).on('beforeFileQueued', function (file) {
                    console.log(dOptions);
                    if (dOptions.multiple != undefined && !dOptions.multiple){
                        if ($('#file_tip li').length>0){
                            layer.msg("已达到文件数上限，请删除其他文件后上传");
                            return false;
                        }
                    }
                }).on('uploadSuccess', function (file, response) {
                    if (response.code > 0) {
                        // 上传失败
                        var message = response.message;
                        layer.alert(message, {icon: 2, title: '温馨提示'})
                    } else {
                        // 上传成功
                        var fileSizeDou;
                        var fileSizeStr;
                        if (response.attachment.fileSize <= 1024) {
                            fileSizeDou = response.attachment.fileSize;
                            fileSizeStr = "B";
                        } else if (response.attachment.fileSize > 1024 &&
                            response.attachment.fileSize < 1048576) {
                            fileSizeDou = (response.attachment.fileSize / 1024).toFixed(2);
                            fileSizeStr = "KB";
                        } else {
                            fileSizeDou = (response.attachment.fileSize / 1048576).toFixed(2);
                            fileSizeStr = "MB";
                        }
                        if (response.attachment.imageFlag) {
                            var attachmentUrl = "\"" + response.attachment.url + " \" ";
                        } else {
                            var attachmentUrl = "\"/static/assets/img/file.png\"";
                        }
                        var formName = 'attachmentId';
                        if (dOptions.data.formName != undefined && dOptions.data.formName != '') {
                            formName = dOptions.data.formName;
                        }
                        $("#file_tip").append("<li class='mr5 mt5 file-li'>" +
                            "<div style='width: 102px;height: 160px;padding: 6px;'>" +
                            "<div class='new-img-show'><div class='file-name'>" +
                            "<p style='width: 90px;word-break:break-word;'>" +
                            response.attachment.fileName + "</p></div><div class='new-img-item' " +
                            " style='background-image: url(" + attachmentUrl + ")'></div><div " +
                            " class='dz-size'><strong>" + fileSizeDou + "</strong>" + fileSizeStr +
                            "</div><div style='width: 100%'><a class='btn btn-danger btn-gradient" +
                            " btn-alt item-active removeFile'href='javascript:void(0)'>移除</a>" +
                            "</div></div><input type='hidden' value='" + response.attachment.id +
                            "' name='" + formName + "'></div></li>");
                        layer.alert('上传成功', {icon: 1, title: '温馨提示'});
                    }
                }).on('uploadError', function (file, response) {

                    layer.alert('文件上传失败', {icon: 2, title: '温馨提示'})

                }).on('uploadComplete', function (file) {
                    fileCount = 0;
                    uploader.removeFile(file);
                }).on('error', function (type) {
                    console.log(type);
                });

        };

        return {
            /**
             * 上传控件
             */
            multipleFile: _multipleFile
        }
    }();

});