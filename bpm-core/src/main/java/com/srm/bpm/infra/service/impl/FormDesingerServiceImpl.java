

package com.srm.bpm.infra.service.impl;

import org.springframework.stereotype.Service;

import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.bpm.infra.dao.FormDesingerDao;
import com.srm.bpm.infra.entity.FormDesingerEntity;
import com.srm.bpm.infra.service.FormDesingerService;

/**
 * <p>
 * 表单设计信息 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class FormDesingerServiceImpl extends BaseServiceImpl<FormDesingerDao, FormDesingerEntity> implements FormDesingerService {

    @Override
    public FormDesingerEntity getByProcessId(long processId) {
        return baseMapper.selectByProcessId(processId);
    }
}
