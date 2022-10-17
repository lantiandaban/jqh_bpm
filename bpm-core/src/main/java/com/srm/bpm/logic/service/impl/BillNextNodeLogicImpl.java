

package com.srm.bpm.logic.service.impl;

import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.googlecode.aviator.AviatorEvaluator;
import com.srm.bpm.infra.entity.BillDataJsonEntity;
import com.srm.bpm.infra.entity.BillTaskEntity;
import com.srm.bpm.infra.entity.ProcessNodeConnectionEntity;
import com.srm.bpm.infra.entity.ProcessNodeExtendEntity;
import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.entity.ToaProcessEntity;
import com.srm.bpm.infra.po.ProcessDetailPO;
import com.srm.bpm.infra.service.BillDataJsonService;
import com.srm.bpm.infra.service.BillTaskService;
import com.srm.bpm.infra.service.ProcessNodeConnectionService;
import com.srm.bpm.infra.service.ProcessNodeExtendService;
import com.srm.bpm.infra.service.ToaBillService;
import com.srm.bpm.infra.service.ToaProcessService;
import com.srm.bpm.logic.constant.BillTaskStatus;
import com.srm.bpm.logic.constant.BillTaskType;
import com.srm.bpm.logic.context.BillDataContext;
import com.srm.bpm.logic.context.BpmnBillContext;
import com.srm.bpm.logic.service.BillBpmnLogic;
import com.srm.bpm.logic.service.BillLogic;
import com.srm.bpm.logic.service.BillNextNodeLogic;
import com.srm.bpm.logic.service.LoginUserHolder;
import com.srm.bpm.logic.constant.BpmnConst;

import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.Process;
import org.activiti.bpmn.model.SequenceFlow;
import org.activiti.bpmn.model.StartEvent;
import org.activiti.bpmn.model.UserTask;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.TaskService;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.task.Task;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.srm.bpm.logic.constant.FastJsonType.MAP_OBJECT_TR;

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
public class BillNextNodeLogicImpl implements BillNextNodeLogic {
    private final ToaProcessService processService;
    private final RepositoryService repositoryService;
    private final BillBpmnLogic billBpmnLogic;
    private final ToaBillService billService;
    private final BillTaskService billTaskService;
    private final BillDataJsonService billDataJsonService;
    private final BillLogic billLogic;
    private final TaskService taskService;
    private final ProcessNodeConnectionService connectionService;
    private final ProcessNodeExtendService nodeExtendService;
    private final LoginUserHolder loginUserHolder;

    /**
     * 审批单提交是否需要手动选择下一个节点审批人
     *
     * @param processId  流程滴id
     * @param employeeId 员工的id
     * @param formData   审批单的数据
     * @return 是否手动(1 : 手动 ; 0 : 不是)
     */
    @Override
    public Pair<Integer, String> submitNextManualFlag(Long processId, String employeeId, String formData) {
        final ToaProcessEntity process = this.processService.getById(processId);
        String processKey = process.getFlowId();
        final ProcessDefinition processDefinition = this.findLastVersionByFlowId(processKey);
        final String definitionId = processDefinition.getId();
        final BpmnModel bpmnModel = repositoryService.getBpmnModel(definitionId);
        final BpmnBillContext bpmnBillContext = billBpmnLogic.createBpmnContext(employeeId, null);
        final Map<String, Object> formDataMap = JSON.parseObject(formData, MAP_OBJECT_TR);
        final List<FlowElement> firstTaskNode = findFirstTaskNode(bpmnModel);
        return getCorrespondConnection(firstTaskNode.get(0), formDataMap, bpmnBillContext);
    }

    private List<FlowElement> findFirstTaskNode(
            BpmnModel bpmnModel
    ) {
        if (bpmnModel != null) {
            List<FlowElement> nodes = Lists.newArrayList();
            Collection<FlowElement> flowElements = bpmnModel.getMainProcess().getFlowElements();
            if (CollectionUtil.isNotEmpty(flowElements)) {
                for (FlowElement flowElement : flowElements) {
                    if (flowElement instanceof StartEvent) {
                        final List<SequenceFlow> outgoingFlows;
                        outgoingFlows = ((StartEvent) flowElement).getOutgoingFlows();
                        for (SequenceFlow outgoingFlow : outgoingFlows) {
                            final FlowElement targetFlowElement = outgoingFlow.getTargetFlowElement();
                            nodes.add(targetFlowElement);
                        }
                    }
                }
            }
            return nodes;
        }
        return Collections.emptyList();
    }

    private ProcessDefinition findLastVersionByFlowId(String flowId) {
        return repositoryService
                .createProcessDefinitionQuery()
                .processDefinitionKey(flowId)
                .latestVersion() // 获取最后一个版本
                .singleResult();
    }

