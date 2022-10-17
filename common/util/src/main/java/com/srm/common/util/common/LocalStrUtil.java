

package com.srm.common.util.common;

/**
 * <p>
 * 本地字符串工具类
 * </p>
 *
 * <pre> Created: 2021/1/6 09:50:12  </pre>
 * <pre> Project: triton  </pre>
 *
 * @author ZhuLei
 * @version 1.0
 * @since JDK 1.8
 */
public class LocalStrUtil {

    /**
     * 下划线转驼峰
     * USER_NAME  ---->  userName
     *
     * @param underlineName 带有下划线的名字
     * @return 驼峰字符串
     */
    public static String underlineToHump(String underlineName) {
        //截取下划线分成数组
        char[] charArray = underlineName.toCharArray();
        //判断上次循环的字符是否是"_"
        boolean underlineBefore = false;
        StringBuilder builder = new StringBuilder();
        for (int i = 0, l = charArray.length; i < l; i++) {
            //判断当前字符是否是"_",如果跳出本次循环
            if (charArray[i] == 95) {
                underlineBefore = true;
            } else if (underlineBefore) {
                //如果为true，代表上次的字符是"_",当前字符需要转成大写
                builder.append(charArray[i]);
                underlineBefore = false;
            } else { //不是"_"后的字符就直接追加
                builder.append(charArray[i] += 32);
            }
        }
        return builder.toString();
    }

    /**
     * 驼峰转 下划线
     * userName  ---->  user_name
     *
     * @param humpName 驼峰命名
     * @return 带下滑线的String
     */
    public static String humpToUnderline(String humpName) {
        //截取下划线分成数组，
        char[] charArray = humpName.toCharArray();
        StringBuilder builder = new StringBuilder();
        //处理字符串
        for (int i = 0, l = charArray.length; i < l; i++) {
            if (charArray[i] >= 65 && charArray[i] <= 90) {
                builder.append("_").append(charArray[i]+= 32);
            } else {
                builder.append(charArray[i] );
            }
        }
        return builder.toString();
    }

    /**
     * 首字母大写
     * userName ---->  UserName
     *
     * @param str userName
     * @return UserName
     */
    public static String capitalizeInitialLetter(String str) {
        char[] charArray = str.toCharArray();
        charArray[0] -= 32;
        return new String(charArray);
    }


}