

package com.srm.config;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */

import com.baomidou.mybatisplus.extension.plugins.handler.TenantLineHandler;
import com.baomidou.mybatisplus.extension.plugins.inner.TenantLineInnerInterceptor;
import com.srm.bpm.logic.service.LoginUserHolder;

import net.sf.jsqlparser.expression.Expression;
import net.sf.jsqlparser.expression.NullValue;
import net.sf.jsqlparser.expression.StringValue;

import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@AllArgsConstructor
@AutoConfigureBefore(MybatisPlusConfig.class)
@EnableConfigurationProperties(TenantProperties.class)
@Slf4j
@Component
public class TenantConfig {
    private final TenantProperties tenantProperties;
    private final LoginUserHolder loginUserHolder;

    /**
     * 新多租户插件配置,一缓和二缓遵循mybatis的规则, 需要设置 MybatisConfiguration#useDeprecatedExecutor = false
     * 避免缓存万一出现问题
     */
    @Bean
    public TenantLineInnerInterceptor tenantLineInnerInterceptor() {

        return new TenantLineInnerInterceptor(new TenantLineHandler() {
            /**
             * 获取租户ID
             * @return
             */
            @Override
            public Expression getTenantId() {

                String tenant = loginUserHolder.getBloc();
                log.info("获取到了平台编码：{}", tenant);
                if (tenant != null) {
                    return new StringValue(tenant);
                }
                return new NullValue();
            }

            /**
             * 获取多租户的字段名
             * @return String
             */
            @Override
            public String getTenantIdColumn() {
                return tenantProperties.getColumn();
            }

            /**
             * 过滤不需要根据租户隔离的表
             * 这是 default 方法,默认返回 false 表示所有表都需要拼多租户条件
             * @param tableName 表名
             */
            @Override
            public boolean ignoreTable(String tableName) {
                return tenantProperties.getIgnoreTables().stream().anyMatch(
                        (t) -> t.equalsIgnoreCase(tableName)
                );
            }
        });
    }
}
