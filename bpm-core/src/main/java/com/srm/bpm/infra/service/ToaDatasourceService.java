 

package com.srm.bpm.infra.service;

import com.srm.bpm.infra.entity.ToaDatasourceEntity;
import com.srm.common.base.infra.service.BaseService;

/**
 * <p>
 * 数据源 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ToaDatasourceService extends BaseService<ToaDatasourceEntity> {

    ToaDatasourceEntity findByCode(String table);
}
