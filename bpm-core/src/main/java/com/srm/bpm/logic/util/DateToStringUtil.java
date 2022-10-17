

package com.srm.bpm.logic.util;

import com.srm.common.util.datetime.DateTimeUtil;

import java.time.LocalDateTime;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public class DateToStringUtil {
    public static String yyyymmdash(LocalDateTime time) {
        return DateTimeUtil.format(time, "yyyy-MM-dd");
    }

    public static String yyyymmdashNow() {
        return yyyymmdash(LocalDateTime.now());
    }
}
