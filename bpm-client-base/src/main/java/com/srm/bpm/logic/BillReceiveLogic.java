

package com.srm.bpm.logic;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillReceiveLogic {
    /**
     * 执行回调方法
     *
     * @param processId 审批流程id
     * @param billId    审批单id
     * @param status    状态
     */
    void execute(Long processId, Long billId, Integer status);

    /**
     * 流程的id，使用逗号隔开表示多个
     * @return 服务的id
     */
    String getServiceId();
}
