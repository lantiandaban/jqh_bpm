<html>
<head>
    <title><#if process??>${process.name}-流程设计 *</#if></title>
    <meta charset="utf-8">
    <meta name="renderer" content="webkit|ie-comp|ie-stand">
    <meta http-equiv="X-UA-Compatible" content="IE=edge; chrome=1">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <link rel="shortcut icon" href="${ctx}/static/assets/img/favicon.ico">
    <link href="${ctx}/static/designer/resource/css/iconfont.css" rel="stylesheet" type="text/css">
    <link href="${ctx}/static/designer/resource/css/index.css" rel="stylesheet" type="text/css">
    <link href="${ctx}/static/designer/resource/css/layout.css" rel="stylesheet" type="text/css">
    <link href="${ctx}/static/designer/resource/css/app_form.css" rel="stylesheet" type="text/css">
    <link href="${ctx}/static/designer/resource/css/app_pc_designer_form.css" rel="stylesheet"
          type="text/css">
    <link href="${ctx}/static/designer/resource/css/app_process.css" rel="stylesheet"
          type="text/css">
    <link href="${ctx}/static/vendor/plugins/bpmn/assets/diagram-js.css"
          rel="stylesheet" type="text/css">
    <link href="${ctx}/static/vendor/plugins/bpmn/assets/bpmn-font/css/bpmn-embedded.css"
          rel="stylesheet" type="text/css">


    <style type="text/css">
        body.dragging,
        body.dragging * {
            cursor: move !important;
        }

        .dragged {
            position: absolute !important;
            opacity: 0.8 !important;
            z-index: 2000 !important;
        }
    </style>
</head>
<body>
<div id="header">
    <div class="nav-left">
        <div class="fx_entry_title"><a class="nav-home"><i class="icon-angleleft"></i></a>
            <div class="fx_title_editor nav-title" widgetname="_widget_1496819990649"><input
                        value="员工入职流程" style="width: 134px;"><span class="name-pre">员工入职流程</span>
            </div>
        </div>
    </div>

    <ul class="nav-right">
        <li class="nav-btn">
            <div class="btn-preview x-btn style-blue">
                <i class="icon-close"></i><span>关闭窗口</span>
            </div>
        </li>
        <li class="nav-btn">
            <div class="btn-save x-btn style-green">
                <i class="icon-save"></i><span>保存</span>
            </div>
        </li>
    </ul>
</div>
<div id="body">
    <div class="frame-edit-navibar">
        <div class="middle-btn">
            <a class="nav-btn design" href="javascript:void(0);" data-type="design"><i
                        class="icon-page-design"></i><span>表单设计</span></a>
            <a class="nav-btn flow" href="javascript:void(0);" data-type="flow"><i
                        class="icon-flow"></i><span>流程设定</span></a>
        </div>
    </div>
    <div class="frame-edit-body">
        <div id="fx-factory">
            <div id="fx-frame-header">
                <div class="btn-pane">
                    <div id="form-designer-close-btn" class="btn-preview x-btn style-white">
                        <i class="icon-close"></i><span>关闭窗口</span>
                    </div>
                    <div id="form-designer-save-btn" class="btn-save x-btn style-green">
                        <i class="icon-save"></i><span>保存</span>
                    </div>
                </div>
            </div>
            <div id="fx-frame-west">
                <div class="frame-inner-list">
                </div>
            </div>
            <div class="" id="fx-frame-east">
                <div id="design-config-tab" class="config-tab">
                    <div class="tab-item widget-tab" data-type="item">控件属性</div>
                    <div class="tab-item form-tab  tab-item-actived" data-type="form">表单属性</div>
                </div>
                <div class="config-content">
                    <div id="widget-config-pane" class="config-tab-content empty"
                         style="display:none"></div>
                    <div id="form-config-pane" class="config-tab-content"></div>
                </div>
            </div>
            <div class="fui-form" id="fx-frame-center">
                <div class="form-edit-body">
                    <div class="form-designer-warpper form-pc-designer-warpper" id="design-warpper">

                        <h1 id="pc-design-layout-table-title"></h1>

                        <table id="design-layout-table" class="pc-designer-layout-table"
                               cellpadding="0" cellspacing="0">
                            <colgroup></colgroup>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div id="form-config-content"></div>
        <div id="form-flow-content"></div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/vendor/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/static/vendor/jquery/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/static/vendor/jquery/jquery.cookie.js"></script>
<script type="text/javascript"
        src="${ctx}/static/vendor/plugins/sortable/jquery-sortable.min.js"></script>
