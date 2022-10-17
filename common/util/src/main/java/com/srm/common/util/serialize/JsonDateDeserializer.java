

package com.srm.common.util.serialize;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import org.apache.commons.lang3.time.DateUtils;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;
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
@JsonComponent
public class JsonDateDeserializer extends JsonDeserializer<LocalDateTime> {
    private String[] patterns = {"yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss.SSS", "yyyy-MM-ddTHH:mm:ss.SSSZ"};

    @Override
    public LocalDateTime deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
        String dateAsString = jsonParser.getText();
        if (dateAsString == null || "".equals(dateAsString) || dateAsString.length() < 1) {
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
