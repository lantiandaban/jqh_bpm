

package com.srm.bpm.infra.service.impl;

import com.srm.bpm.infra.entity.FormThirdEntity;
import com.srm.bpm.infra.dao.FormThirdDao;
import com.srm.bpm.infra.service.FormThirdService;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-07-15
 */
@Service
public class FormThirdServiceImpl extends BaseServiceImpl<FormThirdDao, FormThirdEntity> implements FormThirdService {

    @Override
    public void physicalDeleteById(Long id) {
        this.baseMapper.physicalDeleteById(id);
    }
}
