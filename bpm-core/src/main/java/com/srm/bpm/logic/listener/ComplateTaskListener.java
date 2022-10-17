

package com.srm.bpm.logic.listener;

import com.google.common.base.MoreObjects;
import com.google.common.base.Strings;
import com.google.common.primitives.Longs;

import com.srm.bpm.logic.constant.StringPool;
import com.srm.bpm.logic.service.BillCcPersonLogic;
import com.srm.bpm.logic.service.NodeCcLogic;
import com.srm.config.SpringContextHolder;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;

import java.util.Collections;
import java.util.Set;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import static com.srm.bpm.logic.constant.BpmnConst.VAR_BILL_CONTEXT;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Slf4j
public class ComplateTaskListener implements TaskListener {
    private static final long serialVersionUID = 5102408796560913909L;

    @Override
    public void notify(DelegateTask delegateTask) {
        /**
         * 节点任务完成，需要设置
         */
        log.info("最新的消息:{}", delegateTask);
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
        //处理抄送人
        NodeCcLogic nodeCcService = SpringContextHolder.getBean(NodeCcLogic.class);
        delegateTask.getVariable(VAR_BILL_CONTEXT);
        Set<String> ccUsers = nodeCcService.resolve(processFlowId, nodeId, delegateTask, Collections.emptyList());
        if (CollectionUtil.isNotEmpty(ccUsers)) {
            BillCcPersonLogic billCcPersonService;
            billCcPersonService = SpringContextHolder.getBean(BillCcPersonLogic.class);
            billCcPersonService.saveBillCc(ccUsers, billId, nodeId, processFlowId);
        }
    }
}
