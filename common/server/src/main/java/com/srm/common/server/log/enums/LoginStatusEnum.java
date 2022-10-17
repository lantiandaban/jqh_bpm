

package com.srm.common.server.log.enums;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public enum LoginStatusEnum {
    /**
     * 失败
     */
    FAIL(0),
    /**
     * 成功
     */
    SUCCESS(1),
    /**
     * 账号已锁定
     */
    LOCK(2);

    private int value;

    LoginStatusEnum(int value) {
        this.value = value;
    }

    public int value() {
        return this.value;
    }
}
