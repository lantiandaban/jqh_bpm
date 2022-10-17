

package com.srm.bpm.infra.service.impl;

import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.bpm.infra.dao.FormValidationDao;
import com.srm.bpm.infra.entity.FormValidationEntity;
import com.srm.bpm.infra.service.FormValidationService;

import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-07-26
 */
@Service
public class FormValidationServiceImpl extends BaseServiceImpl<FormValidationDao, FormValidationEntity> implements FormValidationService {

    @Override
    public FormValidationEntity findByProcessId(long processId) {
        return this.baseMapper.selectByProcessId(processId);
    }
}
