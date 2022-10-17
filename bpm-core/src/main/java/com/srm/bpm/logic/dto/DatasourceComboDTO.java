

package com.srm.bpm.logic.dto;

import java.io.Serializable;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
@ApiModel("下拉选项")
public class DatasourceComboDTO implements Serializable {
    private static final long serialVersionUID = 8168194249528300295L;
    @ApiModelProperty("主键")
    private Long id;
    /**
     * 数据源主键
     */
    @ApiModelProperty("数据源主键")
    private Long datasourceId;

    @ApiModelProperty("下拉框显示字段")
    private String displayField;

    @ApiModelProperty("下拉框值字段")
    private String valueField;

    /**
     * 显示排序
     */
    @ApiModelProperty("显示排序")
    private Integer sort;
}
