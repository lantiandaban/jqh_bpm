

package com.srm.bpm.logic.listener;

import com.google.common.base.MoreObjects;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.google.common.primitives.Longs;

import com.srm.bpm.infra.entity.BillTaskEntity;
import com.srm.bpm.logic.constant.StringPool;
import com.srm.bpm.logic.service.BillTaskLogic;
import com.srm.bpm.logic.service.NodeApproverLogic;
import com.srm.config.SpringContextHolder;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

/**
 * <p> 节点任务设置者 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Slf4j
public class CreateTaskListener implements TaskListener {
    private static final long serialVersionUID = 1432405797963462666L;

    @Override
    public void notify(DelegateTask delegateTask) {
        log.debug("进入了CreateTaskListener");
        final DelegateExecution execution = delegateTask.getExecution();
        // 当前节点ID
        final String nodeId = execution.getCurrentActivityId();
        log.info("the create task node is {}", nodeId);
        // 审批单号
        final String businessKey = execution.getProcessInstanceBusinessKey();

        final String taskId = delegateTask.getId();
        if (Strings.isNullOrEmpty(businessKey) || Strings.isNullOrEmpty(nodeId)) {
            log.warn("The billId {} and  task is {} has not found businessKey and nodeId",
                    businessKey, taskId);
            return;
        }

        final long billId = MoreObjects.firstNonNull(Longs.tryParse(businessKey), 0L);
        if (billId <= 0) {
            log.warn("the node {} bill is null!!! businessKey is {}", nodeId, businessKey);
            return;
        }
        final String processDefinitionId = delegateTask.getProcessDefinitionId();
        if (Strings.isNullOrEmpty(processDefinitionId)) {
            log.warn("the node {} and billId {} processDefinitionId is null!!!", nodeId,
                    businessKey);
            return;
        }

        final String processFlowId = StrUtil.split(processDefinitionId, StringPool.COLON)[0];
        // 获取审批人信息
        NodeApproverLogic nodeApproverService = SpringContextHolder.getBean(NodeApproverLogic.class);
        Map<Long, Set<String>> approverSettings = nodeApproverService.resolve(processFlowId, nodeId, delegateTask);
        Set<String> approvers = Sets.newConcurrentHashSet();
        for (Set<String> value : approverSettings.values()) {
            approvers.addAll(value);
        }
        if (CollectionUtil.isNotEmpty(approvers)) {
            delegateTask.addCandidateUsers(approvers);
        } else {
            log.info("the task {} current node is {} , not found approver!!!", taskId, delegateTask.getName());
        }
        // 同步写审批人表
        BillTaskLogic approverService;
        approverService = SpringContextHolder.getBean(BillTaskLogic.class);
        final List<BillTaskEntity> billTaskEntities = approverService.saveBillApprover(approverSettings, billId, delegateTask);
        final Set<String> approvingUsers = billTaskEntities.stream().map(BillTaskEntity::getUserCode).collect(Collectors.toSet());
        List<String> employeeIds = Lists.newArrayList();
        employeeIds.addAll(approvingUsers);
//        //处理抄送人
//        NodeCcLogic nodeCcService = SpringContextHolder.getBean(NodeCcLogic.class);
//        Set<String> ccUsers = nodeCcService.resolve(processFlowId, nodeId, delegateTask, employeeIds);
//        if (CollectionUtil.isNotEmpty(ccUsers)) {
//            BillCcPersonLogic billCcPersonService;
//            billCcPersonService = SpringContextHolder.getBean(BillCcPersonLogic.class);
//            billCcPersonService.saveBillCc(ccUsers, billId, nodeId, processFlowId);
//        }
    }
}