 

package com.srm.common.base.log;

import com.srm.common.data.constant.BaseEnumValue;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public enum LogType implements BaseEnumValue {
    OK(1), ERROR(2);


    private final int value;

    LogType(int value) {
        this.value = value;
    }

    @Override
    public int getValue() {
        return this.value;
    }
}
