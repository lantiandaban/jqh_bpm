

package com.srm.bpm.infra.service;

import com.srm.bpm.infra.entity.ToaFormEntity;
import com.srm.common.base.infra.service.BaseService;

/**
 * <p>
 * 流程表单 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ToaFormService extends BaseService<ToaFormEntity> {

    /**
     * 通过审批单ID获取表单信息
     * @param billId 审批单
     * @return 表单信息
     */
    ToaFormEntity findByBillId(long billId);
}
