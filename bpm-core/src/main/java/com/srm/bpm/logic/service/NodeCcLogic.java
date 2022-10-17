

package com.srm.bpm.logic.service;

import org.activiti.engine.delegate.DelegateTask;

import java.util.List;
import java.util.Set;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface NodeCcLogic {

    /**
     * 解析节点的抄送配置，返回抄送人的信息
     * @param flowId 流程标记
     * @param nodeId 节点ID
     * @param delegateTask 任务信息
     * @return 审批人
     */
    Set<String> resolve(String flowId, String nodeId, DelegateTask delegateTask, List<String> employeeIds);
}
