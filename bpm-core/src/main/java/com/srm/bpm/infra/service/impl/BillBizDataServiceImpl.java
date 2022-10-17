

package com.srm.bpm.infra.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.dao.BillBizDataDao;
import com.srm.bpm.infra.entity.BillBizDataEntity;
import com.srm.bpm.infra.service.BillBizDataService;
import com.srm.bpm.logic.context.BillDataContext;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.common.data.exception.RbException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import cn.hutool.core.collection.CollectionUtil;

/**
 * <p>
 * 审批业务数据 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class BillBizDataServiceImpl extends BaseServiceImpl<BillBizDataDao, BillBizDataEntity> implements BillBizDataService {

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveByBillData(BillDataContext billDataValue) {
        // 先移除
        this.remove(Wrappers.lambdaQuery(BillBizDataEntity.class).eq(BillBizDataEntity::getBillId, billDataValue.getId()));
        final List<BillBizDataEntity> bizDataList = billDataValue.getBizDataList();
        if (CollectionUtil.isNotEmpty(bizDataList)) {
            final boolean bizDataState = this.saveBatch(bizDataList);
            if (!bizDataState) {
                throw new RbException("biz data has error!");
            }
        }
    }
}
