

package com.srm.bpm.infra.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.dao.ProcessDesingerDao;
import com.srm.bpm.infra.entity.ProcessDesingerEntity;
import com.srm.bpm.infra.service.ProcessDesingerService;
import com.srm.bpm.logic.vo.ProcessDesingerVO;
import com.srm.bpm.logic.error.BillCode;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.common.data.exception.RbException;

import org.springframework.stereotype.Service;

/**
 * <p>
 * 流程设计信息 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class ProcessDesingerServiceImpl extends BaseServiceImpl<ProcessDesingerDao, ProcessDesingerEntity> implements ProcessDesingerService {

    @Override
    public void saveOrUpdateByProcess(long processId, String processDesingerJSON, ProcessDesingerVO processDesingerVO) {
        ProcessDesingerEntity desinger = this.getOne(Wrappers.lambdaQuery(ProcessDesingerEntity.class).eq(ProcessDesingerEntity::getProcessId, processId));
        if (desinger == null) {
            desinger = new ProcessDesingerEntity();
            desinger.setProcessId(processId);
            desinger.setProcessXml(processDesingerVO.getXml());
            desinger.setDesingerJson(processDesingerJSON);
            final boolean desingerSaveState = this.insert(desinger);
            if (!desingerSaveState) {
                throw new RbException(BillCode.PROCESS_DESIGN_SAVE_ERROR);
            }
        } else {
            desinger.setProcessXml(processDesingerVO.getXml());
            desinger.setDesingerJson(processDesingerJSON);
            final boolean desingerUpdateState = this.updateById(desinger);
            if (!desingerUpdateState) {
                throw new RbException(BillCode.PROCESS_DESIGN_SAVE_ERROR);
            }
        }
    }
}
