

package com.srm.common.util.common;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <p>
 * 数学工具类
 * </p>
 *
 * <pre> Created: 2021/1/5 09:33:14  </pre>
 * <pre> Project: triton  </pre>
 *
 * @author ZhuLei
 * @version 1.0
 * @since JDK 1.8
 */
public class NumberUtil {

    /**
     * 判断char是否为数字
     *
     * @param c 字符
     * @return boolean
     */
    public static boolean isNumeric(char c) {
        return (c >= '0' && c <= '9');
    }

    /**
     * 判断String是否为数字
     *
     * @param s 字符串
     * @return boolean
     */
    public static boolean isNumericString(String s) {
        Pattern pattern = Pattern.compile("^[-\\+]?[\\d]*.[\\d]*$");
        Matcher matcher = pattern.matcher(s);
        return matcher.matches();
    }
}
