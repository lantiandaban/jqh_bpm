 

package com.srm.bpm.infra.service;

import java.util.List;

import com.srm.bpm.infra.entity.DatasourceFiledEntity;
import com.srm.common.base.infra.service.BaseService;

/**
 * <p>
 * 数据源字段 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface DatasourceFiledService extends BaseService<DatasourceFiledEntity> {

    List<String> selectFieldsByDatasourceId(Long datasourceId);

}
