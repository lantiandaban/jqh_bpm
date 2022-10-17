

package com.jingtong.devools;

import com.google.common.base.MoreObjects;
import com.google.common.primitives.Ints;

import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.ITypeConvert;
import com.baomidou.mybatisplus.generator.config.rules.DbColumnType;
import com.baomidou.mybatisplus.generator.config.rules.IColumnType;

import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;

import static com.baomidou.mybatisplus.generator.config.rules.DbColumnType.BLOB;
import static com.baomidou.mybatisplus.generator.config.rules.DbColumnType.BYTE_ARRAY;
import static com.baomidou.mybatisplus.generator.config.rules.DbColumnType.STRING;

/**
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
public class ScisDbTypeConvert implements ITypeConvert {
    public static final ScisDbTypeConvert INSTANCE    = new ScisDbTypeConvert();
    public static final String            DATA_LEN_RE = "(?<=\\()[^\\)]+";

    /**
     * 处理类型转换
     *
     * @param config    全局配置
     * @param fieldType 字段类型
     * @return 返回的对应的列类型
     */
    @Override
    public IColumnType processTypeConvert(GlobalConfig config, String fieldType) {

        String fieldDataType = fieldType.toLowerCase();
        if (StrUtil.startWith(fieldDataType, "bigint")) {
            return toNumberType(fieldDataType);
        }
        if (StrUtil.startWithIgnoreCase(fieldDataType, "tinyint")) {
            return toNumberType(fieldDataType);
        }
        if (StrUtil.startWithIgnoreCase(fieldDataType, "int")) {
            return toNumberType(fieldDataType);
        }
        if (StrUtil.startWith(fieldDataType, "smallint")) {
            return toNumberType(fieldDataType);
        }
        if (StrUtil.startWith(fieldDataType, "decimal")) {
            return toNumberType(fieldDataType);
        }
        if (StrUtil.startWith(fieldDataType, "number")) {
            return toNumberType(fieldDataType);
        }
        if (StrUtil.startWithAny(fieldDataType, "char", "clob", "varchar", "text", "long text")) {
            return STRING;
        }
        if (StrUtil.startWithAny(fieldDataType, "date", "timestamp")) {
            return toDateType(config);
        }
        if (StrUtil.startWithAny(fieldDataType, "blob")) {
            return BLOB;
        }
        if (StrUtil.startWithAny(fieldDataType, "binary", "raw")) {
            return BYTE_ARRAY;
        }
        return STRING;

    }

    /**
     * 当前时间为字段类型，根据全局配置返回对应的时间类型
     *
     * @param config 全局配置
     * @return 时间类型
     * @see GlobalConfig#getDateType()
     */
    protected static IColumnType toDateType(GlobalConfig config) {
        switch (config.getDateType()) {
            case ONLY_DATE:
                return DbColumnType.DATE;
            case SQL_PACK:
                return DbColumnType.TIMESTAMP;
            case TIME_PACK:
                return DbColumnType.LOCAL_DATE_TIME;
            default:
                return STRING;
        }
    }

    /**
     * 将对应的类型名称转换为对应的 java 类类型
     * <p>
     * String.valueOf(Integer.MAX_VALUE).length() == 10
     * Integer 不一定能装下 10 位的数字
     * <p>
     * String.valueOf(Long.MAX_VALUE).length() == 19
     * Long 不一定能装下 19 位的数字
     *
     * @param typeName 类型名称
     * @return 返回列类型
     */
    private static IColumnType toNumberType(String typeName) {
        String dataLen = ReUtil.getGroup0(DATA_LEN_RE, typeName);
        String[] lens = StrUtil.split(dataLen, StrUtil.COMMA);
        int size = MoreObjects.firstNonNull(Ints.tryParse(lens[0]), 0);
        int scale = 0;
        if (lens.length > 1) {
            scale = MoreObjects.firstNonNull(Ints.tryParse(lens[1]), 0);
            size = size - scale;
        }
        if (scale <= 0) {
            if (size == 13) {
                // number(13) or bigint(13) 表示毫秒时间戳
                return DbColumnType.LOCAL_DATE_TIME;
            }
            if (size <= 11) {
                return DbColumnType.INTEGER;
            }
            return DbColumnType.LONG;
        }
        if (size < 12) {
            return DbColumnType.FLOAT;
        }
        if (size < 22) {
            return DbColumnType.DOUBLE;
        }
        return DbColumnType.BIG_DECIMAL;
    }
}
