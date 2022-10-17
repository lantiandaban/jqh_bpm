

package com.srm.bpm.infra.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.dao.ProcessNodeApproverDao;
import com.srm.bpm.infra.entity.ProcessNodeApproverEntity;
import com.srm.bpm.infra.service.ProcessNodeApproverService;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.common.data.exception.RbException;

import org.springframework.stereotype.Service;

import java.util.List;

import cn.hutool.core.collection.CollectionUtil;

/**
 * <p>
 * 节点审批人 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class ProcessNodeApproverServiceImpl extends BaseServiceImpl<ProcessNodeApproverDao, ProcessNodeApproverEntity> implements ProcessNodeApproverService {

    /**
     * 保存节点审批人配置
     *
     * @param nodeApprovers 审批人配置
     * @param processId     业务流程主键
     */
    @Override
    public void saveOrUpdate(List<ProcessNodeApproverEntity> nodeApprovers, long processId) {
        this.remove(Wrappers.lambdaQuery(ProcessNodeApproverEntity.class).eq(ProcessNodeApproverEntity::getProcessId, processId));
        if (CollectionUtil.isNotEmpty(nodeApprovers)) {
            final boolean b = this.saveBatch(nodeApprovers);
            if (!b) {
                throw new RbException("insert batch node approvers has error!");
            }
        }
    }

    /**
     * 根据流程标记和节点 取得节点的审批人配置
     *
     * @param flowId 流程标记
     * @param nodeId 节点ID
     * @return 审批人配置
     */
    @Override
    public List<ProcessNodeApproverEntity> findByFlowIdAndNodeId(String flowId, String nodeId) {
        return this.baseMapper.selectByFlowIdAndNodeId(flowId,nodeId);
    }


    @Override
    public ProcessNodeApproverEntity getByIdExludDel(Long approverId) {
        return this.baseMapper.getByIdExludDel(approverId);
    }
}