<script type="text/javascript" src="${ctx}/static/vendor/plugins/codemirror.js"></script>
<script type="text/javascript" src="${ctx}/static/vendor/plugins/handlebars-v4.0.5.js"></script>
<script type="text/javascript" src="${ctx}/static/vendor/plugins/moment/moment.min.js"></script>
<script type="text/javascript" src="${ctx}/static/vendor/plugins/bpmn/bpmn-modeler.js"></script>
<script type="text/javascript" src="${ctx}/static/vendor/plugins/layer/layer.js"></script>
<script type="text/javascript" src="${ctx}/static/vendor/plugins/laydate/laydate.js"></script>
<script type="text/javascript" src="${ctx}/static/vendor/require/require.js"></script>
<script type="text/javascript" src="${ctx}/static/assets/js/token.js"></script>
<script type="text/javascript">
    'use strict';
    var g = {ctx: '${ctx}/', targetUrl: '${targetUrl}', type: '${type!}'};
    <#if (process.id)??>
    g.process = {
        id: "${process.id?c}",
        form: ${formJSON!'{}'},
        workflow: ${workflow!'{}'},
        enable: ${process.closeFlag?c}
    };

    <#else>
    g.process = {
        id: 0,
        form: {},
        enable: false,
        workflow: {
            enable: false,
            xml: '<?xml version="1.0" encoding="UTF-8"?><definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="http://bpmn.io" exporterVersion="0.10.1"><process id="Process_1" isExecutable="false"><startEvent id="StartEvent_1" name="流程开始节点"><outgoing>SequenceFlow_0pmgy78</outgoing></startEvent><endEvent id="EndEvent_1evstbh" name="流程结束节点"><incoming>SequenceFlow_0pmgy78</incoming></endEvent><sequenceFlow id="SequenceFlow_0pmgy78" sourceRef="StartEvent_1" targetRef="EndEvent_1evstbh" /></process><bpmndi:BPMNDiagram id="BpmnDiagram_1"><bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1"><bpmndi:BPMNShape id="StartEvent_1_gui" bpmnElement="StartEvent_1"><omgdc:Bounds x="343" y="123" width="30" height="30" /><bpmndi:BPMNLabel><omgdc:Bounds x="263" y="131" width="66" height="13" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="EndEvent_1evstbh_di" bpmnElement="EndEvent_1evstbh"><omgdc:Bounds x="340.26428571428573" y="347" width="36" height="36" /><bpmndi:BPMNLabel><omgdc:Bounds x="262" y="358" width="66" height="13" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_0pmgy78_di" bpmnElement="SequenceFlow_0pmgy78"><omgdi:waypoint xsi:type="omgdc:Point" x="358" y="153" /><omgdi:waypoint xsi:type="omgdc:Point" x="358" y="347" /><bpmndi:BPMNLabel><omgdc:Bounds x="373" y="243" width="0" height="13" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></definitions>'
            nodeSettings: [
                {
                    ntype: "start",
                    nodeId: "StartEvent_1",
                    title: "流程开始节点",
                    desc: ""
                },
                {
                    ntype: "line",
                    nodeId: "SequenceFlow_0pmgy78",
                    title: "",
                    desc: ""
                },
                {
                    ntype: "end",
                    nodeId: "EndEvent_1evstbh",
                    title: "流程结束节点",
                    desc: ""
                }
            ],
            attr: {
                allowRevoke: false
            }
        }
    };
    </#if>
    <#--数据源列表-->
    <#if (datasources??)>
    g.sources = ${datasources}
    <#else>
    g.sources = [];
    </#if>

    <#-- 职位信息 -->
    <#if (positsions??)>
    g.positsions = ${positsions}
    <#else>
    g.positsions = [];
    </#if>
    <#-- 图标信息 -->
    <#if (icons??)>
    g.icons = ${icons}
    <#else>
    g.icons = [];
    </#if>

    function closeWindow() {
        window.location.href = g.targetUrl + "/bill/page/close";
    }

    $(() => {
        $.ajax({
            url: g.ctx + "datasource/rest/datasources",
            type: 'GET',
            beforeSend: (request) => {
                var authorization = 'bearer ' + getAuthorization();
                request.setRequestHeader("Authorization", authorization);
            },
            complete: (xhr) => {
                var data = JSON.parse(xhr.responseText).data;
                g.sources = data;
            }
        })
    });
</script>

<script type="text/javascript" src="${ctx}/static/designer/app/design/index.js"></script>
</body>
</html>