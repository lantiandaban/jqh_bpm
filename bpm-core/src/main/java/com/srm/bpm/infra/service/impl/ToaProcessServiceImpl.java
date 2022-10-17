

package com.srm.bpm.infra.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.bpm.infra.dao.ToaProcessDao;
import com.srm.bpm.infra.entity.ToaProcessEntity;
import com.srm.bpm.infra.po.ProcessDetailPO;
import com.srm.bpm.infra.po.ProcessGridPO;
import com.srm.bpm.infra.service.ToaProcessService;
import com.srm.config.TenantProperties;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import lombok.RequiredArgsConstructor;

/**
 * <p>
 * 业务流程 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
@RequiredArgsConstructor
public class ToaProcessServiceImpl extends BaseServiceImpl<ToaProcessDao, ToaProcessEntity> implements ToaProcessService {
    private final TenantProperties tenantProperties;
    /**
     * 分页查询流程信息
     *
     * @param page 分页参数
     * @return 数据
     */
    @Override
    public List<ProcessGridPO> selectByPaging(Page page, Map<String, Object> params, String bloc,Boolean tenantFlag) {
        return this.baseMapper.selectByPaging(page,params,bloc,tenantFlag);
    }

    /**
     * 查询用户可以发起的流程数据
     *
     * @param userCode 用户编码
     * @return 流程数据
     */
    @Override
    public List<ProcessGridPO> findAllByUserCode(String userCode, Set<String> orgs, String bloc,String name) {
        return this.baseMapper.selectAllByUserCode(userCode,orgs,bloc,name,tenantProperties.getEnable());
    }

    /**
     * 获取业务流程明细信息
     *
     * @param processId 业务流程主键
     * @return 业务流程信息
     */
    @Override
    public ProcessDetailPO findDetailById(long processId) {
        return this.baseMapper.selectDetailById(processId);
    }

    @Override
    public Optional<ToaProcessEntity> getByFlowId(String flowId) {
        return unique(Wrappers.lambdaQuery(ToaProcessEntity.class).eq(ToaProcessEntity::getFlowId,flowId));
    }
}
