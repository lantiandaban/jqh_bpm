

package com.srm.bpm.infra.service;

import com.srm.bpm.infra.entity.ProcessBillTitleEntity;
import com.srm.common.base.infra.service.BaseService;
import com.srm.bpm.infra.po.BillTitlePO;

/**
 * <p>
 * 流程标题规则 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ProcessBillTitleService extends BaseService<ProcessBillTitleEntity> {

    /**
     * 根据流程取得标题信息
     *
     * @param processId 流程主键
     * @return 标题信息
     */
    BillTitlePO findByProcessId(long processId);
}
