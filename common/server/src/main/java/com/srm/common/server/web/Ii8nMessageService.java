

package com.srm.common.server.web;

import com.baomidou.mybatisplus.core.toolkit.StringPool;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.Locale;

import com.srm.common.util.error.ErrorCode;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Service
public class Ii8nMessageService {

    private final MessageSource messageSource;

    @Autowired
    public Ii8nMessageService(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public String getMessage(ErrorCode code) {
        return getMessage(code.getCode());
    }

    public String getMessage(ErrorCode code, Object[] args) {
        return getMessage(code.getCode() + "", args);
    }

    public String getMessage(int code) {
        return getMessage(code + "", null);
    }

    public String getMessage(String code) {
        return getMessage(code, null);
    }

    /**
     * @param code ：对应messages配置的key.
     * @param args : 数组参数.
     * @return 配置内容文本
     */
    public String getMessage(String code, Object[] args) {
        return getMessage(code, args, StringPool.EMPTY);
    }

    /**
     * @param code           ：对应messages配置的key.
     * @param args           : 数组参数.
     * @param defaultMessage : 没有设置key的时候的默认值.
     * @return 配置内容文本
     */
    public String getMessage(String code, Object[] args, String defaultMessage) {
        //这里使用比较方便的方法，不依赖request.
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(code, args, defaultMessage, locale);
    }
}
