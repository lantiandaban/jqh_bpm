

package com.srm.common.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import static com.google.common.collect.Lists.newArrayList;
import static com.srm.common.data.constant.UserAuthConstant.ROLE_HEADER_NAME;
import static com.srm.common.data.constant.UserAuthConstant.TOKEN_HEADER_NAME;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                //加了ApiOperation注解的类，才生成接口文档
                .apis(RequestHandlerSelectors.withMethodAnnotation(ApiOperation.class))
                //包下的类，才生成接口文档
                //.apis(RequestHandlerSelectors.basePackage("io.renren.controller"))
                .paths(PathSelectors.any())
                .build()
                .directModelSubstitute(java.util.Date.class, String.class);


    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("微服务文件")
                .description("微服务文件-接口文档")
                .termsOfServiceUrl("https://www.jing-tong.com/")
                .version("0.0.1")
                .build();
    }

    private List<ApiKey> security() {
        return newArrayList(
                new ApiKey(TOKEN_HEADER_NAME,TOKEN_HEADER_NAME, "header"),
                new ApiKey(ROLE_HEADER_NAME,ROLE_HEADER_NAME, "header")
        );
    }
}
