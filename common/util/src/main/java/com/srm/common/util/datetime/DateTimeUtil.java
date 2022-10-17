

package com.srm.common.util.datetime;


import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Objects;

import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.util.StrUtil;

/**
 * 时间工具，扩展了时间戳的处理
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
public class DateTimeUtil extends LocalDateTimeUtil {

    private static String[] patterns = {"yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss.SSS", "yyyy-MM-ddTHH:mm:ss.SSSZ"};

    public static final LocalDate UNIXTIME_START_DATE = LocalDate.of(1970, 1, 1);

    public static final LocalDateTime UNIXTIME_START_DATETIME = LocalDateTime.of(UNIXTIME_START_DATE, LocalTime.MIN);

    public static final ZoneOffset DEFAULT_ZONE = ZoneOffset.ofHours(8);

    /**
     * CRON表达式时间
     */
    private static final DateTimeFormatter CRON_DATA_FORMAT = DateTimeFormatter.ofPattern("ss/1 mm HH dd MM ?");

    /**
     * 获取当前时间 单位：s
     *
     * @return 当前时间
     */
    public static int unixTime() {
        return (int) (System.currentTimeMillis() / 1000);
    }


    /**
     * 通过日期返回对应的时间 单位s
     *
     * @param dateTime 日期
     * @return 对应的以s为单位的时间
     */
    public static int unixTime(LocalDate dateTime) {
        return dateTime == null ? 0 : (int) (timeMills(dateTime) / 1000);
    }

    /**
     * 获取时间戳
     *
     * @return 时间戳
     */
    public static long timeMills() {
        return System.currentTimeMillis();
    }


    /**
     * 获取时间戳
     *
     * @return 时间戳
     */
    public static long timeMills(LocalDate time) {
        return timeMills(time, null);
    }


    /**
     * 获取时间戳
     *
     * @return 时间戳
     */
    public static long timeMills(Date time) {
        return time.getTime();
    }


    /**
     * 获取时间戳
     *
     * @return 时间戳
     */
    public static long timeMills(LocalDate time, ZoneOffset zoneOffset) {
        if (Objects.isNull(zoneOffset)) {
            zoneOffset = DEFAULT_ZONE;
        }
        return time.atStartOfDay().toInstant(zoneOffset).toEpochMilli();
    }

    /**
     * 获取时间戳
     *
     * @return 时间戳
     */
    public static Long timeMills(LocalDateTime time) {
        return timeMills(time, DEFAULT_ZONE);
    }


    /**
     * 获取时间戳
     *
     * @return 时间戳
     */
    public static Long timeMills(LocalDateTime time, ZoneOffset zone) {
        return time.toInstant(zone).toEpochMilli();
    }

    /**
     * 获取指定日期的开始时间戳
     *
     * @return 时间戳
     */
    public static Long timeMillsOfStartDate(LocalDate date) {
        return DateTimeUtil.timeMills(LocalDateTime.of(date, LocalTime.MIN));
    }

    /**
     * 获取指定日期的结束时间戳
     *
     * @return 时间戳
     */
    public static Long timeMillsOfEndDate(LocalDate date) {
        return DateTimeUtil.timeMills(LocalDateTime.of(date, LocalTime.MAX));
    }

    /**
     * 获取今天的开始时间戳
     *
     * @return 时间戳
     */
    public static Long timeMillsOfStartToday() {
        return DateTimeUtil.timeMills(LocalDateTime.of(LocalDate.now(), LocalTime.MIN));
    }

    /**
     * 获取今天的结束时间戳
     *
     * @return 时间戳
     */
    public static Long timeMillsOfEndToday() {
        return DateTimeUtil.timeMills(LocalDateTime.of(LocalDate.now(), LocalTime.MAX));
    }

    /**
     * 秒数时间戳转LocalDateTime
     *
     * @param sec 秒数时间戳
     * @return LocalDateTime
     */
    public static LocalDateTime localDateTime(Integer sec) {
        return LocalDateTime.ofEpochSecond(sec , 0, DEFAULT_ZONE);
    }

    /**
     * 毫秒数时间戳转LocalDateTime
     *
     * @param ms 毫秒数时间戳
     * @return LocalDateTime
     */
    public static LocalDateTime localDateTime(Long ms) {
        //需要注意，这个地方有个纳秒概念，如果直接把毫秒转成LocalDateTime，需要先取秒，然后再取到剩余的毫秒
        long a = ms - (ms / 1000 * 1000);//获取毫秒转成秒剩余的毫秒，然后转成纳秒
        return LocalDateTime.ofEpochSecond(ms/1000, Integer.valueOf(a+"")*1000*1000, DEFAULT_ZONE);
    }

    /**
     * 毫秒数时间戳格式化时间
     *
     * @param ms     毫秒数时间戳
     * @param format 时间格式
     * @return 时间字符串
     */
    public static String format(long ms, String format) {
        if (ms == 0) {
            return StrUtil.EMPTY;
        }
        final LocalDateTime dt = localDateTime(ms);
        return DateTimeFormatter.ofPattern(format).format(dt);
    }

    /**
     * 秒数时间戳格式化时间
     *
     * @param sec    秒数时间戳
     * @param format 时间格式
     * @return 时间字符串
     */
    public static String format(int sec, String format) {
        if (sec == 0) {
            return StrUtil.EMPTY;
        }
        final LocalDateTime dt = localDateTime(sec);
        return DateTimeFormatter.ofPattern(format).format(dt);
    }

    /**
     * LocalDateTime格式化时间
     *
     * @param ldt    LocalDateTime对象
     * @param format 时间格式
     * @return 时间字符串
     */
    public static String format(LocalDateTime ldt, String format) {
        return DateTimeFormatter.ofPattern(format).format(ldt);
    }

    /**
     * 将毫秒时间戳转换为 cron 表达式
     *
     * @param dateline 毫秒时间戳
     * @return cron表达式
     */
    public static String cronOfTimestamp(long dateline) {
        final LocalDateTime dateTime = localDateTime(dateline);
        return dateTime.format(CRON_DATA_FORMAT);
    }

    public static LocalDateTime to(Date time) {
        Instant instant = time.toInstant();
        return instant.atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    public static LocalDateTime str2DateTime(String valu) {
        String dateAsString = valu;
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

    public static LocalDate str2Date(String valu) {
        String dateAsString = valu;
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

        LocalDate localDateTime = instant.atZone(zoneId).toLocalDate();
        return localDateTime;
    }

    public static Long dateToLong(String time) {
        return DateTimeUtil.timeMillsOfStartDate(DateTimeUtil.str2Date(time == null ? "" : time));
    }

    /**
     * 精确到日开始
     *
     * @param t 日期时间字符串
     */
    public static Long timeMillsOfStartDate(String t) {
        if (StringUtils.isBlank(t)) {
            return null;
        }
        return DateTimeUtil.timeMillsOfStartDate(DateTimeUtil.str2Date(t == null ? "" : t));
    }

    // 精确到日结束

    /**
     * 精确到日结束
     *
     * @param t 日期时间字符串
     */
    public static Long timeMillsOfEndDate(String t) {
        if (StringUtils.isBlank(t)) {
            return null;
        }
        return DateTimeUtil.timeMillsOfEndDate(DateTimeUtil.str2Date(t == null ? "" : t));
    }

    /**
     * 精确到秒开始
     *
     * @param t 日期时间
     */
    public static Long timeMillsOfStartSecond(String t) {
        if (StringUtils.isBlank(t)) {
            return null;
        }
        return DateTimeUtil.timeMillsOfStartSecond(DateTimeUtil.str2DateTime(t == null ? "" : t));
    }

    /**
     * 精确到秒结束
     *
     * @param t 日期时间
     */
    public static Long timeMillsOfEndSecond(String t) {
        if (StringUtils.isBlank(t)) {
            return null;
        }
        return DateTimeUtil.timeMillsOfEndSecond(DateTimeUtil.str2DateTime(t == null ? "" : t));
    }

    public static Long timeMillsOfEndSecond(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return timeMills(dateTime) / 1000 * 1000 + 999L;
    }

    public static Long timeMillsOfStartSecond(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return timeMills(dateTime) / 1000 * 1000;
    }


    /**
     * 精确到秒开始
     */
    public static LocalDateTime toBeginSecond(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        Long sjc = timeMillsOfStartSecond(dateTime);
        return Instant.ofEpochMilli(sjc).atZone(DEFAULT_ZONE).toLocalDateTime();
    }

    /**
     * 精确到秒开始
     */
    public static LocalDateTime toEndSecond(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        Long sjc = timeMillsOfEndSecond(dateTime);
        return Instant.ofEpochMilli(sjc).atZone(DEFAULT_ZONE).toLocalDateTime();
    }
}
