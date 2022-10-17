

package com.srm.common.server.log;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>登陆日志 </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
@EqualsAndHashCode(callSuper=false)
public class SysLogLogin extends BaseLog{
    /**
     * 用户操作   0：用户登录   1：用户退出
     */
    private Integer operation;
    /**
     * 状态  0：失败    1：成功    2：账号已锁定
     */
    private Integer status;
    /**
     * 用户代理
     */
    private String userAgent;
    /**
     * 操作IP
     */
    private String ip;
    /**
     * 用户名
     */
    private String creatorName;
    /**
     * 创建者
     */
    private Long creator;
    /**
     * 创建时间
     */
    private LocalDateTime createDate;
}
