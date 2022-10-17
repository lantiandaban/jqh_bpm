

package com.srm.bpm.logic.service;

import com.srm.bpm.infra.entity.BillTaskEntity;

import java.util.List;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface FlowMsgLogic {
    void sendMsg(List<BillTaskEntity> billTaskEntities);
    void sendMsg(List<BillTaskEntity> billTaskEntities,boolean syncFlag);
}
