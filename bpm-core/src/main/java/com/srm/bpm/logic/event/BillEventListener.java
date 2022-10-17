

package com.srm.bpm.logic.event;

import com.google.common.base.MoreObjects;
import com.google.common.eventbus.EventBus;
import com.google.common.eventbus.Subscribe;

import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.service.ToaBillService;
import com.srm.bpm.logic.constant.BillStatus;
import com.srm.bpm.logic.service.CallBackLogic;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

import javax.annotation.PostConstruct;

import lombok.RequiredArgsConstructor;


/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Component
@RequiredArgsConstructor
public class BillEventListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(BillEventListener.class);
    private final ToaBillService billService;
    private final CallBackLogic callBackLogic;

    private final EventBus eventBus;
    /**
     *  在事件总线中注册
     */
    @PostConstruct
    public void init(){
        eventBus.register(this);
    }

    @Subscribe
    public void accept(BillRefuseEvent refuseEvent) {
//        if (LOGGER.isDebugEnabled()) {
            LOGGER.info("bill refuse event has accept! the event data is {}", refuseEvent);
//        }

        ToaBillEntity bill = new ToaBillEntity();
        bill.setId(refuseEvent.getBillId());
        bill.setStatus(BillStatus.REFUSE.getStatus());
        bill.setUpdateTime(LocalDateTime.now());
        billService.updateById(bill);
        //拒绝需要回调
        callBackLogic.callBack(refuseEvent.getProcessId(),refuseEvent.getBillId(), BillStatus.REFUSE.getStatus());
    }

    @Subscribe
    public void accept(BillRepulseEvent refuseEvent) {
//        if (LOGGER.isDebugEnabled()) {
        LOGGER.info("bill refuse event has accept! the event data is {}", refuseEvent);
//        }

        //退回需要回调
        callBackLogic.callBack(refuseEvent.getProcessId(),refuseEvent.getBillId(),
                BillStatus.REPULSE.getStatus());
    }

    @Subscribe
    public void accept(BillAgreeEvent agreeEvent) {
//        if (LOGGER.isDebugEnabled()) {
            LOGGER.info("bill agree event has accept! the event data is {}", agreeEvent);
//        }
        final ToaBillEntity bill = billService.getById(agreeEvent.getBillId());
        final int status = MoreObjects.firstNonNull(bill.getStatus(), 0);
        BillStatus billStatus = BillStatus.valueTo(status);
        if (billStatus.equals(BillStatus.REFUSE)) {
            bill.setId(agreeEvent.getBillId());
            bill.setStatus(BillStatus.APPROVAL.getStatus());
            bill.setUpdateTime(LocalDateTime.now());
            billService.updateById(bill);
        }
    }
}
