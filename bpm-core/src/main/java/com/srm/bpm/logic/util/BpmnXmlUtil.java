

package com.srm.bpm.logic.util;

import com.google.common.base.Preconditions;
import com.google.common.base.Strings;
import com.google.common.collect.Maps;

import com.srm.bpm.logic.constant.BillAction;
import com.srm.bpm.logic.constant.NodeLinkType;
import com.srm.bpm.logic.constant.ProcessAdminCode;
import com.srm.bpm.logic.constant.StringPool;
import com.srm.bpm.logic.exception.ListenerNotFoundException;
import com.srm.bpm.logic.vo.LineConditionVO;
import com.srm.bpm.logic.vo.ProcessNodeVO;
import com.srm.bpm.logic.constant.BpmnConst;

import org.dom4j.Branch;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.XPath;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;

import static org.activiti.engine.delegate.BaseExecutionListener.EVENTNAME_END;
import static org.activiti.engine.delegate.BaseExecutionListener.EVENTNAME_TAKE;
import static org.activiti.engine.delegate.BaseTaskListener.EVENTNAME_ASSIGNMENT;
import static org.activiti.engine.delegate.BaseTaskListener.EVENTNAME_COMPLETE;
import static org.activiti.engine.delegate.BaseTaskListener.EVENTNAME_CREATE;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public class BpmnXmlUtil {
    private static final Logger LOGGER = LoggerFactory.getLogger(BpmnXmlUtil.class);


    private static final Map<String, String> NAMESPACECONTEXT = Maps.newHashMap();
    /**
     * 默认的节点人员监听器
     */
    private static final String CREATE_TASK_LISTENER = "com.srm.bpm.logic.listener.CreateTaskListener";
    private static final String COMPLATE_TASK_LISTENER = "com.srm.bpm.logic.listener.ComplateTaskListener";
    /**
     * 节点 指派审批人的时候的监听器
     */
    private static final String ASSIGNEE_TASK_LISTENER = "com.srm.bpm.logic.listener.AssigneeTaskListener";
    private static final String GATEWAY_TASK_LISTENER = "com.srm.bpm.logic.listener.GatewayListener";
    /**
     * 审批单流程实例监听器
     */
    private static final String BILL_PROCESS_LISTENER = "com.srm.bpm.logic.listener.ProcessBillListener";

    static {
        NAMESPACECONTEXT.put("bpmn", "http://www.omg.org/spec/BPMN/20100524/MODEL");
    }

    private BpmnXmlUtil() {
    }

    /**
     * 对BPMN 设计的XML进行节点处理信息
     *
     * @param bpmnXml bpmn信息
     * @param nodeVOS 节点设置  @return 重新生成的XML
     */
    public static String destBpmnXml(String bpmnXml, long processId, List<ProcessNodeVO> nodeVOS) {
        Preconditions.checkNotNull(bpmnXml, "xml 信息不能为空");
        // 去掉多余的信息
        bpmnXml = StrUtil.replace(bpmnXml, "targetNamespace=\"http://bpmn.io/bpmn\""
                , "typeLanguage=\"http://www.w3.org/2001/XMLSchema\"  " +
                        "expressionLanguage=\"http://www.w3.org/1999/XPath\" targetNamespace=\"http://jtech.oa/bpmn\"");
        bpmnXml = StrUtil.replace(bpmnXml, "exporter=\"http://bpmn.io\""
                , " xmlns:activiti=\"http://activiti.org/bpmn\"");
        bpmnXml = StrUtil.replace(bpmnXml, "exporterVersion=\"0.10.1\"", StringPool.EMPTY);
        bpmnXml = StrUtil.replace(bpmnXml, "<task ", "<userTask ");
        bpmnXml = StrUtil.replace(bpmnXml, "</task>", "</userTask>");

        try {
            final Document document = DocumentHelper.parseText(bpmnXml);
            // 找到多余的节点进行删除
            clearNodes(document);

            // 添加监听器
            final Object endEventObjs = select("//bpmn:endEvent", document);
            if (endEventObjs != null) {

                final Class<?> nodeCls = endEventObjs.getClass();
                if (Collection.class.isAssignableFrom(nodeCls)) {
                    List<Element> endEventNodes = (List<Element>) endEventObjs;
                    for (Element endEventNode : endEventNodes) {
                        addExecutionListener(endEventNode, EVENTNAME_END, BILL_PROCESS_LISTENER);
                    }
                } else {
                    final Element endEventEle = (Element) endEventObjs;
                    addExecutionListener(endEventEle, EVENTNAME_END, BILL_PROCESS_LISTENER);
                }
            }

            // 节点配置
            for (ProcessNodeVO nodeVO : nodeVOS) {
                final String ntype = nodeVO.getNtype();
                if (Strings.isNullOrEmpty(ntype)) {
                    continue;
                }
                if (StrUtil.equals(BpmnConst.NODE_TASK, ntype)) {
                    final String nodeId = nodeVO.getNodeId();
                    // 根据NODEID找到对应的配置节点
                    final String userTaskXPath = StrUtil
                            .format("//bpmn:userTask[@id='{}']", nodeId);
                    Element taskNode = (Element) select(userTaskXPath, document);
                    if (taskNode == null) {
                        continue;
                    }
                    final NodeLinkType linkType = nodeVO.getLinkType();
                    if (linkType == NodeLinkType.create) {
                        addTaskNodeAssignee(taskNode, BpmnConst.EXP_APPLY);
                        addNodeTaskListener(taskNode, EVENTNAME_ASSIGNMENT, ASSIGNEE_TASK_LISTENER);
                    } else {
                        // 设置创建节点任务的时候的处理器
                        addNodeTaskListener(taskNode, EVENTNAME_CREATE, CREATE_TASK_LISTENER);
                        addNodeTaskListener(taskNode, EVENTNAME_COMPLETE, COMPLATE_TASK_LISTENER);
                    }
                    final String listeners = nodeVO.getListeners();
                    if (!Strings.isNullOrEmpty(listeners)) {
                        String[] listenerClses = StrUtil.split(listeners, StringPool.COMMA);
                        if (CollectionUtil.isNotEmpty(Arrays.asList(listenerClses))) {
                            for (String listenerCls : listenerClses) {
                                try {
                                    Class.forName(listenerCls);
                                } catch (ClassNotFoundException e) {
                                    LOGGER.error("the listener  {}. not found", listenerCls);
                                    throw new ListenerNotFoundException(ProcessAdminCode.LISTENER_NOT_FOUND);
                                }
                                // 自定义完成事件
                                addNodeTaskListener(taskNode, EVENTNAME_COMPLETE, listenerCls);
                            }
                        }
                    }

                } else if (StrUtil.equals(BpmnConst.NODE_LINE, ntype)) {
                    final String nodeId = nodeVO.getNodeId();
                    final String sequenceFlowPath;
                    sequenceFlowPath = StrUtil.format("//bpmn:sequenceFlow[@id='{}']", nodeId);
                    Element sequenceFlow = (Element) select(sequenceFlowPath, document);
                    if (sequenceFlow == null) {
                        continue;
                    }
                    final List<LineConditionVO> conditions = nodeVO.getConditions();

                    final BillAction actionType = nodeVO.getActionType();
                    if (actionType == null) {
                        continue;
                    }
                    switch (actionType) {
                        case refuse: {
                            String expressFormat = "${{}=='{}'}";
                            String express = StrUtil.format(expressFormat, BpmnConst.VAR_ACTION, BillAction.refuse.toString());
                            addNodeExpressElement(sequenceFlow, express);
                            break;
                        }
                        case agree: {
                            String express;
                            if (CollectionUtil.isNotEmpty(conditions)) {
                                String expressFormat;
                                expressFormat = "${lineExpr.invoke({},'{}','{}',{},{},{},{})}";
                                express = StrUtil.format(expressFormat,
                                        "execution", processId, nodeId,
                                        BpmnConst.VAR_BILL_CONTEXT, BpmnConst.VAR_APPROVER_EMPLOYEE,
                                        BpmnConst.VAR_FORM_DATA, BpmnConst.VAR_ACTION);
                            } else {
                                String expressFormat = "${{}=='{}'}";
                                express = StrUtil.format(expressFormat, BpmnConst.VAR_ACTION, BillAction.agree.toString());
                            }
                            addNodeExpressElement(sequenceFlow, express);
                            break;
                        }
                        default:
                            break;
                    }


                } else if (StrUtil.equals(BpmnConst.NODE_JUDGE, ntype)) {
                    final String nodeId = nodeVO.getNodeId();
                    // 根据NODEID找到对应的配置节点
                    final String parallelGatewayXPath = StrUtil
                            .format("//bpmn:parallelGateway[@id='{}']", nodeId);
                    Element taskNode = (Element) select(parallelGatewayXPath, document);
                    if (taskNode == null) {
                        continue;
                    }
                    addExecutionListener(taskNode, EVENTNAME_TAKE, GATEWAY_TASK_LISTENER);
                }

            }
            if (LOGGER.isDebugEnabled()) {
                LOGGER.debug("The process xml is \n{}", document.asXML());
            }
            return document.asXML();
        } catch (DocumentException e) {
            LOGGER.error("parse workflow document xml has error!", e);
            e.printStackTrace();
            return bpmnXml;
        }
    }

    private static void addNodeExpressElement(Element sequenceFlow, String express) {
        final Element conditionExpression = sequenceFlow.addElement("conditionExpression");
        conditionExpression.addAttribute("xsi:type", "tFormalExpression");
        conditionExpression.addCDATA(express);
    }

    @SuppressWarnings("unchecked")
    private static void clearNodes(Document document) {
        final List<Element> outgoings = (List<Element>) select("//bpmn:outgoing", document);
        for (Element outgoing : outgoings) {
            outgoing.getParent().remove(outgoing);
        }
        final List<Element> incomings = (List<Element>) select("//bpmn:incoming", document);
        for (Element incoming : incomings) {
            incoming.getParent().remove(incoming);
        }
    }

    /**
     * 设置某个任务节点的参与人表达式
     *
     * @param taskNode      任务节点
     * @param expressionVal 参与人表达式
     */
    private static void addOwnerElement(Element taskNode, String expressionVal) {
        // potentialOwner 标签描述一个潜在的用户、组集合
        final Element potentialOwner = taskNode.addElement("potentialOwner");
        final Element resourceAssignment = potentialOwner
                .addElement("resourceAssignmentExpression");

        final Element formalExpression = resourceAssignment
                .addElement("formalExpression");
        formalExpression.addCDATA(expressionVal);
    }

    /**
     * 给某个任务节点添加任务监听器
     *
     * @param node      任务节点
     * @param event     监听器事件 @see {@link org.activiti.engine.delegate.BaseTaskListener#EVENTNAME_ALL_EVENTS}
     * @param className 监听器类
     */
    private static void addNodeTaskListener(Element node, String event, String className) {

        Element extensionElements = node.element("extensionElements");
        if (extensionElements == null) {
            extensionElements = node.addElement("extensionElements");
        }
        final Element taskListener = extensionElements.addElement("activiti:taskListener");
        taskListener.addAttribute("event", event);
        taskListener.addAttribute("class", className);
    }

    /**
     * 给某个任务节点添加任务监听器
     *
     * @param event     监听器事件 @see {@link org.activiti.engine.delegate.BaseExecutionListener#EVENTNAME_START}
     * @param className 监听器类
     */
    private static Element addExecutionListener(Element taskNode, String event, String className) {
        final Element extensionElements = taskNode.addElement("extensionElements")
                .addNamespace("activiti", "http://activiti.org/bpmn");
        final Element taskListener = extensionElements.addElement("activiti:executionListener");
        taskListener.addAttribute("event", event);
        taskListener.addAttribute("class", className);

        return extensionElements;
    }


    /**
     * 给某个任务节点添加办理人变量信息
     *
     * @param taskNode 任务节点
     * @param variable 变量参数
     */
    private static void addTaskNodeAssignee(Element taskNode, String variable) {
        if (Strings.isNullOrEmpty(variable)) {
            return;
        }
        taskNode.addAttribute("activiti:assignee", variable);
    }

    private static Object select(String expression, Branch contextNode) {
        XPath xp = contextNode.createXPath(expression);
        xp.setNamespaceURIs(NAMESPACECONTEXT);
        return xp.evaluate(contextNode);
    }

}
