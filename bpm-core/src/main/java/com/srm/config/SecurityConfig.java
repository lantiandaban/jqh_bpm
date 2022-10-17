

package com.srm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Configuration
@Order(1)
public class SecurityConfig extends SecurityPermitAllConfig {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.headers().frameOptions().disable(); // 任何跨域
//        http.headers().frameOptions().sameOrigin(); // 同源跨域
        http.csrf().disable()
                .authorizeRequests()
                .anyRequest().permitAll()
                .and().logout().permitAll();

        http.cors().configurationSource(corsConfigurationSource());
    }

    //配置跨域访问资源
    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*"); // 同源配置，*表示任何请求都视为同源，若需指定ip和端口可以改为如“localhost：8080”，多个以“，”分隔；
        corsConfiguration.addAllowedHeader("*");// header，允许哪些header，本案中使用的是token，此处可将*替换为token；
        corsConfiguration.addAllowedMethod("*"); // 允许的请求方法，PSOT、GET等
        ((UrlBasedCorsConfigurationSource) source).registerCorsConfiguration("/**", corsConfiguration); // 配置允许跨域访问的url
        return source;
    }
}
