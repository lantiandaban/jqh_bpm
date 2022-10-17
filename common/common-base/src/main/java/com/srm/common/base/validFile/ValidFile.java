

package com.srm.common.base.validFile;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;
import java.lang.annotation.Target;

/**
 * 默认:<br/>
 * 上传文件不能为空<br/>
 * 允许上传所有后缀格式的文件<br/>
 * 文件后缀名不区分大小写<br/>
 * 文件最大不超过springmvc配置的文件大小<br/>
 * 文件最小不小于0 kb <br/>
 * Created by bruce on 2018/8/30 16:34
 */
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MultipartFileValidator.class)
public @interface ValidFile {
 
     String DEFAULT_MAXSIZE = "-1";
 
    /**
     * AliasFor("endsWith")
     */
    String[] value() default {};
 
    /**
     * 支持的文件后缀类型,默认全部,AliasFor("value")
     */
    String[] endsWith() default {};
 
    /**
     * 文件后缀是否区分大小写
     */
    boolean ignoreCase() default true;
 
    /**
     * 上传的文件是否允许为空
     */
    boolean allowEmpty() default false;

    /**
     * Max file size. Values can use the suffixes "MB" or "KB" to indicate megabytes or
     * kilobytes respectively.<br/>
     * 默认不限制但必须小于等于SpringMVC中文件上传配置
     */
    String maxSize() default DEFAULT_MAXSIZE;
 
    /**
     * Min file size. Values can use the suffixes "MB" or "KB" to indicate megabytes or
     * kilobytes respectively. default byte
     */
    String minSize() default "0";
 
    String message() default "The uploaded file is not verified.";
 
    Class<?>[] groups() default {};
 
    Class<? extends Payload>[] payload() default {};
 
 
}