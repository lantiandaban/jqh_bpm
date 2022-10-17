

package com.srm.bpm.infra.service;

import com.srm.bpm.infra.entity.BillReadRecordEntity;
import com.srm.common.base.infra.service.BaseService;

/**
 * <p>
 * 审批单阅读表 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface BillReadRecordService extends BaseService<BillReadRecordEntity> {

    /**
     * 写阅读记录
     *
     * @param billId   审批单ID
     * @param userCode 用户编码
     * @return 是否记录成功
     */
    boolean readBillByUserCode(long billId, String userCode);

    /**
     * 删除某个审批单 具体制定人员的阅读记录
     *
     * @param billId   审批单ID
     * @param userCode 员工ID
     * @return 是否删除成功
     */
    void deleteByBillAndEmployeeId(Long billId, String userCode);

    /**
     * 删除审批单全部的查看记录
     *
     * @param billId 审批单id
     * @return 是否成功
     */
    boolean deleteByBillId(long billId);
}
