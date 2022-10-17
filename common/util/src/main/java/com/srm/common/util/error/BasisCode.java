

package com.srm.common.util.error;

import java.net.HttpURLConnection;

/**
 * 基础错误码
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
public enum BasisCode implements ErrorCode {
    /**
     * 操作成功
     */
    SUCESS(200),
    /**
     * 无法找到
     */
    NOT_FOUND(HttpURLConnection.HTTP_NOT_FOUND),

    NO_CONTENT(HttpURLConnection.HTTP_NO_CONTENT),
    BAD_REQUEST(HttpURLConnection.HTTP_BAD_REQUEST),
    /**
     * 服务端错误
     */
    SERVER_ERROR(HttpURLConnection.HTTP_INTERNAL_ERROR),
    /**
     * 请求超时
     */
    TIMEOUT(HttpURLConnection.HTTP_GATEWAY_TIMEOUT),
    /**
     * 拒绝访问
     */
    FORBIDDEN(HttpURLConnection.HTTP_FORBIDDEN),
    /**
     * 认证不通过
     */
    UNAUTHORIZED(HttpURLConnection.HTTP_UNAUTHORIZED),
    /**
     * 数据库错误
     */
    DB_ERROR(599),
    /**
     * 接口停用
     */
    API_STOP(1003),
    /**
     * 请求TOKEN无权限
     */
    API_TOKEN_SUPPORTED(1004),
    /**
     * 错误的请求TOKEN
     */
    API_TOKEN_ERROR(1005),
    /**
     * 请求TOKEN已过期
     */
    API_TOKEN_EXPIRE(1006),
    /**
     * 请求TOKEN已禁止
     */
    API_TOKEN_BAN(1007),

    /**
     * 请求IP已禁止
     */
    IP_BAN(1008),
    /**
     * 请求IP超过请求次数限制
     */
    IP_LIMIT_TIMES(1009),
    /**
     * 参数不能为空
     */
    PARAM_EMPTY(1010),
    /**
     * 参数校验失败
     */
    PARAM_VALID(1011),
    /**
     * 参数必须传递
     */
    PARAM_REQUIRED(1012),
    /**
     * 重复数据
     */
    DUPLICATE_KEY(1013),

    /**
     * TOKEN为空
     */
    TOKEN_EMPTY(1014),
    /**
     * 数据权限配置错误
     */
    DATA_SCOPE_PARAMS_ERROR(1015);


    private final int code;

    BasisCode(int code) {
        this.code = code;
    }

    @Override
    public int getCode() {
        return code;
    }
}
