

package com.srm.bpm.infra.dao;

import com.srm.bpm.infra.entity.ProcessBillTitleEntity;
import com.srm.common.base.infra.dao.BaseDao;
import com.srm.bpm.infra.po.BillTitlePO;

/**
 * <p>
 * 流程标题规则 Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ProcessBillTitleDao extends BaseDao<ProcessBillTitleEntity> {

    BillTitlePO selectByProcessId(long processId);
}
