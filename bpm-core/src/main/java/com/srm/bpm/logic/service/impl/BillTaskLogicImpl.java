

package com.srm.bpm.logic.service.impl;

import com.google.common.base.Optional;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.google.common.eventbus.EventBus;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.entity.BillTaskEntity;
import com.srm.bpm.infra.entity.ProcessNodeExtendEntity;
import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.service.BillTaskService;
import com.srm.bpm.infra.service.ProcessNodeExtendService;
import com.srm.bpm.infra.service.ToaBillService;
import com.srm.bpm.logic.constant.BillAction;
import com.srm.bpm.logic.constant.BillTaskStatus;
import com.srm.bpm.logic.constant.BillTaskType;
import com.srm.bpm.logic.constant.BpmnConst;
import com.srm.bpm.logic.constant.NoApprovalOperation;
import com.srm.bpm.logic.constant.NodeLinkType;
import com.srm.bpm.logic.constant.StringPool;
import com.srm.bpm.logic.converts.BillBasicConvert;
import com.srm.bpm.logic.dto.BillTaskDTO;
import com.srm.bpm.logic.dto.TransferUserDTO;
import com.srm.bpm.logic.error.BillCode;
import com.srm.bpm.logic.event.BillRefuseEvent;
import com.srm.bpm.logic.service.BillBpmnLogic;
import com.srm.bpm.logic.service.BillLogic;
import com.srm.bpm.logic.service.BillTaskLogic;
import com.srm.bpm.logic.service.FlowMsgLogic;
import com.srm.bpm.logic.service.TransferUserLogic;
import com.srm.bpm.logic.vo.BillTaskVO;
import com.srm.bpm.logic.constant.AutoAgreeType;
import com.srm.bpm.logic.constant.Const;
import com.srm.common.data.exception.RbException;
import com.srm.common.util.bean.BeanUtil;
import com.srm.common.util.datetime.DateTimeUtil;

