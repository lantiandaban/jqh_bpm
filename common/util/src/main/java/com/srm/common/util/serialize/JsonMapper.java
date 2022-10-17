

package com.srm.common.util.serialize;

import com.google.common.collect.Lists;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;

import cn.hutool.core.date.DatePattern;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

/**
 * JSON 转换工具
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
@SuppressWarnings("unused")
@Slf4j
public class JsonMapper {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    static {
        OBJECT_MAPPER.findAndRegisterModules();
        OBJECT_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        OBJECT_MAPPER.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        OBJECT_MAPPER.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        // 忽略json字符串中不识别的属性
        OBJECT_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        // 忽略无法转换的对象
        OBJECT_MAPPER.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        // 指定时区
        OBJECT_MAPPER.setTimeZone(TimeZone.getTimeZone("GMT+8:00"));
        // 日期类型字符串处理
        OBJECT_MAPPER.setDateFormat(new SimpleDateFormat(DatePattern.NORM_DATETIME_PATTERN));
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(Long.class, ToStringSerializer.instance);
        simpleModule.addSerializer(Long.TYPE, ToStringSerializer.instance);
        OBJECT_MAPPER.registerModule(simpleModule);
        // java8日期日期处理
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        javaTimeModule.addSerializer(LocalDateTime.class, new UnixDateTimeMillsSerialize());
        javaTimeModule.addSerializer(LocalDate.class, new LocalDateSerialize());
        javaTimeModule.addSerializer(LocalTime.class, new LocalTimeSerializer(DateTimeFormatter.ofPattern(DatePattern.NORM_TIME_PATTERN)));
        javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_PATTERN)));
        javaTimeModule.addDeserializer(LocalDate.class, new LocalDateDeserializer(DateTimeFormatter.ofPattern(DatePattern.NORM_DATE_PATTERN)));
        javaTimeModule.addDeserializer(LocalTime.class, new LocalTimeDeserializer(DateTimeFormatter.ofPattern(DatePattern.NORM_TIME_PATTERN)));
        OBJECT_MAPPER.registerModule(javaTimeModule);
    }

    private JsonMapper() {
    }

    public static String toJson(Object obj) {
        StringWriter writer = new StringWriter();
        try {
            OBJECT_MAPPER.writeValue(writer, obj);
            return writer.toString();
        } catch (IOException e) {
            log.error("Object to JSON String exception! object is {}", obj, e);
            return StrUtil.EMPTY;
        }
    }

    public static <T> List<T> listOfJson(String json, Class<T> clz) {
        if (StrUtil.isNotEmpty(json)) {
            final JavaType listType = buildCollectionType(ArrayList.class, clz);
            try {
                return OBJECT_MAPPER.readValue(json, listType);
            } catch (JsonProcessingException e) {
                log.error("json node from json {}", json, e);
            }
        }
        return Collections.emptyList();
    }

    public static <K, V> Map<K, V> mapOfJson(String json, Class<K> keyCls, Class<V> valueClz) {
        if (StrUtil.isNotEmpty(json)) {
            final JavaType listType = buildMapType(HashMap.class, keyCls, valueClz);
            try {
                return OBJECT_MAPPER.readValue(json, listType);
            } catch (JsonProcessingException e) {
                log.error("json node from json {}", json, e);
            }
        }
        return Collections.emptyMap();
    }

    public static Optional<JsonNode> fromJson(String json) {
        if (StrUtil.isNotEmpty(json)) {
            try {
                JsonNode retval = OBJECT_MAPPER.readValue(json, JsonNode.class);
                return Optional.ofNullable(retval);
            } catch (JsonProcessingException e) {
                log.error("json node from json {}", json, e);
            }
        }
        return Optional.empty();
    }

    public static <T> Optional<T> fromJson(JsonNode node, Class<T> className) {
        try {
            return Optional.ofNullable(OBJECT_MAPPER.treeToValue(node, className));
        } catch (JsonProcessingException e) {
            log.error("fromJson has error!", e);
            return Optional.empty();
        }
    }

    public static <T> Optional<T> fromJson(String requestJson, Class<T> clazz) {
        InputStream is = new ByteArrayInputStream(requestJson.getBytes(StandardCharsets.UTF_8));
        try {
            T t = OBJECT_MAPPER.readValue(is, clazz);
            return Optional.ofNullable(t);
        } catch (IOException e) {
            log.error("fromJson has error!", e);
            return Optional.empty();
        }
    }

    public static <T> Optional<T> fromJson(String json, TypeReference<T> typeRef) {
        InputStream is = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
        try {
            return Optional.ofNullable(OBJECT_MAPPER.readValue(is, typeRef));
        } catch (IOException e) {
            log.error("fromJson has error!", e);
            return Optional.empty();
        }
    }

    public static ArrayNode createArrayNode() {
        return OBJECT_MAPPER.createArrayNode();
    }

    public static ObjectNode createObjectNode() {
        return OBJECT_MAPPER.createObjectNode();
    }

    public static List<String> sortArrayNode(ArrayNode arrayNode) {
        List<String> list = Lists.newArrayList();
        for (JsonNode jsonNode : arrayNode) {
            list.add(jsonNode.asText());
        }
        Collections.sort(list);
        return list;
    }

    /**
     * 构造Collection类型.
     */
    @SuppressWarnings("rawtypes")
    public static JavaType buildCollectionType(Class<? extends Collection> collectionClass, Class<?> elementClass) {
        return OBJECT_MAPPER.getTypeFactory().constructCollectionType(collectionClass, elementClass);
    }

    /**
     * 构造Map类型.
     */
    @SuppressWarnings("rawtypes")
    public static JavaType buildMapType(Class<? extends Map> mapClass, Class<?> keyClass, Class<?> valueClass) {
        return OBJECT_MAPPER.getTypeFactory().constructMapType(mapClass, keyClass, valueClass);
    }

    public static ObjectMapper getMapper() {
        return OBJECT_MAPPER;
    }
}
