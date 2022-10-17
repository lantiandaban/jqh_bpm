

package com.srm.bpm.logic.exception;


import com.srm.bpm.logic.constant.StringPool;
import com.srm.common.data.exception.RbException;
import com.srm.common.util.error.ErrorCode;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public class ListenerNotFoundException extends RbException {
    private static final long serialVersionUID = -1088714824023702178L;

    public ListenerNotFoundException(ErrorCode errorCode) {
        super(StringPool.EMPTY, errorCode);
    }

    public ListenerNotFoundException(ErrorCode errorCode, Throwable cause) {
        super(StringPool.EMPTY, errorCode, cause);
    }

    public ListenerNotFoundException(String message, ErrorCode errorCode) {
        super(message, errorCode);
    }

    public ListenerNotFoundException(String message, Throwable cause, ErrorCode errorCode) {
        super(message, errorCode, cause);
    }
}
