

package com.srm.common.util.serialize;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Objects;

import com.srm.common.util.datetime.DateTimeUtil;

/**
 * @author fitz.yang
 * @version 2021.02
 * @since triton 2021.02
 */
public class UnixDateTimeMillsSerialize extends JsonSerializer<LocalDateTime> {
    @Override
    public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        if (Objects.nonNull(value)) {
            gen.writeNumber(DateTimeUtil.timeMills(value));
        }
    }
}