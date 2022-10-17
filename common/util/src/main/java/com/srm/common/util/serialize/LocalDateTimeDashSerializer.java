

package com.srm.common.util.serialize;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import cn.hutool.core.date.DatePattern;

/**
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
public class LocalDateTimeDashSerializer extends StdDeserializer<LocalDateTime> {
    private static final long serialVersionUID = -843713794778763905L;


    private static final DateTimeFormatter DEFAULT_FORMATTER = DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_PATTERN);

    protected LocalDateTimeDashSerializer() {
        super(LocalDateTime.class);
    }

    @Override
    public LocalDateTime deserialize(JsonParser parser, DeserializationContext ctxt) throws IOException {

        return LocalDateTime.parse(parser.readValueAs(String.class), DEFAULT_FORMATTER);
    }
}
