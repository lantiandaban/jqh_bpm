

package com.srm.bpm.infra.service;

import com.srm.bpm.infra.entity.FormDesingerEntity;
import com.srm.common.base.infra.service.BaseService;

/**
 * <p>
 * 表单设计信息 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface FormDesingerService extends BaseService<FormDesingerEntity> {

    FormDesingerEntity getByProcessId(long processId);

}
