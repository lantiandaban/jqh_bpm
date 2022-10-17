

package com.srm.bpm.infra.service.impl;

import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.bpm.infra.dao.ProcessBillTitleDao;
import com.srm.bpm.infra.entity.ProcessBillTitleEntity;
import com.srm.bpm.infra.po.BillTitlePO;
import com.srm.bpm.infra.service.ProcessBillTitleService;

import org.springframework.stereotype.Service;

/**
 * <p>
 * 流程标题规则 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class ProcessBillTitleServiceImpl extends BaseServiceImpl<ProcessBillTitleDao, ProcessBillTitleEntity> implements ProcessBillTitleService {

    /**
     * 根据流程取得标题信息
     *
     * @param processId 流程主键
     * @return 标题信息
     */
    @Override
    public BillTitlePO findByProcessId(long processId) {
        return this.baseMapper.selectByProcessId(processId);
    }
}
