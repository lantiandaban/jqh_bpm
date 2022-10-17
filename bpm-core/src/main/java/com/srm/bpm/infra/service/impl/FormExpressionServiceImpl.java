

package com.srm.bpm.infra.service.impl;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

import com.srm.bpm.infra.entity.FormExpressionEntity;
import com.srm.bpm.infra.service.FormExpressionService;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.bpm.infra.dao.FormExpressionDao;
import com.srm.bpm.infra.entity.FormExtensionsEntity;

/**
 * <p>
 * 表单表达式 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class FormExpressionServiceImpl extends BaseServiceImpl<FormExpressionDao, FormExpressionEntity> implements FormExpressionService {

    /**
     * 根据业务流程主键获取对应表单的扩展功能
     *
     * @param processId 业务流程主键
     * @return 表单扩展功能集合
     */
    @Override
    public List<FormExtensionsEntity> findByProcessId(long processId) {
        if(processId <= 0){
            return Collections.emptyList();
        }
        return this.baseMapper.selectByProcessId(processId);
    }
}
