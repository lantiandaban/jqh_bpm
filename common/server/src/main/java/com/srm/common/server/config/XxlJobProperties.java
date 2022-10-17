 

package com.srm.common.server.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
@ConfigurationProperties(prefix = "scis.xxljob")
public class XxlJobProperties {
    private String adminAddresses;


    private String appname;


    private String ip;


    private int port;


    private String accessToken;


    private String logPath;


    private int logRetentionDays;

    /**
     * 是否开启xxljob
     */
    private Boolean enable = false;
}
