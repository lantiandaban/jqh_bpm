

package com.srm.bpm.logic.service;

import org.apache.commons.lang3.tuple.Pair;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillNextNodeLogic {
    /**
     * 审批单提交是否需要手动选择下一个节点审批人
     *
     * @param processId  流程滴id
     * @param employeeId 员工的id
     * @param formData   审批单的数据
     * @return 是否手动(1 : 手动 ; 0 : 不是)
     */
    Pair<Integer, String> submitNextManualFlag(Long processId, String employeeId, String formData);

    /**
     * 审批的时候获取下一个节点是否是手动
     *
     * @param taskId   任务的id
     * @param billId   审批单的id
     * @param formData 表单额数据
     * @return 是否手动(1 : 手动 ; 0 : 不是)
     */
    Pair<Integer, String> approvalNextManualFlag(String taskId,
                                                 Long billId,
                                                 String formData);
}
