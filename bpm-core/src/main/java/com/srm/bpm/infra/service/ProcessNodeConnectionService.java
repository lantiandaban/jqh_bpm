

package com.srm.bpm.infra.service;

import java.util.List;

import com.srm.bpm.infra.entity.ProcessNodeConnectionEntity;
import com.srm.common.base.infra.service.BaseService;

/**
 * <p>
 * 节点连线信息 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ProcessNodeConnectionService extends BaseService<ProcessNodeConnectionEntity> {

    void saveOrUpdate(List<ProcessNodeConnectionEntity> nodeConnections, long processId);
}
