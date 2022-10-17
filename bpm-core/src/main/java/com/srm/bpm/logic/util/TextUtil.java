

package com.srm.bpm.logic.util;

import java.util.regex.Pattern;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public class TextUtil {

    private static final String DOUBLE_REGEX = "^[-\\+]?[.\\d]*$";


    public static boolean isDouble(String str) {
        Pattern pattern = Pattern.compile(DOUBLE_REGEX);
        return pattern.matcher(str).matches();
    }

}
