 

package com.srm.bpm.infra.service;

import com.srm.bpm.infra.entity.FormThirdEntity;
import com.srm.common.base.infra.service.BaseService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author JT
 * @since 2021-07-15
 */
public interface FormThirdService extends BaseService<FormThirdEntity> {

    void physicalDeleteById(Long id);

}
