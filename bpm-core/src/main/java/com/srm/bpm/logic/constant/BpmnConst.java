 

package com.srm.bpm.logic.constant;


/**
 * <p> 流程常量 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public interface BpmnConst {

    /**
     * 线节点
     */
    String NODE_LINE = "line";
    String NODE_JUDGE = "judge";
    /**
     * 开始节点
     */
    String NODE_START = "start";
    /**
     * 结束节点
     */
    String NODE_END = "end";
    /**
     * 任务节点
     */
    String NODE_TASK = "task";


    /**
     * 流程变量表单值
     */
    String VAR_FORM_DATA = "var_formData";
    /**
     * 流程变量 申请员工ID
     */
    String VAR_APPLY_EMPLOYEE = "var_apply_employee";
    /**
     * 流程变量 申请业务流程ID
     */
    String VAR_APPLY_PROCESS = "var_apply_process";
    /**
     * 流程变量 审批信息
     *
     * @see BpmnBillContext
     */
    String VAR_BILL_CONTEXT = "var_bill_context";
    /**
     * 申请项目的项目信息
     */
    String VAR_PROJECT = "var_porject";

    String VAR_PORJCET_TYPE = "var_porjcet_type";

    /**
     * 审批单的 客户类型
     */
    String VAR_CUSTOMER = "var_customer";
    /**
     * 申请项目与申请人的关系
     */
    String VAR_USER_PROJECT_ROLE = "var_user_project_role";
    /**
     * 流程变量，审批人ID
     */
    String VAR_APPROVER_EMPLOYEE = "var_approver_employee";

    /**
     * 审批操作
     */
    String VAR_ACTION = "var_action";
    /**
     * 审批意见
     */
    String VAR_OPINION = "var_opinion";

    /**
     * 下一个审批人
     */
    String VAR_NEXT_APPROVER = "var_next_approver";

    /**
     * 审批同意的数据
     */
    String VAR_AGREE_DATA = "var_agree_data";
    /**
     * 上一个节点的nodeKey
     */
    String VAR_LAST_NODE_KEY = "var_last_node_key";

    /**
     * 上一个节点任务taskId
     */
    String VAR_LAST_TASK_ID = "var_last_task_id";


    String EXP_APPLY = "${" + VAR_APPLY_EMPLOYEE + "}";


    String FORMJSON = "{\"columnItems\":[[{\"colspan\":1,\"rowspan\":1,\"widget\":null},{\"colspan\":1,\"rowspan\":1,\"widget\":null},{\"colspan\":1,\"rowspan\":1,\"widget\":null},{\"colspan\":1,\"rowspan\":1,\"widget\":null},{\"colspan\":1,\"rowspan\":1,\"widget\":null},{\"colspan\":1,\"rowspan\":1,\"widget\":null}],[{\"colspan\":1,\"rowspan\":1,\"widget\":null},{\"colspan\":1,\"rowspan\":1,\"widget\":null},{\"colspan\":1,\"rowspan\":1,\"widget\":null},{\"colspan\":1,\"rowspan\":1,\"widget\":null},{\"colspan\":1,\"rowspan\":1,\"widget\":null},{\"colspan\":1,\"rowspan\":1,\"widget\":null}]],\"attr\":{\"name\":\"{name}\",\"layout\":{\"width\":\"auto\",\"colgroup\":[{\"value\":100,\"type\":\"px\"},{\"value\":1,\"type\":\"flex\"},{\"value\":100,\"type\":\"px\"},{\"value\":1,\"type\":\"flex\"},{\"value\":100,\"type\":\"px\"},{\"value\":1,\"type\":\"flex\"}]},\"style\":{\"border\":true},\"icon\":0}}";
    String WORKFLOWJSON = "{\"enable\":{enable},\"xml\":\"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?><definitions xmlns=\\\"http://www.omg.org/spec/BPMN/20100524/MODEL\\\" xmlns:bpmndi=\\\"http://www.omg.org/spec/BPMN/20100524/DI\\\" xmlns:omgdi=\\\"http://www.omg.org/spec/DD/20100524/DI\\\" xmlns:omgdc=\\\"http://www.omg.org/spec/DD/20100524/DC\\\" xmlns:xsi=\\\"http://www.w3.org/2001/XMLSchema-instance\\\" id=\\\"sid-{id}\\\" targetNamespace=\\\"http://bpmn.io/bpmn\\\" exporter=\\\"http://bpmn.io\\\" exporterVersion=\\\"0.10.1\\\"><process id=\\\"Process_{id}\\\" name=\\\"{name}\\\" isExecutable=\\\"true\\\"><startEvent id=\\\"StartEvent_1\\\" name=\\\"流程开始节点\\\"><outgoing>SequenceFlow_0pmgy78</outgoing></startEvent><endEvent id=\\\"EndEvent_1evstbh\\\" name=\\\"流程结束节点\\\"><incoming>SequenceFlow_0pmgy78</incoming></endEvent><sequenceFlow id=\\\"SequenceFlow_0pmgy78\\\" sourceRef=\\\"StartEvent_1\\\" targetRef=\\\"EndEvent_1evstbh\\\" /></process><bpmndi:BPMNDiagram id=\\\"BpmnDiagram_1\\\"><bpmndi:BPMNPlane id=\\\"BpmnPlane_1\\\" bpmnElement=\\\"Process_1\\\"><bpmndi:BPMNShape id=\\\"StartEvent_1_gui\\\" bpmnElement=\\\"StartEvent_1\\\"><omgdc:Bounds x=\\\"343\\\" y=\\\"123\\\" width=\\\"30\\\" height=\\\"30\\\" /><bpmndi:BPMNLabel><omgdc:Bounds x=\\\"263\\\" y=\\\"131\\\" width=\\\"66\\\" height=\\\"13\\\" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id=\\\"EndEvent_1evstbh_di\\\" bpmnElement=\\\"EndEvent_1evstbh\\\"><omgdc:Bounds x=\\\"340.26428571428573\\\" y=\\\"347\\\" width=\\\"36\\\" height=\\\"36\\\" /><bpmndi:BPMNLabel><omgdc:Bounds x=\\\"262\\\" y=\\\"358\\\" width=\\\"66\\\" height=\\\"13\\\" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id=\\\"SequenceFlow_0pmgy78_di\\\" bpmnElement=\\\"SequenceFlow_0pmgy78\\\"><omgdi:waypoint xsi:type=\\\"omgdc:Point\\\" x=\\\"358\\\" y=\\\"153\\\" /><omgdi:waypoint xsi:type=\\\"omgdc:Point\\\" x=\\\"358\\\" y=\\\"347\\\" /><bpmndi:BPMNLabel><omgdc:Bounds x=\\\"373\\\" y=\\\"243\\\" width=\\\"0\\\" height=\\\"13\\\"/></bpmndi:BPMNLabel></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></definitions>\",\"nodeSettings\":[{\"ntype\":\"start\",\"nodeId\":\"StartEvent_1\",\"title\":\"流程开始节点\",\"desc\":\"\"},{\"ntype\":\"line\",\"nodeId\":\"SequenceFlow_0pmgy78\",\"title\":\"\",\"desc\":\"\"},{\"ntype\":\"end\",\"nodeId\":\"EndEvent_1evstbh\",\"title\":\"流程结束节点\",\"desc\":\"\"}],\"attr\":{\"allowRevoke\":false}}";
}
