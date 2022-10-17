

package com.srm.bpm.logic.listener;

import com.google.common.base.MoreObjects;
import com.google.common.base.Strings;
import com.google.common.collect.Sets;
import com.google.common.primitives.Longs;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;

import lombok.extern.slf4j.Slf4j;
import com.srm.bpm.logic.service.BillTaskLogic;
import com.srm.config.SpringContextHolder;

/**
 * <p> 节点任务设置者 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Slf4j
public class AssigneeTaskListener implements TaskListener {
    private static final long serialVersionUID = 1432405797963462666L;

    @Override
    public void notify(DelegateTask delegateTask) {

        log.debug("进入了AssigneeTask");
        final DelegateExecution execution = delegateTask.getExecution();
        // 当前节点ID
        final String nodeId = execution.getCurrentActivityId();
        // 审批单号
        final String businessKey = execution.getProcessInstanceBusinessKey();

        if (log.isDebugEnabled()) {
            log.debug("the assignee task node is {} and billId is {}", nodeId, businessKey);
        }

        if (Strings.isNullOrEmpty(businessKey) || Strings.isNullOrEmpty(nodeId)) {
            log.warn("The billId {} and  task is {} has not found businessKey and nodeId",
                    businessKey, delegateTask.getId());
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
        BillTaskLogic approverService = SpringContextHolder.getBean(BillTaskLogic.class);

        final String assignee = delegateTask.getAssignee();

        // 同步写审批人表
        approverService.saveBillApprover(Sets.newHashSet(assignee), billId, delegateTask);

    }

}
