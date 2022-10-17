

package com.srm.bpm.logic.dto;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class FormTableFieldDto {

    /**
     * 字段名称
     */
    private String fieldName;

    /**
     * 数据类型
     */
    private String dataType;

    /**
     * 默认信息
     */
    private String defaultValue;

    /**
     * 注释 别名
     */
    private String comment;


}
