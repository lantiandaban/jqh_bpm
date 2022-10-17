

package com.srm.common.server.config;


import com.google.common.base.Strings;

import org.apache.commons.lang3.time.DateUtils;
import org.springframework.core.convert.converter.Converter;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
//@Configuration
public class DateStrToLocalDateTimeConverterConfig implements Converter<String, LocalDateTime> {
    private String[] patterns = {"yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss.SSS", "yyyy-MM-ddTHH:mm:ss.SSSZ"};
    @Override
    public LocalDateTime convert(String dateAsString) {
        if (Strings.isNullOrEmpty(dateAsString)) {
            return null;
        }
        Date parseDate = null;
        try {
            parseDate = DateUtils.parseDate(dateAsString, patterns);
        } catch (ParseException e) {
            throw new IllegalArgumentException(e.getCause());
        }
        Instant instant = parseDate.toInstant();
        ZoneId zoneId = ZoneId.systemDefault();
        LocalDateTime localDateTime = instant.atZone(zoneId).toLocalDateTime();
        return localDateTime;
    }

}

