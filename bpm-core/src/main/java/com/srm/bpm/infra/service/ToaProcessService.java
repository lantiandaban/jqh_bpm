

package com.srm.bpm.infra.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.bpm.infra.entity.ToaProcessEntity;
import com.srm.bpm.infra.po.ProcessDetailPO;
import com.srm.bpm.infra.po.ProcessGridPO;
import com.srm.common.base.infra.service.BaseService;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * <p>
 * 业务流程 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ToaProcessService extends BaseService<ToaProcessEntity> {

    /**
     * 分页查询流程信息
     *
     * @param page 分页参数
     * @return 数据
     */
    List<ProcessGridPO> selectByPaging(Page page, Map<String, Object> params, String bloc,Boolean tenantFlag);

    /**
     * 查询用户可以发起的流程数据
     *
     * @param userCode 用户编码
     * @param orgs     部门编码集合
     * @return 流程数据
     */
    List<ProcessGridPO> findAllByUserCode(String userCode, Set<String> orgs, String bloc,String name);

    /**
     * 获取业务流程明细信息
     *
     * @param processId 业务流程主键
     * @return 业务流程信息
     */
    ProcessDetailPO findDetailById(long processId);

    Optional<ToaProcessEntity> getByFlowId(String flowId);
}
