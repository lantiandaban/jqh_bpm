

package com.srm.bpm.logic.service.impl;

import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Ordering;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.entity.FormDesingerEntity;
import com.srm.bpm.infra.entity.ProcessDesingerEntity;
import com.srm.bpm.infra.entity.ProcessNodeApproverEntity;
import com.srm.bpm.infra.entity.ProcessNodeCcEntity;
import com.srm.bpm.infra.entity.ProcessNodeConnectionEntity;
import com.srm.bpm.infra.entity.ProcessNodeExtendEntity;
import com.srm.bpm.infra.entity.ProcessNodeFormFieldEntity;
import com.srm.bpm.infra.entity.ToaProcessEntity;
import com.srm.bpm.infra.service.FormDesingerService;
import com.srm.bpm.infra.service.ProcessDesingerService;
import com.srm.bpm.infra.service.ProcessNodeApproverService;
import com.srm.bpm.infra.service.ProcessNodeCcService;
import com.srm.bpm.infra.service.ProcessNodeConnectionService;
import com.srm.bpm.infra.service.ProcessNodeExtendService;
import com.srm.bpm.infra.service.ProcessNodeFormFieldService;
import com.srm.bpm.infra.service.ToaProcessService;
import com.srm.bpm.logic.comparator.ConditionWeightComparator;
import com.srm.bpm.logic.comparator.NodeApproverComparator;
import com.srm.bpm.logic.comparator.NodeCcComparator;
import com.srm.bpm.logic.constant.BillAction;
import com.srm.bpm.logic.constant.BpmnConst;
import com.srm.bpm.logic.constant.NodeLinkType;
import com.srm.bpm.logic.constant.ProcessAdminCode;
import com.srm.bpm.logic.constant.StringPool;
import com.srm.bpm.logic.converts.FormBasicConvert;
import com.srm.bpm.logic.converts.ProcessBasicConvert;
import com.srm.bpm.logic.dto.FormDesingerDTO;
import com.srm.bpm.logic.dto.ProcessDesingerDTO;
import com.srm.bpm.logic.dto.ProcessDetailDTO;
import com.srm.bpm.logic.exception.ListenerNotFoundException;
import com.srm.bpm.logic.service.ProcessDesingerLogic;
import com.srm.bpm.logic.vo.ConditionVo;
import com.srm.bpm.logic.vo.CountersignVO;
import com.srm.bpm.logic.vo.LineConditionVO;
import com.srm.bpm.logic.vo.NodeApproverVO;
import com.srm.bpm.logic.vo.NodeCcVO;
import com.srm.bpm.logic.vo.NodeSubjectVO;
import com.srm.bpm.logic.vo.ProcessDesingerVO;
import com.srm.bpm.logic.vo.ProcessNodeVO;
import com.srm.common.data.exception.RbException;
import com.srm.common.util.datetime.DateTimeUtil;

