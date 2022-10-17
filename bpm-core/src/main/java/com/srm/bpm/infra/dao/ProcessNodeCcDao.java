

package com.srm.bpm.infra.dao;

import org.apache.ibatis.annotations.Param;

import java.util.List;

import com.srm.bpm.infra.entity.ProcessNodeCcEntity;
import com.srm.common.base.infra.dao.BaseDao;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ProcessNodeCcDao extends BaseDao<ProcessNodeCcEntity> {

    List<ProcessNodeCcEntity> selectListByProcessIdAndNodeId(@Param("processId") String processId,
                                                             @Param("nodeId") String nodeId);
}
