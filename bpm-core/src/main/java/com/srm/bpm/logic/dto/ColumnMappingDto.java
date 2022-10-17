

package com.srm.bpm.logic.dto;

import lombok.Data;

/**
 * <p>模板中的列于表单字段的映射关系. </p>
 *
 * @author yishin
 * @version 1.0
 * @since JDK 1.7
 */

@Data
public class ColumnMappingDto {
    /**
     * 控件标识
     */
    private String filed;
    /**
     * 字段类型
     */
    private String type;
}