    /**
     * 审批的时候获取下一个节点是否是手动
     *
     * @param taskId   任务的id
     * @param billId   审批单的id
     * @param formData 表单额数据
     * @return 是否手动(1 : 手动 ; 0 : 不是)
     */
    @Override
    public Pair<Integer, String> approvalNextManualFlag(String taskId,
                                                        Long billId,
                                                        String formData) {
        final String userId = loginUserHolder.getUserCode();
        ToaBillEntity bill = billService.getById(billId);
        final BillTaskEntity billTask =
                billTaskService.unique(Wrappers.lambdaQuery(BillTaskEntity.class)
                        .eq(BillTaskEntity::getTaskId, taskId).eq(BillTaskEntity::getUserCode, userId).eq(BillTaskEntity::getNodeStatus, BillTaskStatus.APPROVAL.getStatus())).get();
        if (billTask.getTaskType().equals(BillTaskType.ENDORSE.getValue())) {
            return Pair.of(0, StrUtil.EMPTY);
        }
        final Long processId = bill.getProcessId();
        final String processInstanceId = bill.getProcessInstanceId();
        final String employeeId = bill.getSender();
        final ProcessDetailPO processDetailDTO = this.processService.findDetailById(processId);
        final BillDataContext billDataValue;
        BillDataJsonEntity billDataJson = billDataJsonService.getOne(Wrappers.lambdaQuery(BillDataJsonEntity.class).eq(BillDataJsonEntity::getBillId, billId));
        Map<String, Object> billFormDataMap = Maps.newHashMap();
        if (billDataJson != null) {
            //这个是之前填入的
            String billformData = billDataJson.getFormData();
            billFormDataMap = JSON.parseObject(billformData, MAP_OBJECT_TR);
        }
        Map<String, Object> formDataMap = Maps.newHashMap();
        formDataMap.putAll(billFormDataMap);
        if (!Strings.isNullOrEmpty(formData)
                && !formData.equals("null")) {
            formDataMap.putAll(JSON.parseObject(formData, MAP_OBJECT_TR));
        }
        billDataValue = billLogic.resolveFormData(billId, processDetailDTO, formDataMap);
        // 构建流程变量
        final BpmnBillContext bpmnBillContext = billBpmnLogic.createBpmnContext(employeeId, billDataValue);
        final String nodeKey = billTask.getTaskNodeKey();
        final Task task = taskService.createTaskQuery().taskDefinitionKey(nodeKey).processInstanceId(processInstanceId).singleResult();
        final BpmnModel bpmnModel = repositoryService.getBpmnModel(task.getProcessDefinitionId());
        final List<Process> processes = bpmnModel.getProcesses();
        final Process process = processes.get(0);
        final FlowElement flowElement = process.getFlowElement(nodeKey);
        return getCorrespondConnection(flowElement, formDataMap, bpmnBillContext);
    }

    private Pair<Integer, String> getCorrespondConnection(FlowElement flowElement,
                                                          Map<String, Object> formDataMap,
                                                          BpmnBillContext bpmnBillContext) {
        UserTask userTask = (UserTask) flowElement;
        List<SequenceFlow> outgoingFlows = userTask.getOutgoingFlows();
        final Iterator<SequenceFlow> iterator = outgoingFlows.iterator();
        while (iterator.hasNext()) {
            final SequenceFlow next = iterator.next();
            if (!Strings.isNullOrEmpty(next.getConditionExpression())
                    && next.getConditionExpression().equals("${var_action=='refuse'}")) {
                continue;
            }
        }
        if (CollectionUtil.isEmpty(outgoingFlows)) {
            return Pair.of(0, StrUtil.EMPTY);
        }
        Map<String, String> connectionToNodeMap =
                outgoingFlows.parallelStream().collect(Collectors.toMap(SequenceFlow::getId, a -> a.getTargetRef()));
        final List<String> collect = outgoingFlows.parallelStream().map(SequenceFlow::getId).collect(Collectors.toList());
        List<ProcessNodeConnectionEntity> allConnection = connectionService.list(Wrappers.lambdaUpdate(ProcessNodeConnectionEntity.class).in(ProcessNodeConnectionEntity::getNodeId, collect));
        Set<String> correspondConnection = Sets.newHashSet();
        for (ProcessNodeConnectionEntity nodeConnection : allConnection) {
            final String express = nodeConnection.getExpress();
            if (!Strings.isNullOrEmpty(express)) {
                final String expressParams = nodeConnection.getExpressParams();

                Map<String, Object> env = Maps.newHashMap();
                if (StringUtils.contains(express, BpmnConst.VAR_FORM_DATA)) {
                    env.put(BpmnConst.VAR_FORM_DATA, formDataMap);
                }
                env.putAll(bpmnBillContext.toEnvParam(express));
                if (!Strings.isNullOrEmpty(expressParams)) {
                    final Map<String, Object> expressParamMap;
                    expressParamMap = JSON.parseObject(expressParams, MAP_OBJECT_TR);
                    env.putAll(expressParamMap);
                }
                Boolean conditionResult;
                try {
                    conditionResult = (Boolean) AviatorEvaluator.execute(express, env);
                } catch (Exception e) {
                    log.error("Express exec has error ! " +
                            "express is \n {} \n ---- param is \n {}", express, JSON.toJSON(env));
                    conditionResult = false;
                }
                if (conditionResult) {
                    correspondConnection.add(nodeConnection.getNodeId());
                }
            } else {
                correspondConnection.add(nodeConnection.getNodeId());
            }
        }
        Set<String> nextNode = Sets.newHashSet();
        for (String s : correspondConnection) {
            final String node = connectionToNodeMap.get(s);
            nextNode.add(node);
        }
        log.info("{}", nextNode);
        if (CollectionUtil.isEmpty(nextNode)) {
            return Pair.of(0, StrUtil.EMPTY);
        }
        List<ProcessNodeExtendEntity> manual = nodeExtendService.list(Wrappers.lambdaQuery(ProcessNodeExtendEntity.class)
                .in(ProcessNodeExtendEntity::getNodeId, nextNode).eq(ProcessNodeExtendEntity::getSelectApproval, 1));
        if (CollectionUtil.isNotEmpty(manual)) {
            return Pair.of(1, manual.get(0).getNodeName());
        }
        return Pair.of(0, StrUtil.EMPTY);
    }

}
