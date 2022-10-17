

package com.srm.common.server.log.enums;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public enum LogTypeEnum {
    /**
     * 登录日志
     */
    LOGIN(0),
    /**
     * 操作日志
     */
    OPERATION(1),
    /**
     * 异常日志
     */
    ERROR(2);

    private int value;

    LogTypeEnum(int value) {
        this.value = value;
    }

    public int value() {
        return this.value;
    }
}
