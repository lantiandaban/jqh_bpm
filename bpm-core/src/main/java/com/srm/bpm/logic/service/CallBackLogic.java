

package com.srm.bpm.logic.service;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface CallBackLogic {
    /**
     * 回调
     *
     * @param processId 流程id
     * @param billId    审批单id
     * @param status    状态
     */
    void callBack(Long processId, Long billId, Integer status);
}
