

package com.srm.bpm.infra.service;

import com.srm.common.base.infra.service.BaseService;
import com.srm.bpm.infra.entity.ProcessNodeApproverEntity;

import java.util.List;

/**
 * <p>
 * 节点审批人 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ProcessNodeApproverService extends BaseService<ProcessNodeApproverEntity> {

    /**
     * 保存节点审批人配置
     *
     * @param nodeApprovers 审批人配置
     * @param processId     业务流程主键
     */
    void saveOrUpdate(List<ProcessNodeApproverEntity> nodeApprovers, long processId);

    /**
     * 根据流程标记和节点 取得节点的审批人配置
     *
     * @param flowId 流程标记
     * @param nodeId        节点ID
     * @return 审批人配置
     */
    List<ProcessNodeApproverEntity> findByFlowIdAndNodeId(String flowId, String nodeId);

    /**
     * 通过id获取包括删除的
     * @param approverId id
     * @return
     */
    ProcessNodeApproverEntity getByIdExludDel(Long approverId);
}
