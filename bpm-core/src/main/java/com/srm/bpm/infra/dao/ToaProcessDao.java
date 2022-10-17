

package com.srm.bpm.infra.dao;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.bpm.infra.entity.ToaProcessEntity;
import com.srm.common.base.infra.dao.BaseDao;
import com.srm.bpm.infra.po.ProcessDetailPO;
import com.srm.bpm.infra.po.ProcessGridPO;

import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * <p>
 * 业务流程 Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ToaProcessDao extends BaseDao<ToaProcessEntity> {

    /**
     * 分页查询流程信息
     *
     * @param page 分页参数
     * @return 数据
     */
    List<ProcessGridPO> selectByPaging(Page page, @Param("param") Map<String, Object> params, @Param("bloc") String bloc,@Param("tenantFlag") boolean tenantFlag);

    /**
     * 查询用户可以发起的流程数据
     *
     * @param userCode 用户编码
     * @return 流程数据
     */
    List<ProcessGridPO> selectAllByUserCode(@Param("userCode") String userCode,
                                            @Param("orgs") Set<String> orgs,
                                            @Param("bloc") String bloc,
                                            @Param("name") String name,
                                            @Param("bool") Boolean tenant
    );

    /**
     * 获取业务流程明细信息
     *
     * @param processId 业务流程主键
     * @return 业务流程信息
     */
    ProcessDetailPO selectDetailById(@Param("processId") long processId);
}
