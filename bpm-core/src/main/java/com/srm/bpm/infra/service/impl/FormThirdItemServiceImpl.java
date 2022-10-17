

package com.srm.bpm.infra.service.impl;

import com.srm.bpm.infra.entity.FormThirdItemEntity;
import com.srm.bpm.infra.dao.FormThirdItemDao;
import com.srm.bpm.infra.service.FormThirdItemService;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-07-15
 */
@Service
public class FormThirdItemServiceImpl extends BaseServiceImpl<FormThirdItemDao, FormThirdItemEntity> implements FormThirdItemService {

    @Override
    public List<FormThirdItemEntity> findItemsByProcessId(Long processId) {
        return this.baseMapper.selectItemByProcessId(processId);
    }

    @Override
    public void physicalDeleteByThirdId(Long id) {
        this.baseMapper.physicalDeleteByThirdId(id);
    }
}
