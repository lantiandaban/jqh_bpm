

package com.srm.bpm.infra.dao;

import org.apache.ibatis.annotations.Param;

import com.srm.bpm.infra.entity.ToaFormEntity;
import com.srm.common.base.infra.dao.BaseDao;

/**
 * <p>
 * 流程表单 Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ToaFormDao extends BaseDao<ToaFormEntity> {

    /**
     * 通过审批单主键关联来获取表单信息
     * @param billId 审批单主键
     * @return 表单信息
     */
    ToaFormEntity selectByBillId(@Param("billId") long billId);
}
