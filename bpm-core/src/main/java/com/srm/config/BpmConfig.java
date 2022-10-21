

package com.srm.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "bpm")
public class BpmConfig {
    private String filePath;
    private String ctx;
    private String targetUrl;
    /**
     * 类型1:表单和流程,2:流程;3:表单
     */
    private Integer type;

    private String callbackUrl;
    
    private String pushmsgUrl;
}
