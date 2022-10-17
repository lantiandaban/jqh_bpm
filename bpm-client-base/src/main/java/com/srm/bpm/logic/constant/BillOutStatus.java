

package com.srm.bpm.logic.constant;

import java.util.Objects;

/**
 * <p>
 * <p>
 * 审批单状态
 * <p>
 * 1. 当审批单填写完成后，保存到草稿中， 状态为 待提交 也就是草稿状态;
 * <p>
 * 2. 当审批单填写完成并点击提交到流程中，流程正在审批中，单子状态为审批中；
 * <p>
 * 3. 当审批单 审批流程结束并通过之后，审批单的状态为 已完成;
 * <p>
 * 4. 当审批单 审批流程结束并被拒绝之后，审批单的状态为 审批拒绝；
 * <p>
 * 5. 当审核单 发起后，然后发起人撤回或者撤销流程后，状态为 已撤销；
 * <p>
 * 6. 当审核单 发起后，流程开始走向归档节点后，状态为 待归档；
 * <p>
 * 7. 当审核单 发起后，流程走到归档节点后，归档人进行归档后， 状态为 已完成；
 * <p>
 * 8. 当审批单被 A审批人打回，审批单据为打回状态，发起人重新填写任何直接到  A审批人审批中;
 *
 * </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public enum BillOutStatus {
    /**
     * 未知状态，如果出现这个状态，表示出现数据或者逻辑业务代码问题
     */
    NONE(-100),
    /**
     * 待提交，草稿状态
     */
    DRAFTS(0),
    /**
     * 审批中
     */
    APPROVAL(1),
    /**
     * 已撤销
     */
    CANCEL(2),
    /**
     * 审批拒绝
     */
    REFUSE(3),
    /**
     * 归档中
     */
    ARCHIVE(4),
    /**
     * 已完成
     */
    COMPLETE(8),
    /**
     * 已删除
     */
    DELETE(9),
    /**
     * 打回
     */
    REPULSE(10);

    private final int status;


    BillOutStatus(int status) {
        this.status = status;
    }

    public static BillOutStatus valueTo(Integer status) {
        if (Objects.isNull(status)) {
            return NONE;
        }
        for (BillOutStatus billStatus : values()) {
            if (billStatus.getStatus() == status) {
                return billStatus;
            }
        }
        return NONE;
    }

    public int getStatus() {
        return status;
    }
}
