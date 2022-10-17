

package com.srm.bpm.facde.util;

import com.google.common.collect.Sets;

import java.util.Collection;
import java.util.Iterator;
import java.util.Set;

import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.StrUtil;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public class FormDataUtil {
    /**
     * 处理流程条件中的数字属于和不属于增加增加单引号
     */
    public static String includeStrHanlder(String... args) {
        Set<String> result = Sets.newHashSet();
        for (String arg : args) {
            if (NumberUtil.isNumber(arg)) {
                arg = "'" + arg + "'";
            }
            result.add(arg);
        }
        return StrUtil.join(",", result);
    }

    public static String includeStrHanlder(Collection<String> args) {
        final Iterator<String> iterator = args.iterator();
        String[] tmp = new String[args.size()];
        int i = 0;
        while (iterator.hasNext()) {
            tmp[i] = iterator.next();
            i++;
        }
        return includeStrHanlder(tmp);
    }
}
