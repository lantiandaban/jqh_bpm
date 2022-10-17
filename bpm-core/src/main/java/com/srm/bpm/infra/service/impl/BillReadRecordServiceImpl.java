 

package com.srm.bpm.infra.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.bpm.infra.dao.BillReadRecordDao;
import com.srm.bpm.infra.entity.BillReadRecordEntity;
import com.srm.bpm.infra.service.BillReadRecordService;
import com.srm.common.util.datetime.DateTimeUtil;

/**
 * <p>
 * 审批单阅读表 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class BillReadRecordServiceImpl extends BaseServiceImpl<BillReadRecordDao, BillReadRecordEntity> implements BillReadRecordService {

    /**
     * 写阅读记录
     *
     * @param billId   审批单ID
     * @param userCode 用户编码
     * @return 是否记录成功
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = Exception.class)
    public boolean readBillByUserCode(long billId, String userCode) {
        BillReadRecordEntity billReadRecord;
        billReadRecord = getOne(Wrappers.lambdaQuery(BillReadRecordEntity.class).eq(BillReadRecordEntity::getBillId, billId).eq(BillReadRecordEntity::getUserCode, userCode));
        if (billReadRecord == null) {
            final int readTime = DateTimeUtil.unixTime();
            billReadRecord = new BillReadRecordEntity();
            billReadRecord.setBillId(billId);
            billReadRecord.setUserCode(userCode);
            billReadRecord.setCreationTime(LocalDateTime.now());
            billReadRecord.setReadTime(readTime);

            return insert(billReadRecord);
        }
        return true;
    }

    /**
     * 删除某个审批单 具体制定人员的阅读记录
     *
     * @param billId   审批单ID
     * @param userCode 员工ID
     * @return 是否删除成功
     */
    @Override
    public void deleteByBillAndEmployeeId(Long billId, String userCode) {
        this.remove(Wrappers.lambdaQuery(BillReadRecordEntity.class).eq(BillReadRecordEntity::getBillId, billId).eq(BillReadRecordEntity::getUserCode, userCode));
    }

    /**
     * 删除审批单全部的查看记录
     *
     * @param billId 审批单id
     * @return 是否成功
     */
    @Override
    public boolean deleteByBillId(long billId) {
        this.remove(Wrappers.lambdaQuery(BillReadRecordEntity.class).eq(BillReadRecordEntity::getBillId, billId));
        return true;
    }
}
