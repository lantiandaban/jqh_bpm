

package com.srm.common.server.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.google.common.base.Strings;
import com.srm.common.util.datetime.DateTimeUtil;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;

/**
 * @author wangb100
 * @version 1.0
 * @since 2021-06-17 16:53
 */
public class CustomeLocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {

    @Override
    public LocalDateTime deserialize(JsonParser parser, DeserializationContext context) throws IOException {
        String timestamp = parser.getText();
        if (Strings.isNullOrEmpty(timestamp) || Long.parseLong(timestamp) <= 0L) {
            return null;
        }
        return Instant.ofEpochMilli(Long.parseLong(timestamp)).atZone(DateTimeUtil.DEFAULT_ZONE).toLocalDateTime();
    }
}
