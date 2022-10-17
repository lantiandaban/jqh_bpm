

package com.srm.bpm.logic.dto;

import java.io.Serializable;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 数据库字段映射
 * </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
@ApiModel("数据库字段映射")
public class ZZTableField implements Serializable {

    private static final long serialVersionUID = 7069053611730825290L;
    @ApiModelProperty("列名")
    private String columnName;
    @ApiModelProperty("列注释")
    private String columnComment;

    @ApiModelProperty("配置列名")
    private String fieldName;

    @ApiModelProperty("数据类型")
    private String dataType;

    @ApiModelProperty("排序")
    private int sort;

    @ApiModelProperty("显示名")
    private String displayName;


}
