

package com.srm.bpm.infra.service.impl;

import com.google.common.base.Optional;
import com.google.common.base.Strings;

import com.baomidou.mybatisplus.core.toolkit.StringPool;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.dao.ProcessNodeExtendDao;
import com.srm.bpm.infra.entity.ProcessNodeExtendEntity;
import com.srm.bpm.infra.service.ProcessNodeExtendService;
import com.srm.bpm.logic.constant.BpmnConst;
import com.srm.bpm.logic.constant.NodeLinkType;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.common.data.exception.RbException;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

import cn.hutool.core.collection.CollectionUtil;

/**
 * <p>
 * 业务流程节点 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class ProcessNodeExtendServiceImpl extends BaseServiceImpl<ProcessNodeExtendDao, ProcessNodeExtendEntity> implements ProcessNodeExtendService {

    @Override
    public void saveOrUpdate(List<ProcessNodeExtendEntity> nodeExtends, long processId) {
        this.remove(Wrappers.lambdaQuery(ProcessNodeExtendEntity.class).eq(ProcessNodeExtendEntity::getProcessId, processId));
        if (CollectionUtil.isNotEmpty(nodeExtends)) {
            final boolean b = this.saveBatch(nodeExtends);
            if (!b) {
                throw new RbException("insert batch node extend has error!");
            }
        }
    }

    /**
     * 通过业务流程ID 获取节点配置信息
     *
     * @param processId 业务流程主键
     * @return 节点配置信息
     */
    @Override
    public List<ProcessNodeExtendEntity> findTaskNodeByProcess(long processId) {
        if (processId <= 0) {
            return Collections.emptyList();
        }
        return baseMapper.selectByProcessAndNodeType(processId, BpmnConst.NODE_TASK);
    }

    /**
     * 通过审批任务ID获取节点信息
     *
     * @param taskId 审批任务ID
     * @return 节点配置
     */
    @Override
    public Optional<ProcessNodeExtendEntity> findByTaskId(String taskId) {
        if (Strings.isNullOrEmpty(taskId)) {
            return Optional.absent();
        }
        final ProcessNodeExtendEntity nodeExtend = baseMapper.selectByTaskId(taskId);
        if (nodeExtend == null) {
            return Optional.absent();
        }

        return Optional.of(nodeExtend);
    }

    @Override
    public Optional<ProcessNodeExtendEntity> findByFlowIdAndNodeId(String nodeId, String flowId) {
        if (Strings.isNullOrEmpty(nodeId) || Strings.isNullOrEmpty(flowId)) {
            return Optional.absent();
        }
        final ProcessNodeExtendEntity nodeExtend = this.baseMapper.selectByNodeIdAndFlowId(nodeId, flowId);
        if (nodeExtend == null) {
            return Optional.absent();
        }
        return Optional.of(nodeExtend);
    }

    /**
     * 根据业务流程Id和任务节点ID查询节点配置信息
     *
     * @param processId 业务流程主键
     * @param nodeId    节点ID
     * @return 节点配置
     */
    @Override
    public Optional<ProcessNodeExtendEntity> findByNodeIdAndProcessId(long processId, String nodeId) {
        if (Strings.isNullOrEmpty(nodeId)) {
            return Optional.absent();
        }

        final ProcessNodeExtendEntity nodeExtend = baseMapper.selectByProcessAndNodeId(processId, nodeId);
        if (nodeExtend == null) {
            return Optional.absent();
        }

        return Optional.of(nodeExtend);
    }

    /**
     * 根据node类型和流程id查询NodeId
     *
     * @param processId 业务流程主键
     * @param linkType  节点类型
     * @return 节点ID
     */
    @Override
    public String findTaskNodeIdByProcessAndLinkType(long processId, NodeLinkType linkType) {
        ProcessNodeExtendEntity nodeExtends = baseMapper.selectByProcessAndLinkType(processId, linkType.name());
        if (null == nodeExtends) {
            return StringPool.EMPTY;
        }
        String nodeId = nodeExtends.getNodeId();
        if (Strings.isNullOrEmpty(nodeId)) {
            return StringPool.EMPTY;
        }
        return nodeId;
    }
}
