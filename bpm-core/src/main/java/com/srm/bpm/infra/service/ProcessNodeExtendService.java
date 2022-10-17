

package com.srm.bpm.infra.service;

import com.google.common.base.Optional;

import java.util.List;

import com.srm.bpm.infra.entity.ProcessNodeExtendEntity;
import com.srm.bpm.logic.constant.NodeLinkType;
import com.srm.common.base.infra.service.BaseService;

/**
 * <p>
 * 业务流程节点 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ProcessNodeExtendService extends BaseService<ProcessNodeExtendEntity> {

    void saveOrUpdate(List<ProcessNodeExtendEntity> nodeExtends, long processId);


    /**
     * 通过业务流程ID 获取节点配置信息
     *
     * @param processId 业务流程主键
     * @return 节点配置信息
     */
    List<ProcessNodeExtendEntity> findTaskNodeByProcess(long processId);

    /**
     * 通过审批任务ID获取节点信息
     *
     * @param taskId 审批任务ID
     * @return 节点配置
     */
    Optional<ProcessNodeExtendEntity> findByTaskId(String taskId);

    Optional<ProcessNodeExtendEntity> findByFlowIdAndNodeId(String outgoingFlowId, String flowId);

    /**
     * 根据业务流程Id和任务节点ID查询节点配置信息
     * @param processId 业务流程主键
     * @param nodeId 节点ID
     * @return 节点配置
     */
    Optional<ProcessNodeExtendEntity> findByNodeIdAndProcessId(long processId, String nodeId);

    /**
     * 根据node类型和流程id查询NodeId
     *
     * @param processId 业务流程主键
     * @param linkType  节点类型
     * @return 节点ID
     */
    String findTaskNodeIdByProcessAndLinkType(long processId, NodeLinkType linkType);
}
