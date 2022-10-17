

package com.srm.bpm.infra.dao;

import com.srm.common.base.infra.dao.BaseDao;
import com.srm.bpm.infra.entity.ProcessNodeApproverEntity;

import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 节点审批人 Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ProcessNodeApproverDao extends BaseDao<ProcessNodeApproverEntity> {

    List<ProcessNodeApproverEntity> selectByFlowIdAndNodeId(@Param("flowId")String processFlowId, @Param
            ("nodeId")String nodeId);
    ProcessNodeApproverEntity getByIdExludDel(@Param("id") Long approverId);
}
