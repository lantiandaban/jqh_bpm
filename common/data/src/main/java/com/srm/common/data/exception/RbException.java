

package com.srm.common.data.exception;

import java.util.Collections;
import java.util.Map;

import cn.hutool.core.util.StrUtil;
import com.srm.common.util.error.BasisCode;
import com.srm.common.util.error.ErrorCode;

/**
 * 自定义业务异常
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
public class RbException extends RuntimeException {
    private static final long serialVersionUID = 1452465705336378063L;

    /**
     * 提示信息
     */
    private final String msg;
    /**
     * 错误码 0表示正确
     */
    private final ErrorCode code;

    /**
     * 错误信息的数据
     */
    private final Map<String, Object> data;

    private final Object[] params;

    public RbException(String msg) {
        super(msg);
        this.params = null;
        this.code = BasisCode.SERVER_ERROR;
        this.msg = msg;
        this.data = Collections.emptyMap();
    }

    public RbException(ErrorCode code) {
        super(StrUtil.EMPTY);
        this.code = code;
        this.params = null;
        this.msg = StrUtil.EMPTY;
        this.data = Collections.emptyMap();
    }
    public RbException(ErrorCode code, Object[] params) {
        super(StrUtil.EMPTY);
        this.code = code;
        this.params = params;
        this.msg = StrUtil.EMPTY;
        this.data = Collections.emptyMap();
    }

    public RbException(String msg, Throwable e) {
        super(msg, e);
        this.params = null;
        this.code = BasisCode.SERVER_ERROR;
        this.msg = msg;
        this.data = Collections.emptyMap();
    }

    public RbException(String msg, ErrorCode code) {
        super(msg);
        this.msg = msg;
        this.code = code;
        this.params = null;
        this.data = Collections.emptyMap();
    }

    public RbException(String msg, ErrorCode code, Map<String, Object> data) {
        super(msg);
        this.msg = msg;
        this.code = code;
        this.data = data;
        this.params = null;
    }

    public RbException(ErrorCode code, Map<String, Object> data) {
        super(StrUtil.EMPTY);
        this.params = null;
        this.msg = StrUtil.EMPTY;
        this.code = code;
        this.data = data;
    }

    public RbException(String msg, ErrorCode code, Throwable e) {
        super(msg, e);
        this.msg = msg;
        this.code = code;
        this.params = null;
        this.data = Collections.emptyMap();
    }

    /**
     * 异常数据
     *
     * @return 异常数据
     */
    public Map<String, Object> getData() {
        return data;
    }

    /**
     * 提示信息
     *
     * @return 异常消息
     */
    public String getMsg() {
        return msg;
    }

    /**
     * 错误码 0表示正确
     *
     * @return 错误码
     */
    public ErrorCode getCode() {
        return code;
    }

    public Object[] getParams(){return params; }
}
