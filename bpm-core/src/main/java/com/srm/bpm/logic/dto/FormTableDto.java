

package com.srm.bpm.logic.dto;

import lombok.Data;

/**
 * <p> 表对象</p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class FormTableDto {

    /**
     * 表名
     */
    private String tableName;

    /**
     * 注释 别名
     */
    private String comment;

}
