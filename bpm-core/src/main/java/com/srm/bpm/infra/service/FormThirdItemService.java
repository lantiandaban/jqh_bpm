 

package com.srm.bpm.infra.service;

import com.srm.bpm.infra.entity.FormThirdItemEntity;
import com.srm.common.base.infra.service.BaseService;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author JT
 * @since 2021-07-15
 */
public interface FormThirdItemService extends BaseService<FormThirdItemEntity> {

    List<FormThirdItemEntity> findItemsByProcessId(Long processId);

    void physicalDeleteByThirdId(Long id);
}
