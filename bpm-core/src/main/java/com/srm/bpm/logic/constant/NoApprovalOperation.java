 

package com.srm.bpm.logic.constant;

import java.util.Objects;

/**
 * <p> 1:超级管理员处理;2:跳过此步骤;3:不能提交</p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public enum NoApprovalOperation {
    SUPERADMIN(1),
    SKIP(2),
    CANNOTGO(3);
    private final Integer value;

    NoApprovalOperation(Integer val) {
        this.value = val;
    }

    public static NoApprovalOperation forValue(Integer value) {
        if (Objects.isNull(value)) {
            return SUPERADMIN;
        }
        for (NoApprovalOperation approvalOperation : values()) {
            if (approvalOperation.getValue().compareTo(value) == 0) {
                return approvalOperation;
            }
        }
        return SUPERADMIN;
    }

    public Integer getValue() {
        return value;
    }
}
