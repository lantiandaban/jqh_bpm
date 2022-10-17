

package com.srm.bpm.logic.service;

import org.activiti.engine.delegate.DelegateTask;

import java.util.Map;
import java.util.Set;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface NodeApproverLogic {
    /**
     * 解析节点审批人配置，取得审批人，如果没有则返回空
     *
     * @param flowId       流程标记
     * @param nodeId       节点ID
     * @param delegateTask 任务信息
     * @return 审批人
     */
    Map<Long, Set<String>> resolve(String flowId, String nodeId, DelegateTask delegateTask);
}