import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.SequenceFlow;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.srm.bpm.logic.error.BillCode.PROCESS_DESIGN_FORMAT_ERROR;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProcessDesingerLogicImpl implements ProcessDesingerLogic {
    private final ToaProcessService toaProcessService;
    private final FormDesingerService formDesingerService;
    private final ProcessDesingerService processDesingerService;
    private final ProcessNodeFormFieldService nodeFormFieldService;
    private final ProcessNodeExtendService nodeExtendService;
    private final ProcessNodeApproverService nodeApproverService;
    private final ProcessNodeConnectionService nodeConnectionService;
    private final ProcessNodeCcService nodeCcService;
    private final ProcessBasicConvert processBasicConvert;
    private final FormBasicConvert formBasicConvert;

    @Override
    public ProcessDetailDTO getByProecessId(long processId) {
        final ToaProcessEntity processEntity = toaProcessService.getById(processId);
        return processBasicConvert.processDetailEntityToDTO(processEntity);
    }

    @Override
    public FormDesingerDTO getDesingerJSON(long processId) {
        FormDesingerEntity formDesingerEntity = formDesingerService.getByProcessId(processId);
        return formBasicConvert.formDesingerEntityToDTO(formDesingerEntity);
    }

    @Override
    public ProcessDesingerDTO getDesingerById(long processId) {
        final ProcessDesingerEntity desingerEntity =
                processDesingerService.getOne(Wrappers.lambdaQuery(ProcessDesingerEntity.class)
                        .eq(ProcessDesingerEntity::getProcessId, processId));
        return processBasicConvert.processDesingerEntityToDTO(desingerEntity);
    }

    /**
     * 流程设计器保存接口，发布流程，设置节点等
     *
     * @param processDesingerJSON 流程表单JSON
     * @param processId           流程id信息
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveProcessAndSetting(String processDesingerJSON, long processId) {
        //需要处理一下网关的信息
        processDesingerJSON = processDesingerJSON.replace("exclusiveGateway", "parallelGateway");
        processDesingerJSON = processDesingerJSON.replace("Exclusive", "Parallel");
        final ProcessDesingerVO processDesingerVO;
        try {
            processDesingerVO = JSON.parseObject(processDesingerJSON, ProcessDesingerVO.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RbException(PROCESS_DESIGN_FORMAT_ERROR);
        }

        String processXML = processDesingerVO.getXml();
        if (Strings.isNullOrEmpty(processXML)) {
            throw new RbException(PROCESS_DESIGN_FORMAT_ERROR);
        }
        BpmnXMLConverter bpmnXMLConverter = new BpmnXMLConverter();
        InputStream is = new ByteArrayInputStream(processXML.getBytes());
        XMLInputFactory factory = XMLInputFactory.newInstance();
        Map<String, String> conditionTargetTask = Maps.newConcurrentMap();
        try {
            XMLStreamReader reader = factory.createXMLStreamReader(is);//createXmlStreamReader
            //将xml文件转换成BpmnModel
            final BpmnModel bpmnModel = bpmnXMLConverter.convertToBpmnModel(reader);
            org.activiti.bpmn.model.Process pro = null;
            for (org.activiti.bpmn.model.Process bpmnModelProcess : bpmnModel.getProcesses()) {
                pro = bpmnModelProcess;
            }
            final Map<String, FlowElement> flowElementMap = pro.getFlowElementMap();
            for (String s : flowElementMap.keySet()) {
                if (s.startsWith("SequenceFlow")) {
                    final SequenceFlow flowElement = (SequenceFlow) flowElementMap.get(s);
                    final String targetRef = flowElement.getTargetRef();
                    conditionTargetTask.put(s, targetRef);
                }
            }
        } catch (XMLStreamException e) {
            e.printStackTrace();
        }
        parseAndSave(processDesingerJSON, processId, processDesingerVO, conditionTargetTask);
    }

    private void parseAndSave(String processDesingerJSON, long processId, ProcessDesingerVO processDesingerVO, Map<String, String> flowElementMap) {

        final List<ProcessNodeVO> nodeSettings = processDesingerVO.getNodeSettings();
        List<ProcessNodeFormFieldEntity> nodeFormFields = Lists.newArrayList();
        List<ProcessNodeExtendEntity> nodeExtends = Lists.newArrayList();
        List<ProcessNodeConnectionEntity> nodeConnections = Lists.newArrayList();
        List<ProcessNodeApproverEntity> nodeApprovers = Lists.newArrayList();
        List<ProcessNodeCcEntity> nodeCcs = Lists.newArrayList();
        // 处理节点信息
        for (ProcessNodeVO nodeSetting : nodeSettings) {
            final String ntype = nodeSetting.getNtype();
            final String nodeId = nodeSetting.getNodeId();
            final String listeners = nodeSetting.getListeners();
            if (!Strings.isNullOrEmpty(listeners)) {
                List<String> listenerClses = Arrays.asList(StrUtil.split(listeners, StringPool.COMMA));
                if (CollectionUtil.isNotEmpty(listenerClses)) {
                    for (String listenerCls : listenerClses) {
                        try {
                            Class.forName(listenerCls);
                        } catch (ClassNotFoundException e) {
                            log.error("the listener {}. not found", listenerCls);
                            throw new ListenerNotFoundException(ProcessAdminCode.LISTENER_NOT_FOUND, e);
                        }
                    }
                }
            }

            long nodeExtendId = IdWorker.getId();

            final ProcessNodeExtendEntity nodeExtend = new ProcessNodeExtendEntity();
            nodeExtend.setProcessId(processId);
            nodeExtend.setId(nodeExtendId);
            nodeExtend.setNodeId(nodeId);
            nodeExtend.setBtns(nodeSetting.getBtns());
            nodeExtend.setPush(nodeSetting.getPush());
            nodeExtend.setNodeType(nodeSetting.getNtype());
            nodeExtend.setNodeName(nodeSetting.getTitle());
            nodeExtend.setAutoAgree(nodeSetting.getAutoAgree());
            nodeExtend.setAutoNextHours(nodeSetting.getAutoNextHours());
            nodeExtend.setCountersignFlag(nodeSetting.getCountersignFlag());
            nodeExtend.setBatchApproval(nodeSetting.getBatchApproval());
            nodeExtend.setNoApprovalOperation(nodeSetting.getNoApprovalOperation());
            nodeExtend.setSelectApproval(nodeSetting.getSelectApproval());
            final NodeLinkType linkType = nodeSetting.getLinkType();
            if (linkType != null) {
                nodeExtend.setLinkType(linkType.name());
            }
            final BillAction actionType = nodeSetting.getActionType();
            if (actionType != null) {
                nodeExtend.setNodeAction(actionType.name());
            }
            nodeExtend.setCreationTime(LocalDateTime.now());
            nodeExtend.setNodeSetting(StrUtil.EMPTY_JSON);

            if (StringUtils.equals(ntype, BpmnConst.NODE_LINE)) {
                nodeExtends.add(nodeExtend);

                final ProcessNodeConnectionEntity connection = parseLineNode(nodeSetting, nodeExtendId, processId, actionType, flowElementMap);

                nodeConnections.add(connection);

            } else if (StringUtils.equals(ntype, BpmnConst.NODE_TASK)) {
                nodeExtends.add(nodeExtend);

                // 保存审批人配置
                final List<NodeApproverVO> approver = nodeSetting.getApprover();
                final List<NodeApproverVO> nodeSettingApprover = sortApprover(approver);
                if (CollectionUtil.isNotEmpty(nodeSettingApprover)) {

                    for (int i = 0; i < nodeSettingApprover.size(); i++) {
                        NodeApproverVO approverVO = nodeSettingApprover.get(i);

                        ProcessNodeApproverEntity nodeApprover = new ProcessNodeApproverEntity();
                        nodeApprover.setDateline(DateTimeUtil.unixTime());
                        nodeApprover.setNodeId(nodeSetting.getNodeId());
                        nodeApprover.setNodeExtendId(nodeExtendId);
                        nodeApprover.setProcessId(processId);
                        nodeApprover.setWeight(approverVO.getWeight());

                        final List<ConditionVo> conditionList = approverVO.getCondition();
                        Pair<List<String>, Map<String, Object>> expressConditionList;
                        expressConditionList = multiConditionParse(conditionList, i);
                        if (expressConditionList == null) {
                            continue;
                        }
                        final List<String> expressApprovalList = expressConditionList.getFirst();
                        if (CollectionUtil.isNotEmpty(expressApprovalList)) {
                            final String expressJoin = StrUtil.format("({})", StrUtil.join("&&", expressApprovalList));
                            nodeApprover.setExpress(expressJoin);
                        }
                        final Map<String, Object> params = expressConditionList.getSecond();
                        if (CollectionUtil.isNotEmpty(params)) {
                            nodeApprover.setExpressParams(JSON.toJSONString(params));
                        } else {
                            nodeApprover.setExpressParams(StrUtil.EMPTY_JSON);
                        }
                        final List<NodeSubjectVO> subjects = approverVO.getSubject();
                        if (CollectionUtil.isEmpty(subjects)) {
                            nodeApprover.setApprover("[]");
                        } else {
                            nodeApprover.setApprover(JSON.toJSONString(subjects));
                        }
                        final CountersignVO countersign = approverVO.getCountersign();
                        if (Objects.isNull(countersign)) {
                            nodeApprover.setApprover("{'type':1,'count':1}");
                        } else {
                            nodeApprover.setCountersign(JSON.toJSONString(countersign));
                        }

                        nodeApprovers.add(nodeApprover);
                    }

                }

                // 处理抄送保存逻辑
                final List<NodeCcVO> nodeSettingCc = sortCc(nodeSetting.getCc());

                if (CollectionUtil.isNotEmpty(nodeSettingCc)) {
                    for (int i = 0; i < nodeSettingCc.size(); i++) {
                        NodeCcVO nodeCcVO = nodeSettingCc.get(i);
                        ProcessNodeCcEntity nodeCc = new ProcessNodeCcEntity();
                        nodeCc.setDateline(DateTimeUtil.unixTime());
                        nodeCc.setNodeId(nodeSetting.getNodeId());
                        nodeCc.setNodeExtendId(nodeExtendId);
                        nodeCc.setProcessId(processId);

                        final List<ConditionVo> conditionList = nodeCcVO.getCondition();
                        Pair<List<String>, Map<String, Object>> expressConditionList;
                        expressConditionList = multiConditionParse(conditionList, i);
                        if (expressConditionList == null) {
                            continue;
                        }
                        final List<String> expressCondList = expressConditionList.getFirst();
                        if (CollectionUtil.isNotEmpty(expressCondList)) {
                            final String express;
                            express = StrUtil.format("({})", StrUtil.join("&&", expressCondList));
                            nodeCc.setExpress(express);
                        }
                        final Map<String, Object> params = expressConditionList.getSecond();
                        if (CollectionUtil.isNotEmpty(params)) {
                            nodeCc.setExpressParams(JSON.toJSONString(params));
                        } else {
                            nodeCc.setExpressParams("{}");
                        }
                        final List<NodeSubjectVO> subjects = nodeCcVO.getSubject();
                        if (CollectionUtil.isEmpty(subjects)) {
                            nodeCc.setCc("[]");
                        } else {
                            nodeCc.setCc(JSON.toJSONString(subjects));
                        }
                        nodeCcs.add(nodeCc);
                    }
                }

                final List<ProcessNodeFormFieldEntity> formFields = nodeSetting.toFormField(processId);
                if (CollectionUtil.isNotEmpty(formFields)) {
                    nodeFormFields.addAll(formFields);
                }
            }
        }
        this.nodeFormFieldService.saveOrUpdate(nodeFormFields, processId);
        this.nodeExtendService.saveOrUpdate(nodeExtends, processId);
        this.nodeApproverService.saveOrUpdate(nodeApprovers, processId);
        this.nodeConnectionService.saveOrUpdate(nodeConnections, processId);
        this.nodeCcService.saveOrUpdate(nodeCcs, processId);
        processDesingerService.saveOrUpdateByProcess(processId, processDesingerJSON, processDesingerVO);
    }

    /**
     * 处理节点连线条件配置
     *
     * @param nodeSetting  节点配置
     * @param nodeExtendId 节点ID
     * @param processId    业务流程ID
     * @return 连线条件
     */
    private ProcessNodeConnectionEntity parseLineNode(
            ProcessNodeVO nodeSetting,
            long nodeExtendId, long processId, BillAction actionType,
            Map<String, String> flowElementMap
    ) {

        final int unixTime = DateTimeUtil.unixTime();
        final ProcessNodeConnectionEntity connection = new ProcessNodeConnectionEntity();
        connection.setProcessId(processId);
        connection.setNodeExtendId(nodeExtendId);
        connection.setNodeId(nodeSetting.getNodeId());
        connection.setDateline(unixTime);
        // 解析条件表达式

        final List<LineConditionVO> conditions = nodeSetting.getConditions();
        String lastTaskCode = "lastTaskCode";
        if (CollectionUtil.isEmpty(conditions)) {
            connection.setExpress(StringPool.EMPTY);
            connection.setExpressParams(StrUtil.EMPTY_JSON);
            if (actionType.equals(BillAction.refuse)) {
                connection.setExpress("(" + lastTaskCode + "=='" + flowElementMap.get(connection.getNodeId()) + "')");
            }
        } else {
            List<String> expressList = Lists.newArrayList();
            Map<String, Object> expressParams = Maps.newHashMap();
            // 1. 先通过权重进行排序
            final List<LineConditionVO> conditionVOS = sortCondition(conditions);

            for (int i = 0; i < conditionVOS.size(); i++) {
                LineConditionVO conditionVO = conditionVOS.get(i);
                final List<ConditionVo> conditionList = conditionVO.getCondition();
                if (CollectionUtil.isEmpty(conditionList)) {
                    continue;
                }
                final Pair<List<String>, Map<String, Object>> conditionParse;
                conditionParse = multiConditionParse(conditionList, i);
                if (conditionParse == null) {
                    continue;
                }
                List<String> expressConditionList = conditionParse.getFirst();
                final Map<String, Object> conditionParams = conditionParse.getSecond();
                if (CollectionUtil.isNotEmpty(conditionParams)) {
                    expressParams.putAll(conditionParams);
                }
                if (actionType.equals(BillAction.refuse)) {
                    expressConditionList.add(lastTaskCode + "=='" + flowElementMap.get(connection.getNodeId()) + "'");
                }
                if (CollectionUtil.isNotEmpty(expressConditionList)) {
                    expressList.add(StrUtil.format("({})", StrUtil.join("&&", expressConditionList)));
                }
            }
            if (CollectionUtil.isNotEmpty(expressList)) {
                String express = StrUtil.join("||", expressList);
                connection.setExpress(express);
                connection.setExpressParams(JSON.toJSONString(expressParams));
            }


        }
        return connection;
    }

    /**
     * 解析参数保存逻辑
     *
     * @param conditionList 条件结果
     * @param index         当前条件的次序
     * @return 解析条件和表达式以及表达式参数
     */
    private Pair<List<String>, Map<String, Object>> multiConditionParse(
            List<ConditionVo> conditionList,
            int index
    ) {
        if (CollectionUtil.isEmpty(conditionList)) {
            return null;
        }
        Map<String, Object> expressParams = Maps.newHashMap();
        List<String> expressConditionList = Lists.newArrayList();
        for (int i = 0; i < conditionList.size(); i++) {
            ConditionVo conditionVo = conditionList.get(i);
            final Pair<String, Map<String, Object>> expressAndParam;
            expressAndParam = conditionVo.toExpress(i, index);
            if (expressAndParam == null) {
                continue;
            }
            final String excepress = expressAndParam.getFirst();
            expressConditionList.add(excepress);
            final Map<String, Object> params = expressAndParam.getSecond();
            if (CollectionUtil.isNotEmpty(params)) {
                expressParams.putAll(params);
            }
        }
        return Pair.of(expressConditionList, expressParams);
    }

    private List<LineConditionVO> sortCondition(List<LineConditionVO> conditions) {
        final List<LineConditionVO> conditionVOS;
        int conditionSize = conditions.size();
        if (conditionSize > 1) {
            ConditionWeightComparator comparator = new ConditionWeightComparator();
            Ordering<LineConditionVO> ordering = Ordering.from(comparator);
            conditionVOS = ordering.sortedCopy(conditions);
        } else {
            conditionVOS = conditions;
        }
        return conditionVOS;
    }

    private List<NodeApproverVO> sortApprover(List<NodeApproverVO> approverVOS) {
        if (CollectionUtil.isEmpty(approverVOS)) {
            return Collections.emptyList();
        }
        final List<NodeApproverVO> conditionVOS;
        int conditionSize = approverVOS.size();
        if (conditionSize > 1) {
            NodeApproverComparator comparator = new NodeApproverComparator();
            Ordering<NodeApproverVO> ordering = Ordering.from(comparator);
            conditionVOS = ordering.sortedCopy(approverVOS);
        } else {
            conditionVOS = approverVOS;
        }
        return conditionVOS;
    }

    private List<NodeCcVO> sortCc(List<NodeCcVO> nodeCcVOS) {
        if (CollectionUtil.isEmpty(nodeCcVOS)) {
            return Collections.emptyList();
        }
        final List<NodeCcVO> conditionVOS;
        int conditionSize = nodeCcVOS.size();
        if (conditionSize > 1) {
            NodeCcComparator comparator = new NodeCcComparator();
            Ordering<NodeCcVO> ordering = Ordering.from(comparator);
            conditionVOS = ordering.sortedCopy(nodeCcVOS);
        } else {
            conditionVOS = nodeCcVOS;
        }
        return conditionVOS;
    }
}
