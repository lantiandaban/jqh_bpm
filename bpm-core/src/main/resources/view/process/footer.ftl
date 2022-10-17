</div>
</body>
<script type="text/javascript" src="${ctx}/static/vendor/jquery/jquery-1.12.4.min.js"></script>
<script type="text/javascript" src="${ctx}/static/vendor/jquery/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/static/vendor/jquery/jquery.cookie.js"></script>
<script src="${ctx}/static/vendor/plugins/select2/js/select2.min.js"
        type="text/javascript"></script>
<script src="${ctx}/static/vendor/plugins/select2/js/i18n/zh-CN.js" type="text/javascript"></script>
<script src="${ctx}/static/vendor/plugins/ztree/js/jquery.ztree.all.js"
        type="text/javascript"></script>
<script type="text/javascript" src="${ctx}/static/vendor/plugins/handlebars-v4.0.5.js"></script>
<script type="text/javascript" src="${ctx}/static/assets/js/handlebars-helper.js"></script>
<script type="text/javascript" src="${ctx}/static/assets/js/utility/utility.js"></script>
<script type="text/javascript" src="${ctx}/static/vendor/plugins/layer/layer.js"></script>
<script type="text/javascript"
        src="${ctx}/static/vendor/plugins/xeditable/js/bootstrap-editable.min.js"></script>
<script type="text/javascript" src="${ctx}/static/assets/js/jquery-ztree.js"></script>
<script type="text/javascript" src="${ctx}/static/assets/js/trdc-util.js"></script>
<script type="text/javascript" src="${ctx}/static/assets/js/token.js"></script>
<script type="text/javascript" src="${ctx}/static/vendor/require/require.js"></script>
<script type="text/javascript">
    "use strict";
    var g = {ctx: '${ctx}/'};
    g.dialogIndex = parent.layer.getFrameIndex(window.name); //获取窗口索引
    "use strict";
    jQuery(document).ready(function () {
        var selectComp = $('body').find('[data-toggle="select2"]');
        if (selectComp && selectComp.length > 0) {
            selectComp.each(function (i, sel) {
                var $select = $(sel);
                var selectOptions = $select.data();
                var _options = {language: 'zh-CN'};
                var selOpt = $.extend({}, selectOptions, _options);
                $select.select2(selOpt)
            })
        }
    });
    requirejs.config({
        baseUrl: g.ctx + 'static/designer/app/',
        urlArgs: "t=" + +new Date,
        paths: {
            text: g.ctx + "static/vendor/require/require.text",
            controller: 'controllers',
            view: 'tpl'
        }
    });
</script>
<script type="text/javascript">
    g.project_types = [];
</script>