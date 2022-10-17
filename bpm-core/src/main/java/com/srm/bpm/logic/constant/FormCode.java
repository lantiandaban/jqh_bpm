

package com.srm.bpm.logic.constant;


import com.srm.common.util.error.ErrorCode;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public enum FormCode implements ErrorCode {
    /**
     * 必须多选
     */
    MULTI_REQUIRED(91010),
    /**
     * 必须单选
     */
    SIGNLE_REQUIRED(91010),


    ;

    private final int code;

    FormCode(int code) {
        this.code = code;
    }

    @Override
    public int getCode() {
        return this.code;
    }
}
