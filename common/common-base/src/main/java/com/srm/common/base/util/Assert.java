

package com.srm.common.base.util;

import com.google.common.base.Strings;
import com.srm.common.data.exception.RbException;
import com.srm.common.util.error.ErrorCode;
import lombok.extern.slf4j.Slf4j;

/**
 * 断言工具类
 *
 * @author Wang_Bing
 * @version 1.0
 * @since 04/12/2021 23:35
 */
@Slf4j
public class Assert {

    public static void notNull(Object obj, String msg) {
        if (obj == null) {
            throw new RbException(msg);
        }
    }

    public static void notNull(Object obj, ErrorCode errorCode) {
        if (obj == null) {
            throw new RbException(errorCode);
        }
    }

    public static void isNull(Object obj, String msg) {
        if (obj != null) {
            throw new RbException(msg);
        }
    }

    public static void isNull(Object obj, ErrorCode errorCode) {
        if (obj != null) {
            throw new RbException(errorCode);
        }
    }

    public static void isFalse(boolean obj, String msg) {
        if (obj) {
            throw new RbException(msg);
        }
    }

    public static void isFalse(boolean obj, ErrorCode errorCode) {
        if (obj) {
            throw new RbException(errorCode);
        }
    }

    public static void isTrue(boolean obj, String msg) {
        if (!obj) {
            throw new RbException(msg);
        }
    }

    public static void isTrue(boolean obj, ErrorCode errorCode) {
        if (!obj) {
            throw new RbException(errorCode);
        }
    }

    public static void notEquals(Object obj1, Object obj2, String msg) {
        if (obj1.equals(obj2)) {
            throw new RbException(msg);
        }
    }

    public static void notEquals(Object obj1, Object obj2, ErrorCode errorCode) {
        if (obj1.equals(obj2)) {
            throw new RbException(errorCode);
        }
    }

    public static void notEmpty(String s, String msg) {
        if (!Strings.isNullOrEmpty(s)) {
            throw new RbException(msg);
        }
    }

    public static void notEmpty(String s, ErrorCode errorCode) {
        if (!Strings.isNullOrEmpty(s)) {
            throw new RbException(errorCode);
        }
    }

    public static void equals(Object obj1, Object obj2, String msg) {
        if (!obj1.equals(obj2)) {
            throw new RbException(msg);
        }
    }

    public static void equals(Object obj1, Object obj2, ErrorCode errorCode) {
        if (!obj1.equals(obj2)) {
            throw new RbException(errorCode);
        }
    }

}
