<#include "./header.ftl"/>
<div class="panel user-group-widget pn">
    <div class="panel-menu br-t-n br-h-n ">
        <div class="tool-bar">
            <div class="btn-toolbar">
                <a href="#" id="btn-cc-create"
                   class="btn btn-sm btn-primary">新建</a>
            </div>
        </div>
    </div>

    <table class="table table-condensed table-bordered br-a br-info-light" id="cc-condition-dt">
        <thead>
        <tr class="primary">
            <th class="w40">序号</th>
            <th>条件</th>
            <th>抄送人</th>
            <th class="w125">权重</th>
            <th class="w50">操作</th>
        </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>
<input type="hidden" id="fields_val">
<input type="hidden" id="cc_val" value=''>
<#include "./footer.ftl"/>
<script type="text/javascript"
        src="${ctx}/static/designer/app/controllers/process/designer/cc.js?_=${.now?string
        ('yyyyMMddHHmmSS')}"></script>
</html>