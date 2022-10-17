

package com.srm.bpm.infra.service.impl;

import com.google.common.base.Strings;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.dao.ProcessNodeCcDao;
import com.srm.bpm.infra.entity.ProcessNodeCcEntity;
import com.srm.bpm.infra.service.ProcessNodeCcService;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.common.data.exception.RbException;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

import cn.hutool.core.collection.CollectionUtil;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class ProcessNodeCcServiceImpl extends BaseServiceImpl<ProcessNodeCcDao, ProcessNodeCcEntity> implements ProcessNodeCcService {

    @Override
    public void saveOrUpdate(List<ProcessNodeCcEntity> nodeCcs, long processId) {
        this.remove(Wrappers.lambdaQuery(ProcessNodeCcEntity.class).eq(ProcessNodeCcEntity::getProcessId, processId));
        if (CollectionUtil.isNotEmpty(nodeCcs)) {
            final boolean b = this.saveBatch(nodeCcs);
            if (!b) {
                throw new RbException("insert batch node cc has error!");
            }
        }
    }

    /**
     * 根据流程的id和节点的id查询节点抄送人
     *
     * @param processFlowId 流程的id
     * @param nodeId    节点的id
     * @return 抄送人集合
     */
    @Override
    public List<ProcessNodeCcEntity> findByFlowIdAndNodeId(String processFlowId, String nodeId) {
        if (Strings.isNullOrEmpty(processFlowId) || Strings.isNullOrEmpty(nodeId)) {
            return Collections.emptyList();
        }
        return baseMapper.selectListByProcessIdAndNodeId(processFlowId, nodeId);
    }
}
