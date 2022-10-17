

package com.srm.bpm.infra.service;

import com.srm.bpm.infra.entity.BillBizDataEntity;
import com.srm.bpm.logic.context.BillDataContext;
import com.srm.common.base.infra.service.BaseService;

/**
 * <p>
 * 审批业务数据 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface BillBizDataService extends BaseService<BillBizDataEntity> {

    void saveByBillData(BillDataContext billDataValue);

}
