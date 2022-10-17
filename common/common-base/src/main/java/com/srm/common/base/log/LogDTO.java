 

package com.srm.common.base.log;

import java.time.LocalDateTime;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class LogDTO {
    /**
     * 用户编码
     */
    private String userCode;

    /**
     * 用户名称
     */
    private String userName;

    /**
     * 操作事件
     */
    private String tlogEvent;

    /**
     * 操作时间
     */
    private LocalDateTime tlogTime;

    /**
     * 请求地址
     */
    private String requestUrl;

    /**
     * 请求方式
     */
    private String requestType;

    /**
     * 请求参数
     */
    private String requestParams;

    /**
     * IP
     */
    private String requestIp;

    /**
     * 操作备注
     */
    private String tlogDesc;

    /**
     * 错误信息
     */
    private String tlogError;

    /**
     * 操作位置
     */
    private String tlogLocation;
}
