

package com.srm.common.data.exception;


import com.srm.common.util.error.ErrorCode;

/**
 * TOKEN 访问过期
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
public class ExpiredTokenException extends RuntimeException {
    private static final long serialVersionUID = 2217287230611229639L;

    private final String msg;

    private final ErrorCode code;

    public ExpiredTokenException(String msg, ErrorCode code) {
        super(msg);
        this.msg = msg;
        this.code = code;
    }


    public ErrorCode getCode() {
        return code;
    }


    public String getMsg() {
        return msg;
    }
}
