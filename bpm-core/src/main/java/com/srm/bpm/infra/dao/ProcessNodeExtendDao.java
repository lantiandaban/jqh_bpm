

package com.srm.bpm.infra.dao;

import org.apache.ibatis.annotations.Param;

import java.util.List;

import com.srm.bpm.infra.entity.ProcessNodeExtendEntity;
import com.srm.common.base.infra.dao.BaseDao;

/**
 * <p>
 * 业务流程节点 Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ProcessNodeExtendDao extends BaseDao<ProcessNodeExtendEntity> {

    List<ProcessNodeExtendEntity> selectByProcessAndNodeType(@Param("processId") long processId,
                                                             @Param("nodeType") String nodeType);

    ProcessNodeExtendEntity selectByTaskId(@Param("taskId") String taskId);

    ProcessNodeExtendEntity selectByNodeIdAndFlowId(@Param("nodeId") String nodeId,
                                                    @Param("flowId") String flowId);

    ProcessNodeExtendEntity selectByProcessAndNodeId(@Param("processId") long processId, @Param("nodeId") String nodeId);

    ProcessNodeExtendEntity selectByProcessAndLinkType( @Param("processId") long processId,
                                                        @Param("linkType") String linkType);
}
