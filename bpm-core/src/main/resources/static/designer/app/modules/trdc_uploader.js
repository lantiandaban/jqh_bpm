   

/**
 * 文件上传工具类
 * @author sog
 * @version 1.0
 */
define(function (require, exports, module) {
    var singleImageFunc = Handlebars.compile(require('text!view/uploader/single_image.hbs'));

    var defaultOptions = {		//options 默认值设置
        fileNumLimit: 10,
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
    return function () {
        var defaultCompress = {
            // 图片质量，只有type为`image/jpeg`的时候才有效。
            quality: 90,
            // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
            allowMagnify: false,
            // 是否允许裁剪。
            crop: false,
            // 是否保留头部meta信息。
            preserveHeaders: true,

            // 如果发现压缩后文件大小比原来还大，则使用原来图片
            // 此属性可能会影响图片自动纠正功能
            noCompressIfLarger: false,

            // 单位字节，如果图片大小小于此值，不会采用压缩。
            compressSize: 0
        };

        var imageOptions = $.extend({}, defaultOptions, {
            server: g.ctx + 'sys/file/upload/picture',
            fileNumLimit: 1,
            accept: {					            //上传文件格式限制
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/jpg,image/jpeg,image/png'
            },
            compress: defaultCompress
        });
        // 判断浏览器是否支持图片的base64
        var isSupportBase64 = (function () {
            var data = new Image();
            var support = true;
            data.onload = data.onerror = function () {
                if (this.width !== 1 || this.height !== 1) {
                    support = false;
                }
            };
            data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            return support;
        })();

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

                        var html = '<object type="application/x-shockwave-flash" data="' + swf + '" ';

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
                    $wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
                }
                return false;
            } else if (!WebUploader.Uploader.support()) {
                alert('Web Uploader 不支持您的浏览器！');
                return false;
            }
            return true;
        };

        var _singleImage = function (options) {
            var fileCount = 0;			//添加文件总数
            var dOptions = $.extend({}, imageOptions, options);
            dOptions.auto = true;

            if (dOptions.action) {
                // 优化retina, 在retina下这个值是2
                var ratio = window.devicePixelRatio || 1;
                // 缩略图大小
                var thumbnailWidth = dOptions.width * ratio;
                var thumbnailHeight = dOptions.height * ratio;
                if (dOptions.action.compress) {
                    // 开启压缩
                    if (!dOptions.compress) {
                        dOptions.compress = defaultCompress;
                    }

                    dOptions.compress.width = thumbnailWidth;
                    dOptions.compress.height = thumbnailHeight;
                }
                if (dOptions.action.thumb) {
                    //开启缩略图
                    if (!dOptions.thumb) {
                        console.error("你开启做缩略图功能，但是缩略图参数呢!");
                        return;
                    }
                    dOptions.thumb.width = thumbnailWidth;
                    dOptions.thumb.height = thumbnailHeight;
                }
            }

            var $wrap = $('#' + dOptions.wrapId);		//上传容器对象

            var data = dOptions.data; // 是否已存在数据
            data.title = dOptions.label;

            if (data.url) {
                data.viewUrl = data.url;
            }

            var wrapHtml = singleImageFunc(data);
            $wrap.html(wrapHtml);

            dOptions.pick = $('#' + dOptions.wrapId + ' .trdc-file');
            //判断是否支持Flash
            if (!checkSupport($wrap)) {
                layer.msg('上传控件无法运行在您的浏览器上');
                return;
            }

            var uploader = WebUploader.create(dOptions)
                .on('fileQueued', function (file) {
                }).on('uploadSuccess', function (file, response) {
                    if (response.code > 0) {
                        // 上传失败
                        var message = response.message;
                        layer.alert(message, {icon: 2, title: '温馨提示'})
                    } else {
                        // 上传成功
                        var $img = $wrap.find('img');
                        if ($img) {
                            $img.prop('src', response.attachment.url);
                        }
                        var $hidVal = $wrap.find('input.upload_attachment_id');
                        if ($hidVal) {
                            $hidVal.val(response.attachment.id);
                        }
                        var $hidURL = $wrap.find('input.upload_attachment_url');
                        if ($hidURL) {
                            $hidURL.val(response.attachment.url);
                        }
                        $wrap.find('div.webuploader-pick').html('更换' + dOptions.label);
                        layer.msg('上传成功', {icon: 1, title: '温馨提示'});
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
             * 单个图片上传控件
             */
            singleImage: _singleImage
        }
    }();
});