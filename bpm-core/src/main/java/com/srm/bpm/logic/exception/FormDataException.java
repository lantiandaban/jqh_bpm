

package com.srm.bpm.logic.exception;


import com.srm.common.util.error.ErrorCode;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public class FormDataException extends RuntimeException {

    private static final long serialVersionUID = 2360453866408822513L;
    private final ErrorCode errorCode;

    public FormDataException(ErrorCode errorCode) {
        super();
        this.errorCode = errorCode;
    }


    public FormDataException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public FormDataException(ErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public FormDataException(ErrorCode errorCode, Throwable cause) {
        super(cause);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
