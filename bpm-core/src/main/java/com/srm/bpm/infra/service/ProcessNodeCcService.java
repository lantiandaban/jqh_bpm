

package com.srm.bpm.infra.service;

import java.util.List;

import com.srm.bpm.infra.entity.ProcessNodeCcEntity;
import com.srm.common.base.infra.service.BaseService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ProcessNodeCcService extends BaseService<ProcessNodeCcEntity> {

    void saveOrUpdate(List<ProcessNodeCcEntity> nodeCcs, long processId);

    /**
     * 根据流程的id和节点的id查询节点抄送人
     * @param processId 流程的id
     * @param nodeId 节点的id
     * @return 抄送人集合
     */
    List<ProcessNodeCcEntity> findByFlowIdAndNodeId(String processId, String nodeId);

}