import org.activiti.engine.delegate.DelegateTask;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.srm.bpm.logic.error.BillCode.NO_APPROVER;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class BillTaskLogicImpl implements BillTaskLogic {
    private final EventBus eventBus;
    private final BillTaskService billTaskService;
    private final ProcessNodeExtendService nodeExtendService;
    private final BillBpmnLogic billBpmnLogic;
    private final ToaBillService billService;
    private final BillLogic billLogic;
    private final TransferUserLogic transferUserLogic;
    private final FlowMsgLogic msgLogic;
    private final BillBasicConvert billBasicConvert;


    /**
     * 写审批任务信息，当流程引擎确定了审批人之后
     *
     * @param approvers 审批人
     * @param billId    审批单主键
     * @param task      流程审批任务
     */
    @Override
    public void saveBillApprover(HashSet<String> approvers, long billId, DelegateTask task) {
        final String taskNodeId = task.getTaskDefinitionKey();
        final String processDefinitionId = task.getProcessDefinitionId();
        final String processFlowId = StrUtil.split(processDefinitionId, StringPool.COLON)[0];
        final Optional<ProcessNodeExtendEntity> nodeExtendOpt;
        nodeExtendOpt = nodeExtendService.findByFlowIdAndNodeId(taskNodeId, processFlowId);

        // 审批动作，如果是拒绝，则不能创建提交任务，而是审批任务
        final String action = task.getVariable(BpmnConst.VAR_ACTION, String.class);
        BillAction billAction = BillAction.valueOf(action);

        final ProcessNodeExtendEntity nodeExtend;
        if (nodeExtendOpt.isPresent()) {
            nodeExtend = nodeExtendOpt.get();
            final String linkType = nodeExtend.getLinkType();
            final NodeLinkType nodeLinkType = NodeLinkType.valueOf(linkType);
            switch (nodeLinkType) {
                case archive: {
                    // 设置为归档中
//                    taskStatus = BillTaskStatus.ARCHIVED;
//                    BillArchiveEvent archiveEvent = new BillArchiveEvent();
//                    archiveEvent.setBillId(billId);
//                    eventBus.post(archiveEvent);
                    break;
                }
                case create:
                    switch (billAction) {
                        case submit:
                            break;
                        case refuse: {
                            // 创建节点，并且是拒绝操作
                            // 如果是回到了审批创建节点，则审批单调整为已拒绝状态
                            BillRefuseEvent billRefuseEvent = new BillRefuseEvent();
                            billRefuseEvent.setBillId(billId);
                            billRefuseEvent.setProcessId(nodeExtend.getProcessId());
                            eventBus.post(billRefuseEvent);
                            break;
                        }
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        } else {
            throw new RbException(BillCode.PROCESS_NODE_NOT_FOUND);
        }

        // 审批发起人
        if (CollectionUtil.isNotEmpty(approvers)) {
            final List<BillTaskEntity> billTasks = Lists.newArrayListWithCapacity(approvers.size());
            BillTaskEntity billTask;
            for (String approver : approvers) {
                if (Strings.isNullOrEmpty(approver)) {
                    continue;
                }
                billTask = new BillTaskEntity();
                billTask.setAction(BillAction.fill.name());
                billTask.setOpinion("提交审批单");
                billTask.setDateline(DateTimeUtil.unixTime());
                billTask.setSort(System.currentTimeMillis());
                billTask.setTaskNodeKey(taskNodeId);
                billTask.setUserCode(approver);
                billTask.setBillId(billId);
                billTask.setNodeStatus(BillTaskStatus.REFUSE_FILL_IN.getStatus());
                billTask.setNodeName(task.getName());
                billTask.setTaskId(task.getId());
                billTask.setCreationTime(LocalDateTime.now());
                billTasks.add(billTask);
            }

            if (CollectionUtil.isNotEmpty(billTasks)) {
                this.billTaskService.saveBatch(billTasks, 300);
            }
        }
    }

    /**
     * 写审批任务信息，当流程引擎确定了审批人之后
     *
     * @param approvers 审批人
     * @param billId    审批单主键
     * @param task      流程审批任务
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<BillTaskEntity> saveBillApprover(Map<Long, Set<String>> approvers, long billId, DelegateTask task) {
        final String taskNodeId = task.getTaskDefinitionKey();
        final String processDefinitionId = task.getProcessDefinitionId();
        final String processFlowId = StrUtil.split(processDefinitionId, StringPool.COLON)[0];
        final Optional<ProcessNodeExtendEntity> nodeExtendOpt;
        nodeExtendOpt = nodeExtendService.findByFlowIdAndNodeId(taskNodeId, processFlowId);

        // 审批动作，如果是拒绝，则不能创建提交任务，而是审批任务
        final String action = task.getVariable(BpmnConst.VAR_ACTION, String.class);
        final String lastNodeKey = task.getVariable(BpmnConst.VAR_LAST_NODE_KEY, String.class);
        final String lastTaskId = task.getVariable(BpmnConst.VAR_LAST_TASK_ID, String.class);
        BillAction billAction = BillAction.valueOf(action);

        BillTaskStatus taskStatus = BillTaskStatus.APPROVAL;
        final ProcessNodeExtendEntity nodeExtend;
        if (nodeExtendOpt.isPresent()) {
            nodeExtend = nodeExtendOpt.get();
            final String linkType = nodeExtend.getLinkType();
            final NodeLinkType nodeLinkType = NodeLinkType.valueOf(linkType);
            switch (nodeLinkType) {
                case archive: {
                    break;
                }
                case create:
                    switch (billAction) {
                        case submit:
                            taskStatus = BillTaskStatus.FILL_IN;
                            break;
                        case refuse: {
                            // 创建节点，并且是拒绝操作
                            taskStatus = BillTaskStatus.REFUSE_FILL_IN;
                            // 如果是回到了审批创建节点，则审批单调整为已拒绝状态
//                            BillRefuseEvent billRefuseEvent = new BillRefuseEvent();
//                            billRefuseEvent.setBillId(billId);
//                            billRefuseEvent.setProcessId(nodeExtend.getProcessId());
//                            log.info("这个是拒绝到创建节点调用的");
//                            eventBus.post(billRefuseEvent);
                            break;
                        }
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
            final NoApprovalOperation operation = NoApprovalOperation.forValue(nodeExtend.getNoApprovalOperation());
            final String taskId = task.getId();
            Set<String> approverSet = Sets.newHashSet();
            if (CollectionUtil.isNotEmpty(approvers)) {
                final Collection<Set<String>> values = approvers.values();
                for (Set<String> value : values) {
                    approverSet.addAll(value);
                }
            }
            switch (operation) {
                case SUPERADMIN:
                    if (CollectionUtil.isEmpty(approverSet)) {
                        approvers = Maps.newConcurrentMap();
                        approvers.put(0L, Sets.newHashSet(Const.ADMIN_USER));
                    }
                    break;
                case SKIP:
                    if (CollectionUtil.isEmpty(approverSet)) {
                        //跳过当前节点直接到下一个节点
                        final Map<String, Object> formDataMap;
                        formDataMap = (Map<String, Object>) task.getVariable(BpmnConst.VAR_FORM_DATA);
                        this.billTaskService.saveSkipTask(taskNodeId, billId, taskId, task.getName(), lastNodeKey, lastTaskId);
                        this.billBpmnLogic.complete(billService.getById(billId), taskId, Const.SKIP_OPTION, "", "", JSON.toJSONString(formDataMap), taskNodeId, lastTaskId);
                    }
                    break;
                case CANNOTGO:
                    if (CollectionUtil.isEmpty(approverSet)) {
                        throw new RbException(NO_APPROVER);
                    }
                    break;
            }
            // 审批发起人
            if (CollectionUtil.isNotEmpty(approvers)) {
                final List<BillTaskEntity> billTasks = Lists.newArrayList();
                for (Long approverSettingId : approvers.keySet()) {
                    Set<String> approversStr = approvers.get(approverSettingId);
                    BillTaskEntity billTask;
                    for (String approver : approversStr) {
                        if (Strings.isNullOrEmpty(approver)) {
                            continue;
                        }
                        billTask = new BillTaskEntity();

                        if (taskStatus == BillTaskStatus.FILL_IN) {
                            billTask.setAction(BillAction.fill.name());
                            billTask.setDateline(DateTimeUtil.unixTime());
                        } else {
                            billTask.setAction(BillAction.none.name());
                        }
                        billTask.setSort(System.currentTimeMillis());
                        billTask.setTaskNodeKey(taskNodeId);
                        billTask.setUserCode(approver);
                        billTask.setBillId(billId);
                        billTask.setNodeStatus(taskStatus.getStatus());
                        billTask.setNodeName(task.getName());
                        billTask.setTaskId(taskId);
                        billTask.setLastTaskId(lastTaskId);
                        billTask.setCreationTime(LocalDateTime.now());
                        billTask.setNodeApproverId(approverSettingId);
                        billTask.setLastNodeKey(lastNodeKey);
                        billTask.setTaskType(BillTaskType.DEFAULT.getValue());
                        billTasks.add(billTask);
                    }
                }
                if (CollectionUtil.isNotEmpty(billTasks)) {
                    this.billTaskService.saveBatch(billTasks, 300);
                    final BillTaskEntity billTaskEntity = autoAgree(nodeExtend, billTasks, lastTaskId, billId);
                    if (!Objects.isNull(billTaskEntity)) {
                        //需要增加会签判断
                        final boolean goFlag = billLogic.agreeIsGoOn(billTaskEntity);
                        if (goFlag) {
                            this.billBpmnLogic.complete(billService.getById(billId), billTaskEntity.getTaskId(), Const.AUTO_AGREE_OPTION, billTaskEntity.getUserCode(), "", "", billTaskEntity.getTaskNodeKey(), billTaskEntity.getTaskId());
                            //删除待审批的信息
                            this.billTaskService.deleteApproval(billId, billTaskEntity.getTaskId(), BillTaskStatus.APPROVAL.getStatus());
                        } else {
                            //转办操作
                            transfer(billTasks, billId);
                            final List<BillTaskEntity> approvingByBillAndTaskId = this.billTaskService.findApprovingByBillAndTaskId(billId, taskId);
                            msgLogic.sendMsg(approvingByBillAndTaskId);
                            return approvingByBillAndTaskId;
                        }
                    } else {
                        //转办操作
                        transfer(billTasks, billId);
                        final List<BillTaskEntity> approvingByBillAndTaskId = this.billTaskService.findApprovingByBillAndTaskId(billId, taskId);
                        msgLogic.sendMsg(approvingByBillAndTaskId);
                        return approvingByBillAndTaskId;
                    }
                }
            }
        } else {
            throw new RbException(BillCode.PROCESS_NODE_NOT_FOUND);
        }
        return Collections.emptyList();
    }

    private void transfer(List<BillTaskEntity> billTaskEntities, Long billId) {
        final Map<String, List<BillTaskEntity>> listMap = billTaskEntities.stream()
                .filter(a -> a.getNodeStatus().compareTo(BillTaskStatus.APPROVAL.getStatus()) == 0)
                .collect(Collectors.groupingBy(BillTaskEntity::getUserCode));
        final List<TransferUserDTO> transferUserDTOS = transferUserLogic.getByProcess(listMap.keySet(), billId, LocalDateTime.now());
        final Map<String, TransferUserDTO> transferUserMap = transferUserDTOS.stream().collect(Collectors.toMap(TransferUserDTO::getUserCode, a -> a, (a, b) -> a));
        final Set<String> userCodes = listMap.keySet().stream().filter(a -> transferUserMap.keySet().contains(a)).collect(Collectors.toSet());
        /**
         * 需要把有转办的目标用户替换，然后把他当前的节点更新为专办类型，状态改为已转办
         */
        List<BillTaskEntity> updates = Lists.newArrayList();
        List<BillTaskEntity> inserts = Lists.newArrayList();
        for (String userCode : userCodes) {
            final List<BillTaskEntity> billTaskEntities1 = listMap.get(userCode);
            if (CollectionUtil.isNotEmpty(billTaskEntities1)) {
                final TransferUserDTO transferUserDTO = transferUserMap.get(userCode);
                final BillTaskEntity billTaskEntity = BeanUtil.sourceToTarget(billTaskEntities1.get(0), BillTaskEntity.class);
                billTaskEntity.setTaskType(BillTaskType.TRANSFER.getValue());
                billTaskEntity.setNodeStatus(BillTaskStatus.APPROVAL.getStatus());
                billTaskEntity.setUserCode(transferUserDTO.getTargetUserCode());
                billTaskEntity.setSourceUserCode(userCode);
                billTaskEntity.setSourceTaskId(billTaskEntity.getId());
                billTaskEntity.setId(null);
                billTaskEntity.setCreationTime(LocalDateTime.now());
                inserts.add(billTaskEntity);
                billTaskEntities1.forEach(a -> {
                    a.setNodeStatus(BillTaskStatus.TRANSFER.getStatus());
                    a.setUpdateTime(LocalDateTime.now());
                    a.setDateline(DateTimeUtil.unixTime());
                });
                updates.addAll(billTaskEntities1);
            }
        }
        if (CollectionUtil.isNotEmpty(updates)) {
            billTaskService.updateBatchById(updates);
            msgLogic.sendMsg(updates);
        }
        if (CollectionUtil.isNotEmpty(inserts)) {
            billTaskService.saveBatch(inserts);
            msgLogic.sendMsg(inserts);
        }
    }

    /**
     * 自动审批同意
     *
     * @param nodeExtend 节点配置
     * @param billTasks  节点任务集合
     * @param lastTaskId 最后一个节点id
     * @param billId     审批单id
     */
    @Override
    public BillTaskEntity autoAgree(ProcessNodeExtendEntity nodeExtend, List<BillTaskEntity> billTasks, String lastTaskId, long billId) {
        final String autoAgree = nodeExtend.getAutoAgree();
        if (Strings.isNullOrEmpty(autoAgree)) {
            return null;
        }
        List<BillTaskEntity> updateLists = Lists.newArrayList();
        if (autoAgree.contains(AutoAgreeType.SENDER_IS_APPROVER)) {
            final ToaBillEntity billEntity = billService.getById(billId);
            final String sender = billEntity.getSender();
            final List<BillTaskEntity> collect = billTasks.stream().filter(a -> a.getUserCode().equals(sender)).collect(Collectors.toList());
            updateLists.addAll(collect);
        }
        if (autoAgree.contains(AutoAgreeType.APPROVER_IS_LAST_APPROVER)) {
            final List<BillTaskEntity> billTaskEntities = approverHasAgree(billTasks, lastTaskId, billId);
            updateLists.addAll(billTaskEntities);
        }
        if (autoAgree.contains(AutoAgreeType.APPROVER_IS_AGREE)) {
            final List<BillTaskEntity> billTaskEntities = approverHasAgree(billTasks, null, billId);
            updateLists.addAll(billTaskEntities);
        }
        //需要排除重复数据
        final Map<Long, BillTaskEntity> collect = updateLists.stream().collect(Collectors.toMap(BillTaskEntity::getId, a -> a, (a1, a2) -> a1));
        final List<BillTaskEntity> collect1 = new ArrayList<>(collect.values());
        return autoAgree(billId, collect1);
    }

    /**
     * 查询审批单已经审批的节点
     *
     * @param billid 审批单id
     * @return 审批节点
     */
    @Override
    public List<BillTaskVO> getHistoryTasks(Long billid) {
        List<BillTaskDTO> billTaskDTOS = billTaskService.getHistoryTasks(billid);
        return billBasicConvert.billTasksDTOToVO(billTaskDTOS);
    }


    private List<BillTaskEntity> approverHasAgree(List<BillTaskEntity> billTasks, String lastTaskId, long billId) {
        final Set<String> userCodes = billTasks.stream().map(BillTaskEntity::getUserCode).collect(Collectors.toSet());
        if (CollectionUtil.isNotEmpty(userCodes)) {
            //增加判断，需要是fill后的审批同意
            final BillTaskEntity billTaskEntity = billTaskService.getOne(Wrappers.lambdaQuery(BillTaskEntity.class).eq(BillTaskEntity::getBillId, billId)
                    .eq(BillTaskEntity::getAction, BillAction.fill.name()).orderByDesc(BillTaskEntity::getSort),false);
            if (Objects.isNull(billTaskEntity)) {
                throw new RbException("fill task not found!");
            }
            //查询节点是否已经审批同意
            final LambdaQueryWrapper<BillTaskEntity> wrapper =
                    Wrappers.lambdaQuery(BillTaskEntity.class)
                            .eq(BillTaskEntity::getBillId, billId)
                            .eq(BillTaskEntity::getNodeStatus, BillTaskStatus.AGREE.getStatus())
                            .gt(BillTaskEntity::getSort, billTaskEntity.getSort())
                            .in(BillTaskEntity::getUserCode, userCodes);
            if (!Strings.isNullOrEmpty(lastTaskId)) {
                wrapper.eq(BillTaskEntity::getTaskId, lastTaskId);
            }
            final List<BillTaskEntity> list = billTaskService.list(wrapper);
            //表示已经审批同意的用户编号
            final Set<String> agreeUserCode = list.stream().map(BillTaskEntity::getUserCode).collect(Collectors.toSet());
            if (CollectionUtil.isNotEmpty(agreeUserCode)) {
                //过滤出已经审批的用户对应的节点任务
                final List<BillTaskEntity> autoAgreeTasks = billTasks.stream().filter(a -> agreeUserCode.contains(a.getUserCode())).collect(Collectors.toList());
                return autoAgreeTasks;
            }
        }
        return Collections.emptyList();
    }

    private BillTaskEntity autoAgree(long billId, List<BillTaskEntity> autoAgreeTasks) {
        if (CollectionUtil.isNotEmpty(autoAgreeTasks)) {
            autoAgreeTasks.forEach(a -> {
                a.setDateline(DateTimeUtil.unixTime());
                a.setUpdateTime(LocalDateTime.now());
                a.setOpinion(Const.AUTO_AGREE_OPTION);
                a.setNodeStatus(BillTaskStatus.AGREE.getStatus());
            });
            //需要把第一个拿出来给agreeFlow去更新，这个地方更新除第一个以为的
            final BillTaskEntity billTaskEntity = autoAgreeTasks.get(0);
            if (CollectionUtil.isNotEmpty(autoAgreeTasks)) {
                this.billTaskService.updateBatchById(autoAgreeTasks, 300);
            }
            msgLogic.sendMsg(autoAgreeTasks);
            return billTaskEntity;
        }
        return null;
    }
}
