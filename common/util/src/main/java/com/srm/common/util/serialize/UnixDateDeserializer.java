

package com.srm.common.util.serialize;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.srm.common.util.datetime.DateTimeUtil;

import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@JsonComponent
public class UnixDateDeserializer extends JsonDeserializer<LocalDateTime> {

    @Override
    public LocalDateTime deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
        Long dateAsString = jsonParser.getValueAsLong();
        if (dateAsString == null || dateAsString.compareTo(0L) == 0) {
            return null;
        }

        return DateTimeUtil.localDateTime(dateAsString);
    }
}
