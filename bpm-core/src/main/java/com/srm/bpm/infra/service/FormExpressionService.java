 

package com.srm.bpm.infra.service;

import java.util.List;

import com.srm.bpm.infra.entity.FormExpressionEntity;
import com.srm.common.base.infra.service.BaseService;
import com.srm.bpm.infra.entity.FormExtensionsEntity;

/**
 * <p>
 * 表单表达式 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface FormExpressionService extends BaseService<FormExpressionEntity> {

    /**
     * 根据业务流程主键获取对应表单的扩展功能
     *
     * @param processId 业务流程主键
     * @return 表单扩展功能集合
     */
    List<FormExtensionsEntity> findByProcessId(long processId);
}
