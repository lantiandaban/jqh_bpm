

package com.srm.bpm.infra.service;

import com.srm.bpm.infra.entity.FormValidationEntity;
import com.srm.common.base.infra.service.BaseService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author JT
 * @since 2021-07-26
 */
public interface FormValidationService extends BaseService<FormValidationEntity> {

    FormValidationEntity findByProcessId(long processId);


}
