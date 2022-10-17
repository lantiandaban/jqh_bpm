

package com.srm.bpm.infra.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.dao.ProcessNodeConnectionDao;
import com.srm.bpm.infra.entity.ProcessNodeConnectionEntity;
import com.srm.bpm.infra.service.ProcessNodeConnectionService;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.common.data.exception.RbException;

import org.springframework.stereotype.Service;

import java.util.List;

import cn.hutool.core.collection.CollectionUtil;

/**
 * <p>
 * 节点连线信息 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class ProcessNodeConnectionServiceImpl extends BaseServiceImpl<ProcessNodeConnectionDao, ProcessNodeConnectionEntity> implements ProcessNodeConnectionService {

    @Override
    public void saveOrUpdate(List<ProcessNodeConnectionEntity> nodeConnections, long processId) {
        this.remove(Wrappers.lambdaQuery(ProcessNodeConnectionEntity.class).eq(ProcessNodeConnectionEntity::getProcessId, processId));
        if (CollectionUtil.isNotEmpty(nodeConnections)) {
            final boolean b = this.saveBatch(nodeConnections);
            if (!b) {
                throw new RbException("insert batch node connection has error!");
            }
        }
    }
}
