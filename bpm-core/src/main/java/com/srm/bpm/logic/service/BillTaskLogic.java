 

package com.srm.bpm.logic.service;

import com.srm.bpm.infra.entity.BillTaskEntity;
import com.srm.bpm.infra.entity.ProcessNodeExtendEntity;
import com.srm.bpm.logic.vo.BillTaskVO;

import org.activiti.engine.delegate.DelegateTask;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillTaskLogic {
    /**
     * 写审批任务信息，当流程引擎确定了审批人之后
     *
     * @param approvers 审批人
     * @param billId    审批单主键
     * @param task      流程审批任务
     */
    void saveBillApprover(HashSet<String> approvers, long billId, DelegateTask task);

    /**
     * 写审批任务信息，当流程引擎确定了审批人之后
     *
     * @param approvers 审批人
     * @param billId    审批单主键
     * @param task      流程审批任务
     */
    List<BillTaskEntity> saveBillApprover(Map<Long, Set<String>> approvers, long billId, DelegateTask task);

    BillTaskEntity autoAgree(ProcessNodeExtendEntity nodeExtend, List<BillTaskEntity> billTasks, String lastTaskId, long billId);

    /**
     * 查询审批单已经审批的节点
     *
     * @param billid 审批单id
     * @return 审批节点
     */
    List<BillTaskVO> getHistoryTasks(Long billid);

}
