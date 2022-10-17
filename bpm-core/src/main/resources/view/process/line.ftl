<#include "./header.ftl"/>

<div class="panel pn">
    <div class="panel-menu br-h-n p5 ">
        <div class="tool-bar">
            <div class="btn-toolbar">
                <a href="#" id="btn_create_condition"
                   class="btn btn-sm btn-primary">新建</a>
            </div>
        </div>
    </div>
    <table class="table table-condensed table-bordered mb20 br-a br-info-light"
           id="line_condtion_dt">
        <thead>
        <tr class="primary">
            <th class="w40">序号</th>
            <th>条件</th>
            <th class="w125">权重</th>
            <th class="w100">操作</th>
        </tr>
        </thead>
        <tbody>
        </tbody>
    </table>


    <div class="alert alert-default light alert-dismissable mb20">
        <i class="fa fa-info pr10"></i>
        <strong>操作提示</strong>
        <p>1. 表单字段需要在对表单设计完成并且保存成功后才可以在这里进行字段的设置</p>
        <p>2. 申请人职位 表示的 审批发起人的部门职位</p>
        <p>3. 申请人部门 表示的 审批发起人的所在部门</p>
        <p>4. 申请人 表示的 指定的具体的员工</p>
    </div>
</div>
<input type="hidden" id="fields_val">
<input type="hidden" id="condition_val" value="">
<#include "./footer.ftl"/>
<script type="text/javascript"
        src="${ctx}/static/designer/app/controllers/process/designer/line.js?_=${.now?string
        ('yyyyMMddHHmmSS')}"></script>
</html>