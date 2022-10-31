 

package com.srm.bpm.logic.listener;

import com.google.common.base.MoreObjects;
import com.google.common.primitives.Longs;

import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.service.ToaBillService;
import com.srm.bpm.logic.service.BillLogic;
import com.srm.config.SpringContextHolder;

import org.activiti.engine.delegate.BaseExecutionListener;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.ExecutionListener;
import org.activiti.engine.impl.persistence.entity.ExecutionEntityImpl;
import org.apache.commons.lang3.StringUtils;

import java.util.Objects;

import lombok.extern.slf4j.Slf4j;

/**
 * <p> 整个流程实例的监听器 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Slf4j
public class ProcessBillListener implements ExecutionListener {
    private static final long serialVersionUID = 1720995327038825119L;

    @Override
    public void notify(DelegateExecution execution) {
        log.debug("进入了ProcessBillListener");
        String eventName = execution.getEventName();
        if (StringUtils.equals(eventName, BaseExecutionListener.EVENTNAME_END)) {
            // 结束事件
            final Object varAction = ((ExecutionEntityImpl) execution).getProcessInstance().getVariable("var_action");

            final String action = Objects.isNull(varAction) ? "" : (String) varAction;
            final String businessKey = execution.getProcessInstanceBusinessKey();
            // 更新审批单为结束
            if (StringUtils.isNotEmpty(businessKey)) {
                long billId = MoreObjects.firstNonNull(Longs.tryParse(businessKey), 0L);
                log.debug("ProcessBillListener流程结束回调:{}",billId);
                if (billId > 0) {
                    final BillLogic billService = SpringContextHolder.getBean(BillLogic.class);
                    final ToaBillService toaBillService = SpringContextHolder.getBean(ToaBillService.class);
                    final ToaBillEntity byId = toaBillService.getById(billId);
                    billService.complete(byId, action);
                }
            }
        }
    }
}
