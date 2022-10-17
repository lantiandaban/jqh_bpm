

package com.srm.bpm.infra.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.bpm.infra.dao.DatasourceFiledDao;
import com.srm.bpm.infra.entity.DatasourceFiledEntity;
import com.srm.bpm.infra.service.DatasourceFiledService;

/**
 * <p>
 * 数据源字段 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class DatasourceFiledServiceImpl extends BaseServiceImpl<DatasourceFiledDao, DatasourceFiledEntity> implements DatasourceFiledService {

    @Override
    public List<String> selectFieldsByDatasourceId(Long datasourceId) {
        final List<DatasourceFiledEntity> filedEntities =
                list(Wrappers.lambdaQuery(DatasourceFiledEntity.class).eq(DatasourceFiledEntity::getDatasourceId, datasourceId));
        return filedEntities.stream().map(DatasourceFiledEntity::getFiledCode).collect(Collectors.toList());
    }
}
