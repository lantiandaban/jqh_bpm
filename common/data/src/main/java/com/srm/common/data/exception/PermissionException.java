

package com.srm.common.data.exception;

import java.util.Collections;

import com.srm.common.util.error.BasisCode;
import com.srm.common.util.error.ErrorCode;


/**
 * 权限异常
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
public class PermissionException extends RuntimeException {
    private static final long serialVersionUID = -509330004392078791L;


    private final Object data;
    private final String msg;

    private final ErrorCode code;

    public PermissionException(Object data, String msg) {
        super();
        this.data = data;
        this.msg = msg;
        this.code = BasisCode.FORBIDDEN;
    }

    public PermissionException(String msg, ErrorCode code) {
        super();
        this.data = Collections.emptyMap();
        this.msg = msg;
        this.code = code;
    }

    public PermissionException(Object data, String msg, ErrorCode code) {
        super();
        this.data = data;
        this.msg = msg;
        this.code = code;
    }

    public PermissionException(String message, Object data, String msg, ErrorCode code) {
        super(message);
        this.data = data;
        this.msg = msg;
        this.code = code;
    }

    public PermissionException(String message, Throwable cause, Object data, String msg, ErrorCode code) {
        super(message, cause);
        this.data = data;
        this.msg = msg;
        this.code = code;
    }

    public PermissionException(Throwable cause, Object data, String msg, ErrorCode code) {
        super(cause);
        this.data = data;
        this.msg = msg;
        this.code = code;
    }

    public ErrorCode getCode() {
        return code;
    }


    public Object getData() {
        return data;
    }

    public String getMsg() {
        return msg;
    }
}
