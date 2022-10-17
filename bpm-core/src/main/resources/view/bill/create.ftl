<#compress>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="renderer" content="webkit|ie-comp|ie-stand">
        <meta http-equiv="X-UA-Compatible" content="IE=edge; chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <meta name="generator" content="V2.0"/>
        <meta name="author" content="JtOA Team"/>
        <meta name="copyright" content="Inc."/>

        <title></title>
        <link rel="stylesheet" type="text/css"
              href="${ctx}/static/vendor/plugins/tooltip/css/tooltipster.bundle.min.css"/>
        <link rel="stylesheet" type="text/css"
              href="${ctx}/static/vendor/plugins/layerui/css/layui.css">
        <link rel="stylesheet" type="text/css" href="${ctx}/static/assets/css/reset.css"/>

        <link rel="stylesheet" type="text/css" href="${ctx}/static/assets/css/main.src.css"/>
        <link rel="stylesheet" type="text/css" href="${ctx}/static/assets/css/iconfont.css">
        <link rel="stylesheet" type="text/css" href="${ctx}/static/assets/css/component.css">
        <link rel="stylesheet" type="text/css" href="${ctx}/static/assets/css/common.css">
        <link rel="stylesheet" type="text/css" href="${ctx}/static/assets/css/approval.css">
        <link rel="stylesheet" type="text/css" href="${ctx}/static/assets/css/grid-layout.css">
        <link rel="stylesheet" type="text/css"
              href="${ctx}/static/vendor/plugins/datatable/jquery.dateTable.css">
        <link rel="stylesheet" type="text/css"
              href="${ctx}/static/vendor/plugins/datatable/jquery.dataTable.style.css">
        <link rel="stylesheet" type="text/css"
              href="${ctx}/static/vendor/plugins/tooltip/css/tooltipster.bundle.min.css">
        <link rel="stylesheet" type="text/css"
              href="${ctx}/static/vendor/plugins/webuploader/webuploader.css">
        <link rel="stylesheet" type="text/css"
              href="${ctx}/static/vendor/plugins/viewer/viewer.min.css">
        <link rel="stylesheet" type="text/css"
              href="${ctx}/static/assets/css/page.css">
        <link rel="stylesheet" type="text/css"
              href="${ctx}/static/assets/css/process_track.css">
        <link rel="stylesheet" type="text/css"
              href="${ctx}/static/vendor/plugins/ztree/css/metroStyle/metroStyle.css">
    </head>

    <body>

    <!--内容区域-->
    <section id="g-bd" style="top: 0px!important;">
        <div id="layout-main" class="bd-main">
            <div class="bd-mian-lr" style="margin-left: 0px!important;">
                <div class="bd-mian-lr-bd"></div>
            </div>
        </div>
    </section>
    <script type="text/javascript">
        window.Hamster = {};
        function getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
            return "";
        }

        var g = {
            ctx: '${ctx}/',
            targetUrl:'${targetUrl}',
            processId: getQueryVariable("processId"),
            mode: getQueryVariable("mode"),
            billId: getQueryVariable("billId")
        };
        function closeWindow(){
            window.location.href = g.targetUrl + "/bill/page/close";
        }
    </script>
    <#--用来给layuiTable生成序号-->
    <script type="text/html" id="laytpl_public_index">
        <div style="text-align: center">{{ d.LAY_TABLE_INDEX + 1 }}</div>
    </script>
    <script type="text/html" id="laytpl_public_priority">
        {{#  if(d.priority == 1){ }}
        <span style='color: red'>高</span>
        {{#  } else if(d.priority == 2) { }}
        <span style='color: #FFD700'>中</span>
        {{#  } else if(d.priority == 3) { }}
        <span style='color: darkgray'>低</span>
        {{# } else { }}
        <span>无</span>
        {{#  } }}
    </script>
    <script type="text/html" id="laytpl_public_status">
        {{#  if(d.status == 0){ }}
        <span style="color: #C4C6C9">草稿</span>
        {{#  } else if(d.status == 1) { }}
        <span style='color: #3db8c1'>审批中</span>
        {{#  } else if(d.status == 2) { }}
        <span style='color: #bfbfbf'>已撤销</span>
        {{#  } else if(d.status == 3) { }}
        <span style='color: #f56a00'>已拒绝</span>
        {{#  } else if(d.status == 4) { }}
        <span style='color:#49a9ee;'>归档中</span>
        {{#  } else if(d.status == 8) { }}
        <span style='color:#00a854;'>已完成</span>
        {{# } else { }}
        <span>无</span>
        {{#  } }}
    </script>
    <script type="text/html" id="laytpl_public_paymentStatus">
        {{# if(d.paymentStatus == 12) { }}
        <span style='color: #3db8c1'>支付中</span>
        {{#  } else if(d.paymentStatus == 11) { }}
        <span style='color:#00a854;'>已支付</span>
        {{#  } else if(d.paymentStatus == 13) { }}
        <span style='color:#00a854;'>未支付</span>
        {{# } else { }}
        <span>无</span>
        {{#  } }}
    </script>

    <script type="text/javascript" src="${ctx}/static/vendor/jquery/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="${ctx}/static/vendor/jquery/jquery.cookie.js"></script>
    <script src="${ctx}/static/vendor/plugins/ztree/js/jquery.ztree.all.js"
            type="text/javascript"></script>
    <script type="text/javascript" src="${ctx}/static/vendor/plugins/moment/moment.min.js"></script>
    <script type="text/javascript"
            src="${ctx}/static/vendor/plugins/tooltip/js/tooltipster.bundle.min.js"></script>

    <script type="text/javascript"
            src="${ctx}/static/vendor/plugins/handlebars-v4.0.5.js"></script>
    <script type="text/javascript"
            src="${ctx}/static/vendor/plugins/Handlebars.helper.js"></script>
    <script type="text/javascript"
            src="${ctx}/static/vendor/plugins/layerui/layui.all.js"></script>
    <script type="text/javascript"
            src="${ctx}/static/vendor/plugins/datatable/jquery.dataTable.js"></script>
    <script type="text/javascript"
            src="${ctx}/static/vendor/plugins/datatable/jquery.dataTable.style.js"></script>
    <script type="text/javascript"
            src="${ctx}/static/vendor/plugins/webuploader/webuploader.nolog.min.js"></script>
    <script type="text/javascript"
            src="${ctx}/static/vendor/plugins/viewer/viewer.min.js"></script>

    <script type="text/javascript" src="${ctx}/static/vendor/plugins/toa.util.js"></script>
    <script type="text/javascript" src="${ctx}/static/vendor/require/require.js"></script>
    <script type="text/javascript" src="${ctx}/static/assets/js/token.js"></script>
    <script type="text/javascript" src="${ctx}/static/assets/js/jquery-ztree.js"></script>
    <script type="text/javascript" src="${ctx}/static/bill/index.js"></script>

    </body>
    </html>
</#compress>