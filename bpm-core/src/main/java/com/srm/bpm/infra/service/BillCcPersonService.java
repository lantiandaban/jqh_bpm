 

package com.srm.bpm.infra.service;

import com.srm.bpm.infra.entity.BillCcPersonEntity;
import com.srm.common.base.infra.service.BaseService;

/**
 * <p>
 * 审批单抄送人信息 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface BillCcPersonService extends BaseService<BillCcPersonEntity> {

    /**
     * 查询是否为抄送人，指定的审批单和员工
     * @param billId 审批单主键
     * @param userCode 用户编码
     * @return 抄送信息
     */
    BillCcPersonEntity findByEmployeeAndBill(long billId, String userCode);

}
