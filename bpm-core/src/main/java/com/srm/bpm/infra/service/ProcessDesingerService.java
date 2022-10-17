

package com.srm.bpm.infra.service;

import com.srm.bpm.infra.entity.ProcessDesingerEntity;
import com.srm.bpm.logic.vo.ProcessDesingerVO;
import com.srm.common.base.infra.service.BaseService;

/**
 * <p>
 * 流程设计信息 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ProcessDesingerService extends BaseService<ProcessDesingerEntity> {

    void saveOrUpdateByProcess(long processId, String processDesingerJSON, ProcessDesingerVO processDesingerVO);
}
