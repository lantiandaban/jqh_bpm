

package com.srm.bpm.logic.util;

import java.util.Objects;

import cn.hutool.core.util.StrUtil;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public class StringUtil {
    public static String ob2str(Object o) {
        if (Objects.isNull(o)) {
            return StrUtil.EMPTY;
        }
        if (o instanceof Long || o instanceof Integer || o instanceof Float) {
            return String.valueOf(o);
        } else if (o instanceof String) {
            return (String) o;
        } else {
            return o.toString();
        }
    }
}
