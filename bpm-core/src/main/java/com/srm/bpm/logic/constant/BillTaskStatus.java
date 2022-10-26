

package com.srm.bpm.logic.constant;

import java.util.Objects;

/**
 * <p> 审批任务状态 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public enum BillTaskStatus {

    /**
     * 未知状态，如果出现这个状态，表示出现数据或者逻辑业务代码问题
     */
    NONE(0),
    /**
     * 审批中
     */
    APPROVAL(1),
    /**
     * 已同意
     */
    AGREE(2),
    /**
     * 已拒绝
     */
    REFUSE(3),
    /**
     * 他人已审批
     */
    OTHER_APPROVAL(4),
    /**
     * 已归档
     */
    ARCHIVED(5),
    /**
     * 已撤销
     */
    CANCEL(6),
    /**
     * 申请已撤销
     */
    APPLY_CANCEL(7),
    /**
     * 填写报销单
     */
    FILL_IN(8),
    /**
     * 审批单重新填写
     */
    REFUSE_FILL_IN(9),
    /**
     * 归档中
     */
    ARCHIVE(10),
    /**
     * 加签
     */
    ENDORSE(11),
    /**
     * 打回
     */
    REPULSE(12),
    /**
     * 自动跳过
     */
    SKIP(13),
    /**
     * 已转办
     */
    TRANSFER(14),
    /**
     * 已移交
     */
    TURN(15),
    
    COMPLATE(16);


    private final int status;


    BillTaskStatus(int status) {
        this.status = status;
    }


    public static BillTaskStatus valueTo(Integer status) {
        if (Objects.isNull(status)) {
            return NONE;
        }
        for (BillTaskStatus billTaskStatus : values()) {
            if (billTaskStatus.getStatus() == status) {
                return billTaskStatus;
            }
        }
        return NONE;
    }

    public int getStatus() {
        return status;
    }
}
