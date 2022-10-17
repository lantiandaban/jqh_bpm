

package com.srm.common.server.log.enums;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public enum LoginOperationEnum {
    /**
     * 用户登录
     */
    LOGIN(0),
    /**
     * 用户退出
     */
    LOGOUT(1);

    private int value;

    LoginOperationEnum(int value) {
        this.value = value;
    }

    public int value() {
        return this.value;
    }
}
