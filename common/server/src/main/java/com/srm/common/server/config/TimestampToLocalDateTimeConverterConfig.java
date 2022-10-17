 

package com.srm.common.server.config;


import com.google.common.base.Strings;
import com.srm.common.util.datetime.DateTimeUtil;
import lombok.Data;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;

import java.time.Instant;
import java.time.LocalDateTime;

/**
 * 前端->后端：时间戳 to LocalDateTime
 *
 * @author Wangb100
 * @version 1.0
 * @since 06/17/2021 13:02
 */
@Data
@Configuration
public class TimestampToLocalDateTimeConverterConfig implements Converter<String, LocalDateTime> {
    @Override
    public LocalDateTime convert(String timestamp) {
        if (Strings.isNullOrEmpty(timestamp) || Long.parseLong(timestamp) <= 0L) {
            return null;
        }
        return Instant.ofEpochMilli(Long.parseLong(timestamp)).atZone(DateTimeUtil.DEFAULT_ZONE).toLocalDateTime();
    }

}

