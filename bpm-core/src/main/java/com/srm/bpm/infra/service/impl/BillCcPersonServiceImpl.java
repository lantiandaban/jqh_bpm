 

package com.srm.bpm.infra.service.impl;

import com.google.common.base.Strings;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;

import org.springframework.stereotype.Service;

import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.bpm.infra.dao.BillCcPersonDao;
import com.srm.bpm.infra.entity.BillCcPersonEntity;
import com.srm.bpm.infra.service.BillCcPersonService;

/**
 * <p>
 * 审批单抄送人信息 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class BillCcPersonServiceImpl extends BaseServiceImpl<BillCcPersonDao, BillCcPersonEntity> implements BillCcPersonService {

    /**
     * 查询是否为抄送人，指定的审批单和员工
     *
     * @param billId   审批单主键
     * @param userCode 用户编码
     * @return 抄送信息
     */
    @Override
    public BillCcPersonEntity findByEmployeeAndBill(long billId, String userCode) {
        if (billId <= 0 || Strings.isNullOrEmpty(userCode)) {
            return null;
        }
        return this.getOne(Wrappers.lambdaQuery(BillCcPersonEntity.class).eq(BillCcPersonEntity::getBillId, billId)
                .eq(BillCcPersonEntity::getUserCode, userCode));
    }
}
