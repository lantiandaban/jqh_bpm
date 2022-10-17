 

package com.srm.bpm.logic.constant;

import java.util.Objects;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public enum BillTaskType {
    /**
     * 默认
     */
    DEFAULT(1),
    /**
     * 加签
     */
    ENDORSE(2),
    /**
     * 转办
     */
    TRANSFER(3),
    /**
     * 移交
     */
    TURN(4),
    /**
     * 自动跳转
     */
    SKIP(5),
    ;
    private final int type;

    BillTaskType(int type) {
        this.type = type;
    }

    public static BillTaskType forValue(Integer status) {
        if (Objects.isNull(status)) {
            return null;
        }
        for (BillTaskType enableStatus : values()) {
            if (enableStatus.getValue() == status) {
                return enableStatus;
            }
        }
        return DEFAULT;
    }

    public int getValue() {
        return this.type;
    }
}
