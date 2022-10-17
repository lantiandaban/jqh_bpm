

package com.srm.bpm.infra.service.impl;

import org.springframework.stereotype.Service;

import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.bpm.infra.dao.ToaFormDao;
import com.srm.bpm.infra.entity.ToaFormEntity;
import com.srm.bpm.infra.service.ToaFormService;

/**
 * <p>
 * 流程表单 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class ToaFormServiceImpl extends BaseServiceImpl<ToaFormDao, ToaFormEntity> implements ToaFormService {

    /**
     * 通过审批单ID获取表单信息
     *
     * @param billId 审批单
     * @return 表单信息
     */
    @Override
    public ToaFormEntity findByBillId(long billId) {
        if (billId <= 0) {
            return null;
        }
        return baseMapper.selectByBillId(billId);
    }
}
