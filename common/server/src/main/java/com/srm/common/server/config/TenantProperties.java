

package com.srm.common.server.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

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
@ConfigurationProperties(prefix = "scis.tenant")
public class TenantProperties {
    /**
     * 是否开启租户模式
     */
    private Boolean enable = true;

    /**
     * 需要排除的多租户的表
     */
    private List<String> ignoreTables = new ArrayList<>();

    /**
     * 多租户字段名称
     */
    private String column = "bloc_code";
}
