 

package com.srm.common.util.serialize;

/**
 * @author fitz.yang
 * @version 2021.02
 * @since triton 2021.02
 */

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Objects;

public class  LocalDateSerialize extends JsonSerializer<LocalDate> {
    @Override
    public void serialize(LocalDate value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        if (Objects.nonNull(value)) {
            String ymd = String.format("%d%02d%02d", value.getYear(), value.getMonthValue(), value.getDayOfMonth());
            gen.writeNumber(Integer.parseInt(ymd));
        }
    }
}