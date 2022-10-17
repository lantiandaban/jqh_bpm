 

package com.srm.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.OptimisticLockerInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.TenantLineInnerInterceptor;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import lombok.RequiredArgsConstructor;

/**
 * @author fitz.yang
 * @version 2021.02
 * @since triton 2021.02
 */
@RequiredArgsConstructor
@Configuration
@EnableTransactionManagement
@MapperScan("com.**.**.infra.dao")
public class MybatisPlusConfig {
    private final TenantProperties tenantProperties;

    private final TenantLineInnerInterceptor tenantLineInnerInterceptor;

    /**
     * 分页插件,一缓和二缓遵循mybatis的规则,需要设置 MybatisConfiguration#useDeprecatedExecutor = false
     * 避免缓存出现问题(该属性会在旧插件移除后一同移除)
     *
     * @return 分页插件
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        boolean enableTenant = tenantProperties.getEnable();
        if (enableTenant) {
            interceptor.addInnerInterceptor(tenantLineInnerInterceptor);
        }
        PaginationInnerInterceptor paginationInnerInterceptor = new PaginationInnerInterceptor(DbType.MYSQL);
        // 设置最大单页限制数量，默认 500 条，-1 不受限制
        paginationInnerInterceptor.setMaxLimit(500L);
        interceptor.addInnerInterceptor(paginationInnerInterceptor);
        // sql性能规范,防止全表更新与删除
        // interceptor.addInnerInterceptor(new IllegalSQLInnerInterceptor());
        return interceptor;
    }

    @Bean
    public MybatisPlusInterceptor optimisticLockerInnerInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        return interceptor;
    }

}
