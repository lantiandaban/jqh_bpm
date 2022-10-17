

package com.srm.bpm.infra.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.bpm.infra.dao.ToaDatasourceDao;
import com.srm.bpm.infra.entity.ToaDatasourceEntity;
import com.srm.bpm.infra.service.ToaDatasourceService;

import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * <p>
 * 数据源 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class ToaDatasourceServiceImpl extends BaseServiceImpl<ToaDatasourceDao, ToaDatasourceEntity> implements ToaDatasourceService {

    @Override
    public ToaDatasourceEntity findByCode(String table) {
        final Optional<ToaDatasourceEntity> unique = unique(Wrappers.lambdaQuery(ToaDatasourceEntity.class).eq(ToaDatasourceEntity::getCode, table));
        if (unique.isPresent()) {
            return unique.get();
        }
        return null;
    }
}
