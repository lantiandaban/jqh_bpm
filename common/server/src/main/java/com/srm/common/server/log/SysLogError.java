

package com.srm.common.server.log;

import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>异常日志 </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
@EqualsAndHashCode(callSuper=false)
public class SysLogError extends BaseLog{
    /**
     * 模块名称
     */
    private String module;
    /**
     * 请求URI
     */
    private String requestUri;
    /**
     * 请求方式
     */
    private String requestMethod;
    /**
     * 请求参数
     */
    private String requestParams;
    /**
     * 用户代理
     */
    private String userAgent;
    /**
     * 操作IP
     */
    private String ip;
    /**
     * 异常信息
     */
    private String errorInfo;
    /**
     * 创建者
     */
    private Long creator;
    /**
     * 创建时间
     */
    private Date createDate;
}
